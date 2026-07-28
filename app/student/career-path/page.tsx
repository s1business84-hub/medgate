"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getApplications, getSessions, getPerformanceMetrics } from "@/lib/storage"
import { mockPrograms, mockHospitals } from "@/lib/mockData"
import { CareerStrategizer } from "@/components/career-strategizer"
import { Application, Session, Program, Hospital } from "@/lib/types"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

export default function CareerPathPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)

  // Derived data for career strategizer
  const [completedDepartments, setCompletedDepartments] = useState<string[]>([])
  const [completedSessionCount, setCompletedSessionCount] = useState(0)
  const [skillsAcquired, setSkillsAcquired] = useState<string[]>([])
  const [departmentPerformance, setDepartmentPerformance] = useState<{
    department: string
    averageRating: number
    trend: "improving" | "stable" | "declining"
    strengths: string[]
  }[]>([])

  const loadData = () => {
    try {
      // Load applications for this student
      const allApplications = getApplications()
      const studentApplications = allApplications.filter(app => app.studentId === user?.id)
      setApplications(studentApplications)

      // Load all sessions for student's applications
      const allSessions: Session[] = []
      studentApplications.forEach(app => {
        const appSessions = getSessions(app.id)
        allSessions.push(...appSessions)
      })
      setSessions(allSessions)

      // Load programs and hospitals
      setPrograms(mockPrograms)
      setHospitals(mockHospitals)

      // Calculate completed departments
      const completedApps = studentApplications.filter(app => 
        app.status === "In Training" || app.status === "Accepted"
      )
      
      const departments: string[] = []
      completedApps.forEach(app => {
        const program = mockPrograms.find(p => p.id === app.programId)
        if (program?.hospitalId) {
          const hospital = mockHospitals.find(h => h.id === program.hospitalId)
          if (hospital) {
            departments.push(...hospital.departments)
          }
        }
        if (app.department) {
          departments.push(app.department)
        }
      })
      
      // Deduplicate departments
      setCompletedDepartments([...new Set(departments)])

      // Count completed sessions
      const completed = allSessions.filter(s => s.status === "completed").length
      setCompletedSessionCount(completed)

      // For now, mock skills - in production this would come from form responses
      const mockSkills = [
        "Patient Communication",
        "Clinical Observation",
        "Team Collaboration",
        "Medical Documentation",
        "Clinical Assessment"
      ].slice(0, Math.min(5, completed * 2))
      setSkillsAcquired(mockSkills)

      // Map applications to departments to align performance metrics with observership types
      const departmentLookup: Record<string, string> = {}
      studentApplications.forEach(app => {
        const program = mockPrograms.find(p => p.id === app.programId)
        const hospital = program ? mockHospitals.find(h => h.id === program.hospitalId) : undefined
        departmentLookup[app.id] = app.department || program?.name || hospital?.departments?.[0] || "General"
      })

      // Aggregate performance metrics per department
      const perfMetrics = getPerformanceMetrics().filter(m => m.studentId === user?.id)
      const perfBuckets: Record<string, { ratings: number[]; trends: string[]; strengths: string[] }> = {}

      perfMetrics.forEach(m => {
        const dept = departmentLookup[m.applicationId] || "General"
        if (!perfBuckets[dept]) {
          perfBuckets[dept] = { ratings: [], trends: [], strengths: [] }
        }
        perfBuckets[dept].ratings.push(m.averageRating)
        perfBuckets[dept].trends.push(m.performanceTrend)
        perfBuckets[dept].strengths.push(...m.keyStrengths)
      })

      const perfByDept = Object.entries(perfBuckets).map(([department, bucket]) => {
        const avg = bucket.ratings.reduce((a, b) => a + b, 0) / (bucket.ratings.length || 1)
        const trend = bucket.trends.sort((a, b) => bucket.trends.filter(t => t === a).length - bucket.trends.filter(t => t === b).length).pop() as any
        const strengths = Array.from(new Set(bucket.strengths)).slice(0, 4)
        return {
          department,
          averageRating: Number(avg.toFixed(1)),
          trend: trend || "stable",
          strengths,
        }
      }).sort((a, b) => b.averageRating - a.averageRating)

      setDepartmentPerformance(perfByDept)

      setLoading(false)
    } catch (error) {
      console.error("Error loading career path data:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "student") {
      router.push("/")
      return
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router, isLoading])

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-slate-300">Loading your career path...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-blue-500/30 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/student"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Student Portal
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-linear-to-br from-indigo-500 to-blue-500 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Career Path Strategizer</h1>
              <p className="text-slate-300">
                Plan your medical career journey with personalized recommendations
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {applications.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-12 text-center">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-indigo-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Start Your Journey</h3>
            <p className="text-slate-300 mb-6 max-w-md mx-auto">
              Complete your first observership session to unlock personalized career path recommendations
              based on your experience and interests.
            </p>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-indigo-500 to-blue-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-blue-600 transition-all"
            >
              Browse Programs
            </Link>
          </div>
        ) : (
          <CareerStrategizer
            studentId={user?.id || ""}
            currentStage="observership"
            completedDepartments={completedDepartments}
            completedSessions={completedSessionCount}
            skillsAcquired={skillsAcquired}
            yearOfStudy={3} // Could be loaded from student profile
            departmentPerformance={departmentPerformance}
          />
        )}

        {/* Tips Section */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-linear-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">💡 Career Planning Tips</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="font-medium text-white mb-2">Explore Multiple Specialties</h4>
              <p className="text-sm text-slate-300">
                Complete observerships in different departments to discover which specialty aligns with your interests and strengths.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="font-medium text-white mb-2">Build Your Network</h4>
              <p className="text-sm text-slate-300">
                Connect with supervisors and mentors during your sessions. Their guidance can be invaluable for career decisions.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="font-medium text-white mb-2">Document Your Experience</h4>
              <p className="text-sm text-slate-300">
                Complete post-session forms thoroughly. They help track your skills and provide evidence for future applications.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="font-medium text-white mb-2">Research Requirements Early</h4>
              <p className="text-sm text-slate-300">
                Each specialty has unique certification and training requirements. Start planning early to stay on track.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        {applications.length > 0 && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Experience Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-linear-to-br from-indigo-500/10 to-blue-500/10 rounded-lg p-4 border border-indigo-500/30">
                <div className="text-2xl font-bold text-white mb-1">{applications.length}</div>
                <div className="text-sm text-slate-300">Total Applications</div>
              </div>
              <div className="bg-linear-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/30">
                <div className="text-2xl font-bold text-white mb-1">{completedSessionCount}</div>
                <div className="text-sm text-slate-300">Sessions Completed</div>
              </div>
              <div className="bg-linear-to-br from-blue-500/10 to-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                <div className="text-2xl font-bold text-white mb-1">{completedDepartments.length}</div>
                <div className="text-sm text-slate-300">Departments</div>
              </div>
              <div className="bg-linear-to-br from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/30">
                <div className="text-2xl font-bold text-white mb-1">{skillsAcquired.length}</div>
                <div className="text-sm text-slate-300">Skills Acquired</div>
              </div>
            </div>

            {completedDepartments.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Departments You've Explored:</h4>
                <div className="flex flex-wrap gap-2">
                  {completedDepartments.map(dept => (
                    <span
                      key={dept}
                      className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm border border-indigo-500/30"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
