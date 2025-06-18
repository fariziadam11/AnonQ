/*
  # Enhanced message tracking and policies

  1. Database Changes
    - Add proper policies for user_id tracking in messages
    - Improve message management capabilities
    - Add indexes for better performance

  2. Security Updates
    - Better RLS policies for message ownership
    - Improved anonymous message handling
    - Enhanced user message tracking

  3. Performance
    - Add indexes for frequently queried columns
    - Optimize message retrieval queries
*/

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_profile_id ON messages(profile_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Update RLS policies for better message management
DROP POLICY IF EXISTS "Authenticated users can insert messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can read messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can update their own messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can delete their own messages" ON messages;
DROP POLICY IF EXISTS "Users can read their messages" ON messages;
DROP POLICY IF EXISTS "Users can update their messages" ON messages;
DROP POLICY IF EXISTS "Users can delete their messages" ON messages;

-- Policy for authenticated users to insert messages with user tracking
CREATE POLICY "Authenticated users can insert messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    profile_id IN (
      SELECT id FROM profiles WHERE id = profile_id
    )
  );

-- Policy for authenticated users to read messages they sent or received
CREATE POLICY "Authenticated users can read messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    ) OR
    user_id = auth.uid()
  );

-- Policy for authenticated users to update their own messages
CREATE POLICY "Authenticated users can update their own messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy for authenticated users to delete their own messages
CREATE POLICY "Authenticated users can delete their own messages"
  ON messages
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Add a function to get message statistics
CREATE OR REPLACE FUNCTION get_message_stats(profile_uuid uuid)
RETURNS TABLE(
  total_messages bigint,
  unread_messages bigint,
  messages_today bigint,
  messages_this_week bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_messages,
    COUNT(*) FILTER (WHERE is_read = false) as unread_messages,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as messages_today,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as messages_this_week
  FROM messages 
  WHERE profile_id = profile_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_message_stats(uuid) TO authenticated;