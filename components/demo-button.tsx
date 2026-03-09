"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Zap, Copy, Check } from "lucide-react"
import { mockUsers, mockStudents, mockApplications, mockStaffAlerts, mockHospitals, mockPrograms, mockDocuments, mockPayments } from "@/lib/mockData"

export function DemoButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState("student")
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  // Initialize demo data in localStorage
  const initializeDemoData = () => {
    if (typeof window === 'undefined') return;
    
    // Force reinitialize all demo data
    window.localStorage.setItem("electivio_users", JSON.stringify(mockUsers));
    window.localStorage.setItem("electivio_students", JSON.stringify(mockStudents));
    window.localStorage.setItem("electivio_applications", JSON.stringify(mockApplications));
    window.localStorage.setItem("electivio_staff_alerts", JSON.stringify(mockStaffAlerts));
    window.localStorage.setItem("electivio_hospitals", JSON.stringify(mockHospitals));
    window.localStorage.setItem("electivio_programs", JSON.stringify(mockPrograms));
    window.localStorage.setItem("electivio_documents", JSON.stringify(mockDocuments));
    window.localStorage.setItem("electivio_payments", JSON.stringify(mockPayments));
  }

  // Launch demo and redirect to demo preview page
  const handleLaunchDemo = (email: string, password: string, role: string) => {
    // Initialize demo data first
    initializeDemoData();
    
    // Small delay to ensure data is written to localStorage
    setTimeout(() => {
      // Redirect to the demo preview page based on role
      const demoMap: Record<string, string> = {
        student: "/demo/student",
        staff: "/demo/hospital",
        supervisor: "/demo/supervisor",
        admin: "/demo/admin"
      };
      
      const targetRoute = demoMap[role] || "/login";
      
      // Close modal and redirect
      setIsOpen(false);
      
      // Redirect to demo preview page
      window.location.href = targetRoute;
    }, 100);
  }

  const demoCredentials = {
    student: {
      id: "student",
      label: "Student Demo",
      icon: "👨‍🎓",
      email: "student@example.com",
      password: "password",
      description: "Medical trainee exploring programs and tracking progress",
    },
    staff: {
      id: "staff",
      label: "Staff Demo",
      icon: "🏥",
      email: "hospital1@electivio.com",
      password: "password",
      description: "Hospital administrator managing applications and students",
    },
    supervisor: {
      id: "supervisor",
      label: "Supervisor Demo",
      icon: "📊",
      email: "supervisor@example.com",
      password: "password",
      description: "Supervisor tracking student progress and reviewing forms",
    },
    admin: {
      id: "admin",
      label: "Admin Demo",
      icon: "🔐",
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
        className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        <Play className="w-5 h-5" />
        <span>Try Demo</span>
        
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
              className="fixed left-1/2 top-1/2 z-50 flex w-[min(28rem,calc(100vw-1.5rem))] max-h-[min(92vh,44rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-green-500/30 bg-slate-900/98 shadow-2xl backdrop-blur-xl"
            >
              {/* Header */}
              <div className="border-b border-green-500/20 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-green-400" />
                  <h3 className="font-bold text-white">Try Electivio</h3>
                </div>
                <p className="text-xs text-slate-400">Explore as different user roles</p>
              </div>

              {/* Tabs */}
              <div className="grid grid-cols-2 gap-2 border-b border-green-500/20 bg-slate-800/30 p-3 sm:grid-cols-4 sm:gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-medium transition-all sm:px-3 sm:text-sm ${
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
                className="flex-1 overflow-y-auto p-4"
              >
                {/* Description */}
                <div className="mb-3">
                  <p className="text-sm font-semibold text-white mb-1">{current.label}</p>
                  <p className="text-xs text-slate-400">{current.description}</p>
                </div>

                {/* Credentials Box */}
                <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4 space-y-3">
                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Email</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded text-sm text-green-300 font-mono break-all">
                        {current.email}
                      </code>
                      <button
                        onClick={() => handleCopyEmail(current.email)}
                        className="rounded p-2 text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-green-300"
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
              </motion.div>

              {/* Always-visible action area */}
              <div className="border-t border-green-500/20 bg-slate-900/95 px-4 py-3">
                <button
                  onClick={() => handleLaunchDemo(current.email, current.password, selectedTab)}
                  className="group/btn flex w-full items-center justify-center gap-2 rounded-lg border border-green-500/50 bg-green-500/20 px-4 py-3 font-semibold text-green-300 transition-all duration-200 hover:bg-green-500/30"
                >
                  <Play className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                  Start {current.label}
                </button>
              </div>

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
