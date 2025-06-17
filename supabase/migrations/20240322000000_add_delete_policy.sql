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