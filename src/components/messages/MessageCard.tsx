"use client"

import type React from "react"
import { useState } from "react"
import {
  Clock,
  CheckCheck,
  Trash2,
  CheckSquare,
  Square,
  Download,
  Eye,
  X,
  User,
  Heart,
  MessageSquare,
} from "lucide-react"
import type { Database } from "../../lib/supabase"
import { useMessages } from "../../context/MessagesContext"
import * as htmlToImage from "html-to-image"
import { toast } from "react-hot-toast"

type Message = Database["public"]["Tables"]["messages"]["Row"]

export interface MessageCardProps {
  message: Message
  onMarkAsRead: (messageId: string) => Promise<void>
  isSelected?: boolean
  onSelect?: (messageId: string) => void
  isSelectionMode?: boolean
}

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  onMarkAsRead,
  isSelected = false,
  onSelect,
  isSelectionMode = false,
}) => {
  const { deleteMessage } = useMessages()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleMarkAsRead = async () => {
    if (!message.is_read) {
      await onMarkAsRead(message.id)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMessage(message.id)
      setShowDeleteConfirm(false)
      toast.success("Message deleted successfully! 🗑️")
    } catch (error) {
      console.error("Error deleting message:", error)
      toast.error("Failed to delete message")
    }
  }

  // Main download function with fallback
  const handleDownload = async () => {
    try {
      const cardElement = document.getElementById(`message-card-${message.id}`)
      if (!cardElement) {
        toast.error("Message card not found")
        return
      }

      // Method 1: Capture original element (recommended)
      await handleDownloadOriginal(cardElement)
    } catch (error) {
      console.error("Primary download method failed:", error)

      // Fallback method using clone
      try {
        await handleDownloadWithClone()
      } catch (fallbackError) {
        console.error("Fallback method also failed:", fallbackError)
        toast.error("Failed to download message. Please try again.")
      }
    }
  }

  // Method 1: Capture original element
  const handleDownloadOriginal = async (cardElement: HTMLElement) => {
    // Hide elements that shouldn't be in the image
    const elementsToHide = cardElement.querySelectorAll(".hide-in-image, .action-buttons, .checkbox-container")
    const originalDisplayValues: string[] = []

    elementsToHide.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        originalDisplayValues[index] = el.style.display
        el.style.display = "none"
      }
    })

    // Add loading state
    toast.loading("Generating image... 📸")

    try {
      // Wait for any pending renders
      await new Promise((resolve) => setTimeout(resolve, 100))

      const dataUrl = await htmlToImage.toPng(cardElement, {
        backgroundColor: "#ffffff",
        cacheBust: true,
        pixelRatio: 2,
        quality: 1,
        width: cardElement.offsetWidth,
        height: cardElement.offsetHeight,
      })

      // Check if dataUrl is valid
      if (!dataUrl || dataUrl === "data:," || dataUrl.length < 100) {
        throw new Error("Generated image is empty or invalid")
      }

      // Download the image
      const link = document.createElement("a")
      link.download = `message-${message.id}-${new Date().getTime()}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.dismiss()
      toast.success("Image downloaded successfully! ✨")
    } finally {
      // Always restore original display values
      elementsToHide.forEach((el, index) => {
        if (el instanceof HTMLElement) {
          el.style.display = originalDisplayValues[index] || ""
        }
      })
      toast.dismiss()
    }
  }

  // Method 2: Fallback with clone (improved to match desired output)
  const handleDownloadWithClone = async () => {
    const cardElement = document.getElementById(`message-card-${message.id}`)
    if (!cardElement) return

    toast.loading("Trying alternative method... 🔄")

    // Create main container exactly like the desired output
    const container = document.createElement("div")
    container.style.cssText = `
      position: absolute;
      top: -9999px;
      left: 0;
      width: 800px;
      background-color: #ffffff;
      padding: 40px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      border: 6px solid #000000;
      border-radius: 20px;
      box-sizing: border-box;
    `

    // Header section
    const header = document.createElement("div")
    header.style.cssText = `
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #000000;
    `

    const title = document.createElement("h1")
    title.textContent = "Anonymous Message"
    title.style.cssText = `
      margin: 0 0 12px 0;
      font-size: 36px;
      font-weight: bold;
      color: #000000;
      line-height: 1.2;
    `

    const timestamp = document.createElement("p")
    timestamp.textContent = new Date(message.created_at).toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    timestamp.style.cssText = `
      margin: 0;
      font-size: 18px;
      color: #666666;
      font-weight: normal;
    `

    header.appendChild(title)
    header.appendChild(timestamp)

    // Message content section
    const messageSection = document.createElement("div")
    messageSection.style.cssText = `
      margin-bottom: 0;
    `

    // User info with icon
    const userInfo = document.createElement("div")
    userInfo.style.cssText = `
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      gap: 16px;
    `

    // User icon (red circle)
    const userIcon = document.createElement("div")
    userIcon.style.cssText = `
      width: 50px;
      height: 50px;
      background-color: #ff6b6b;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    `

    // User icon SVG
    const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    iconSvg.setAttribute("width", "24")
    iconSvg.setAttribute("height", "24")
    iconSvg.setAttribute("viewBox", "0 0 24 24")
    iconSvg.setAttribute("fill", "white")

    const iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
    iconPath.setAttribute("d", "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2")
    iconPath.setAttribute("stroke", "white")
    iconPath.setAttribute("stroke-width", "2")
    iconPath.setAttribute("fill", "none")

    const iconCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    iconCircle.setAttribute("cx", "12")
    iconCircle.setAttribute("cy", "7")
    iconCircle.setAttribute("r", "4")
    iconCircle.setAttribute("stroke", "white")
    iconCircle.setAttribute("stroke-width", "2")
    iconCircle.setAttribute("fill", "none")

    iconSvg.appendChild(iconCircle)
    iconSvg.appendChild(iconPath)
    userIcon.appendChild(iconSvg)

    // User label
    const userLabel = document.createElement("span")
    userLabel.textContent = message.message_type === "anonymous" ? "Anonymous" : "User-to-User"
    userLabel.style.cssText = `
      font-size: 24px;
      font-weight: bold;
      color: #000000;
    `

    userInfo.appendChild(userIcon)
    userInfo.appendChild(userLabel)

    // Message content box
    const messageBox = document.createElement("div")
    messageBox.style.cssText = `
      background-color: #f0f0f0;
      border: 2px solid #e0e0e0;
      border-radius: 16px;
      padding: 24px;
      font-size: 18px;
      line-height: 1.6;
      color: #000000;
      white-space: pre-wrap;
      word-wrap: break-word;
      min-height: 60px;
    `
    messageBox.textContent = message.content

    // Assemble everything
    messageSection.appendChild(userInfo)
    messageSection.appendChild(messageBox)

    container.appendChild(header)
    container.appendChild(messageSection)
    document.body.appendChild(container)

    try {
      // Wait for render
      await new Promise((resolve) => setTimeout(resolve, 300))

      const dataUrl = await htmlToImage.toPng(container, {
        backgroundColor: "#ffffff",
        cacheBust: true,
        pixelRatio: 2,
        width: 800,
        height: container.scrollHeight + 80, // Add some padding
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      })

      if (!dataUrl || dataUrl === "data:," || dataUrl.length < 100) {
        throw new Error("Clone method also produced empty image")
      }

      const link = document.createElement("a")
      link.download = `message-${message.id}-${new Date().getTime()}.png`
      link.href = dataUrl
      link.click()

      toast.dismiss()
      toast.success("Image downloaded successfully! ✨")
    } finally {
      document.body.removeChild(container)
      toast.dismiss()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 168) {
      // 7 days
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <>
      <div
        id={`message-card-${message.id}`}
        className={`group bg-white dark:bg-neoDark rounded-neo shadow-neo-lg border-4 border-neoDark dark:border-white p-3 sm:p-4 lg:p-6 transition-all duration-300 neo-card ${
          isSelected ? "ring-4 ring-neoAccent2 dark:ring-neoAccent3 shadow-neo-xl" : ""
        } ${!message.is_read ? "border-neoAccent2 dark:border-neoAccent3 shadow-neo-xl" : ""} w-full break-words animate-fade-in-up`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col gap-3 sm:gap-4">
          {isSelectionMode && onSelect && (
            <div className="flex justify-end checkbox-container">
              <button
                onClick={() => onSelect(message.id)}
                className={`p-2 rounded-neo transition-all duration-200 hover:scale-110 ${
                  isSelected
                    ? "text-neoAccent2 dark:text-neoAccent3 bg-neoAccent2/10 dark:bg-neoAccent3/10"
                    : "text-neoDark/40 dark:text-white/40 hover:text-neoAccent2 dark:hover:text-neoAccent3 hover:bg-neoAccent2/5"
                }`}
              >
                {isSelected ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
              </button>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-3">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 user-icon-wrapper transition-all duration-300 ${
                  message.message_type === "anonymous"
                    ? "bg-gradient-to-r from-neoAccent2 to-pink-500"
                    : "bg-gradient-to-r from-neoAccent3 to-blue-500"
                } ${isHovered ? "scale-110 shadow-neo" : ""}`}
              >
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-neoDark dark:text-white text-sm sm:text-base message-sender flex items-center gap-2">
                    {message.message_type === "anonymous" ? (
                      <>
                        Anonymous 🕶️
                        <div className="w-2 h-2 bg-neoAccent2 rounded-full animate-pulse"></div>
                      </>
                    ) : (
                      <>
                        User-to-User 👤<div className="w-2 h-2 bg-neoAccent3 rounded-full animate-pulse"></div>
                      </>
                    )}
                  </span>
                  {!message.is_read && (
                    <div className="px-2 py-1 bg-neoAccent2 text-white text-xs font-bold rounded-full animate-bounce-gentle">
                      NEW
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 hide-in-image">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-neoDark/50 dark:text-white/50" />
                  <span className="text-xs sm:text-sm text-neoDark/70 dark:text-white/70 font-medium">
                    {formatDate(message.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-neoBg to-white dark:from-neoDark/50 dark:to-neoDark/30 rounded-neo p-4 sm:p-5 border-2 border-neoDark/10 dark:border-white/10 shadow-neo-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neoAccent2 via-neoAccent3 to-neoAccent"></div>
              <p className="text-neoDark dark:text-white whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-base message-content-text relative z-10">
                {message.content}
              </p>
              <div className="absolute bottom-2 right-2 opacity-5">
                <MessageSquare className="h-8 w-8 text-neoDark dark:text-white" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neoDark/50 dark:text-white/50 hide-in-image">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(message.created_at).toLocaleString()}</span>
                </div>
                {message.is_read && (
                  <div className="flex items-center gap-1 text-neoSuccess">
                    <CheckCheck className="h-4 w-4" />
                    <span>Read</span>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center gap-1 sm:gap-2 action-buttons hide-in-image transition-all duration-300 ${
                  isHovered ? "opacity-100 translate-x-0" : "opacity-70 translate-x-2"
                }`}
              >
                <button
                  onClick={() => setShowPreview(true)}
                  className="p-2 text-neoDark dark:text-white hover:text-neoInfo hover:bg-neoInfo/10 transition-all duration-200 rounded-neo hover:scale-110 focus-neo"
                  title="Preview message"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 text-neoDark dark:text-white hover:text-neoAccent2 hover:bg-neoAccent2/10 transition-all duration-200 rounded-neo hover:scale-110 focus-neo"
                  title="Download as image"
                >
                  <Download className="h-4 w-4" />
                </button>
                {!message.is_read && (
                  <button
                    onClick={handleMarkAsRead}
                    className="p-2 text-neoDark dark:text-white hover:text-neoSuccess hover:bg-neoSuccess/10 transition-all duration-200 rounded-neo hover:scale-110 focus-neo"
                    title="Mark as read"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-neoDark dark:text-white hover:text-neoError hover:bg-neoError/10 transition-all duration-200 rounded-neo hover:scale-110 focus-neo"
                  title="Delete message"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-neoDark rounded-neo shadow-neo-xl border-4 border-neoDark dark:border-white p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-neoAccent2 to-neoAccent3 rounded-full flex items-center justify-center">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neoDark dark:text-white">Message Preview</h3>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-neoDark/70 dark:text-white/70 hover:text-neoDark dark:hover:text-white p-2 rounded-neo hover:bg-neoDark/5 dark:hover:bg-white/5 transition-all duration-200 focus-neo"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-neoBg dark:bg-neoDark/50 rounded-neo border-2 border-neoDark/10 dark:border-white/10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.message_type === "anonymous"
                      ? "bg-gradient-to-r from-neoAccent2 to-pink-500"
                      : "bg-gradient-to-r from-neoAccent3 to-blue-500"
                  }`}
                >
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-bold text-neoDark dark:text-white">
                    {message.message_type === "anonymous" ? "Anonymous Message" : "User-to-User Message"}
                  </div>
                  <div className="text-sm text-neoDark/70 dark:text-white/70">
                    {new Date(message.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-neoBg to-white dark:from-neoDark/50 dark:to-neoDark/30 rounded-neo p-6 border-2 border-neoDark/10 dark:border-white/10 shadow-neo-sm">
                <p className="whitespace-pre-wrap break-words text-neoDark dark:text-white leading-relaxed text-base">
                  {message.content}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-neoDark/70 dark:text-white/70 pt-4 border-t-2 border-neoDark/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-neoAccent2" />
                  <span>Received with care</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      message.is_read ? "bg-neoSuccess/20 text-neoSuccess" : "bg-neoAccent2/20 text-neoAccent2"
                    }`}
                  >
                    {message.is_read ? "Read" : "Unread"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-neoDark rounded-neo shadow-neo-xl border-4 border-neoDark dark:border-white p-6 max-w-md w-full mx-4 animate-scale-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-neoError/20 rounded-full flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-neoError" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neoDark dark:text-white">Delete Message</h3>
                <p className="text-sm text-neoDark/70 dark:text-white/70">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-neoDark/70 dark:text-white/70 mb-6 p-3 bg-neoBg dark:bg-neoDark/50 rounded-neo border-2 border-neoDark/10 dark:border-white/10">
              Are you sure you want to delete this message? Once deleted, it will be permanently removed from your
              account.
            </p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="form-button-secondary">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-neoError text-white rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-bold hover:bg-red-600 transition-all duration-200 neo-button"
              >
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
