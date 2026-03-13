-- Run this in your Supabase SQL Editor

-- 1. Ensure profiles table has bio and website columns (in case they are missing)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS website TEXT;

-- 2. Create the Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL, -- The recipient of the notification
    actor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL, -- The person who performed the action
    type TEXT CHECK (type IN ('like', 'follow', 'comment')) NOT NULL,
    entity_id TEXT, -- Optional ID (e.g., the design_id that was liked)
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications Policies
-- Users can read only their own notifications
CREATE POLICY "Users can view own notifications" 
ON public.notifications FOR SELECT 
USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" 
ON public.notifications FOR DELETE 
USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications" 
ON public.notifications FOR UPDATE 
USING (auth.uid() = user_id);

-- 3. Create Triggers for Automated Notifications

-- Trigger for New Likes
CREATE OR REPLACE FUNCTION public.handle_new_like()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create a notification if the user is not liking their own design
    -- We need to find the owner of the design first
    DECLARE
        design_owner_id UUID;
    BEGIN
        SELECT user_id INTO design_owner_id FROM public.designs WHERE id = NEW.design_id;
        
        IF design_owner_id != NEW.user_id THEN
            INSERT INTO public.notifications (user_id, actor_id, type, entity_id)
            VALUES (design_owner_id, NEW.user_id, 'like', NEW.design_id::text);
        END IF;
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_like_created ON public.likes;

CREATE TRIGGER on_like_created
AFTER INSERT ON public.likes
FOR EACH ROW EXECUTE FUNCTION public.handle_new_like();


-- Trigger for New Followers
CREATE OR REPLACE FUNCTION public.handle_new_follower()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, actor_id, type)
    VALUES (NEW.following_id, NEW.follower_id, 'follow');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_follower_created ON public.followers;

CREATE TRIGGER on_follower_created
AFTER INSERT ON public.followers
FOR EACH ROW EXECUTE FUNCTION public.handle_new_follower();

-- Enable Realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
