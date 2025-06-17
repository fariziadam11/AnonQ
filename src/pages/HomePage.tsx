import React from 'react';
import { MessageCircle, Users, Shield, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthForm } from '../components/AuthForm';

export const HomePage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              Welcome to AnonQ
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              You're all set! Check your dashboard to see messages or share your
              personal link to start receiving anonymous messages.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
              <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                View Messages
              </h3>
              <p className="text-gray-600 mb-4">
                Check all the anonymous messages you've received from others.
              </p>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
              >
                Go to Dashboard
              </button>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
              <LinkIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Share Your Link
              </h3>
              <p className="text-gray-600 mb-4">
                Share your personal page to start receiving anonymous messages.
              </p>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-gradient-to-r from-indigo-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-emerald-700 transition-all duration-200"
              >
                Get Your Link
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent mb-6">
            Anonymous Q&A Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Create your anonymous link and let others send you honest, anonymous
            messages. Perfect for receiving feedback, questions, or just connecting
            with others in a safe space.
          </p>
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full px-6 py-3">
              <span className="text-purple-800 font-medium">
                🚀 Join thousands sharing anonymously
              </span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <MessageCircle className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Anonymous Messages
            </h3>
            <p className="text-gray-600">
              Receive honest feedback and questions without revealing the sender's
              identity. Perfect for genuine conversations.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <Shield className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Complete Privacy
            </h3>
            <p className="text-gray-600">
              Your privacy is our priority. All messages are completely anonymous
              with no way to trace back to the sender.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <Users className="h-12 w-12 text-emerald-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Easy Sharing
            </h3>
            <p className="text-gray-600">
              Get your unique link and share it anywhere. Friends, social media,
              or embed it on your website.
            </p>
          </div>
        </div>

        {/* Auth Form */}
        <div className="max-w-md mx-auto">
          <AuthForm />
        </div>

        {/* How it works */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-purple-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-800">Create Account</h3>
              <p className="text-gray-600">
                Sign up with your email and choose a unique username
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-indigo-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-800">Share Your Link</h3>
              <p className="text-gray-600">
                Share your personal anonymous message link with others
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-emerald-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-800">Receive Messages</h3>
              <p className="text-gray-600">
                Get anonymous messages and respond if you want to
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};