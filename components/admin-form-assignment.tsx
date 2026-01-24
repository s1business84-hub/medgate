"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Plus, Send } from "lucide-react"
import { Application, ObservationForm, FormField } from "@/lib/types"

interface AdminFormAssignmentProps {
  application: Application
  onAssignForm: (formData: {
    title: string
    description: string
    fields: FormField[]
  }) => Promise<void>
  loading?: boolean
  existingForms?: ObservationForm[]
}

export function AdminFormAssignment({
  application,
  onAssignForm,
  loading = false,
  existingForms = [],
}: AdminFormAssignmentProps) {
  const [mode, setMode] = useState<"select" | "create">("select")
  const [selectedFormId, setSelectedFormId] = useState<string>("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [fields, setFields] = useState<FormField[]>([
    { id: "f1", label: "", type: "text", required: false, order: 0 },
  ])
  const [errors, setErrors] = useState<string[]>([])

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

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleCreateForm = async () => {
    if (!validateForm()) return

    try {
      await onAssignForm({
        title: formTitle,
        description: formDescription,
        fields,
      })

      // Reset form
      setFormTitle("")
      setFormDescription("")
      setFields([{ id: "f1", label: "", type: "text", required: false, order: 0 }])
      setShowCreateForm(false)
      setMode("select")
    } catch (error) {
      setErrors(["Failed to create form"])
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
    >
      <div>
        <h4 className="font-semibold text-white mb-3">Assign Observation Form</h4>
        <p className="text-sm text-slate-300 mb-4">
          Student will fill this form after each session during their {application.sessionCount || 1} session(s).
        </p>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("select")}
          className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${
            mode === "select"
              ? "bg-blue-600 text-white"
              : "bg-white/10 text-slate-300 hover:bg-white/20"
          }`}
        >
          Use Existing Template
        </button>
        <button
          onClick={() => setMode("create")}
          className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${
            mode === "create"
              ? "bg-blue-600 text-white"
              : "bg-white/10 text-slate-300 hover:bg-white/20"
          }`}
        >
          Create New Form
        </button>
      </div>

      {/* Select Existing Form */}
      {mode === "select" && (
        <div>
          {existingForms.length > 0 ? (
            <select
              value={selectedFormId}
              onChange={(e) => setSelectedFormId(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
            >
              <option value="">-- Select a form --</option>
              {existingForms.map(form => (
                <option key={form.id} value={form.id}>
                  {form.title} ({form.fields.length} fields)
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-slate-400 italic">No existing forms available. Create a new one.</p>
          )}
        </div>
      )}

      {/* Create New Form */}
      {mode === "create" && (
        <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-sm text-red-300 space-y-1">
              {errors.map((err, i) => (
                <div key={i}>• {err}</div>
              ))}
            </div>
          )}

          {/* Form Title */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">Form Title</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g., Daily Observation Form, Session Feedback"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-slate-500"
            />
          </div>

          {/* Form Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">Description (Optional)</label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="What should the student focus on when filling this form?"
              rows={2}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-slate-500 resize-none"
            />
          </div>

          {/* Fields */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-white">Form Fields</label>
              <button
                onClick={addField}
                className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
              >
                <Plus className="w-3 h-3" />
                Add Field
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((field, idx) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-white/10 border border-white/20 rounded space-y-2"
                >
                  {/* Field Label */}
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    placeholder="Field label"
                    className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white placeholder-slate-500 text-sm"
                  />

                  {/* Field Type & Options */}
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={field.type}
                      onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                      className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="textarea">Textarea</option>
                      <option value="rating">Rating</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="select">Select</option>
                    </select>

                    <label className="flex items-center gap-1 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                        className="w-4 h-4"
                      />
                      Required
                    </label>

                    <button
                      onClick={() => deleteField(field.id)}
                      className="px-2 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 text-sm rounded"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Select Options */}
                  {field.type === "select" && (
                    <div>
                      <label className="text-xs text-slate-400">Options (comma-separated)</label>
                      <input
                        type="text"
                        value={field.options?.join(", ") || ""}
                        onChange={(e) => updateField(field.id, { options: e.target.value.split(",").map(o => o.trim()) })}
                        placeholder="Option 1, Option 2, Option 3"
                        className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white placeholder-slate-500 text-sm mt-1"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-white/10">
        <button
          onClick={() => {
            if (mode === "create") {
              handleCreateForm()
            } else {
              // Assign existing form
              if (selectedFormId) {
                // Trigger parent callback
                setSelectedFormId("")
              }
            }
          }}
          disabled={loading || (mode === "create" && !formTitle) || (mode === "select" && !selectedFormId)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
          {loading ? "Assigning..." : "Assign Form"}
        </button>
        <button
          onClick={() => {
            setShowCreateForm(false)
            setFormTitle("")
            setFormDescription("")
            setFields([{ id: "f1", label: "", type: "text", required: false, order: 0 }])
            setErrors([])
          }}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-300 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  )
}
