-- 1. Hapus SEMUA kebijakan INSERT yang lama berdasarkan file migrasi awal dan screenshot
DROP POLICY IF EXISTS "Allow anonymous and authenticated message sending" ON public.messages;
DROP POLICY IF EXISTS "Allow anonymous message insert" ON public.messages;
DROP POLICY IF EXISTS "Allow user to user message insert" ON public.messages;
DROP POLICY IF EXISTS "Anonymous users can send anonymous messages" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users can send anonymous messages" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users can send user messages" ON public.messages;

-- 2. Buat satu kebijakan INSERT yang benar dan komprehensif
CREATE POLICY "Allow anonymous and authenticated message sending"
ON public.messages
FOR INSERT
TO public -- Berlaku untuk semua role (anon, authenticated, dll)
WITH CHECK (
  (
    -- Kasus 1: Pesan anonim bisa dikirim oleh siapa saja (termasuk yang tidak login)
    message_type = 'anonymous'::text AND sender_id IS NULL AND sender_profile_id IS NULL
  )
  OR
  (
    -- Kasus 2: Pesan user-to-user hanya bisa dikirim oleh pengguna yang sudah login
    -- dan ID pengirimnya harus cocok dengan ID pengguna yang sedang login.
    message_type = 'user_to_user'::text AND auth.uid() = sender_id
  )
); 