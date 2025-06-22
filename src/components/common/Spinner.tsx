import type React from "react"
import { Loader2, MessageCircle } from "lucide-react"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  message?: string
  variant?: "default" | "dots" | "pulse" | "bounce"
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-16 h-16",
}

const DotsSpinner: React.FC<{ size: string }> = ({ size }) => (
  <div className="flex space-x-1">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={`${size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"} bg-neoAccent2 rounded-full animate-bounce`}
        style={{ animationDelay: `${i * 0.1}s` }}
      />
    ))}
  </div>
)

const PulseSpinner: React.FC<{ size: string }> = ({ size }) => (
  <div className="relative">
    <div
      className={`${sizeClasses[size as keyof typeof sizeClasses]} bg-neoAccent2 rounded-full animate-ping absolute`}
    />
    <div className={`${sizeClasses[size as keyof typeof sizeClasses]} bg-neoAccent3 rounded-full animate-pulse`} />
  </div>
)

const BounceSpinner: React.FC<{ size: string }> = ({ size }) => (
  <div className="flex items-center justify-center">
    <MessageCircle
      className={`${sizeClasses[size as keyof typeof sizeClasses]} text-neoAccent2 animate-bounce-gentle`}
    />
  </div>
)

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "", message, variant = "default" }) => {
  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return <DotsSpinner size={size} />
      case "pulse":
        return <PulseSpinner size={size} />
      case "bounce":
        return <BounceSpinner size={size} />
      default:
        return <Loader2 className={`${sizeClasses[size]} text-neoAccent2 animate-spin`} />
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="relative">{renderSpinner()}</div>
      {message && (
        <div className="text-center">
          <p className="text-sm font-bold text-neoDark dark:text-white animate-pulse">{message}</p>
          <div className="mt-2 flex justify-center">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-neoAccent2 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
