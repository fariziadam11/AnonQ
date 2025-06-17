<<<<<<< HEAD
# AnonQ
AnonQ adalah platform tanya jawab anonim yang memungkinkan siapa saja untuk menerima pesan, pertanyaan, atau feedback secara anonim dari teman, followers, atau siapa pun. Cocok untuk berbagi link di media sosial, mendapatkan masukan jujur, atau sekadar seru-seruan bersama teman.
=======
# AnonQ - Anonymous Q&A Platform

A modern, beautiful anonymous Q&A web application built with React, TypeScript, Tailwind CSS, and Supabase. Users can create profiles with unique usernames and receive anonymous messages from anyone with their link.

## Features

- **User Authentication**: Email-based signup/signin with Supabase Auth
- **Unique Profiles**: Create profiles with unique usernames
- **Anonymous Messaging**: Send and receive completely anonymous messages
- **Real-time Updates**: Live message notifications using Supabase realtime
- **Message Management**: Mark messages as read/unread, filter by status
- **Share Links**: Easy sharing of personal anonymous message links
- **Responsive Design**: Beautiful, mobile-first responsive UI
- **Privacy-Focused**: Complete anonymity for message senders

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Realtime)
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd anonymous-qa-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project on [Supabase](https://supabase.com)
   - Go to Project Settings > API to get your project URL and anon key
   - Copy `.env.example` to `.env` and fill in your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Set up the database**
   - In your Supabase dashboard, go to the SQL Editor
   - Run the migration script from `supabase/migrations/create_schema.sql`
   - This will create the necessary tables and security policies

5. **Configure Authentication (Optional)**
   - In Supabase dashboard, go to Authentication > Settings
   - Disable email confirmation for easier testing (or configure email provider)
   - Configure any additional auth providers if needed

6. **Start the development server**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## Database Schema

### Tables

**profiles**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `username` (text, unique)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**messages**
- `id` (uuid, primary key)
- `profile_id` (uuid, foreign key to profiles)
- `content` (text)
- `is_read` (boolean, default false)
- `created_at` (timestamptz)

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own profiles and messages
- Anonymous users can send messages but not read them
- Comprehensive security policies for all operations

## Usage

1. **Create Account**: Sign up with email and choose a unique username
2. **Get Your Link**: Access your dashboard to get your personal anonymous message link
3. **Share**: Share your link on social media, with friends, or embed on your website
4. **Receive Messages**: Anonymous users can visit your link and send messages
5. **Manage**: View, filter, and mark messages as read in your dashboard

## Deployment

### Vercel (Recommended)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel`
   - Follow the prompts to deploy
   - Add your environment variables in the Vercel dashboard

### Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Install Netlify CLI: `npm i -g netlify-cli`
   - Run: `netlify deploy --prod --dir=dist`
   - Add your environment variables in the Netlify dashboard

### Manual Deployment

1. Run `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your web server to serve the index.html for all routes (SPA configuration)
4. Set environment variables on your hosting platform

## Environment Variables

Make sure to set these environment variables in your deployment platform:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information about your problem
3. Include steps to reproduce, expected behavior, and actual behavior

## Roadmap

- [ ] Message reactions and replies
- [ ] Message filtering and search
- [ ] Export messages functionality
- [ ] Custom themes and personalization
- [ ] Message templates and auto-responses
- [ ] Analytics and insights dashboard
- [ ] Mobile app (React Native)

---

Built with ❤️ using modern web technologies. Perfect for creating safe spaces for honest communication and feedback.
>>>>>>> 699436c (initial commit)
