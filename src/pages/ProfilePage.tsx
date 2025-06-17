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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-white">
              {profile.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            @{profile.username}
          </h1>
          <p className="text-gray-600 text-lg">
            Send an anonymous message to this user
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <MessageCircle className="h-4 w-4" />
            <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Message Form */}
        <MessageForm profileId={profile.id} username={profile.username} />

        {/* How it works */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3">How anonymous messaging works:</h3>
          <ul className="text-blue-700 text-sm space-y-2">
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
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
            <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Want to receive anonymous messages too?
            </h3>
            <p className="text-gray-600 mb-4">
              Create your own AnonQ profile and start receiving anonymous messages from your friends!
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
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