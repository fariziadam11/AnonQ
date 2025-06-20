import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageCircle, User, ExternalLink } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { MessageForm } from '../components/MessageForm';
import { Database } from '../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { getProfileByUsername } = useProfile();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      loadProfile();
    }
  }, [username]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await getProfileByUsername(username!);
      setProfile(profileData);
    } catch (err) {
      setError('Profile not found');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Profile Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The user @{username} doesn't exist or has been removed.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-neoBg dark:bg-neoDark">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-neoDark dark:border-white bg-neoAccent overflow-hidden">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.username + ' avatar'}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <span className="text-3xl font-extrabold text-neoDark dark:text-white">
                {profile.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="text-4xl font-extrabold text-neoDark dark:text-white mb-2 drop-shadow-sm">
            @{profile.username}
          </h1>
          <p className="text-neoDark/70 dark:text-white/70 text-lg">
            Send an anonymous message to this user
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-neoDark/70 dark:text-white/70">
            <MessageCircle className="h-4 w-4" />
            <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Message Form */}
        <MessageForm profileId={profile.id} username={profile.username} />

        {/* How it works */}
        <div className="mt-8 bg-neoAccent3/10 dark:bg-neoAccent3/20 border-2 border-neoAccent3 dark:border-white rounded-neo p-6">
          <h3 className="font-semibold text-neoAccent3 dark:text-neoAccent mb-3">How anonymous messaging works:</h3>
          <ul className="text-neoDark dark:text-white text-sm space-y-2">
            <li className="flex items-start space-x-2">
              <span className="font-bold">•</span>
              <span>Your message will be completely anonymous - no personal information is shared</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold">•</span>
              <span>The recipient cannot see who sent the message</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold">•</span>
              <span>Be respectful and kind in your messages</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold">•</span>
              <span>Messages are delivered instantly</span>
            </li>
          </ul>
        </div>

        {/* Create your own */}
        <div className="mt-8 text-center">
          <div className="bg-neoAccent/10 dark:bg-neoAccent/20 rounded-neo p-6 border-2 border-neoAccent dark:border-white">
            <MessageCircle className="h-12 w-12 text-neoAccent2 dark:text-neoAccent3 mx-auto mb-4" />
            <h3 className="text-xl font-extrabold text-neoDark dark:text-white mb-2">
              Want to receive anonymous messages too?
            </h3>
            <p className="text-neoDark/70 dark:text-white/70 mb-4">
              Create your own AnonQ profile and start receiving anonymous messages from your friends!
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center space-x-2 bg-neoAccent2 dark:bg-neoAccent3 text-white dark:text-neoDark px-6 py-3 rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-bold hover:bg-neoAccent3 hover:text-neoDark dark:hover:bg-neoAccent2 dark:hover:text-white transition-all duration-200"
            >
              <span>Create Your Profile</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};