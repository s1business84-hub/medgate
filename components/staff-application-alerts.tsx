"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  Mail,
  User,
  Calendar,
  Building2,
} from "lucide-react"
import { StaffApplicationAlert } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface StaffApplicationAlertsProps {
  alerts: StaffApplicationAlert[]
  onApprove?: (alertId: string) => void
  onDecline?: (alertId: string) => void
  onWaitlist?: (alertId: string) => void
  onMarkAsRead?: (alertId: string, staffId: string) => void
  staffId: string
  loading?: boolean
}

export function StaffApplicationAlerts({
  alerts,
  onApprove,
  onDecline,
  onWaitlist,
  onMarkAsRead,
  staffId,
  loading = false,
}: StaffApplicationAlertsProps) {
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "actioned">("all")

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      if (filterStatus === "all") return true
      if (filterStatus === "pending") return alert.status === "pending"
      if (filterStatus === "actioned") return alert.status !== "pending"
      return true
    })
  }, [alerts, filterStatus])

  const pendingCount = alerts.filter(a => a.status === "pending").length
  const unreadCount = alerts.filter(a => !a.readBy.includes(staffId)).length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-emerald-400"
      case "declined":
        return "text-red-400"
      case "waitlisted":
        return "text-amber-400"
      default:
        return "text-slate-400"
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 border-emerald-500/30"
      case "declined":
        return "bg-red-500/10 border-red-500/30"
      case "waitlisted":
        return "bg-amber-500/10 border-amber-500/30"
      default:
        return "bg-slate-500/10 border-slate-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      case "declined":
        return <XCircle className="w-5 h-5 text-red-400" />
      case "waitlisted":
        return <Clock className="w-5 h-5 text-amber-400" />
      default:
        return <Bell className="w-5 h-5 text-slate-400" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-r from-slate-950 to-slate-900 border border-white/10 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-400" />
              Application Alerts
            </h3>
            <p className="text-slate-400 text-sm mt-1">New student applications awaiting review</p>
          </div>
          {unreadCount > 0 && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center gap-3"
            >
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-400">{unreadCount}</div>
                <div className="text-xs text-slate-400">unread</div>
              </div>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            </motion.div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-sm text-slate-400">Pending Review</div>
            <div className="text-2xl font-bold text-white mt-1">{pendingCount}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-sm text-slate-400">Approved</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {alerts.filter(a => a.status === "approved").length}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-sm text-slate-400">Waitlisted/Declined</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              {alerts.filter(a => a.status !== "pending" && a.status !== "approved").length}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "pending", "actioned"] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === status
                ? "bg-blue-600 text-white"
                : "bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10"
            }`}
          >
            {status === "all" && "All"}
            {status === "pending" && `Pending (${pendingCount})`}
            {status === "actioned" && `Actioned (${alerts.length - pendingCount})`}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-400">Loading alerts...</p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white/5 rounded-lg border border-white/10"
        >
          <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
          <p className="text-slate-400">
            {filterStatus === "pending" ? "No pending applications" : "No applications"}
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {filteredAlerts.map((alert, index) => {
              const isExpanded = expandedAlertId === alert.id
              const isUnread = !alert.readBy.includes(staffId)

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative border rounded-lg overflow-hidden transition-all ${
                    isUnread ? "border-blue-400/50 bg-blue-500/5" : "border-white/10 bg-white/5"
                  }`}
                >
                  {/* Unread indicator */}
                  {isUnread && (
                    <motion.div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-400 to-blue-500" />
                  )}

                  {/* Alert header - always visible */}
                  <motion.button
                    onClick={() => {
                      setExpandedAlertId(isExpanded ? null : alert.id)
                      if (isUnread && onMarkAsRead) {
                        onMarkAsRead(alert.id, staffId)
                      }
                    }}
                    className="w-full p-4 text-left hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {/* Status icon */}
                        <div className="shrink-0">{getStatusIcon(alert.status)}</div>

                        {/* Student info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white truncate">{alert.studentName}</p>
                            {isUnread && (
                              <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="inline-block w-2 h-2 bg-blue-400 rounded-full"
                              />
                            )}
                          </div>
                          <p className="text-sm text-slate-400 truncate">{alert.programId}</p>
                        </div>

                        {/* Status badge */}
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusBgColor(
                            alert.status
                          )}`}
                        >
                          <span className={`text-xs font-medium ${getStatusColor(alert.status)}`}>
                            {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                          </span>
                        </div>

                        {/* Expand indicator */}
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          className="shrink-0 text-slate-400"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.button>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-white/10"
                      >
                        <div className="p-4 space-y-4">
                          {/* Details grid */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <User className="w-4 h-4" />
                                Student Email
                              </div>
                              <p className="font-medium text-white break-all">{alert.studentEmail}</p>
                            </div>

                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <Calendar className="w-4 h-4" />
                                Submitted
                              </div>
                              <p className="font-medium text-white">
                                {new Date(alert.submittedAt).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="bg-white/5 rounded-lg p-3 border border-white/10 col-span-2">
                              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <Building2 className="w-4 h-4" />
                                Program & Application
                              </div>
                              <p className="font-medium text-white">{alert.programId}</p>
                              <p className="text-xs text-slate-400 mt-1">ID: {alert.applicationId}</p>
                            </div>
                          </div>

                          {/* Actions - only show if pending */}
                          {alert.status === "pending" && (
                            <div className="pt-4 border-t border-white/10 space-y-3">
                              <p className="text-sm text-slate-400 font-medium">Make a decision:</p>
                              <div className="grid grid-cols-3 gap-2">
                                <Button
                                  onClick={() => onApprove?.(alert.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => onWaitlist?.(alert.id)}
                                  className="bg-amber-600 hover:bg-amber-700 text-white font-medium"
                                >
                                  <Clock className="w-4 h-4 mr-2" />
                                  Waitlist
                                </Button>
                                <Button
                                  onClick={() => onDecline?.(alert.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white font-medium"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Decline
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Email button */}
                          <div className="pt-2">
                            <Button
                              onClick={() => {
                                window.location.href = `mailto:${alert.studentEmail}`
                              }}
                              variant="outline"
                              className="w-full border-white/10 text-slate-300 hover:bg-white/5"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Email Student
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}
