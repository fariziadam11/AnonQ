"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MessageCircle, Users, Shield, LinkIcon, ArrowRight, Sparkles, Heart, Star } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export const HomePage: React.FC = () => {
  const { user, loading } = useAuth()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-8 border-neoDark dark:border-white border-t-neoAccent2"></div>
          <p className="text-neoDark dark:text-white font-bold">Loading your experience...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex flex-col h-full page-transition">
        <div className="flex-1 px-4 py-8 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Welcome Section */}
            <div
              className={`mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="relative inline-block">
                <h1 className="text-3xl sm:text-5xl font-black mb-6 transform -rotate-1 p-4 border-8 shadow-neo-xl text-white bg-gradient-to-r from-neoAccent2 to-neoAccent3 border-neoDark dark:border-white animate-float">
                  Welcome Back! 🎉
                </h1>
                <div className="absolute -top-2 -right-2 animate-bounce-gentle">
                  <Sparkles className="h-8 w-8 text-neoAccent fill-current" />
                </div>
              </div>
              <p className="text-base sm:text-xl max-w-2xl mx-auto font-bold p-4 border-4 transform rotate-1 shadow-neo-lg text-neoDark dark:text-white bg-white dark:bg-gray-800 border-neoDark dark:border-white">
                You're all set! Check your dashboard to see messages or share your personal link to start receiving
                anonymous messages.
              </p>
            </div>

            {/* Action Cards */}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div
                className="group border-8 p-6 sm:p-8 shadow-neo-xl transform hover:-rotate-2 transition-all duration-300 hover:shadow-neo-xl hover:-translate-y-2 bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 border-neoDark dark:border-white neo-card cursor-pointer"
                onClick={() => (window.location.href = "/dashboard")}
              >
                <div className="relative">
                  <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 stroke-[3px] text-white group-hover:animate-bounce-gentle" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-neoAccent2 rounded-full flex items-center justify-center">
                    <span className="text-xs font-black text-white">!</span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-black mb-2 text-white">VIEW MESSAGES</h3>
                <p className="mb-4 font-bold text-white/90 text-sm sm:text-base">
                  Check all the anonymous messages you've received from others.
                </p>
                <button className="group/btn w-full sm:w-auto px-6 py-2 border-4 font-black uppercase shadow-neo hover:shadow-neo-hover hover:-translate-y-1 transition-all duration-200 bg-white text-neoDark border-neoDark flex items-center justify-center gap-2">
                  GO TO DASHBOARD
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              <div
                className="group border-8 p-6 sm:p-8 shadow-neo-xl transform hover:rotate-2 transition-all duration-300 hover:shadow-neo-xl hover:-translate-y-2 bg-gradient-to-br from-green-400 to-green-600 dark:from-green-600 dark:to-green-800 border-neoDark dark:border-white neo-card cursor-pointer"
                onClick={() => (window.location.href = "/dashboard")}
              >
                <div className="relative">
                  <LinkIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 stroke-[3px] text-white group-hover:animate-wiggle" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-neoAccent rounded-full flex items-center justify-center animate-pulse">
                    <Star className="h-3 w-3 text-neoDark fill-current" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-black mb-2 text-white">SHARE YOUR LINK</h3>
                <p className="mb-4 font-bold text-white/90 text-sm sm:text-base">
                  Share your personal page to start receiving anonymous messages.
                </p>
                <button className="group/btn w-full sm:w-auto px-6 py-2 border-4 font-black uppercase shadow-neo hover:shadow-neo-hover hover:-translate-y-1 transition-all duration-200 bg-neoAccent text-neoDark border-neoDark flex items-center justify-center gap-2">
                  GET YOUR LINK
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Stats Section */}
            <div
              className={`mt-16 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="p-4 border-4 border-neoDark dark:border-white rounded-neo shadow-neo bg-white dark:bg-neoDark transform hover:scale-105 transition-all duration-200">
                  <div className="text-2xl font-black text-neoAccent2">1000+</div>
                  <div className="text-sm font-bold text-neoDark dark:text-white">Active Users</div>
                </div>
                <div className="p-4 border-4 border-neoDark dark:border-white rounded-neo shadow-neo bg-white dark:bg-neoDark transform hover:scale-105 transition-all duration-200">
                  <div className="text-2xl font-black text-neoAccent3">50K+</div>
                  <div className="text-sm font-bold text-neoDark dark:text-white">Messages Sent</div>
                </div>
                <div className="p-4 border-4 border-neoDark dark:border-white rounded-neo shadow-neo bg-white dark:bg-neoDark transform hover:scale-105 transition-all duration-200">
                  <div className="text-2xl font-black text-neoAccent">100%</div>
                  <div className="text-sm font-bold text-neoDark dark:text-white">Anonymous</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="w-full py-4 px-2 sm:px-6 text-center text-xs sm:text-base text-neoDark dark:text-white bg-white dark:bg-gray-800 border-t-4 border-neoDark dark:border-white shadow-neo-lg">
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-4 w-4 text-neoAccent2 fill-current animate-pulse" />
            <span className="font-bold">© {new Date().getFullYear()} AnonQ</span>
            <span>&middot;</span>
            <a
              href="https://github.com/fariziadam11/AnonQ"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-neoAccent2 transition-colors"
            >
              GitHub
            </a>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full page-transition">
      <div className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="relative inline-block">
              <h1 className="text-3xl sm:text-6xl font-black mb-6 transform -rotate-2 p-4 sm:p-8 border-8 shadow-neo-xl text-white bg-gradient-to-r from-neoAccent2 via-neoAccent3 to-neoAccent border-neoDark dark:border-white animate-float">
                ANONYMOUS Q&A PLATFORM
              </h1>
              <div className="absolute -top-4 -right-4 animate-bounce-gentle">
                <div className="w-12 h-12 bg-neoAccent rounded-full flex items-center justify-center border-4 border-neoDark shadow-neo">
                  <Sparkles className="h-6 w-6 text-neoDark fill-current" />
                </div>
              </div>
            </div>

            <p className="text-base sm:text-xl max-w-3xl mx-auto mb-8 font-bold p-4 sm:p-6 border-4 transform rotate-1 shadow-neo-lg text-neoDark dark:text-white bg-white dark:bg-gray-800 border-neoDark dark:border-white">
              Create your anonymous link and let others send you honest, anonymous messages. Perfect for receiving
              feedback, questions, or just connecting with others in a safe space.
            </p>

            <div className="flex justify-center mb-8">
              <div className="border-4 px-4 sm:px-6 py-2 sm:py-3 shadow-neo transform -rotate-1 bg-gradient-to-r from-neoAccent to-neoAccent3 border-neoDark dark:border-white animate-pulse">
                <span className="font-black uppercase text-neoDark text-xs sm:text-base flex items-center gap-2">
                  🚀 JOIN THOUSANDS SHARING ANONYMOUSLY
                  <Star className="h-4 w-4 fill-current animate-spin" />
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "/register")}
                className="group px-8 py-4 bg-neoAccent2 text-white border-4 border-neoDark dark:border-white rounded-neo shadow-neo-lg font-black text-lg hover:shadow-neo-xl hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
              >
                GET STARTED FREE
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => (window.location.href = "/login")}
                className="px-8 py-4 bg-white dark:bg-neoDark text-neoDark dark:text-white border-4 border-neoDark dark:border-white rounded-neo shadow-neo-lg font-black text-lg hover:shadow-neo-xl hover:-translate-y-1 transition-all duration-200"
              >
                SIGN IN
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="group border-8 p-6 sm:p-8 shadow-neo-xl transform hover:-rotate-3 transition-all duration-300 hover:shadow-neo-xl hover:-translate-y-2 bg-gradient-to-br from-pink-400 to-pink-600 dark:from-pink-600 dark:to-pink-800 border-neoDark dark:border-white neo-card">
              <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 mb-4 stroke-[3px] text-white group-hover:animate-bounce-gentle" />
              <h3 className="text-lg sm:text-xl font-black mb-2 uppercase text-white">ANONYMOUS MESSAGES</h3>
              <p className="font-bold text-white/90 text-sm sm:text-base">
                Receive honest feedback and questions without revealing the sender's identity. Perfect for genuine
                conversations.
              </p>
            </div>

            <div className="group border-8 p-6 sm:p-8 shadow-neo-xl transform hover:rotate-3 transition-all duration-300 hover:shadow-neo-xl hover:-translate-y-2 bg-gradient-to-br from-cyan-400 to-cyan-600 dark:from-cyan-600 dark:to-cyan-800 border-neoDark dark:border-white neo-card">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 mb-4 stroke-[3px] text-white group-hover:animate-pulse" />
              <h3 className="text-lg sm:text-xl font-black mb-2 uppercase text-white">COMPLETE PRIVACY</h3>
              <p className="font-bold text-white/90 text-sm sm:text-base">
                Your privacy is our priority. All messages are completely anonymous with no way to trace back to the
                sender.
              </p>
            </div>

            <div className="group border-8 p-6 sm:p-8 shadow-neo-xl transform hover:-rotate-2 transition-all duration-300 hover:shadow-neo-xl hover:-translate-y-2 bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-600 dark:to-orange-800 border-neoDark dark:border-white neo-card">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 mb-4 stroke-[3px] text-white group-hover:animate-wiggle" />
              <h3 className="text-lg sm:text-xl font-black mb-2 uppercase text-white">EASY SHARING</h3>
              <p className="font-bold text-white/90 text-sm sm:text-base">
                Get your unique link and share it anywhere. Friends, social media, or embed it on your website.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div
            className={`mt-16 text-center transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-2xl sm:text-3xl font-black mb-8 p-4 border-6 shadow-neo-lg transform rotate-1 uppercase text-white bg-gradient-to-r from-green-400 to-green-600 border-neoDark dark:border-white">
              HOW IT WORKS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  title: "CREATE ACCOUNT",
                  desc: "Sign up with your email and choose a unique username",
                  color: "from-purple-400 to-purple-600",
                },
                {
                  step: 2,
                  title: "SHARE YOUR LINK",
                  desc: "Share your personal anonymous message link with others",
                  color: "from-lime-400 to-lime-600",
                },
                {
                  step: 3,
                  title: "RECEIVE MESSAGES",
                  desc: "Get anonymous messages and respond if you want to",
                  color: "from-rose-400 to-rose-600",
                },
              ].map((item, index) => (
                <div
                  key={item.step}
                  className={`space-y-4 p-4 sm:p-6 border-6 shadow-neo-lg transform ${index % 2 === 0 ? "-rotate-2" : "rotate-1"} bg-gradient-to-br ${item.color} border-neoDark dark:border-white hover:scale-105 transition-all duration-300 neo-card`}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 flex items-center justify-center mx-auto shadow-neo bg-white border-neoDark animate-bounce-gentle">
                    <span className="font-black text-base sm:text-lg text-neoDark">{item.step}</span>
                  </div>
                  <h3 className="font-black uppercase text-white text-sm sm:text-base">{item.title}</h3>
                  <p className="font-bold text-white/90 text-xs sm:text-base">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full py-4 px-2 sm:px-6 text-center text-xs sm:text-base text-neoDark dark:text-white bg-white dark:bg-gray-800 border-t-4 border-neoDark dark:border-white shadow-neo-lg">
        <div className="flex items-center justify-center gap-2">
          <Heart className="h-4 w-4 text-neoAccent2 fill-current animate-pulse" />
          <span className="font-bold">© {new Date().getFullYear()} AnonQ</span>
          <span>&middot;</span>
          <a
            href="https://github.com/fariziadam11/AnonQ"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-neoAccent2 transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
