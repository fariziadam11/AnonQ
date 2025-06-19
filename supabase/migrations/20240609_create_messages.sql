-- Migration: Fixed setup for AnonQ application
-- Create profiles and messages tables with proper RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    username TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT profiles_username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 50),
    CONSTRAINT profiles_username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

-- Create messages table with support for both anonymous and user-to-user messaging
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    -- Recipient profile
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    -- Sender info (optional for anonymous messages)
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    sender_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    -- Message content
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    -- Message type: 'anonymous' or 'user_to_user'
    message_type TEXT DEFAULT 'anonymous' CHECK (message_type IN ('anonymous', 'user_to_user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT messages_content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 1000),
    -- If message_type is 'user_to_user', sender_id must be present
    CONSTRAINT messages_user_to_user_check CHECK (
        (message_type = 'anonymous') OR 
        (message_type = 'user_to_user' AND sender_id IS NOT NULL)
    )
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_messages_profile_id ON messages(profile_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_is_read ON messages(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_messages_type ON messages(message_type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Allow everyone to read all profiles (needed for username lookup and user discovery)
CREATE POLICY "Everyone can read profiles" ON profiles
    FOR SELECT USING (true);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Authenticated users can create their profile" ON profiles
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile" ON profiles
    FOR DELETE 
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================
-- MESSAGES POLICIES
-- ============================================

-- Allow users to read messages sent to their profile
CREATE POLICY "Users can read their received messages" ON messages
    FOR SELECT 
    TO authenticated
    USING (
        profile_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

-- Allow users to read messages they sent to others
CREATE POLICY "Users can read their sent messages" ON messages
    FOR SELECT 
    TO authenticated
    USING (sender_id = auth.uid());

-- Allow anonymous users to send anonymous messages
CREATE POLICY "Anonymous users can send anonymous messages" ON messages
    FOR INSERT 
    TO anon
    WITH CHECK (
        message_type = 'anonymous' 
        AND sender_id IS NULL 
        AND sender_profile_id IS NULL
    );

-- Allow authenticated users to send anonymous messages
CREATE POLICY "Authenticated users can send anonymous messages" ON messages
    FOR INSERT 
    TO authenticated
    WITH CHECK (
        message_type = 'anonymous'
        AND sender_id IS NULL 
        AND sender_profile_id IS NULL
    );

-- Allow authenticated users to send user-to-user messages
CREATE POLICY "Authenticated users can send user messages" ON messages
    FOR INSERT 
    TO authenticated
    WITH CHECK (
        message_type = 'user_to_user'
        AND sender_id = auth.uid()
        AND sender_profile_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

-- Allow users to update messages sent to their profile (mark as read, etc.)
CREATE POLICY "Users can update their received messages" ON messages
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

-- Allow users to delete messages sent to their profile
CREATE POLICY "Users can delete their received messages" ON messages
    FOR DELETE 
    TO authenticated
    USING (
        profile_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

-- Allow users to delete messages they sent
CREATE POLICY "Users can delete their sent messages" ON messages
    FOR DELETE 
    TO authenticated
    USING (sender_id = auth.uid());

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Function to send anonymous message
CREATE OR REPLACE FUNCTION send_anonymous_message(
    recipient_username TEXT,
    message_content TEXT
)
RETURNS UUID AS $$
DECLARE
    recipient_profile_id UUID;
    new_message_id UUID;
BEGIN
    -- Find recipient profile
    SELECT id INTO recipient_profile_id
    FROM profiles
    WHERE username = recipient_username;
    
    IF recipient_profile_id IS NULL THEN
        RAISE EXCEPTION 'Profile not found for username: %', recipient_username;
    END IF;
    
    -- Insert anonymous message
    INSERT INTO messages (profile_id, content, message_type)
    VALUES (recipient_profile_id, message_content, 'anonymous')
    RETURNING id INTO new_message_id;
    
    RETURN new_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to send user-to-user message
CREATE OR REPLACE FUNCTION send_user_message(
    recipient_profile_id UUID,
    message_content TEXT
)
RETURNS UUID AS $$
DECLARE
    sender_profile_id UUID;
    new_message_id UUID;
BEGIN
    -- Get sender's profile
    SELECT id INTO sender_profile_id
    FROM profiles
    WHERE user_id = auth.uid();
    
    IF sender_profile_id IS NULL THEN
        RAISE EXCEPTION 'Sender profile not found';
    END IF;
    
    -- Insert user message
    INSERT INTO messages (
        profile_id, 
        sender_id, 
        sender_profile_id, 
        content, 
        message_type
    )
    VALUES (
        recipient_profile_id, 
        auth.uid(), 
        sender_profile_id, 
        message_content, 
        'user_to_user'
    )
    RETURNING id INTO new_message_id;
    
    RETURN new_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant table permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.messages TO authenticated;
GRANT INSERT ON public.messages TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Grant function permissions
GRANT EXECUTE ON FUNCTION send_anonymous_message TO anon, authenticated;
GRANT EXECUTE ON FUNCTION send_user_message TO authenticated;

-- ============================================
-- SAMPLE DATA (Optional - remove in production)
-- ============================================

-- Uncomment to add sample data for testing
-- INSERT INTO auth.users (id, email) VALUES 
--     ('123e4567-e89b-12d3-a456-426614174000', 'test@example.com');
-- 
-- INSERT INTO profiles (user_id, username) VALUES 
--     ('123e4567-e89b-12d3-a456-426614174000', 'testuser');