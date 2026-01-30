"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { getApplications, getObservationForms, createSessionFormSubmission } from "@/lib/storage"
import { StudentFormSubmission } from "@/components/student-form-submission"
import { ImportGuidelines } from "@/components/import-guidelines"
import { showToast } from "@/lib/toast"
import { ObservationForm } from "@/lib/types"
import { LiquidParallax } from "@/components/ui/liquid-parallax"

export default function FormSubmissionPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [forms, setForms] = useState<ObservationForm[]>([])
  const [selectedForm, setSelectedForm] = useState<ObservationForm | null>(null)
  const [sessionNumber, setSessionNumber] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login")
      return
    }

    // Get student's applications and their forms
    const applications = getApplications()
    const studentApps = applications.filter(a => a.studentId === user.id)

    if (studentApps.length === 0) {
      showToast("No active applications found")
      setLoading(false)
      return
    }

    // Get all forms for student's applications
    const allForms: ObservationForm[] = []
    studentApps.forEach(app => {
      const appForms = getObservationForms(app.id)
      allForms.push(...appForms)
    })

    setForms(allForms)
    if (allForms.length > 0) {
      setSelectedForm(allForms[0])
    }
    setLoading(false)
  }, [user, router])

  const handleFormSubmit = async (responses: Array<{ fieldId: string; value: any }>) => {
    if (!user || !selectedForm) return

    try {
      setLoading(true)
      
      // Create session form submission
      const submission = createSessionFormSubmission({
        sessionId: `session_${sessionNumber - 1}`,
        applicationId: selectedForm.applicationId,
        studentId: user.id,
        formId: selectedForm.id,
        responses,
        status: "submitted",
      })

      if (submission) {
        showToast("Form submitted successfully!")
        setSelectedForm(null)
        setTimeout(() => router.push("/student"), 2000)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      showToast("Failed to submit form")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-purple-900/20 to-slate-950 flex items-center justify-center">
        <LiquidParallax depth={14} className="opacity-70" />
        <p className="text-slate-300 relative z-10">Loading forms...</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-purple-900/20 to-slate-950">
      <LiquidParallax depth={14} className="opacity-70" />
      <div className="max-w-2xl mx-auto px-4 py-12 relative z-10">
        {selectedForm ? (
          <StudentFormSubmission
            form={selectedForm}
            sessionNumber={sessionNumber}
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        ) : forms.length === 0 ? (
          <div className="space-y-12">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-2">No Forms Available</h2>
              <p className="text-slate-300 mb-4">
                Forms will appear here once your supervisor assigns them to your application.
              </p>
              <button
                onClick={() => router.push("/student")}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
            <ImportGuidelines />
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white mb-6">Session Observation Forms</h1>
            <div className="space-y-2">
              {forms.map((form, idx) => (
                <button
                  key={form.id}
                  onClick={() => {
                    setSelectedForm(form)
                    setSessionNumber(idx + 1)
                  }}
                  className="w-full p-4 text-left bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <h3 className="font-semibold text-white">{form.title}</h3>
                  <p className="text-sm text-slate-300">{form.description}</p>
                </button>
              ))}
            </div>
            <ImportGuidelines />
          </div>
        )}
      </div>
    </div>
  )
}
