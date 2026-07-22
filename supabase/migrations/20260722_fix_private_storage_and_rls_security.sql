-- Migration: Add strict private storage bucket and fix RLS policies & path authorization
-- Author: StitchHub Team
-- Date: 2026-07-22

-- 1. Fix UPDATE policy on public.designs with WITH CHECK constraint
DROP POLICY IF EXISTS "Users can update own designs" ON public.designs;
CREATE POLICY "Users can update own designs" ON public.designs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Storage Buckets: Public 'design-images' and Strictly Private 'private-design-images'
INSERT INTO storage.buckets (id, name, public)
VALUES ('design-images', 'design-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('private-design-images', 'private-design-images', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 3. Strict Storage Policies for public bucket 'design-images'
DROP POLICY IF EXISTS "Public Read Design Images Storage" ON storage.objects;
CREATE POLICY "Public Read Design Images Storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'design-images');

DROP POLICY IF EXISTS "Authenticated Insert Design Images Storage" ON storage.objects;
CREATE POLICY "Authenticated Insert Design Images Storage" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'design-images' AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Owner Delete Design Images Storage" ON storage.objects;
CREATE POLICY "Owner Delete Design Images Storage" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'design-images' AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4. Strictly Private Storage Policies for 'private-design-images' (Owner Only)
DROP POLICY IF EXISTS "Owner Read Private Design Images Storage" ON storage.objects;
CREATE POLICY "Owner Read Private Design Images Storage" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'private-design-images' AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Owner Insert Private Design Images Storage" ON storage.objects;
CREATE POLICY "Owner Insert Private Design Images Storage" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'private-design-images' AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Owner Delete Private Design Images Storage" ON storage.objects;
CREATE POLICY "Owner Delete Private Design Images Storage" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'private-design-images' AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
