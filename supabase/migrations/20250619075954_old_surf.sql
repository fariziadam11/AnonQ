/*
  # Allow Anonymous Messaging

  1. Policy Changes
    - Drop existing restrictive INSERT policy for messages
    - Create new INSERT policy allowing both authenticated and anonymous users to send messages
    - Ensure profile owners can still read, update, and delete their own messages
    - Add DELETE policy for profile owners

  2. Security
    - Anonymous users can only INSERT messages (send messages)
    - Authenticated users can INSERT messages and manage their received messages
    - All users must send messages to valid profiles only
*/

-- Drop the existing INSERT policy that only allows authenticated users
DROP POLICY IF EXISTS "Authenticated users can send messages to any profile" ON messages;

-- Create new INSERT policy that allows both authenticated and anonymous users to send messages
CREATE POLICY "Anyone can send messages to valid profiles"
  ON messages
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    -- Ensure the profile_id exists in the profiles table
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = profile_id
    )
  );

-- Add DELETE policy for profile owners (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'messages' 
    AND policyname = 'Profile owners can delete their messages'
  ) THEN
    CREATE POLICY "Profile owners can delete their messages"
      ON messages
      FOR DELETE
      TO authenticated
      USING (
        profile_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;