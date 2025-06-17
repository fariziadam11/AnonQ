# AnonQ – Platform Q&A Anonim

**AnonQ** adalah platform tanya jawab anonim yang memungkinkan siapa saja untuk menerima pesan, pertanyaan, atau feedback secara anonim dari teman, followers, atau siapa pun. Cocok untuk berbagi link di media sosial, mendapatkan masukan jujur, atau sekadar seru-seruan bersama teman.

## Fitur Utama
- **Tanya Jawab Anonim:** Siapa pun bisa mengirim pesan tanpa harus login.
- **Dashboard Pribadi:** Pengguna dapat melihat, menandai, dan mengelola pesan yang masuk.
- **Link Unik:** Setiap pengguna mendapatkan link profil unik untuk dibagikan.
- **Realtime Update:** Pesan masuk langsung muncul di dashboard tanpa perlu refresh.
- **Privasi Terjaga:** Identitas pengirim benar-benar anonim.

## Teknologi
- **React + TypeScript** untuk frontend
- **Supabase** untuk autentikasi, database, dan realtime
- **TailwindCSS** untuk styling modern dan responsif
- **Vite** untuk build

## Cara Install & Jalankan Lokal

1. **Clone repo ini**
   ```bash
   git clone <repo-url-anda>
   cd ngl
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Buat file `.env` di root** dan isi:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Jalankan aplikasi**
   ```bash
   npm run dev
   ```
5. **Akses di browser**
   - Buka [http://localhost:5173](http://localhost:5173)

## Deploy ke Netlify

1. **Fork/Clone repo ini**
2. **Buat file `.env` di root** dan isi:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. **Build Command:**
   ```
   npm run build
   ```
4. **Publish Directory:**
   ```
   dist
   ```
5. **Tambahkan file `netlify.toml`** (sudah tersedia) agar routing SPA berjalan lancar.
6. **Deploy di Netlify** (bisa drag & drop folder dist, atau connect ke repo dan deploy otomatis)

## Redirects (penting untuk SPA)
Sudah diatur di `netlify.toml`:
```
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Cara Kontribusi

1. **Fork repo ini** ke akun GitHub kamu.
2. **Clone hasil fork** ke komputer lokal:
   ```bash
   git clone <url-fork-anda>
   cd ngl
   ```
3. **Buat branch baru** untuk fitur atau perbaikan:
   ```bash
   git checkout -b nama-fitur-anda
   ```
4. **Lakukan perubahan & commit**
   ```bash
   git add .
   git commit -m "deskripsi perubahan"
   ```
5. **Push branch ke repo fork**
   ```bash
   git push origin nama-fitur-anda
   ```
6. **Buka Pull Request** ke repo utama.
7. Tunggu review dan diskusi dari maintainer.

Kontribusi berupa fitur baru, perbaikan bug, dokumentasi, atau saran sangat diterima!

---

**Cocok untuk siapa?**  
- Ingin menerima feedback jujur secara anonim  
- Seru-seruan Q&A di media sosial  
- Membuka sesi tanya jawab tanpa takut identitas bocor

---

> **Mulai sekarang, dapatkan pertanyaan dan pesan anonim dengan mudah dan aman!**
