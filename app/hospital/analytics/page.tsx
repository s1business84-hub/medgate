"use client"

import { useState, useEffect, startTransition } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, TrendingUp, Users, Target, BarChart3, Download } from "lucide-react"
import { LiquidParallax } from "@/components/ui/liquid-parallax"
import Reveal from "@/components/Reveal"

interface StudentProgress {
  studentId: string
  studentName: string
  category: string
  avgProgress: number
  entries: number
  lastUpdate: string
}

export default function HospitalAnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [studentData, setStudentData] = useState<StudentProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    if (!user || (user.role !== "staff" && user.role !== "supervisor")) {
      router.push("/login")
      return
    }

    // Load all student progress data
    const mockStudents = ["STU001", "STU002", "STU003", "STU004"]
    const allData: StudentProgress[] = []

    mockStudents.forEach((studentId) => {
      const saved = localStorage.getItem(`progress_${studentId}`)
      if (saved) {
        const entries = JSON.parse(saved)
        const categories = ["skills", "knowledge", "communication", "professionalism"]

        categories.forEach((cat) => {
          const catEntries = entries.filter((e: any) => e.category === cat)
          if (catEntries.length > 0) {
            const avg = Math.round(catEntries.reduce((sum: number, e: any) => sum + e.value, 0) / catEntries.length)
            allData.push({
              studentId,
              studentName: `Student ${studentId}`,
              category: cat,
              avgProgress: avg,
              entries: catEntries.length,
              lastUpdate: catEntries[catEntries.length - 1].date,
            })
          }
        })
      }
    })

    startTransition(() => {
      setStudentData(allData)
      setLoading(false)
    })
  }, [user, router])

  const categories = [
    { id: "skills", label: "Clinical Skills", emoji: "🏥" },
    { id: "knowledge", label: "Medical Knowledge", emoji: "📚" },
    { id: "communication", label: "Communication", emoji: "💬" },
    { id: "professionalism", label: "Professionalism", emoji: "⭐" },
  ]

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      skills: "from-blue-500 to-cyan-500",
      knowledge: "from-purple-500 to-pink-500",
      communication: "from-green-500 to-emerald-500",
      professionalism: "from-yellow-500 to-orange-500",
    }
    return colors[category] || "from-slate-500 to-slate-600"
  }

  const uniqueStudents = [...new Set(studentData.map((d) => d.studentName))]
  const filteredData =
    filter === "all" ? studentData : studentData.filter((d) => d.category === filter)

  const overallStats = {
    totalStudents: uniqueStudents.length,
    avgProgress: Math.round(studentData.reduce((sum, d) => sum + d.avgProgress, 0) / (studentData.length || 1)),
    totalEntries: studentData.reduce((sum, d) => sum + d.entries, 0),
  }

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-purple-900/20 to-slate-950 flex items-center justify-center">
        <LiquidParallax depth={14} className="opacity-70" />
        <p className="text-slate-300 relative z-10">Loading analytics dashboard...</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-purple-900/20 to-slate-950">
      <LiquidParallax depth={14} className="opacity-70" />

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <Reveal>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                href={user?.role === "staff" ? "/hospital" : "/supervisor"}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <ArrowLeft className="w-6 h-6 text-slate-300" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-8 h-8 text-cyan-400" />
                  Student Progress Analytics
                </h1>
                <p className="text-slate-300">Track clinical development across your programs</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Students", value: overallStats.totalStudents, icon: Users },
            { label: "Avg Progress", value: `${overallStats.avgProgress}%`, icon: TrendingUp },
            { label: "Total Entries", value: overallStats.totalEntries, icon: Target },
          ].map((stat, idx) => (
            <Reveal key={stat.label} delay={0.1 * idx} y={20}>
              <motion.div
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <stat.icon className="w-12 h-12 text-cyan-400/30" />
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Category Filter */}
        <Reveal delay={0.2} y={20}>
          <div className="mb-6 flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Categories" },
              ...categories,
            ].map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  filter === cat.id
                    ? "bg-linear-to-r from-cyan-500 to-indigo-600 text-white shadow-lg"
                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </Reveal>

        {/* Student Progress Grid */}
        {filteredData.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredData.map((data, idx) => {
              const cat = categories.find((c) => c.id === data.category)
              return (
                <Reveal key={`${data.studentId}-${data.category}`} delay={0.05 * idx} y={20}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className={`p-6 rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 backdrop-blur-xl hover:border-white/20 transition-all`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{cat?.emoji}</span>
                        <div>
                          <p className="font-semibold text-white">{data.studentName}</p>
                          <p className="text-xs text-slate-400">{cat?.label}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-cyan-400">{data.avgProgress}%</p>
                        <p className="text-xs text-slate-400">{data.entries} logs</p>
                      </div>
                    </div>

                    <div className="w-full bg-white/10 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.avgProgress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`bg-linear-to-r ${getCategoryColor(data.category)} h-3 rounded-full`}
                      />
                    </div>

                    <p className="text-xs text-slate-400 mt-3">
                      Last update: {new Date(data.lastUpdate).toLocaleDateString()}
                    </p>
                  </motion.div>
                </Reveal>
              )
            })}
          </div>
        ) : (
          <Reveal delay={0.2}>
            <div className="text-center py-16 px-6">
              <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-200 mb-2">No Progress Data Yet</h2>
              <p className="text-slate-400">
                Students can start logging their progress from their dashboard.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  )
}
