/*
  # Fix anonymous message insertion

  1. Problem Analysis
    - Multiple conflicting INSERT policies on messages table
    - Complex policy conditions preventing anonymous insertion
    - Potential issues with user_id field handling

  2. Solution
    - Remove all existing INSERT policies
    - Create a single, clear policy for anonymous and authenticated users
    - Ensure proper handling of user_id field for both user types

  3. Security
    - Maintain security by validating profile_id exists
    - Allow optional user_id tracking for authenticated users
    - Prevent unauthorized user_id spoofing
*/

-- First, let's clean up all existing INSERT policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can send messages" ON public.messages;
DROP POLICY IF EXISTS "Allow anonymous message sending" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users can insert messages" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users can insert messages with user tracking" ON public.messages;
DROP POLICY IF EXISTS "Allow message insertion for all users" ON public.messages;

-- Create a single, comprehensive INSERT policy
CREATE POLICY "Enable message insertion for all users"
  ON public.messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Ensure the profile_id exists in the profiles table
    profile_id IN (SELECT id FROM public.profiles)
    AND
    -- Handle user_id field properly:
    -- - Anonymous users: user_id should be NULL
    -- - Authenticated users: user_id can be NULL or match current user
    (
      (auth.uid() IS NULL AND user_id IS NULL) OR  -- Anonymous users
      (auth.uid() IS NOT NULL AND (user_id IS NULL OR user_id = auth.uid()))  -- Authenticated users
    )
  );

-- Verify the policy was created correctly
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'messages' 
    AND policyname = 'Enable message insertion for all users'
    AND cmd = 'INSERT'
  ) THEN
    RAISE EXCEPTION 'Policy was not created successfully';
  END IF;
END $$;