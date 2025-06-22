"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, MessageCircle, Heart, Shield, Sparkles, User, Lock, CheckCircle, AlertTriangle } from "lucide-react"
import { useMessages } from "../../context/MessagesContext"
import toast from "react-hot-toast"

interface MessageFormProps {
  profileId: string
  username: string
}

export const MessageForm: React.FC<MessageFormProps> = ({ profileId, username }) => {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { sendMessage } = useMessages()
  const [messageType] = useState<"anonymous" | "user_to_user">("anonymous")

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    setCharCount(message.length)
  }, [message])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      toast.error("Please enter a message")
      return
    }

    if (message.length > 1000) {
      toast.error("Message is too long (max 1000 characters)")
      return
    }

    setLoading(true)
    try {
      await sendMessage(profileId, message.trim(), messageType)
      setMessage("")
      setCharCount(0)

      // Success animation
      if (textareaRef.current) {
        textareaRef.current.style.transform = "scale(0.98)"
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.style.transform = "scale(1)"
          }
        }, 150)
      }

      toast.success(messageType === "anonymous" ? "🎉 Message sent anonymously!" : "📨 Message sent as user!", {
        duration: 4000,
        style: {
          background: "#10B981",
          color: "white",
        },
      })
    } catch (error: any) {
      toast.error(error.message || "Failed to send message", {
        duration: 4000,
        style: {
          background: "#EF4444",
          color: "white",
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= 1000) {
      setMessage(value)
    }
  }

  const getCharCountColor = () => {
    if (charCount > 900) return "text-neoError"
    if (charCount > 750) return "text-neoWarning"
    return "text-neoDark/50 dark:text-white/50"
  }

  const getProgressWidth = () => {
    return Math.min((charCount / 1000) * 100, 100)
  }

  const getProgressColor = () => {
    if (charCount > 900) return "bg-neoError"
    if (charCount > 750) return "bg-neoWarning"
    return "bg-gradient-to-r from-neoAccent2 to-neoAccent3"
  }

  return (
    <div
      className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-neoAccent/5 dark:from-neoDark/50 dark:to-neoAccent/10 rounded-neo blur-xl"></div>

        <div className="relative bg-white/90 dark:bg-neoDark/90 backdrop-blur-sm rounded-neo shadow-neo-xl border-4 border-neoDark dark:border-white p-6 sm:p-8 lg:p-10 transform hover:-rotate-1 transition-all duration-300">
          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-neoAccent2 to-neoAccent3 rounded-full flex items-center justify-center border-4 border-neoDark dark:border-white shadow-neo-lg animate-bounce-gentle">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>

              {/* Floating icons around the main icon */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-neoAccent rounded-full flex items-center justify-center border-2 border-neoDark dark:border-white shadow-neo animate-pulse">
                <Heart className="h-3 w-3 text-neoDark fill-current" />
              </div>
              <div
                className="absolute -bottom-2 -left-2 w-6 h-6 bg-neoAccent3 rounded-full flex items-center justify-center border-2 border-neoDark dark:border-white shadow-neo animate-pulse"
                style={{ animationDelay: "0.5s" }}
              >
                <Sparkles className="h-3 w-3 text-white fill-current" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-neoDark dark:text-white mb-3">
              Send an anonymous message to{" "}
              <span className="bg-gradient-to-r from-neoAccent2 to-neoAccent3 bg-clip-text text-transparent">
                @{username}
              </span>
            </h2>
            <p className="text-neoDark/70 dark:text-white/70 text-lg font-bold max-w-2xl mx-auto">
              Your identity will remain completely anonymous. Be honest, be kind, be yourself.
            </p>
          </div>

          {/* Enhanced Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-lg font-black text-neoDark dark:text-white mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-neoAccent2" />
                Your anonymous message
              </label>

              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={handleTextareaChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`w-full px-6 py-4 border-4 border-neoDark dark:border-white rounded-neo focus:ring-4 focus:ring-neoAccent/50 focus:border-neoAccent transition-all duration-300 resize-none bg-white dark:bg-neoDark text-neoDark dark:text-white font-bold shadow-neo text-lg leading-relaxed ${
                    isFocused ? "shadow-neo-lg transform -translate-y-1" : ""
                  } ${charCount > 900 ? "border-neoError focus:border-neoError focus:ring-neoError/50" : ""}`}
                  rows={6}
                  placeholder="Type your message here... Be kind and respectful! ✨"
                  required
                />

                {/* Character count and progress */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <div className={`text-sm font-bold ${getCharCountColor()}`}>{charCount}/1000</div>
                  {charCount > 0 && (
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getProgressColor()}`}
                        style={{ width: `${getProgressWidth()}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Focus indicator */}
                {isFocused && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-neoAccent2 to-neoAccent3 rounded-neo opacity-20 animate-pulse pointer-events-none"></div>
                )}
              </div>

              {/* Character count warning */}
              {charCount > 750 && (
                <div
                  className={`mt-2 flex items-center gap-2 text-sm font-bold animate-slide-down ${
                    charCount > 900 ? "text-neoError" : "text-neoWarning"
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                  {charCount > 900
                    ? `Only ${1000 - charCount} characters remaining!`
                    : `${1000 - charCount} characters remaining`}
                </div>
              )}
            </div>

            {/* Enhanced Submit Button */}
            <div className="relative">
              <button
                type="submit"
                disabled={loading || !message.trim() || charCount > 1000}
                className={`group w-full bg-gradient-to-r from-neoAccent2 to-neoAccent3 text-white py-4 px-6 rounded-neo border-4 border-neoDark dark:border-white shadow-neo-lg font-black text-xl hover:shadow-neo-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-neo-lg flex items-center justify-center gap-3 ${
                  loading ? "animate-pulse" : ""
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    <span>Sending anonymously...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                    <span>Send Anonymous Message</span>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </>
                )}
              </button>

              {/* Button glow effect */}
              {!loading && message.trim() && charCount <= 1000 && (
                <div className="absolute inset-0 bg-gradient-to-r from-neoAccent2 to-neoAccent3 rounded-neo opacity-20 animate-pulse pointer-events-none"></div>
              )}
            </div>
          </form>

          {/* Enhanced Privacy Notice */}
          <div className="mt-8 relative">
            <div className="bg-gradient-to-r from-neoAccent3/10 to-neoAccent/10 dark:from-neoAccent3/20 dark:to-neoAccent/20 border-4 border-neoAccent3/30 dark:border-neoAccent/30 rounded-neo p-6 shadow-neo transform hover:rotate-1 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-neoAccent3 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-neoDark dark:border-white shadow-neo">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-neoDark dark:text-white mb-2 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-neoAccent3" />
                    Privacy Guarantee
                  </h3>
                  <div className="space-y-2 text-sm text-neoDark dark:text-white">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-neoSuccess flex-shrink-0" />
                      <span className="font-bold">Your message will be sent completely anonymously</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-neoSuccess flex-shrink-0" />
                      <span className="font-bold">
                        The recipient cannot see your identity or any information about you
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-neoSuccess flex-shrink-0" />
                      <span className="font-bold">Your IP address and device information are not stored</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message Guidelines */}
          <div className="mt-6 p-4 bg-neoAccent/10 dark:bg-neoAccent/20 border-2 border-neoAccent/30 rounded-neo">
            <h4 className="font-black text-neoDark dark:text-white mb-2 flex items-center gap-2">
              <Heart className="h-4 w-4 text-neoAccent2 fill-current" />
              Message Guidelines
            </h4>
            <ul className="text-sm text-neoDark/80 dark:text-white/80 space-y-1">
              <li>• Be respectful and kind in your messages</li>
              <li>• No harassment, threats, or inappropriate content</li>
              <li>• Keep it constructive and meaningful</li>
              <li>• Remember: anonymity is not a license to be cruel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
