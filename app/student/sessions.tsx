"use client"

import { useState, useEffect } from "react"
import { Clock, Play, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Session {
  id: string
  applicationId: string
  sessionNumber: number
  status: "not_started" | "in_progress" | "completed"
  startedAt?: string
  completedAt?: string
  formTemplateId?: string
  formResponseId?: string
  createdAt: string
  updatedAt: string
}

interface StudentSessionsProps {
  applicationId: string
  onSessionStart?: (sessionId: string, sessionNumber: number) => void
  onSessionComplete?: (sessionId: string, sessionNumber: number) => void
  onFillForm?: (sessionId: string, sessionNumber: number) => void
}

export function StudentSessions({
  applicationId,
  onSessionStart,
  onSessionComplete,
  onFillForm,
}: StudentSessionsProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const { getSessions } = await import("@/lib/storage")
        const loadedSessions = getSessions(applicationId)
        setSessions(loadedSessions)
      } catch (error) {
        console.error("Error loading sessions:", error)
      } finally {
        setLoading(false)
      }
    }

    if (applicationId) {
      loadSessions()
    }
  }, [applicationId])

  const handleStartSession = async (session: Session) => {
    try {
      const { startSession } = await import("@/lib/storage")
      const updated = startSession(session.id)
      if (updated) {
        setSessions(sessions.map(s => (s.id === session.id ? updated : s)))
        onSessionStart?.(session.id, session.sessionNumber)

        // Create notification for hospital
        try {
          const { createNotification } = await import("@/lib/storage")
          createNotification({
            userId: "hospital", // Will be hospital supervisor in real app
            type: "update",
            title: `Student Started Session ${session.sessionNumber}`,
            message: `A student has started session ${session.sessionNumber} for their observership.`,
            relatedApplicationId: applicationId,
          })
        } catch (err) {}
      }
    } catch (error) {
      console.error("Error starting session:", error)
    }
  }

  const handleCompleteSession = async (session: Session) => {
    try {
      const { completeSession } = await import("@/lib/storage")
      const updated = completeSession(session.id)
      if (updated) {
        setSessions(sessions.map(s => (s.id === session.id ? updated : s)))
        onSessionComplete?.(session.id, session.sessionNumber)

        // Trigger form prompt
        setTimeout(() => {
          onFillForm?.(session.id, session.sessionNumber)
        }, 500)

        // Create notification for hospital
        try {
          const { createNotification } = await import("@/lib/storage")
          createNotification({
            userId: "hospital",
            type: "update",
            title: `Student Completed Session ${session.sessionNumber}`,
            message: `A student has completed session ${session.sessionNumber}. Form submission awaited.`,
            relatedApplicationId: applicationId,
          })
        } catch (err) {}
      }
    } catch (error) {
      console.error("Error completing session:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No sessions found for this observership</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Observership Sessions ({sessions.length})
      </h3>

      {sessions.map(session => {
        const isNotStarted = session.status === "not_started"
        const isInProgress = session.status === "in_progress"
        const isCompleted = session.status === "completed"

        const statusIcon =
          isCompleted ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : isInProgress ? (
            <Clock className="w-6 h-6 text-blue-600 animate-spin" />
          ) : (
            <AlertCircle className="w-6 h-6 text-gray-400" />
          )

        const statusLabel =
          isCompleted ? "Completed" : isInProgress ? "In Progress" : "Not Started"

        const statusColor = isCompleted ? "bg-green-50 border-green-200" : isInProgress ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"

        return (
          <div key={session.id} className={`border rounded-lg p-4 ${statusColor}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {statusIcon}
                <div>
                  <p className="font-semibold text-gray-900">
                    Session {session.sessionNumber}
                  </p>
                  <p className="text-sm text-gray-600">{statusLabel}</p>
                  {session.startedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Started: {new Date(session.startedAt).toLocaleString()}
                    </p>
                  )}
                  {session.completedAt && (
                    <p className="text-xs text-gray-500">
                      Completed: {new Date(session.completedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {isNotStarted && (
                  <Button
                    onClick={() => handleStartSession(session)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                )}

                {isInProgress && (
                  <Button
                    onClick={() => handleCompleteSession(session)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete
                  </Button>
                )}

                {isCompleted && session.formResponseId && (
                  <Button
                    onClick={() => onFillForm?.(session.id, session.sessionNumber)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    size="sm"
                  >
                    View Form
                  </Button>
                )}

                {isCompleted && !session.formResponseId && (
                  <Button
                    onClick={() => onFillForm?.(session.id, session.sessionNumber)}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    size="sm"
                  >
                    Fill Form
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      })}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>How it works:</strong> Start each session to begin your observership. When you complete a session, you'll be asked to fill out an assessment form. Your supervisor will review your responses.
        </p>
      </div>
    </div>
  )
}
