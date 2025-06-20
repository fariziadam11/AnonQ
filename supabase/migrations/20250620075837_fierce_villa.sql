/*
  # Fix Messages RLS Policies

  1. Security Updates
    - Drop existing problematic INSERT policies
    - Create new INSERT policies that properly handle both anonymous and user-to-user messages
    - Ensure anonymous users can send anonymous messages
    - Ensure authenticated users can send both anonymous and user-to-user messages

  2. Policy Changes
    - Fix anonymous message insertion for both anon and authenticated roles
    - Fix user-to-user message insertion with proper sender validation
    - Maintain existing SELECT, UPDATE, and DELETE policies
*/

-- Drop existing INSERT policies that are causing issues
DROP POLICY IF EXISTS "Anonymous users can send anonymous messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can send anonymous messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can send user messages" ON messages;

-- Create new INSERT policy for anonymous messages (both anon and authenticated users)
CREATE POLICY "Allow anonymous message insert"
  ON messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    message_type = 'anonymous' AND 
    sender_id IS NULL AND 
    sender_profile_id IS NULL
  );

-- Create new INSERT policy for user-to-user messages (authenticated users only)
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