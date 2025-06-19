import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single instance of the Supabase client
let supabaseInstance: SupabaseClient | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          'x-application-name': 'anonq',
        },
      },
      db: {
        schema: 'public',
      },
    });
  }
  return supabaseInstance;
})();

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          profile_id: string;
          sender_id: string | null;
          sender_profile_id: string | null;
          content: string;
          is_read: boolean;
          message_type: 'anonymous' | 'user_to_user';
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          sender_id?: string | null;
          sender_profile_id?: string | null;
          content: string;
          is_read?: boolean;
          message_type?: 'anonymous' | 'user_to_user';
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          sender_id?: string | null;
          sender_profile_id?: string | null;
          content?: string;
          is_read?: boolean;
          message_type?: 'anonymous' | 'user_to_user';
          created_at?: string;
        };
      };
    };
  };
};