/*
  # Fix Messages INSERT Policy

  1. Policy Changes
    - Drop the existing restrictive INSERT policy for messages
    - Create a new policy that allows authenticated users to send messages to any valid profile
    - This enables the messaging functionality while maintaining security

  2. Security
    - Authenticated users can send messages to any existing profile
    - Messages can only be inserted by authenticated users
    - Profile existence is still validated through foreign key constraint
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Anyone can send messages to valid profiles" ON messages;

-- Create a new policy that allows authenticated users to send messages
CREATE POLICY "Authenticated users can send messages to valid profiles"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = messages.profile_id
    )
  );