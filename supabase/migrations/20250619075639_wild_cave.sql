/*
  # Fix RLS policy for messages table

  1. Changes
    - Drop existing restrictive INSERT policy
    - Create new INSERT policy that allows authenticated users to send messages to any profile
    - Keep existing SELECT and UPDATE policies that ensure users can only see/modify their own messages
  
  2. Security
    - Users can send messages to any profile (INSERT)
    - Users can only read messages sent to their own profile (SELECT)
    - Users can only update messages sent to their own profile (UPDATE)
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Authenticated users can send messages" ON messages;

-- Create a new INSERT policy that allows authenticated users to send messages to any profile
CREATE POLICY "Authenticated users can send messages to any profile"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Ensure the profile_id exists in the profiles table
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = profile_id
    )
  );