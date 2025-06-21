-- Berikan hak akses INSERT pada tabel 'messages' kepada role 'anon'
-- Kebijakan RLS yang sudah ada akan tetap memastikan mereka hanya bisa menyisipkan pesan 'anonymous'.
GRANT INSERT ON TABLE public.messages TO anon;
 
-- Pastikan role 'authenticated' juga memiliki hak yang sama, untuk konsistensi
GRANT INSERT ON TABLE public.messages TO authenticated; 