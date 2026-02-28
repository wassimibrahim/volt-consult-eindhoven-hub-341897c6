
-- Fix positions table policies: change from RESTRICTIVE to PERMISSIVE
DROP POLICY IF EXISTS "Admins can delete positions" ON public.positions;
DROP POLICY IF EXISTS "Admins can insert positions" ON public.positions;
DROP POLICY IF EXISTS "Admins can read all positions" ON public.positions;
DROP POLICY IF EXISTS "Admins can update positions" ON public.positions;
DROP POLICY IF EXISTS "Public can read active positions" ON public.positions;

CREATE POLICY "Admins can delete positions" ON public.positions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert positions" ON public.positions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can read all positions" ON public.positions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update positions" ON public.positions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Public can read active positions" ON public.positions FOR SELECT TO anon, authenticated USING (active = true);

-- Fix applications table policies
DROP POLICY IF EXISTS "Admins can delete applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can view applications" ON public.applications;
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.applications;

CREATE POLICY "Admins can delete applications" ON public.applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update applications" ON public.applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view applications" ON public.applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can submit applications" ON public.applications FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Fix contact_messages table policies
DROP POLICY IF EXISTS "Admins can read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

CREATE POLICY "Admins can read contact messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Fix user_roles table policies
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
