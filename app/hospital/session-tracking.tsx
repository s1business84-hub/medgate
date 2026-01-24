"use client"

import { useState, useEffect } from "react"
import { BarChart3, Users, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface SessionWithDetails {
  sessionId: string
  applicationId: string
  studentId: string
  studentName: string
  sessionNumber: number
  status: "not_started" | "in_progress" | "completed"
  startedAt?: string
  completedAt?: string
  formResponseId?: string
}

interface SessionStats {
  totalSessions: number
  notStarted: number
  inProgress: number
  completed: number
}

export function HospitalSessionTracking({ hospitalId }: { hospitalId?: string }) {
  const [sessions, setSessions] = useState<SessionWithDetails[]>([])
  const [stats, setStats] = useState<SessionStats>({
    totalSessions: 0,
    notStarted: 0,
    inProgress: 0,
    completed: 0,
  })
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<SessionWithDetails | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | "not_started" | "in_progress" | "completed">("all")

  useEffect(() => {
    const loadSessionsData = async () => {
      try {
        const { getApplications, getSessions, getFormResponse } = await import("@/lib/storage")
        const { getStudents } = await import("@/lib/storage")

        const applications = getApplications()
        const students = getStudents()

        // Filter applications by hospital if needed
        const hospitalApps = hospitalId
          ? applications.filter(app => app.hospitalId === hospitalId)
          : applications

        const allSessions: SessionWithDetails[] = []
        let statsData = { totalSessions: 0, notStarted: 0, inProgress: 0, completed: 0 }

        for (const app of hospitalApps) {
          const sessionsList = getSessions(app.id)
          const student = students.find(s => s.id === app.studentId)

          for (const session of sessionsList) {
            const formResponse = session.formResponseId
              ? getFormResponse(session.formResponseId)
              : null

            allSessions.push({
              sessionId: session.id,
              applicationId: app.id,
              studentId: app.studentId,
              studentName: student?.name || "Unknown Student",
              sessionNumber: session.sessionNumber,
              status: session.status,
              startedAt: session.startedAt,
              completedAt: session.completedAt,
              formResponseId: session.formResponseId,
            })

            // Update stats
            statsData.totalSessions++
            if (session.status === "not_started") statsData.notStarted++
            else if (session.status === "in_progress") statsData.inProgress++
            else if (session.status === "completed") statsData.completed++
          }
        }

        setSessions(allSessions)
        setStats(statsData)
      } catch (error) {
        console.error("Error loading sessions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSessionsData()
  }, [hospitalId])

  const filteredSessions =
    filterStatus === "all" ? sessions : sessions.filter(s => s.status === filterStatus)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "not_started":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "in_progress":
        return <Clock className="w-4 h-4 animate-spin" />
      case "not_started":
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Session Tracking Dashboard</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Not Started</p>
              <p className="text-2xl font-bold text-gray-900">{stats.notStarted}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterStatus("not_started")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === "not_started"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Not Started
        </button>
        <button
          onClick={() => setFilterStatus("in_progress")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === "in_progress"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilterStatus("completed")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === "completed"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No sessions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Session
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Started
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Form
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session, idx) => (
                  <tr
                    key={session.sessionId}
                    className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{session.studentName}</p>
                      <p className="text-xs text-gray-500">{session.studentId}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Session {session.sessionNumber}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}
                        {session.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {session.startedAt
                        ? new Date(session.startedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {session.completedAt
                        ? new Date(session.completedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {session.formResponseId ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Submitted
                        </span>
                      ) : session.status === "completed" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Pending
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Session Details - {selectedSession.studentName}
              </h3>
              <button
                onClick={() => setSelectedSession(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="font-mono text-sm text-gray-900">{selectedSession.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Session Number</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedSession.sessionNumber}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSession.status)}`}>
                    {getStatusIcon(selectedSession.status)}
                    {selectedSession.status.replace("_", " ")}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Form Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedSession.formResponseId ? "bg-green-100 text-green-800" : selectedSession.status === "completed" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800"}`}>
                    {selectedSession.formResponseId
                      ? "Submitted"
                      : selectedSession.status === "completed"
                      ? "Pending"
                      : "Not Applicable"}
                  </span>
                </div>
              </div>

              {selectedSession.startedAt && (
                <div>
                  <p className="text-sm text-gray-600">Session Started</p>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedSession.startedAt).toLocaleString()}
                  </p>
                </div>
              )}

              {selectedSession.completedAt && (
                <div>
                  <p className="text-sm text-gray-600">Session Completed</p>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedSession.completedAt).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedSession(null)}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
