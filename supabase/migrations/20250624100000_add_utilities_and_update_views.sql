-- Migration: Add utility functions and update popular_profiles view

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Function to get profile by username (optimized)
CREATE OR REPLACE FUNCTION get_profile_by_username(username_param TEXT)
RETURNS TABLE(
    id UUID,
    user_id UUID,
    username TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    avatar TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.user_id, p.username, p.created_at, p.updated_at, p.avatar
    FROM profiles p
    WHERE p.username = username_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unread message count for a profile
CREATE OR REPLACE FUNCTION get_unread_count(profile_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    unread_count INTEGER;
BEGIN
    SELECT COUNT(*)::INTEGER
    INTO unread_count
    FROM messages
    WHERE profile_id = profile_id_param AND is_read = FALSE;
    
    RETURN COALESCE(unread_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark multiple messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(message_ids UUID[])
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE messages
    SET is_read = TRUE
    WHERE id = ANY(message_ids);
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent messages for a profile with pagination
CREATE OR REPLACE FUNCTION get_recent_messages(
    profile_id_param UUID,
    limit_param INTEGER DEFAULT 50,
    offset_param INTEGER DEFAULT 0
)
RETURNS TABLE(
    id UUID,
    profile_id UUID,
    sender_id UUID,
    sender_profile_id UUID,
    content TEXT,
    is_read BOOLEAN,
    message_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT m.id, m.profile_id, m.sender_id, m.sender_profile_id, m.content, m.is_read, m.message_type, m.created_at
    FROM messages m
    WHERE m.profile_id = profile_id_param
    ORDER BY m.created_at DESC
    LIMIT limit_param
    OFFSET offset_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old read messages (optional cleanup job)
CREATE OR REPLACE FUNCTION cleanup_old_messages(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM messages
    WHERE is_read = TRUE 
    AND created_at < NOW() - INTERVAL '1 day' * days_old;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate username format
CREATE OR REPLACE FUNCTION is_valid_username(username_param TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        username_param IS NOT NULL
        AND char_length(username_param) >= 3
        AND char_length(username_param) <= 50
        AND username_param ~ '^[a-zA-Z0-9_]+$'
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_profile_by_username TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_unread_count TO authenticated;
GRANT EXECUTE ON FUNCTION mark_messages_as_read TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_messages TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_messages TO authenticated;
GRANT EXECUTE ON FUNCTION is_valid_username TO anon, authenticated;


-- ============================================
-- UPDATE VIEW: popular_profiles
-- ============================================

-- First, drop the existing view
DROP VIEW IF EXISTS popular_profiles;

-- Then, create the new view to include latest_message_at
CREATE OR REPLACE VIEW popular_profiles AS
SELECT 
    p.id,
    p.username,
    p.created_at,
    COUNT(m.id) as message_count,
    COUNT(m.id) FILTER (WHERE m.created_at >= NOW() - INTERVAL '7 days') as recent_message_count,
    MAX(m.created_at) as latest_message_at
FROM profiles p
LEFT JOIN messages m ON p.id = m.profile_id
GROUP BY p.id, p.username, p.created_at
ORDER BY message_count DESC;

-- Make sure permissions are still granted
GRANT SELECT ON popular_profiles TO anon, authenticated; 