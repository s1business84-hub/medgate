"use client"

import { useState, useEffect, startTransition } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, TrendingUp, Target, Zap } from "lucide-react"
import { LiquidParallax } from "@/components/ui/liquid-parallax"
import Reveal from "@/components/Reveal"
import { AIAnalyticsPanel } from "@/components/ai-analytics-panel"
import { ImportGuidelines } from "@/components/import-guidelines"

interface ProgressEntry {
  id: string
  date: string
  category: string
  value: number
  notes: string
  hospitalName?: string
}

export default function StudentProgressPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [entries, setEntries] = useState<ProgressEntry[]>([])
  const [loading, setLoading] = useState(true)

  // Load progress entries from localStorage
  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login")
      return
    }

    const saved = localStorage.getItem(`progress_${user.id}`)
    startTransition(() => {
      if (saved) {
        setEntries(JSON.parse(saved))
      }
      setLoading(false)
    })
  }, [user, router])

  const categories = [
    { id: "skills", label: "Clinical Skills", emoji: "🏥", color: "from-slate-900/80 to-slate-800/60" },
    { id: "knowledge", label: "Medical Knowledge", emoji: "📚", color: "from-slate-900/80 to-slate-800/60" },
    { id: "communication", label: "Communication", emoji: "💬", color: "from-slate-900/80 to-slate-800/60" },
    { id: "professionalism", label: "Professionalism", emoji: "⭐", color: "from-slate-900/80 to-slate-800/60" },
  ]

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center">
        <LiquidParallax depth={14} className="opacity-70" />
        <p className="text-slate-300 relative z-10">Loading progress tracking...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center">
        <LiquidParallax depth={14} className="opacity-70" />
        <p className="text-slate-300 relative z-10">Please log in to track your progress</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-900 via-slate-950 to-black">
      <LiquidParallax depth={14} className="opacity-70" />
      
      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <Reveal>
          <div className="flex items-center justify-start mb-8">
            <div className="flex items-center gap-4">
              <Link href="/student" className="p-2 rounded-lg hover:bg-white/10 transition">
                <ArrowLeft className="w-6 h-6 text-slate-300" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                  Progress Tracker
                </h1>
                <p className="text-slate-300">Your clinical development overview</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Progress Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map((cat, idx) => {
            const catEntries = entries.filter((e) => e.category === cat.id)
            const avgValue =
              catEntries.length > 0
                ? Math.round(catEntries.reduce((sum, e) => sum + e.value, 0) / catEntries.length)
                : 0

            return (
              <Reveal key={cat.id} delay={0.1 * idx} y={20}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className={`p-6 rounded-2xl border border-white/10 bg-linear-to-br ${cat.color} backdrop-blur-xl hover:border-white/20 transition-all`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{cat.emoji}</div>
                    <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-slate-300">
                      {catEntries.length} logs
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{cat.label}</h3>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-blue-400">{avgValue}%</span>
                      <span className="text-sm text-slate-400">average</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-linear-to-r from-blue-400 to-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${avgValue}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            )
          })}
        </div>

        {/* AI Analytics & Goal Setting */}
        <Reveal delay={0.4} y={20}>
          <AIAnalyticsPanel 
            entries={entries}
            studentId={user?.id}
            onGoalsUpdate={(goals) => {
              // Goals are auto-saved in localStorage
            }}
          />
        </Reveal>

        {/* Recent Entries */}
        {entries.length > 0 && (
          <Reveal delay={0.3} y={20}>
            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                Recent Progress Entries
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {[...entries].reverse().slice(0, 10).map((entry) => {
                  const cat = categories.find((c) => c.id === entry.category)
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{cat?.emoji}</span>
                            <div>
                              <p className="font-semibold text-white">{cat?.label}</p>
                              <p className="text-xs text-slate-400">
                                {new Date(entry.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {entry.notes && <p className="mt-2 text-sm text-slate-300">{entry.notes}</p>}
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-blue-400">{entry.value}%</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </Reveal>
        )}

        {/* Import Guidelines */}
        <ImportGuidelines />
      </div>
    </div>
  )
}
