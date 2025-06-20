-- Add is_deleted column for soft delete
ALTER TABLE profiles ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE; 