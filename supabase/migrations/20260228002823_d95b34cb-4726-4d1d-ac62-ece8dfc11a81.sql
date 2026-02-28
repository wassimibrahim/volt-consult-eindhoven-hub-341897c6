
-- Step 1: Create app_role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can view roles, but we need the security definer function first
-- Step 2: Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 3: RLS policies for user_roles table
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Step 4: Drop ALL existing policies on applications
DROP POLICY IF EXISTS "Anyone can insert applications" ON public.applications;
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.applications;
DROP POLICY IF EXISTS "Anyone can update applications" ON public.applications;
DROP POLICY IF EXISTS "Anyone can view applications" ON public.applications;
DROP POLICY IF EXISTS "No deletions" ON public.applications;
DROP POLICY IF EXISTS "Only authenticated users can delete applications" ON public.applications;
DROP POLICY IF EXISTS "Only authenticated users can read applications" ON public.applications;
DROP POLICY IF EXISTS "Only authenticated users can update applications" ON public.applications;

-- New applications policies: anyone can INSERT (submit), only admins can read/update/delete
CREATE POLICY "Anyone can submit applications"
ON public.applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view applications"
ON public.applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update applications"
ON public.applications
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete applications"
ON public.applications
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Step 5: Drop ALL existing policies on positions
DROP POLICY IF EXISTS "Anyone can read active positions" ON public.positions;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.positions;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.positions;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.positions;
DROP POLICY IF EXISTS "Enable update for all users" ON public.positions;
DROP POLICY IF EXISTS "Only authenticated users can delete positions" ON public.positions;
DROP POLICY IF EXISTS "Only authenticated users can insert positions" ON public.positions;
DROP POLICY IF EXISTS "Only authenticated users can update positions" ON public.positions;

-- New positions policies: public can read active, admins can manage
CREATE POLICY "Public can read active positions"
ON public.positions
FOR SELECT
TO anon, authenticated
USING (active = true);

CREATE POLICY "Admins can read all positions"
ON public.positions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert positions"
ON public.positions
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update positions"
ON public.positions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete positions"
ON public.positions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Step 6: Drop ALL existing policies on contact_messages
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only authenticated users can read messages" ON public.contact_messages;

-- New contact_messages policies: anyone can insert, admins can read
CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can read contact messages"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Step 7: Make the applications storage bucket private
UPDATE storage.buckets SET public = false WHERE id = 'applications';

-- Step 8: Drop any existing storage policies for the applications bucket and create new ones
DROP POLICY IF EXISTS "Anyone can upload application files" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- Allow anyone to upload to applications bucket (for applicants)
CREATE POLICY "Anyone can upload to applications bucket"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'applications');

-- Only admins can view/download files from applications bucket
CREATE POLICY "Admins can view application files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'applications' AND public.has_role(auth.uid(), 'admin'));
