"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Bell, Mail, MessageCircle, Phone } from "lucide-react"
import { createReminder } from "@/lib/storage"

interface ReminderModalProps {
  isOpen: boolean
  programName: string
  programId: string
  onClose: () => void
  onSuccess?: () => void
}

export function ReminderModal({
  isOpen,
  programName,
  programId,
  onClose,
  onSuccess,
}: ReminderModalProps) {
  const [email, setEmail] = useState("")
  const [channels, setChannels] = useState<("email" | "sms" | "whatsapp")[]>(["email"])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const toggleChannel = (channel: "email" | "sms" | "whatsapp") => {
    setChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (channels.length === 0) {
      setError("Please select at least one notification method")
      return
    }

    setIsSubmitting(true)

    // Create reminder
    try {
      createReminder({
        programId,
        email,
        notificationChannels: channels,
      })

      setSuccess(true)
      setTimeout(() => {
        onSuccess?.()
        onClose()
        setEmail("")
        setChannels(["email"])
        setSuccess(false)
      }, 2000)
    } catch {
      setError("Failed to create reminder. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl bg-linear-to-br from-white/60 via-white/40 to-white/20 border border-white/40">
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-400/10 via-transparent to-indigo-400/10" />

              {/* Header */}
              <div className="relative border-b border-white/20 px-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-blue-500 to-indigo-500 rounded-lg">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Set Reminder</h2>
                      <p className="text-sm text-gray-600 mt-1">{programName}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              {success ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative px-6 py-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Reminder Set!</h3>
                  <p className="text-gray-600 text-sm">
                    We&apos;ll notify you via {channels.join(" & ")} when this program becomes available.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="relative px-6 py-6 space-y-6">
                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/30 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  {/* Notification Channels */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      How should we notify you?
                    </label>
                    <div className="space-y-2">
                      {[
                        {
                          id: "email",
                          label: "Email",
                          icon: Mail,
                          description: "Instant email notification",
                        },
                        {
                          id: "sms",
                          label: "SMS",
                          icon: Phone,
                          description: "Text message alert",
                        },
                        {
                          id: "whatsapp",
                          label: "WhatsApp",
                          icon: MessageCircle,
                          description: "WhatsApp message",
                        },
                      ].map(({ id, label, icon: Icon, description }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggleChannel(id as "email" | "sms" | "whatsapp")}
                          className={`w-full p-3 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                            channels.includes(id as "email" | "sms" | "whatsapp")
                              ? "border-blue-500 bg-blue-50/50"
                              : "border-white/30 bg-white/30 hover:border-blue-300 hover:bg-blue-50/20"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              channels.includes(id as "email" | "sms" | "whatsapp")
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {channels.includes(id as "email" | "sms" | "whatsapp") && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{label}</div>
                            <div className="text-xs text-gray-600">{description}</div>
                          </div>
                          <Icon className="w-5 h-5 text-gray-600" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-100 border border-red-300 rounded-lg"
                    >
                      <p className="text-sm text-red-800">{error}</p>
                    </motion.div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2 rounded-lg bg-white/40 text-gray-900 font-medium hover:bg-white/60 transition-colors border border-white/30"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Setting..." : "Set Reminder"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
