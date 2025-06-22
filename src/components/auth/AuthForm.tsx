"use client"

import type React from "react"
import { useState } from "react"
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useToast } from "../../context/ToastContext"
import { validateUsername } from "../../lib/supabase"

interface AuthFormProps {
  onSuccess?: () => void
  mode?: "login" | "register"
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, mode }) => {
  const [isLogin, setIsLogin] = useState(mode ? mode === "login" : true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  })

  const { signIn, signUp } = useAuth()
  const { showToast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!isLogin) {
      if (!formData.username.trim()) {
        newErrors.username = "Username is required"
      } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
        newErrors.username = "Username can only contain letters, numbers, hyphens, and underscores"
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password)
        showToast("Welcome back! 🎉", "success")
      } else {
        // Backend validation (Supabase RPC)
        const isValid = await validateUsername(formData.username)
        if (!isValid) {
          setErrors({ username: "Username is not valid (must be 3-50 chars, only a-z, A-Z, 0-9, _ )" })
          return
        }

        await signUp(formData.email, formData.password, formData.username)
        await signIn(formData.email, formData.password)
        showToast("Account created successfully! 🚀", "success")
        localStorage.setItem("pending_username", formData.username)
        onSuccess?.()
        return
      }
      onSuccess?.()
    } catch (error: any) {
      showToast(error.message || "An error occurred", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const getInputClassName = (fieldName: string) => {
    const baseClass =
      "w-full pl-10 pr-4 py-3 border-2 rounded-neo focus:ring-2 focus:ring-neoAccent transition-all duration-200 bg-neoBg dark:bg-neoDark text-neoDark dark:text-white font-bold shadow-neo neo-input"
    const errorClass = errors[fieldName]
      ? "border-neoError focus:border-neoError"
      : "border-neoDark dark:border-white focus:border-neoAccent"
    return `${baseClass} ${errorClass}`
  }

  return (
    <div className="w-full max-w-md mx-auto animate-scale-in">
      <div className="bg-white dark:bg-neoDark rounded-neo shadow-neo-xl border-4 border-neoDark dark:border-white p-8 neo-card">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-neoAccent2 to-neoAccent3 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-neoDark dark:border-white shadow-neo animate-bounce-gentle">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-neoDark dark:text-white drop-shadow-sm">
            {isLogin ? "Welcome Back! 👋" : "Join AnonQ! 🚀"}
          </h2>
          <p className="text-neoDark/70 dark:text-white/70 mt-2">
            {isLogin
              ? "Sign in to access your anonymous messages"
              : "Create your account to start receiving anonymous messages"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neoAccent2" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={getInputClassName("username")}
                  placeholder="Choose a unique username"
                  required={!isLogin}
                />
                {formData.username && !errors.username && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neoSuccess" />
                )}
              </div>
              {errors.username && (
                <div className="flex items-center gap-2 text-neoError text-sm font-bold animate-slide-down">
                  <AlertCircle className="h-4 w-4" />
                  {errors.username}
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neoAccent3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={getInputClassName("email")}
                placeholder="Enter your email address"
                required
              />
              {formData.email && !errors.email && /\S+@\S+\.\S+/.test(formData.email) && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neoSuccess" />
              )}
            </div>
            {errors.email && (
              <div className="flex items-center gap-2 text-neoError text-sm font-bold animate-slide-down">
                <AlertCircle className="h-4 w-4" />
                {errors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neoAccent" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`${getInputClassName("password")} pr-12`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neoAccent2 hover:text-neoAccent3 transition-colors p-1 rounded focus-neo"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center gap-2 text-neoError text-sm font-bold animate-slide-down">
                <AlertCircle className="h-4 w-4" />
                {errors.password}
              </div>
            )}
            {!isLogin && formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-2 h-2 rounded-full ${formData.password.length >= 6 ? "bg-neoSuccess" : "bg-gray-300"}`}
                  ></div>
                  <span className={formData.password.length >= 6 ? "text-neoSuccess" : "text-gray-500"}>
                    At least 6 characters
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="form-button-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                {isLogin ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              <>
                {isLogin ? "Sign In" : "Create Account"}
                {isLogin ? "🔓" : "🎉"}
              </>
            )}
          </button>

          {isLogin && (
            <div className="text-center">
              <a
                href="/forgot-password"
                className="text-neoAccent2 hover:text-neoAccent3 font-bold transition-colors duration-200 hover:underline focus-neo rounded px-2 py-1"
              >
                Forgot your password? 🤔
              </a>
            </div>
          )}
        </form>

        {!mode && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setErrors({})
                setFormData({ email: "", password: "", username: "" })
              }}
              className="text-neoAccent2 hover:text-neoAccent3 font-bold transition-colors duration-200 hover:underline focus-neo rounded px-2 py-1"
            >
              {isLogin ? "Don't have an account? Sign up 🚀" : "Already have an account? Sign in 👋"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
