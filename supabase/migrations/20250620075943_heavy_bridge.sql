/*
  # Fix RLS policies for messages table

  1. Policy Updates
    - Update anonymous message policy to work for both anon and authenticated users
    - Ensure user-to-user message policy works correctly
    - Fix policy conditions to match application logic

  2. Security
    - Maintain proper access control for message types
    - Allow anonymous messages from both guest and authenticated users
    - Restrict user-to-user messages to authenticated users only
*/

-- Drop existing policies to recreate them with correct logic
DROP POLICY IF EXISTS "Allow anonymous message insert" ON messages;
DROP POLICY IF EXISTS "Allow user to user message insert" ON messages;

-- Create policy for anonymous messages (works for both anon and authenticated users)
CREATE POLICY "Allow anonymous message insert"
  ON messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    message_type = 'anonymous' AND 
    sender_id IS NULL AND 
    sender_profile_id IS NULL
  );

-- Create policy for user-to-user messages (authenticated users only)
CREATE POLICY "Allow user to user message insert"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    message_type = 'user_to_user' AND 
    sender_id = auth.uid() AND 
    sender_profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );