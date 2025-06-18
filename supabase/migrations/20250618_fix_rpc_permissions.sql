-- Grant permission to the anon role to execute the get_message_stats function
-- This allows guest users to view message statistics on profile pages without causing an authorization error.
GRANT EXECUTE ON FUNCTION get_message_stats(uuid) TO anon;
