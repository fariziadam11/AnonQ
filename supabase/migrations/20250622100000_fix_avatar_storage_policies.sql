-- Drop existing policies to ensure a clean slate, avoiding conflicts.
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars." ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars." ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars." ON storage.objects;

-- Policy: Allow public read access to everyone for files in the 'avatars' bucket.
-- This makes profile pictures viewable by anyone.
CREATE POLICY "Avatar images are publicly accessible."
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Policy: Allow authenticated users to upload new files into the 'avatars' bucket.
CREATE POLICY "Authenticated users can upload avatars."
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'avatars' );

-- Policy: Allow authenticated users to update their own files in the 'avatars' bucket.
-- The `auth.uid() = owner` check ensures users can only modify files they own.
CREATE POLICY "Users can update their own avatars."
ON storage.objects FOR UPDATE
TO authenticated
USING ( auth.uid() = owner );

-- Policy: Allow authenticated users to delete their own files from the 'avatars' bucket.
CREATE POLICY "Users can delete their own avatars."
ON storage.objects FOR DELETE
TO authenticated
USING ( auth.uid() = owner ); 