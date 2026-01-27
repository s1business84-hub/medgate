"use client"

import { useState, useMemo, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Send,
  MessageSquare,
  User,
  Calendar,
  FileText,
} from "lucide-react"
import { StaffApplicationAlert, Application, Student } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { showToast } from "@/lib/toast"
import { processApplicationDecision } from "@/lib/application-decision-service"

interface ApplicationDecisionModalProps {
  alert: StaffApplicationAlert | null
  application: Application | null
  student: Student | null
  isOpen: boolean
  onClose: () => void
  staffId: string
  onDecisionMade?: () => void
  loading?: boolean
}

export function ApplicationDecisionModal({
  alert,
  application,
  student,
  isOpen,
  onClose,
  staffId,
  onDecisionMade,
  loading = false,
}: ApplicationDecisionModalProps) {
  const [isPending, startTransition] = useTransition()
  const [decision, setDecision] = useState<"approved" | "declined" | "waitlisted" | null>(null)
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")

  if (!isOpen || !alert || !application || !student) {
    return null
  }

  const handleSubmitDecision = async () => {
    if (!decision) {
      showToast("Please select a decision")
      return
    }

    startTransition(async () => {
      try {
        const result = await processApplicationDecision({
          applicationId: application.id,
          studentId: student.id,
          hospitalId: alert.hospitalId,
          decision,
          decisionMadeBy: staffId,
          reason: reason || undefined,
          notes: notes || undefined,
          staffAlertId: alert.id,
          studentEmail: student.email,
          programName: alert.programId,
          hospitalName: alert.hospitalId, // In real app, would fetch hospital name
        })

        if (result.success) {
          showToast(
            `Application ${decision}. Email and in-app notification sent to student.`
          )
          onDecisionMade?.()
          onClose()
          setDecision(null)
          setReason("")
          setNotes("")
        } else {
          showToast(result.error || "Failed to process decision")
        }
      } catch (error) {
        showToast("Error processing decision")
        console.error(error)
      }
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-slate-900 border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Review Application</h2>
                  <p className="text-slate-400 text-sm mt-1">Make a decision and notify the student</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Student info */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{student.name}</p>
                    <p className="text-sm text-slate-400">{student.email}</p>
                  </div>
                </div>
              </div>

              {/* Application details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                    <FileText className="w-4 h-4" />
                    Program
                  </div>
                  <p className="font-medium text-white">{alert.programId}</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    Application ID
                  </div>
                  <p className="font-medium text-white text-sm break-all">{application.id}</p>
                </div>
              </div>

              {/* Application status */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Current Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <p className="font-medium text-white">{application.status}</p>
                </div>
              </div>

              {/* Decision selection */}
              <div className="border-t border-white/10 pt-6">
                <p className="text-slate-300 font-semibold mb-4">Your Decision</p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {(
                    [
                      {
                        value: "approved" as const,
                        label: "Approve",
                        icon: CheckCircle2,
                        color: "emerald",
                      },
                      {
                        value: "waitlisted" as const,
                        label: "Waitlist",
                        icon: Clock,
                        color: "amber",
                      },
                      {
                        value: "declined" as const,
                        label: "Decline",
                        icon: XCircle,
                        color: "red",
                      },
                    ] as const
                  ).map(({ value, label, icon: Icon, color }) => (
                    <motion.button
                      key={value}
                      onClick={() => setDecision(value)}
                      className={`relative p-4 rounded-lg border-2 transition-all ${
                        decision === value
                          ? `border-${color}-400 bg-${color}-500/10`
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 mx-auto mb-2 ${
                          decision === value
                            ? `text-${color}-400`
                            : "text-slate-400"
                        }`}
                      />
                      <p className={`text-sm font-medium ${
                        decision === value
                          ? "text-white"
                          : "text-slate-400"
                      }`}>
                        {label}
                      </p>

                      {decision === value && (
                        <motion.div
                          layoutId="decision-indicator"
                          className="absolute inset-0 border-2 border-white/20 rounded-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Reason */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Reason (optional but recommended)
                  </label>
                  <textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder={`e.g., "Strong academic record and relevant experience" or "Limited spots available"`}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none resize-none"
                    rows={3}
                  />
                </div>

                {/* Internal notes */}
                <div className="mt-4">
                  <label className="text-sm text-slate-400 mb-2 block">
                    Internal Notes (not visible to student)
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Add any internal notes for your team..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none resize-none"
                    rows={2}
                  />
                </div>
              </div>

              {/* Info box */}
              <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-300 font-medium mb-1">What happens next?</p>
                  <ul className="text-blue-200/80 space-y-1 text-xs">
                    <li>✓ Email notification sent to student</li>
                    <li>✓ In-app notification created</li>
                    <li>✓ Application status updated</li>
                    <li>✓ Audit log recorded</li>
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-white/10">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-white/10 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitDecision}
                  disabled={!decision || isPending || loading}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold"
                >
                  {isPending || loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Decision
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
