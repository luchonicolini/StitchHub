-- Migration: Strict Private Storage, RLS Security & Performance Optimization for StitchHub
-- Author: StitchHub Team
-- Date: 2026-07-22

-- 1. Covering Indexes for Foreign Keys (Performance Advisor)
CREATE INDEX IF NOT EXISTS idx_designs_user_id ON public.designs(user_id);
CREATE INDEX IF NOT EXISTS idx_followers_following_id ON public.followers(following_id);
CREATE INDEX IF NOT EXISTS idx_likes_design_id ON public.likes(design_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_actor_id ON public.notifications(actor_id);

-- 2. Optimize RLS Policies with (SELECT auth.uid()) for Initplan Optimization
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public designs are viewable by everyone." ON public.designs;
CREATE POLICY "Public designs are viewable by everyone." ON public.designs
  FOR SELECT USING (
    is_public = true OR ((SELECT auth.uid()) IS NOT NULL AND (SELECT auth.uid()) = user_id)
  );

DROP POLICY IF EXISTS "Users can insert their own designs." ON public.designs;
CREATE POLICY "Users can insert their own designs." ON public.designs
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own designs" ON public.designs;
CREATE POLICY "Users can update own designs" ON public.designs
  FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own designs" ON public.designs;
CREATE POLICY "Users can delete own designs" ON public.designs
  FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- 3. Storage Buckets: Public 'design-images' and Strictly Private 'private-design-images'
INSERT INTO storage.buckets (id, name, public)
VALUES ('design-images', 'design-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('private-design-images', 'private-design-images', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Public Storage Policies for 'design-images'
DROP POLICY IF EXISTS "Public Read Design Images Storage" ON storage.objects;
CREATE POLICY "Public Read Design Images Storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'design-images');

DROP POLICY IF EXISTS "Authenticated Insert Design Images Storage" ON storage.objects;
CREATE POLICY "Authenticated Insert Design Images Storage" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'design-images' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Owner Delete Design Images Storage" ON storage.objects;
CREATE POLICY "Owner Delete Design Images Storage" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'design-images' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- Strictly Private Storage Policies for 'private-design-images' (Owner Only)
DROP POLICY IF EXISTS "Owner Read Private Design Images Storage" ON storage.objects;
CREATE POLICY "Owner Read Private Design Images Storage" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'private-design-images' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Owner Insert Private Design Images Storage" ON storage.objects;
CREATE POLICY "Owner Insert Private Design Images Storage" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'private-design-images' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Owner Delete Private Design Images Storage" ON storage.objects;
CREATE POLICY "Owner Delete Private Design Images Storage" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'private-design-images' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- 4. Hardening Function Search Path & Execution
ALTER FUNCTION public.update_comments_count() SET search_path = public;
ALTER FUNCTION public.notify_on_like() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.update_comments_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_on_like() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
