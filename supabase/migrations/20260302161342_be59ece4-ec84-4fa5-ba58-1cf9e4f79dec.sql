
-- Drop the existing RESTRICTIVE INSERT policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.applications;
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

-- Recreate as PERMISSIVE policies so public users can actually insert
CREATE POLICY "Anyone can submit applications"
ON public.applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Add storage policies for the applications bucket so anon users can upload files
CREATE POLICY "Anyone can upload application files"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'applications');

CREATE POLICY "Anyone can read application files"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'applications');
