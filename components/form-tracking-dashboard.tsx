"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
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
          name: app.firstName && app.lastName ? `${app.firstName} ${app.lastName}` : `Student ${app.studentId.slice(0, 8)}`,
          applicationId: app.id,
          programName: app.programName,
          hospitalName: app.hospitalName,
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
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="bg-white/10 border border-white/20">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="sessions" disabled={!selectedStudent}>
            Sessions
          </TabsTrigger>
          <TabsTrigger value="forms" disabled={!selectedStudent}>
            Forms
          </TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Tab 1: Students List */}
        <TabsContent value="students" className="space-y-4">
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
                      <span className="text-slate-400">{student.programName}</span>
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
        </TabsContent>

        {/* Tab 2: Sessions */}
        <TabsContent value="sessions" className="space-y-4">
          {selectedStudent && (
            <>
              {/* Student Info */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <h3 className="font-medium text-white mb-2">
                  {studentsData.find(s => s.studentId === selectedStudent)?.name}
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

              {/* Chart */}
              {chartData.length > 0 && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <h3 className="font-medium text-white mb-4">Session Progress</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "rgba(15, 23, 42, 0.95)", 
                          border: "1px solid rgba(255, 255, 255, 0.1)" 
                        }}
                        formatter={(value: any) => value.toFixed(1)}
                      />
                      <Legend />
                      <Bar dataKey="completed" fill="#10b981" name="Completed Forms" />
                      <Bar dataKey="total" fill="#6366f1" name="Total Forms" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

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
        </TabsContent>

        {/* Tab 3: Forms */}
        <TabsContent value="forms" className="space-y-4">
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
        </TabsContent>

        {/* Tab 4: Performance Overview */}
        <TabsContent value="performance" className="space-y-4">
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <h3 className="font-medium text-white mb-4">Top Performing Students</h3>
            {performanceChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" yAxisId="left" />
                  <YAxis stroke="rgba(255,255,255,0.5)" yAxisId="right" orientation="right" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(15, 23, 42, 0.95)", 
                      border: "1px solid rgba(255, 255, 255, 0.1)" 
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="rating" fill="#fbbf24" name="Avg Rating" />
                  <Bar yAxisId="right" dataKey="submissions" fill="#10b981" name="Forms Completed" />
                </BarChart>
              </ResponsiveContainer>
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
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
