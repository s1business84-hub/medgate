"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Eye, Save, X } from "lucide-react"
import { FormField, FormFieldType } from "@/lib/types"

interface FormBuilderProps {
  initialTitle?: string
  initialDescription?: string
  initialFields?: FormField[]
  onSave: (title: string, description: string, fields: FormField[]) => Promise<void>
  loading?: boolean
}

const fieldTypeOptions: FormFieldType[] = ["text", "rating", "checkbox", "textarea", "select"]

export function FormBuilder({
  initialTitle = "Daily Observership Assessment",
  initialDescription = "Assessment form for tracking observership performance",
  initialFields = [],
  onSave,
  loading = false,
}: FormBuilderProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [fields, setFields] = useState<FormField[]>(initialFields)
  const [previewMode, setPreviewMode] = useState(false)

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: "",
      type: "text",
      required: false,
      placeholder: "",
      order: fields.length,
    }
    setFields([...fields, newField])
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  const deleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id))
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Form title is required")
      return
    }
    if (fields.length === 0) {
      alert("Please add at least one field")
      return
    }
    await onSave(title, description, fields)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Form Builder</h2>
          <p className="text-slate-400 text-sm mt-1">Create forms for students to fill during sessions</p>
        </div>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          {previewMode ? "Edit" : "Preview"}
        </button>
      </div>

      {!previewMode ? (
        <>
          {/* Form Settings */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Form Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                placeholder="e.g., Daily Observership Assessment"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                placeholder="Brief description of what this form assesses"
                rows={2}
              />
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Form Fields ({fields.length})</h3>
              <button
                onClick={addField}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Field
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/20 p-8 text-center">
                <p className="text-slate-400">No fields added yet. Click "Add Field" to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-sm font-medium text-slate-300">Field {index + 1}</div>
                      <button
                        onClick={() => deleteField(field.id)}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Field Label</label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-indigo-500"
                          placeholder="e.g., Overall Performance Rating"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Field Type</label>
                        <select
                          value={field.type}
                          onChange={(e) => updateField(field.id, { type: e.target.value as FormFieldType })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-indigo-500"
                        >
                          {fieldTypeOptions.map(type => (
                            <option key={type} value={type} className="bg-slate-900">
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {field.type === "select" && (
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Options (comma-separated)</label>
                        <input
                          type="text"
                          value={field.options?.join(", ") || ""}
                          onChange={(e) => updateField(field.id, { options: e.target.value.split(",").map(o => o.trim()) })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-indigo-500"
                          placeholder="e.g., Excellent, Good, Fair, Poor"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Placeholder/Help Text</label>
                      <input
                        type="text"
                        value={field.placeholder || ""}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-indigo-500"
                        placeholder="Help text for students"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                        className="rounded"
                      />
                      <label className="text-xs font-medium text-slate-400">Required field</label>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Form"}
            </button>
          </div>
        </>
      ) : (
        /* Preview Mode */
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-300">{description}</p>
          </div>

          <div className="space-y-6">
            {fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-white mb-2">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    disabled
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 opacity-50"
                  />
                )}

                {field.type === "textarea" && (
                  <textarea
                    placeholder={field.placeholder}
                    disabled
                    rows={3}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 opacity-50"
                  />
                )}

                {field.type === "rating" && (
                  <div className="flex items-center gap-2 opacity-50">
                    {[1, 2, 3, 4, 5].map(i => (
                      <button key={i} className="p-2 rounded hover:bg-white/10">
                        <span className="text-2xl">★</span>
                      </button>
                    ))}
                  </div>
                )}

                {field.type === "checkbox" && (
                  <div className="flex items-center gap-2 opacity-50">
                    <input type="checkbox" disabled className="rounded" />
                    <label className="text-slate-300">{field.placeholder || "Option"}</label>
                  </div>
                )}

                {field.type === "select" && (
                  <select disabled className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-slate-400 opacity-50">
                    <option>{field.placeholder || "Select an option..."}</option>
                    {field.options?.map(opt => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {field.placeholder && field.type !== "select" && (
                  <p className="text-xs text-slate-400 mt-1">{field.placeholder}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
