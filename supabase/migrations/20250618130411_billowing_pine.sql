/*
  # Fix RLS policies for anonymous message sending

  1. Policy Changes
    - Remove conflicting INSERT policies on messages table
    - Create a single, clear policy that allows both anonymous and authenticated users to insert messages
    - Ensure the policy properly handles both cases (with and without user_id)

  2. Security
    - Maintain RLS on messages table
    - Allow anonymous message sending (core feature requirement)
    - Allow authenticated users to send messages with tracking
    - Ensure profile_id validation for message targeting
*/

-- Drop existing conflicting INSERT policies
DROP POLICY IF EXISTS "Allow anonymous message sending" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users can insert messages with user tracking" ON public.messages;

-- Create a single, comprehensive INSERT policy that handles both anonymous and authenticated users
CREATE POLICY "Allow message insertion for all users"
  ON public.messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Ensure the profile_id exists in the profiles table
    profile_id IN (SELECT id FROM public.profiles)
    AND
    -- For authenticated users, if user_id is provided, it must match the current user
    (
      (auth.uid() IS NULL) OR  -- Anonymous users
      (user_id IS NULL) OR     -- Authenticated users not providing user_id
      (user_id = auth.uid())   -- Authenticated users providing their own user_id
    )
  );