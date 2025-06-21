-- Migration: Implement hard delete for user accounts
-- This migration removes soft delete and implements proper hard delete

-- Remove the is_deleted column from profiles table
ALTER TABLE profiles DROP COLUMN IF EXISTS is_deleted;

-- Create a function to handle complete user deletion
CREATE OR REPLACE FUNCTION delete_user_account(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    user_profile_id UUID;
BEGIN
    -- Get the user's profile ID
    SELECT id INTO user_profile_id 
    FROM profiles 
    WHERE user_id = user_uuid;
    
    -- Delete all messages sent to this user
    DELETE FROM messages WHERE profile_id = user_profile_id;
    
    -- Delete all messages sent by this user
    DELETE FROM messages WHERE sender_id = user_uuid;
    
    -- Delete the user's profile
    DELETE FROM profiles WHERE user_id = user_uuid;
    
    -- Delete the user from auth.users (this will cascade to any other references)
    DELETE FROM auth.users WHERE id = user_uuid;
    
    -- Note: Storage files (avatars) should be deleted separately in the application
    -- as Supabase Storage doesn't have automatic cascade delete
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO authenticated;

-- Create a policy to allow users to call the delete function
CREATE POLICY "Users can delete their own account" ON profiles
    FOR DELETE 
    TO authenticated
    USING (auth.uid() = user_id);

-- Update the existing delete policy to be more explicit
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
CREATE POLICY "Users can delete their own profile" ON profiles
    FOR DELETE 
    TO authenticated
    USING (auth.uid() = user_id); 