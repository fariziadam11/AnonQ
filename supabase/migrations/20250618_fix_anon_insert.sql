-- Enable RLS (jaga-jaga)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Hapus policy insert lama jika ada
DROP POLICY IF EXISTS "Anyone can send messages" ON messages;
DROP POLICY IF EXISTS "Users can insert messages" ON messages;

-- Tambahkan policy insert untuk authenticated & anon
CREATE POLICY "Anyone can send messages"
  ON messages
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true); 