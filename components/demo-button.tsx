"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Zap } from "lucide-react"
import Link from "next/link"

export function DemoButton() {
  const [isOpen, setIsOpen] = useState(false)

  const demoOptions = [
    {
      id: "student",
      label: "Student Demo",
      description: "Explore student portal",
      href: "/demo/student",
      icon: "👨‍🎓",
    },
    {
      id: "staff",
      label: "Staff Demo",
      description: "Explore staff dashboard",
      href: "/demo/hospital",
      icon: "🏥",
    },
    {
      id: "supervisor",
      label: "Supervisor Demo",
      description: "Track student progress",
      href: "/demo/supervisor",
      icon: "📊",
    },
  ]

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
              className="absolute top-full mt-3 left-0 w-72 bg-slate-900/98 backdrop-blur-xl border border-green-500/30 rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-green-500/20 bg-linear-to-r from-green-500/10 to-emerald-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-green-400" />
                  <h3 className="font-bold text-white">Try Electivio</h3>
                </div>
                <p className="text-xs text-slate-400">Explore as different user roles</p>
              </div>

              {/* Demo Options */}
              <div className="p-2 space-y-1">
                {demoOptions.map((option, idx) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={option.href}
                      onClick={() => setIsOpen(false)}
                      className="group/item flex items-start gap-3 p-3 rounded-lg hover:bg-green-500/20 transition-all duration-200"
                    >
                      <span className="text-2xl mt-0.5">{option.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm group-hover/item:text-green-300 transition-colors">
                          {option.label}
                        </p>
                        <p className="text-xs text-slate-400 group-hover/item:text-slate-300 transition-colors">
                          {option.description}
                        </p>
                      </div>
                      <Play className="w-4 h-4 text-green-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                  </motion.div>
                ))}
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
