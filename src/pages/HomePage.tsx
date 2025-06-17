import React from 'react';
import { MessageCircle, Users, Shield, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthForm } from '../components/AuthForm';

export const HomePage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-300 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-8 border-black dark:border-white border-t-red-500"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-yellow-300 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-5xl font-black mb-6 transform -rotate-1 p-4 border-8 shadow-[8px_8px_0px_0px_#000] text-black dark:text-white bg-red-500 dark:bg-red-600 border-black dark:border-white">
              Welcome to AnonQ
            </h1>
            <p className="text-xl max-w-2xl mx-auto font-bold p-4 border-4 transform rotate-1 shadow-[4px_4px_0px_0px_#000] text-black dark:text-white bg-white dark:bg-gray-800 border-black dark:border-white">
              You're all set! Check your dashboard to see messages or share your
              personal link to start receiving anonymous messages.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="border-8 p-8 shadow-[8px_8px_0px_0px_#000] transform hover:-rotate-2 transition-all duration-300 hover:shadow-[12px_12px_0px_0px_#000] bg-blue-400 dark:bg-blue-600 border-black dark:border-white">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 stroke-[3px] text-black dark:text-white" />
              <h3 className="text-xl font-black mb-2 text-black dark:text-white">
                VIEW MESSAGES
              </h3>
              <p className="mb-4 font-bold text-black dark:text-white">
                Check all the anonymous messages you've received from others.
              </p>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-6 py-2 border-4 font-black uppercase shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 bg-red-500 dark:bg-red-600 text-black dark:text-white border-black dark:border-white"
              >
                GO TO DASHBOARD
              </button>
            </div>

            <div className="border-8 p-8 shadow-[8px_8px_0px_0px_#000] transform hover:rotate-2 transition-all duration-300 hover:shadow-[12px_12px_0px_0px_#000] bg-green-400 dark:bg-green-600 border-black dark:border-white">
              <LinkIcon className="h-12 w-12 mx-auto mb-4 stroke-[3px] text-black dark:text-white" />
              <h3 className="text-xl font-black mb-2 text-black dark:text-white">
                SHARE YOUR LINK
              </h3>
              <p className="mb-4 font-bold text-black dark:text-white">
                Share your personal page to start receiving anonymous messages.
              </p>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-6 py-2 border-4 font-black uppercase shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 bg-yellow-500 dark:bg-yellow-600 text-black dark:text-white border-black dark:border-white"
              >
                GET YOUR LINK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-yellow-300 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-6 transform -rotate-2 p-8 border-8 shadow-[12px_12px_0px_0px_#000] text-black dark:text-white bg-red-500 dark:bg-red-600 border-black dark:border-white">
            ANONYMOUS Q&A PLATFORM
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-8 font-bold p-6 border-4 transform rotate-1 shadow-[6px_6px_0px_0px_#000] text-black dark:text-white bg-white dark:bg-gray-800 border-black dark:border-white">
            Create your anonymous link and let others send you honest, anonymous
            messages. Perfect for receiving feedback, questions, or just connecting
            with others in a safe space.
          </p>
          <div className="flex justify-center">
            <div className="border-4 px-6 py-3 shadow-[4px_4px_0px_0px_#000] transform -rotate-1 bg-blue-400 dark:bg-blue-600 border-black dark:border-white">
              <span className="font-black uppercase text-black dark:text-white">
                🚀 JOIN THOUSANDS SHARING ANONYMOUSLY
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="border-8 p-8 shadow-[8px_8px_0px_0px_#000] transform hover:-rotate-3 transition-all duration-300 hover:shadow-[12px_12px_0px_0px_#000] bg-pink-400 dark:bg-pink-600 border-black dark:border-white">
            <MessageCircle className="h-12 w-12 mb-4 stroke-[3px] text-black dark:text-white" />
            <h3 className="text-xl font-black mb-2 uppercase text-black dark:text-white">
              ANONYMOUS MESSAGES
            </h3>
            <p className="font-bold text-black dark:text-white">
              Receive honest feedback and questions without revealing the sender's
              identity. Perfect for genuine conversations.
            </p>
          </div>

          <div className="border-8 p-8 shadow-[8px_8px_0px_0px_#000] transform hover:rotate-3 transition-all duration-300 hover:shadow-[12px_12px_0px_0px_#000] bg-cyan-400 dark:bg-cyan-600 border-black dark:border-white">
            <Shield className="h-12 w-12 mb-4 stroke-[3px] text-black dark:text-white" />
            <h3 className="text-xl font-black mb-2 uppercase text-black dark:text-white">
              COMPLETE PRIVACY
            </h3>
            <p className="font-bold text-black dark:text-white">
              Your privacy is our priority. All messages are completely anonymous
              with no way to trace back to the sender.
            </p>
          </div>

          <div className="border-8 p-8 shadow-[8px_8px_0px_0px_#000] transform hover:-rotate-2 transition-all duration-300 hover:shadow-[12px_12px_0px_0px_#000] bg-orange-400 dark:bg-orange-600 border-black dark:border-white">
            <Users className="h-12 w-12 mb-4 stroke-[3px] text-black dark:text-white" />
            <h3 className="text-xl font-black mb-2 uppercase text-black dark:text-white">
              EASY SHARING
            </h3>
            <p className="font-bold text-black dark:text-white">
              Get your unique link and share it anywhere. Friends, social media,
              or embed it on your website.
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <AuthForm />
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-black mb-8 p-4 border-6 shadow-[6px_6px_0px_0px_#000] transform rotate-1 uppercase text-black dark:text-white bg-green-400 dark:bg-green-600 border-black dark:border-white">
            HOW IT WORKS
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4 p-6 border-6 shadow-[6px_6px_0px_0px_#000] transform -rotate-2 bg-purple-400 dark:bg-purple-600 border-black dark:border-white">
              <div className="w-12 h-12 border-4 flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#000] bg-white dark:bg-gray-800 border-black dark:border-white">
                <span className="font-black text-lg text-black dark:text-white">1</span>
              </div>
              <h3 className="font-black uppercase text-black dark:text-white">CREATE ACCOUNT</h3>
              <p className="font-bold text-black dark:text-white">
                Sign up with your email and choose a unique username
              </p>
            </div>
            <div className="space-y-4 p-6 border-6 shadow-[6px_6px_0px_0px_#000] transform rotate-1 bg-lime-400 dark:bg-lime-600 border-black dark:border-white">
              <div className="w-12 h-12 border-4 flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#000] bg-white dark:bg-gray-800 border-black dark:border-white">
                <span className="font-black text-lg text-black dark:text-white">2</span>
              </div>
              <h3 className="font-black uppercase text-black dark:text-white">SHARE YOUR LINK</h3>
              <p className="font-bold text-black dark:text-white">
                Share your personal anonymous message link with others
              </p>
            </div>
            <div className="space-y-4 p-6 border-6 shadow-[6px_6px_0px_0px_#000] transform -rotate-1 bg-rose-400 dark:bg-rose-600 border-black dark:border-white">
              <div className="w-12 h-12 border-4 flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#000] bg-white dark:bg-gray-800 border-black dark:border-white">
                <span className="font-black text-lg text-black dark:text-white">3</span>
              </div>
              <h3 className="font-black uppercase text-black dark:text-white">RECEIVE MESSAGES</h3>
              <p className="font-bold text-black dark:text-white">
                Get anonymous messages and respond if you want to
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};