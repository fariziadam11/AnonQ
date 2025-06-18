/*
  # Fix delete policy for messages table

  1. Changes
    - Safely add delete policy for messages table
    - Handle case where policy might already exist
    - Ensure profile owners can delete their messages

  2. Security
    - Allow authenticated users to delete messages from their own profiles
    - Maintain proper RLS security
*/

-- Drop the policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Profile owners can delete their messages" ON messages;

-- Add delete policy for messages table
CREATE POLICY "Profile owners can delete their messages"
  ON messages
  FOR DELETE
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );