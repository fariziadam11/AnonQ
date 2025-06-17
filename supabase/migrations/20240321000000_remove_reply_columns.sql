-- Remove reply columns from messages table
ALTER TABLE messages
DROP COLUMN reply_content,
DROP COLUMN reply_to,
DROP COLUMN updated_at;

-- Drop the trigger and function
DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
DROP FUNCTION IF EXISTS update_updated_at_column(); 