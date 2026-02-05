"use client"

import { useState, useEffect, startTransition } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, TrendingUp, Target, Zap, Brain } from "lucide-react"
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
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    category: "skills",
    value: 0,
    notes: "",
  })

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

  const handleAddEntry = () => {
    if (!user || formData.value < 0 || formData.value > 100) return

    const newEntry: ProgressEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      category: formData.category,
      value: formData.value,
      notes: formData.notes,
      hospitalName: (user as any).hospitalName || "My Program",
    }

    const updated = [...entries, newEntry]
    setEntries(updated)
    localStorage.setItem(`progress_${user.id}`, JSON.stringify(updated))
    setFormData({ category: "skills", value: 0, notes: "" })
    setShowForm(false)
  }

  const categories = [
    { id: "skills", label: "Clinical Skills", emoji: "🏥", color: "from-slate-800/40 to-slate-800/40" },
    { id: "knowledge", label: "Medical Knowledge", emoji: "📚", color: "from-slate-800/40 to-slate-800/40" },
    { id: "communication", label: "Communication", emoji: "💬", color: "from-slate-800/40 to-slate-800/40" },
    { id: "professionalism", label: "Professionalism", emoji: "⭐", color: "from-slate-800/40 to-slate-800/40" },
  ]

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-purple-900/20 to-slate-950 flex items-center justify-center">
        <LiquidParallax depth={14} className="opacity-70" />
        <p className="text-slate-300 relative z-10">Loading progress tracking...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-purple-900/20 to-slate-950 flex items-center justify-center">
        <LiquidParallax depth={14} className="opacity-70" />
        <p className="text-slate-300 relative z-10">Please log in to track your progress</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-purple-900/20 to-slate-950">
      <LiquidParallax depth={14} className="opacity-70" />
      
      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <Reveal>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/student" className="p-2 rounded-lg hover:bg-white/10 transition">
                <ArrowLeft className="w-6 h-6 text-slate-300" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-8 h-8 text-cyan-400" />
                  Progress Tracker
                </h1>
                <p className="text-slate-300">Monitor your clinical development</p>
              </div>
            </div>
            <motion.button
              onClick={() => setShowForm(!showForm)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-xl shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Log Progress
            </motion.button>
          </div>
        </Reveal>

        {/* Add Entry Form */}
        {showForm && (
          <Reveal delay={0.1} y={20}>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Log New Progress Entry</h2>
              <div className="grid gap-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat.id}
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        whileHover={{ scale: 1.05 }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.category === cat.id
                            ? "border-cyan-400 bg-cyan-500/20"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="text-2xl mb-1">{cat.emoji}</div>
                        <div className="text-xs font-medium text-slate-200">{cat.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Progress Value Slider */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Progress: {formData.value}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) })}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g., Improved suturing technique, assisted with 3 procedures..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    rows={3}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleAddEntry}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-2 bg-linear-to-r from-cyan-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    Save Entry
                  </motion.button>
                  <motion.button
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-2 bg-white/10 text-slate-200 font-semibold rounded-lg hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </Reveal>
        )}

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
                      <span className="text-3xl font-bold text-cyan-400">{avgValue}%</span>
                      <span className="text-sm text-slate-400">average</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-linear-to-r from-cyan-400 to-indigo-500 h-2 rounded-full transition-all duration-500"
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
                          <span className="text-2xl font-bold text-cyan-400">{entry.value}%</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </Reveal>
        )}

        {/* Empty State */}
        {entries.length === 0 && !showForm && (
          <Reveal delay={0.2}>
            <div className="text-center py-16 px-6">
              <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-200 mb-2">No Progress Entries Yet</h2>
              <p className="text-slate-400 mb-6">
                Start logging your clinical progress to see analytics and insights.
              </p>
              <motion.button
                onClick={() => setShowForm(true)}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-xl shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Log Your First Entry
              </motion.button>
            </div>
          </Reveal>
        )}

        {/* Import Guidelines */}
        <ImportGuidelines />
      </div>
    </div>
  )
}
