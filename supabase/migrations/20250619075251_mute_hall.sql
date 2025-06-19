/*
  # Create messages table

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, foreign key to profiles)
      - `content` (text, message content)
      - `is_read` (boolean, read status)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `messages` table
    - Add policy for profile owners to read their messages
    - Add policy for authenticated users to insert messages
    - Add policy for profile owners to update their messages (mark as read)

  3. Changes
    - Create foreign key relationship with profiles table
    - Add indexes for better query performance
*/

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Profile owners can view their messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Profile owners can update their messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS messages_profile_id_idx ON messages(profile_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS messages_is_read_idx ON messages(is_read);