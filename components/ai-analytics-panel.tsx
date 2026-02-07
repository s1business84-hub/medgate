"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Target, Plus, Trash2, Brain, Sparkles } from "lucide-react"

interface Goal {
  id: string
  type: "academic" | "personal" // academic = supervisor set, personal = student set
  category: string
  targetValue: number
  deadline: string
  setBy?: string // "supervisor" or "student"
  aiSuggestion?: string
}

interface AIAnalyticsProps {
  entries: any[]
  onGoalsUpdate: (goals: Goal[]) => void
}

export function AIAnalyticsPanel({ entries, onGoalsUpdate }: AIAnalyticsProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [aiInsights, setAiInsights] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [goalType, setGoalType] = useState<"academic" | "personal">("personal")
  const [formData, setFormData] = useState({
    category: "skills",
    targetValue: 80,
    deadline: "",
  })

  // Load goals from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("student_goals")
    if (saved) {
      setGoals(JSON.parse(saved))
    }
  }, [])

  // Generate AI insights
  const generateAIInsights = async () => {
    setLoading(true)
    try {
      // Use free OpenAI API endpoint with a simple prompt
      // Note: In production, you'd want to use an API key securely
      const prompt = generateInsightPrompt()

      // For now, generate rule-based insights
      const insights = generateLocalInsights()
      setAiInsights(insights)
    } catch (error) {
      console.error("Error generating insights:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateInsightPrompt = () => {
    const categories = [...new Set(entries.map((e) => e.category))]
    const avgByCategory: Record<string, number> = {}

    categories.forEach((cat) => {
      const catEntries = entries.filter((e) => e.category === cat)
      avgByCategory[cat] = Math.round(
        catEntries.reduce((sum, e) => sum + e.value, 0) / catEntries.length
      )
    })

    return `Based on medical student progress data, analyze and provide 3 specific, actionable insights:
    Progress by category: ${JSON.stringify(avgByCategory)}
    Total entries logged: ${entries.length}
    
    Provide brief, motivating insights focused on improvement areas.`
  }

  const generateLocalInsights = (): string[] => {
    const insights: string[] = []
    const categories = [...new Set(entries.map((e) => e.category))]
    const avgByCategory: Record<string, number> = {}

    categories.forEach((cat) => {
      const catEntries = entries.filter((e) => e.category === cat)
      avgByCategory[cat] = Math.round(
        catEntries.reduce((sum, e) => sum + e.value, 0) / catEntries.length
      )
    })

    // Rule-based insights
    if (entries.length === 0) {
      insights.push("Start logging your progress to receive personalized insights!")
    } else {
      // Identify strongest area
      const strongest = Object.entries(avgByCategory).sort((a, b) => b[1] - a[1])[0]
      if (strongest) {
        insights.push(
          `📈 Your strongest area is ${strongest[0]} (${strongest[1]}%). Continue building on this excellence.`
        )
      }

      // Identify area for improvement
      const needsWork = Object.entries(avgByCategory).sort((a, b) => a[1] - b[1])[0]
      if (needsWork && needsWork[1] < 75) {
        insights.push(
          `🎯 Focus on ${needsWork[0]} - currently at ${needsWork[1]}%. Set a goal to reach 85% within 2 weeks.`
        )
      }

      // Consistency check
      const lastWeekEntries = entries.filter((e) => {
        const entryDate = new Date(e.date)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return entryDate > weekAgo
      })

      if (lastWeekEntries.length === 0) {
        insights.push(
          `💡 Keep up the momentum! You haven't logged anything this week. Plan time for reflection.`
        )
      } else {
        insights.push(
          `✨ Great consistency! You've logged ${lastWeekEntries.length} entries this week. Maintain this habit.`
        )
      }
    }

    return insights
  }

  const handleAddGoal = () => {
    if (!formData.deadline) return

    const newGoal: Goal = {
      id: Date.now().toString(),
      type: goalType,
      category: formData.category,
      targetValue: formData.targetValue,
      deadline: formData.deadline,
      setBy: "student", // In student portal, always set by student
    }

    const updated = [...goals, newGoal]
    setGoals(updated)
    localStorage.setItem("student_goals", JSON.stringify(updated))
    onGoalsUpdate(updated)
    setFormData({ category: "skills", targetValue: 80, deadline: "" })
    setShowForm(false)
  }

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id)
    setGoals(updated)
    localStorage.setItem("student_goals", JSON.stringify(updated))
    onGoalsUpdate(updated)
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="p-6 rounded-2xl border border-white/10 bg-linear-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            AI Insights
          </h2>
          <motion.button
            onClick={generateAIInsights}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "Analyzing..." : "Generate"}
          </motion.button>
        </div>

        {aiInsights.length > 0 ? (
          <div className="space-y-3">
            {aiInsights.map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 bg-white/5 border border-white/10 rounded-lg"
              >
                <p className="text-sm text-slate-200">{insight}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">Click "Generate" to receive personalized AI-powered insights.</p>
        )}
      </motion.div>

      {/* Goals Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="p-6 rounded-2xl border border-white/10 bg-linear-to-br from-cyan-500/10 to-indigo-500/10 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-cyan-400" />
            Goals & Targets
          </h2>
          <motion.button
            onClick={() => setShowForm(!showForm)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-cyan-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </motion.button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-4 p-4 bg-white/10 rounded-lg space-y-3"
          >
            <div>
              <label className="text-xs font-medium text-slate-300 mb-2 block">Goal Type</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setGoalType("personal")}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                    goalType === "personal"
                      ? "bg-cyan-500 text-white"
                      : "bg-white/10 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  Personal Goal
                </button>
                <button
                  onClick={() => setGoalType("academic")}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                    goalType === "academic"
                      ? "bg-purple-500 text-white"
                      : "bg-white/10 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  Academic Goal
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {goalType === "personal" 
                  ? "Set your own learning objectives and milestones"
                  : "Goals aligned with your clinical training requirements"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                >
                  <option>skills</option>
                  <option>knowledge</option>
                  <option>communication</option>
                  <option>professionalism</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">Target: {formData.targetValue}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: parseInt(e.target.value) })}
                  className="w-full mt-2 accent-cyan-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              />
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={handleAddGoal}
                whileHover={{ scale: 1.02 }}
                className="flex-1 px-3 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition"
              >
                Save
              </motion.button>
              <motion.button
                onClick={() => setShowForm(false)}
                className="flex-1 px-3 py-2 bg-white/10 text-slate-200 font-semibold rounded-lg hover:bg-white/20 transition"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}

        {goals.length > 0 ? (
          <div className="space-y-4">
            {/* Academic Goals Section */}
            {goals.filter(g => g.type === "academic").length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                  Academic Goals
                </h3>
                <div className="space-y-2">
                  {goals.filter(g => g.type === "academic").map((goal) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-white capitalize">{goal.category}</p>
                        <p className="text-sm text-slate-400">
                          Target: {goal.targetValue}% by {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-purple-300 mt-1">Set by {goal.setBy || "supervisor"}</p>
                      </div>
                      <motion.button
                        onClick={() => handleDeleteGoal(goal.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Goals Section */}
            {goals.filter(g => g.type === "personal").length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                  Personal Goals
                </h3>
                <div className="space-y-2">
                  {goals.filter(g => g.type === "personal").map((goal) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-white capitalize">{goal.category}</p>
                        <p className="text-sm text-slate-400">
                          Target: {goal.targetValue}% by {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-cyan-300 mt-1">Self-directed</p>
                      </div>
                      <motion.button
                        onClick={() => handleDeleteGoal(goal.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No goals set yet. Add academic or personal goals to track your progress!</p>
        )}
      </motion.div>
    </div>
  )
}
