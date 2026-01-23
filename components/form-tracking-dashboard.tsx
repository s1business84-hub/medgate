"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, TrendingUp, Award, AlertCircle } from "lucide-react"
import { SessionFormSubmission, StudentPerformanceMetrics, Application } from "@/lib/types"

interface TrackingDashboardProps {
  submissions: SessionFormSubmission[]
  metrics: StudentPerformanceMetrics[]
  applications: Application[]
}

export function FormTrackingDashboard({
  submissions,
  metrics,
  applications,
}: TrackingDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState("students")

  // Get unique students with their data
  const studentsData = useMemo(() => {
    const studentMap = new Map()
    
    applications.forEach(app => {
      if (!studentMap.has(app.studentId)) {
        studentMap.set(app.studentId, {
          studentId: app.studentId,
          name: `Student ${app.studentId.slice(0, 8)}`,
          applicationId: app.id,
          programName: app.programId,
          hospitalName: app.hospitalId || "—",
          totalSubmissions: 0,
          completedForms: 0,
          averageRating: 0,
          status: app.status,
        })
      }

      const studentInfo = studentMap.get(app.studentId)
      const studentSubmissions = submissions.filter(s => s.studentId === app.studentId)
      const studentMetrics = metrics.find(m => m.studentId === app.studentId)

      studentInfo.totalSubmissions = studentSubmissions.length
      studentInfo.completedForms = studentSubmissions.filter(s => s.status === "submitted").length
      if (studentMetrics) {
        studentInfo.averageRating = studentMetrics.averageRating
        studentInfo.trend = studentMetrics.performanceTrend
      }
    })

    return Array.from(studentMap.values()).filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [applications, submissions, metrics, searchQuery])

  // Get sessions data for selected student
  const sessionsData = useMemo(() => {
    if (!selectedStudent) return []

    const studentSubmissions = submissions.filter(s => s.studentId === selectedStudent)
    const sessionMap = new Map()

    studentSubmissions.forEach(sub => {
      const sessionNum = parseInt(sub.sessionId.split("_")[1] || "0") + 1
      if (!sessionMap.has(sub.sessionId)) {
        sessionMap.set(sub.sessionId, {
          sessionId: sub.sessionId,
          sessionNumber: sessionNum,
          formsCount: 0,
          completedForms: 0,
          averageScore: 0,
          status: "pending",
        })
      }

      const sessionInfo = sessionMap.get(sub.sessionId)
      sessionInfo.formsCount++
      if (sub.status === "reviewed") {
        sessionInfo.completedForms++
        if (sub.supervisorReview?.rating) {
          sessionInfo.averageScore = (sessionInfo.averageScore + sub.supervisorReview.rating) / 2
        }
      }
      if (sub.status === "submitted") {
        sessionInfo.status = "submitted"
      }
    })

    return Array.from(sessionMap.values()).sort((a, b) => a.sessionNumber - b.sessionNumber)
  }, [selectedStudent, submissions])

  // Get forms data for selected student
  const formsData = useMemo(() => {
    if (!selectedStudent) return []

    const studentSubmissions = submissions.filter(s => s.studentId === selectedStudent)
    const formMap = new Map()

    studentSubmissions.forEach(sub => {
      const formKey = `${sub.formId}_${sub.sessionId}`
      if (!formMap.has(formKey)) {
        formMap.set(formKey, {
          formId: sub.formId,
          sessionId: sub.sessionId,
          sessionNumber: parseInt(sub.sessionId.split("_")[1] || "0") + 1,
          status: sub.status,
          submittedAt: sub.submittedAt,
          rating: sub.supervisorReview?.rating || 0,
          reviewedAt: sub.supervisorReview?.reviewedAt,
          notes: sub.supervisorReview?.notes || "No notes",
        })
      }
    })

    return Array.from(formMap.values())
  }, [selectedStudent, submissions])

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!selectedStudent) return []

    return sessionsData.map(session => ({
      name: `Session ${session.sessionNumber}`,
      completed: session.completedForms,
      total: session.formsCount,
      score: Math.round(session.averageScore * 10) / 10,
    }))
  }, [selectedStudent, sessionsData])

  const performanceChartData = useMemo(() => {
    return studentsData
      .filter(s => s.averageRating > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 10)
      .map(student => ({
        name: student.name.split(" ")[0],
        rating: Math.round(student.averageRating * 10) / 10,
        submissions: student.completedForms,
      }))
  }, [studentsData])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Form Tracking Dashboard</h1>
        <p className="text-slate-300">Monitor student performance and form submissions across sessions</p>
      </div>

      {/* Tabs */}
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/20">
        <button
          onClick={() => setSelectedTab("students")}
          className={`px-4 py-2 font-medium transition-colors ${
            selectedTab === "students"
              ? "text-white border-b-2 border-purple-500"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Students
        </button>
        <button
          onClick={() => setSelectedTab("sessions")}
          disabled={!selectedStudent}
          className={`px-4 py-2 font-medium transition-colors ${
            selectedTab === "sessions"
              ? "text-white border-b-2 border-purple-500"
              : "text-slate-400 hover:text-white disabled:opacity-50"
          }`}
        >
          Sessions
        </button>
        <button
          onClick={() => setSelectedTab("forms")}
          disabled={!selectedStudent}
          className={`px-4 py-2 font-medium transition-colors ${
            selectedTab === "forms"
              ? "text-white border-b-2 border-purple-500"
              : "text-slate-400 hover:text-white disabled:opacity-50"
          }`}
        >
          Forms
        </button>
        <button
          onClick={() => setSelectedTab("performance")}
          className={`px-4 py-2 font-medium transition-colors ${
            selectedTab === "performance"
              ? "text-white border-b-2 border-purple-500"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Performance
        </button>
      </div>

      <div className="mt-6">
        {/* Tab 1: Students List */}
        {selectedTab === "students" && (
          <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or student ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {studentsData.map((student, idx) => (
                <motion.button
                  key={student.studentId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    setSelectedStudent(student.studentId)
                    setSelectedTab("sessions")
                  }}
                  className={`p-4 rounded-lg border transition-all text-left ${
                    selectedStudent === student.studentId
                      ? "bg-purple-500/20 border-purple-500/50"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-white">{student.name}</h3>
                      <p className="text-xs text-slate-400">ID: {student.studentId.slice(0, 8)}</p>
                    </div>
                    {student.averageRating >= 4 && (
                      <Award className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{student.programName || "—"}</span>
                      <span className="text-slate-300 font-medium">{student.completedForms}/{student.totalSubmissions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Rating</span>
                      <span className={`font-medium ${
                        student.averageRating >= 4 ? "text-green-400" : "text-slate-300"
                      }`}>
                        {student.averageRating > 0 ? `${student.averageRating.toFixed(1)}/5` : "—"}
                      </span>
                    </div>
                    {student.trend && (
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <TrendingUp className="w-3 h-3" />
                        {student.trend}
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {studentsData.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              No students found matching your search.
            </div>
          )}
        </div>
        )}

        {/* Tab 2: Sessions */}
        {selectedTab === "sessions" && (
          <div className="space-y-4">
          {selectedStudent && (
            <>
              {/* Student Info */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <h3 className="font-medium text-white mb-2">
                  {(() => {
                    const s = studentsData.find(s => s.studentId === selectedStudent)
                    return s ? s.name : ""
                  })()}
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Total Forms</span>
                    <p className="text-lg font-medium text-white">
                      {studentsData.find(s => s.studentId === selectedStudent)?.totalSubmissions || 0}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Completed</span>
                    <p className="text-lg font-medium text-green-400">
                      {studentsData.find(s => s.studentId === selectedStudent)?.completedForms || 0}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Avg Rating</span>
                    <p className="text-lg font-medium text-yellow-400">
                      {studentsData.find(s => s.studentId === selectedStudent)?.averageRating.toFixed(1) || "—"}/5
                    </p>
                  </div>
                </div>
              </div>


              {/* Sessions List */}
              <div className="space-y-2">
                <h3 className="font-medium text-white">Sessions Breakdown</h3>
                {sessionsData.map((session, idx) => (
                  <motion.div
                    key={session.sessionId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-white">Session {session.sessionNumber}</p>
                      <p className="text-sm text-slate-400">{session.completedForms}/{session.formsCount} forms completed</p>
                    </div>
                    <div className="text-right">
                      {session.status === "reviewed" ? (
                        <p className="text-sm font-medium text-green-400">✓ Reviewed</p>
                      ) : (
                        <p className="text-sm font-medium text-yellow-400">⏳ Pending</p>
                      )}
                      {session.averageScore > 0 && (
                        <p className="text-lg font-bold text-white">{session.averageScore.toFixed(1)}/5</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
        )}

        {/* Tab 3: Forms */}
        {selectedTab === "forms" && (
          <div className="space-y-4">
          {selectedStudent && formsData.length > 0 ? (
            <div className="space-y-3">
              {formsData.map((form, idx) => (
                <motion.div
                  key={`${form.formId}_${form.sessionId}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-white">Session {form.sessionNumber}</h4>
                      <p className="text-sm text-slate-400">Form {form.formId.slice(0, 8)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      form.status === "reviewed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {form.status === "reviewed" ? "✓ Reviewed" : "⏳ Pending"}
                    </span>
                  </div>

                  {form.status === "reviewed" && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Supervisor Rating:</span>
                        <span className="font-medium text-yellow-400">{form.rating}/5 ★</span>
                      </div>
                      {form.notes && (
                        <div>
                          <span className="text-slate-400">Feedback:</span>
                          <p className="text-slate-300 mt-1 italic">"{form.notes}"</p>
                        </div>
                      )}
                      {form.reviewedAt && (
                        <p className="text-xs text-slate-500">
                          Reviewed: {new Date(form.reviewedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              No forms found for this student.
            </div>
          )}
        </div>
        )}

        {/* Tab 4: Performance Overview */}
        {selectedTab === "performance" && (
          <div className="space-y-4">
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <h3 className="font-medium text-white mb-4">Top Performing Students</h3>
            {performanceChartData.length > 0 ? (
              <div className="space-y-2">
                {performanceChartData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-20 text-sm text-slate-400">{item.name}</span>
                    <div className="flex-1 h-6 bg-white/10 rounded flex items-center overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-yellow-500 to-orange-500 transition-all"
                        style={{ width: `${(item.rating / 5) * 100}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-sm text-yellow-400 font-medium">{item.rating}/5</span>
                    <span className="w-12 text-right text-sm text-green-400">{item.submissions}✓</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">No performance data available yet.</p>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Total Students</p>
              <p className="text-2xl font-bold text-white">{studentsData.length}</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Forms Submitted</p>
              <p className="text-2xl font-bold text-green-400">
                {submissions.filter(s => s.status === "submitted" || s.status === "reviewed").length}
              </p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-400">
                {(metrics.reduce((sum, m) => sum + m.averageRating, 0) / Math.max(metrics.length, 1)).toFixed(1)}/5
              </p>
            </div>
          </div>
        </div>
        )}
      </div>
    </motion.div>
  )
}
