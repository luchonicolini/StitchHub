-- Migration: Add is_public column, RLS policies, and Foreign Keys for StitchHub
-- Author: StitchHub Team
-- Date: 2026-07-22

-- 1. Add is_public column to public.designs
ALTER TABLE public.designs
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

UPDATE public.designs SET is_public = true WHERE is_public IS NULL;

-- 2. Foreign Keys & Relationships for PostgREST joins
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.designs DROP CONSTRAINT IF EXISTS designs_user_id_fkey;
ALTER TABLE public.designs DROP CONSTRAINT IF EXISTS designs_user_id_profiles_fkey;
ALTER TABLE public.designs ADD CONSTRAINT designs_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS comments_user_id_profiles_fkey;
ALTER TABLE public.comments ADD CONSTRAINT comments_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS comments_design_id_fkey;
ALTER TABLE public.comments ADD CONSTRAINT comments_design_id_fkey
  FOREIGN KEY (design_id) REFERENCES public.designs(id) ON DELETE CASCADE;

ALTER TABLE public.likes DROP CONSTRAINT IF EXISTS likes_user_id_fkey;
ALTER TABLE public.likes DROP CONSTRAINT IF EXISTS likes_user_id_profiles_fkey;
ALTER TABLE public.likes ADD CONSTRAINT likes_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.likes DROP CONSTRAINT IF EXISTS likes_design_id_fkey;
ALTER TABLE public.likes ADD CONSTRAINT likes_design_id_fkey
  FOREIGN KEY (design_id) REFERENCES public.designs(id) ON DELETE CASCADE;

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_actor_id_fkey;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_actor_id_fkey
  FOREIGN KEY (actor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 3. RLS Policies on public.designs
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public designs are viewable by everyone." ON public.designs;
CREATE POLICY "Public designs are viewable by everyone." ON public.designs
  FOR SELECT USING (
    is_public = true OR (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  );

DROP POLICY IF EXISTS "Users can insert their own designs." ON public.designs;
CREATE POLICY "Users can insert their own designs." ON public.designs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own designs" ON public.designs;
CREATE POLICY "Users can update own designs" ON public.designs
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own designs" ON public.designs;
CREATE POLICY "Users can delete own designs" ON public.designs
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Storage Buckets and RLS Policies for Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('design-images', 'design-images', true), ('designs', 'designs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Read Design Images Storage" ON storage.objects;
CREATE POLICY "Public Read Design Images Storage" ON storage.objects
  FOR SELECT USING (bucket_id IN ('design-images', 'designs'));

DROP POLICY IF EXISTS "Authenticated Insert Design Images Storage" ON storage.objects;
CREATE POLICY "Authenticated Insert Design Images Storage" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('design-images', 'designs') AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Authenticated Delete Design Images Storage" ON storage.objects;
CREATE POLICY "Authenticated Delete Design Images Storage" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('design-images', 'designs') AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 5. Auto Confirm User Email Trigger
CREATE OR REPLACE FUNCTION public.auto_confirm_user_email()
RETURNS trigger AS $$
BEGIN
  new.email_confirmed_at = COALESCE(new.email_confirmed_at, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_auto_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_auto_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user_email();

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
