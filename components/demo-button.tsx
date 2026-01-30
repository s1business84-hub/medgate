"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Zap, Copy, Check } from "lucide-react"
import Link from "next/link"

export function DemoButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState("student")
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  const demoCredentials = {
    student: {
      id: "student",
      label: "Student Demo",
      icon: "👨‍🎓",
      href: "/demo/student",
      email: "student@example.com",
      password: "password",
      description: "Medical trainee exploring programs and tracking progress",
    },
    staff: {
      id: "staff",
      label: "Staff Demo",
      icon: "🏥",
      href: "/demo/hospital",
      email: "hospital1@electivio.com",
      password: "password",
      description: "Hospital administrator managing applications and students",
    },
    supervisor: {
      id: "supervisor",
      label: "Supervisor Demo",
      icon: "📊",
      href: "/demo/supervisor",
      email: "supervisor@example.com",
      password: "password",
      description: "Supervisor tracking student progress and reviewing forms",
    },
    admin: {
      id: "admin",
      label: "Admin Demo",
      icon: "🔐",
      href: "/demo/admin",
      email: "admin@example.com",
      password: "password",
      description: "Platform founders viewing analytics and system-wide metrics",
    },
  }

  const tabs = [
    { id: "student", label: "Student", icon: "👨‍🎓" },
    { id: "staff", label: "Staff", icon: "🏥" },
    { id: "supervisor", label: "Supervisor", icon: "📊" },
    { id: "admin", label: "Admin", icon: "🔐" },
  ]

  const current = demoCredentials[selectedTab as keyof typeof demoCredentials]

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopiedEmail(email)
    setTimeout(() => setCopiedEmail(null), 2000)
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        <Play className="w-5 h-5" />
        <span>Try Demo</span>
        
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-linear-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Demo Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-[min(24rem,calc(100vw-2rem))] max-h-[85vh] overflow-y-auto bg-slate-900/98 backdrop-blur-xl border border-green-500/30 rounded-2xl shadow-2xl z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-green-500/20 bg-linear-to-r from-green-500/10 to-emerald-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-green-400" />
                  <h3 className="font-bold text-white">Try Electivio</h3>
                </div>
                <p className="text-xs text-slate-400">Explore as different user roles</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-3 border-b border-green-500/20 bg-slate-800/30">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTab === tab.id
                        ? "bg-green-500/30 text-green-300 border border-green-500/50"
                        : "bg-slate-700/30 text-slate-300 hover:bg-slate-700/50 border border-transparent"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Credentials Display */}
              <motion.div
                key={selectedTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="p-4 space-y-4"
              >
                {/* Description */}
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{current.label}</p>
                  <p className="text-xs text-slate-400">{current.description}</p>
                </div>

                {/* Credentials Box */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 space-y-3">
                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Email</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded text-sm text-green-300 font-mono break-all">
                        {current.email}
                      </code>
                      <button
                        onClick={() => handleCopyEmail(current.email)}
                        className="p-2 rounded hover:bg-slate-700/50 transition-colors text-slate-300 hover:text-green-300"
                        title="Copy email"
                      >
                        {copiedEmail === current.email ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Password</label>
                    <code className="flex px-3 py-2 mt-1 bg-slate-900/50 border border-slate-600/50 rounded text-sm text-green-300 font-mono">
                      {current.password}
                    </code>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={current.href}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-300 font-semibold transition-all duration-200 group/btn"
                >
                  <Play className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  Launch {current.label}
                </Link>
              </motion.div>

              {/* Footer */}
              <div className="p-3 border-t border-green-500/20 bg-slate-950/50">
                <p className="text-xs text-slate-500 text-center">
                  Demo data is reset daily. Create an account for persistent data.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
