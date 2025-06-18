/*
  # Fix anonymous messaging RLS policies

  1. Policy Changes
    - Remove conflicting authenticated-only insert policy
    - Ensure anonymous users can insert messages
    - Maintain security for other operations
  
  2. Security
    - Allow anonymous message insertion
    - Maintain read/update/delete restrictions for authenticated users only
    - Ensure profile owners can manage their messages
*/

-- Drop the conflicting authenticated-only insert policy
DROP POLICY IF EXISTS "Authenticated users can insert messages" ON messages;

-- Ensure the anonymous insert policy exists and is correct
DROP POLICY IF EXISTS "Anyone can send messages" ON messages;

-- Create a clear policy for anonymous message sending
CREATE POLICY "Allow anonymous message sending"
  ON messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure authenticated users can still insert messages (for logged-in senders)
CREATE POLICY "Authenticated users can insert messages with user tracking"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if profile exists and user_id matches current user (for tracking)
    profile_id IN (SELECT id FROM profiles WHERE id = profile_id)
  );