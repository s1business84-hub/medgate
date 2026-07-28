"use client"

import { useState, useEffect, startTransition } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { getApplications, getSessionFormSubmissions, getPerformanceMetrics } from "@/lib/storage"
import { FormTrackingDashboard } from "@/components/form-tracking-dashboard"
import { Application, SessionFormSubmission, StudentPerformanceMetrics } from "@/lib/types"
import { LiquidParallax } from "@/components/ui/liquid-parallax"

export default function FormTrackingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<SessionFormSubmission[]>([])
  const [metrics, setMetrics] = useState<StudentPerformanceMetrics[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoading) return;
    if (!user || (user.role !== "supervisor" && user.role !== "staff")) {
      router.push("/login")
      return
    }

    try {
      // Get all applications (supervisor sees all, staff sees their hospital only)
      let allApps = getApplications()
      if (user.role === "staff") {
        // Filter by hospital ID if available
        allApps = allApps.filter(a => a.hospitalId === user.hospitalId)
      }
      startTransition(() => setApplications(allApps))

      // Get form submissions
      const allSubmissions = getSessionFormSubmissions()
      if (user.role === "staff") {
        // Filter to only submissions from this hospital's applications
        const filteredSubmissions = allSubmissions.filter(sub => {
          const app = allApps.find(a => a.id === sub.applicationId)
          return app?.hospitalId === user.hospitalId
        })
        startTransition(() => setSubmissions(filteredSubmissions))
      } else {
        startTransition(() => setSubmissions(allSubmissions))
      }

      // Get performance metrics
      const allMetrics = getPerformanceMetrics()
      startTransition(() => setMetrics(allMetrics))

      startTransition(() => setLoading(false))
    } catch (error) {
      console.error("Error loading data:", error)
      startTransition(() => setLoading(false))
    }
  }, [user, router, isLoading])

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-indigo-900/20 to-slate-950 flex items-center justify-center">
        <LiquidParallax depth={14} className="opacity-70" />
        <p className="text-slate-300">Loading tracking dashboard...</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-indigo-900/20 to-slate-950">
      <LiquidParallax depth={14} className="opacity-70" />
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <FormTrackingDashboard
          submissions={submissions}
          metrics={metrics}
          applications={applications}
        />
      </div>
    </div>
  )
}
