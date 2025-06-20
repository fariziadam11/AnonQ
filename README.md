# AnonQ – Anonymous Q&A Platform

**AnonQ** is an anonymous question-and-answer platform that allows anyone to receive messages, questions, or feedback anonymously from friends, followers, or anyone else. It is suitable for sharing links on social media, getting honest feedback, or just having fun with friends.

## Key Features
- **Anonymous Q&A:** Anyone can send messages without logging in.
- **Personal Dashboard:** Users can view, mark, and manage incoming messages.
- **Unique Link:** Each user receives a unique profile link to share.
- **Real-time Updates:** Incoming messages appear directly on the dashboard without needing to refresh.
- **Privacy Protected:** The sender's identity is completely anonymous.

## Technology
- **React + TypeScript** for frontend
- **Supabase** for authentication, database, and real-time
- **TailwindCSS** for modern and responsive styling
- **Vite** for build

## How to Install & Run Locally

1. **Clone this repo**
```bash
   git clone <your-repo-url>
   cd ngl
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Create a `.env` file in the root directory** and fill it with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Run the application**
   ```bash
   npm run dev
   ```
5. **Access in browser**
   - Open [http://localhost:5173](http://localhost:5173)

## Deploy to Netlify

1. **Fork/Clone this repo**
2. **Create a `.env` file in the root** and fill it with:
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
5. **Add the `netlify.toml` file** (already available) to ensure smooth SPA routing.
6. **Deploy to Netlify** (you can drag and drop the dist folder, or connect to the repository and deploy automatically)

## Redirects (important for SPA)
Already set up in `netlify.toml`:
```
[[redirects]]
  from = “/*”
  to = “/index.html”
  status = 200
```

## How to Contribute

1. **Fork this repository** to your GitHub account.
2. **Clone the fork** to your local computer:
```bash
   git clone <your-fork-url>
   cd ngl
   ```
3. **Create a new branch** for the feature or fix:
   ```bash
   git checkout -b your-feature-name
   ```
4. **Make changes & commit**
   ```bash
   git add .
   git commit -m “description of changes”
   ```
5. **Push the branch to the fork repo**
   ```bash
   git push origin your-feature-name
   ```
6. **Open a Pull Request** to the main repo.
7. Wait for review and discussion from the maintainer.

Contributions in the form of new features, bug fixes, documentation, or suggestions are greatly appreciated!

---

**Who is this for?**  
- Want to receive honest feedback anonymously  
- Fun Q&A sessions on social media  
- Host Q&A sessions without fear of identity leaks

---

> **Starting now, get anonymous questions and messages easily and securely!**
