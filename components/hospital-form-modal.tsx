"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Trash2, Save } from "lucide-react"
import { Application, ObservationForm, FormField, Session } from "@/lib/types"
import { getSessions } from "@/lib/storage"

interface HospitalFormModalProps {
  isOpen: boolean
  onClose: () => void
  application: Application
  onSubmit: (formData: {
    title: string
    description: string
    fields: FormField[]
    sessionId: string
    sessionNumber: number
  }) => Promise<void>
  existingForms?: ObservationForm[]
}

export function HospitalFormModal({
  isOpen,
  onClose,
  application,
  onSubmit,
  existingForms = [],
}: HospitalFormModalProps) {
  const [mode, setMode] = useState<"select" | "create">("create")
  const [selectedFormId, setSelectedFormId] = useState<string>("")
  const [selectedSessionId, setSelectedSessionId] = useState<string>("")
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [fields, setFields] = useState<FormField[]>([
    { id: "f1", label: "Overall Performance", type: "rating", required: true, order: 0 },
  ])
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    if (isOpen && application?.id) {
      const appSessions = getSessions().filter(s => s.applicationId === application.id)
      setSessions(appSessions)
      if (appSessions.length > 0 && !selectedSessionId) {
        setSelectedSessionId(appSessions[0].id)
      }
    }
  }, [isOpen, application, selectedSessionId])

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: "",
      type: "text",
      required: false,
      order: fields.length,
    }
    setFields([...fields, newField])
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(
      fields.map(f =>
        f.id === id ? { ...f, ...updates } : f
      )
    )
  }

  const deleteField = (id: string) => {
    if (fields.length === 1) {
      setErrors(["Form must have at least one field"])
      return
    }
    setFields(fields.filter(f => f.id !== id))
  }

  const validateForm = (): boolean => {
    const newErrors: string[] = []

    if (!selectedSessionId) {
      newErrors.push("Please select a session")
    }

    if (mode === "create") {
      if (!formTitle.trim()) {
        newErrors.push("Form title is required")
      }

      if (fields.length === 0) {
        newErrors.push("Form must have at least one field")
      }

      fields.forEach((field, idx) => {
        if (!field.label.trim()) {
          newErrors.push(`Field ${idx + 1}: Label is required`)
        }
        if (field.type === "select" && (!field.options || field.options.length === 0)) {
          newErrors.push(`Field ${idx + 1}: Select fields must have options`)
        }
      })
    } else {
      if (!selectedFormId) {
        newErrors.push("Please select an existing form template")
      }
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const selectedSession = sessions.find(s => s.id === selectedSessionId)
      if (!selectedSession) {
        setErrors(["Invalid session selected"])
        return
      }

      if (mode === "create") {
        await onSubmit({
          title: formTitle,
          description: formDescription,
          fields,
          sessionId: selectedSessionId,
          sessionNumber: selectedSession.sessionNumber,
        })
      } else {
        const existingForm = existingForms.find(f => f.id === selectedFormId)
        if (existingForm) {
          await onSubmit({
            title: existingForm.title,
            description: existingForm.description || "",
            fields: existingForm.fields,
            sessionId: selectedSessionId,
            sessionNumber: selectedSession.sessionNumber,
          })
        }
      }

      // Reset and close
      setFormTitle("")
      setFormDescription("")
      setFields([{ id: "f1", label: "Overall Performance", type: "rating", required: true, order: 0 }])
      setSelectedFormId("")
      setErrors([])
      onClose()
    } catch (error: any) {
      setErrors([error.message || "Failed to create form"])
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">Create Observation Form</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Session Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Assign to Session <span className="text-red-400">*</span>
              </label>
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select a session...</option>
                {sessions.map(session => (
                  <option key={session.id} value={session.id}>
                    Session {session.sessionNumber} {session.status !== 'pending' ? `(${session.status})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
              <button
                onClick={() => setMode("create")}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                  mode === "create"
                    ? "bg-cyan-500 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Create New Form
              </button>
              <button
                onClick={() => setMode("select")}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                  mode === "select"
                    ? "bg-cyan-500 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Use Existing Template
              </button>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                {errors.map((error, idx) => (
                  <p key={idx} className="text-sm text-red-300">• {error}</p>
                ))}
              </div>
            )}

            {mode === "select" ? (
              /* Existing Form Selection */
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Select Form Template
                </label>
                <select
                  value={selectedFormId}
                  onChange={(e) => setSelectedFormId(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Choose a template...</option>
                  {existingForms.map(form => (
                    <option key={form.id} value={form.id}>
                      {form.title} ({form.fields.length} fields)
                    </option>
                  ))}
                </select>
                {existingForms.length === 0 && (
                  <p className="text-sm text-slate-400 mt-2">No existing templates available. Create a new form instead.</p>
                )}
              </div>
            ) : (
              /* Create New Form */
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Form Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g., Session Observation Form"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Brief description of what this form evaluates..."
                    rows={2}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                {/* Form Fields */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-slate-300">Form Fields</label>
                    <button
                      onClick={addField}
                      className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Field
                    </button>
                  </div>

                  <div className="space-y-3">
                    {fields.map((field, idx) => (
                      <div key={field.id} className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                            placeholder={`Field ${idx + 1} label...`}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          />
                          <select
                            value={field.type}
                            onChange={(e) => updateField(field.id, { type: e.target.value as FormField["type"] })}
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          >
                            <option value="text">Text</option>
                            <option value="textarea">Long Text</option>
                            <option value="rating">Rating (1-5)</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="select">Dropdown</option>
                          </select>
                          <label className="flex items-center gap-2 text-sm text-slate-300">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                              className="rounded border-white/20"
                            />
                            Required
                          </label>
                          <button
                            onClick={() => deleteField(field.id)}
                            disabled={fields.length === 1}
                            className="p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {field.type === "select" && (
                          <input
                            type="text"
                            value={field.options?.join(", ") || ""}
                            onChange={(e) => updateField(field.id, { options: e.target.value.split(",").map(o => o.trim()) })}
                            placeholder="Options (comma-separated): Excellent, Good, Fair, Poor"
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Creating..." : "Create & Assign Form"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
