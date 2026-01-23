"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, AlertCircle } from "lucide-react"
import { ObservationForm } from "@/lib/types"

interface FormFieldValue {
  fieldId: string
  value: string | number | boolean | string[]
}

interface StudentFormSubmissionProps {
  form: ObservationForm
  sessionNumber: number
  onSubmit: (responses: FormFieldValue[]) => Promise<void>
  loading?: boolean
}

export function StudentFormSubmission({
  form,
  sessionNumber,
  onSubmit,
  loading = false,
}: StudentFormSubmissionProps) {
  const [responses, setResponses] = useState<Record<string, string | number | boolean | string[]>>({})
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleFieldChange = (fieldId: string, value: string | number | boolean | string[]) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const validate = () => {
    const newErrors: string[] = []
    form.fields.forEach(field => {
      if (field.required && !responses[field.id]) {
        newErrors.push(`${field.label} is required`)
      }
    })
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    try {
      const formattedResponses: FormFieldValue[] = form.fields.map(field => ({
        fieldId: field.id,
        value: responses[field.id] || "",
      }))
      await onSubmit(formattedResponses)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{form.title}</h2>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">
            Session {sessionNumber}
          </span>
          <p>{form.description}</p>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-300 mb-1">Please fix the following:</p>
            <ul className="text-sm text-red-300/80 space-y-0.5">
              {errors.map((error, i) => (
                <li key={i}>• {error}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Form Fields */}
      <div className="space-y-6 mb-6">
        {form.fields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <label className="block text-sm font-medium text-white mb-2">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                value={(responses[field.id] as string) || ""}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            )}

            {field.type === "textarea" && (
              <textarea
                value={(responses[field.id] as string) || ""}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            )}

            {field.type === "rating" && (
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <button
                    key={i}
                    onClick={() => handleFieldChange(field.id, i)}
                    className={`p-2 rounded transition-all ${
                      responses[field.id] === i
                        ? "bg-yellow-500/30 scale-110"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <span className={`text-2xl ${responses[field.id] === i ? "text-yellow-400" : "text-slate-500"}`}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
            )}

            {field.type === "checkbox" && (
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={(responses[field.id] as boolean) || false}
                  onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                  className="rounded w-4 h-4 accent-purple-500"
                />
                <span className="text-slate-300">{field.placeholder || "Confirm"}</span>
              </div>
            )}

            {field.type === "select" && (
              <select
                value={(responses[field.id] as string) || ""}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="" className="bg-slate-900">
                  {field.placeholder || "Select an option..."}
                </option>
                {field.options?.map(opt => (
                  <option key={opt} value={opt} className="bg-slate-900">
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {field.helpText && (
              <p className="text-xs text-slate-400 mt-1">{field.helpText}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {loading ? "Submitting..." : "Submit Form"}
        </button>
      </div>

      {/* Success Message */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-center text-green-300"
        >
          ✓ Form submitted successfully! Your supervisor will review it.
        </motion.div>
      )}
    </motion.div>
  )
}
