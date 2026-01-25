"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Send, AlertCircle, Zap } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
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
  const { user } = useAuth()
  const [responses, setResponses] = useState<Record<string, string | number | boolean | string[]>>({})
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [xpGained, setXpGained] = useState(0)
  // Reflection assistant
  const reflectionQuestions = useMemo(
    () => [
      { id: "rq1", prompt: "What went particularly well in this session?" },
      { id: "rq2", prompt: "Describe one challenge you faced and how you addressed it." },
      { id: "rq3", prompt: "What is one concrete skill you improved today?" },
      { id: "rq4", prompt: "What will you do differently next session?" },
    ],
    []
  )
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string>>({})
  const answeredCount = Object.values(reflectionAnswers).filter(v => (v || "").trim().length > 0).length
  const progressPct = Math.round((answeredCount / reflectionQuestions.length) * 100)
  // XP calculation: +5 per reflection answer
  const totalXpEarnable = answeredCount * 5

  // Demo data per session per form
  const [showDemo, setShowDemo] = useState(false)
  const demoValues = useMemo(() => {
    const out: Record<string, string | number | boolean | string[]> = {}
    form.fields.forEach((f, idx) => {
      if (f.type === "text") out[f.id] = `Sample text for ${f.label}`
      if (f.type === "textarea") out[f.id] = `Demo reflection for ${f.label} (Session ${sessionNumber}).`
      if (f.type === "rating") out[f.id] = ((idx % 5) + 1)
      if (f.type === "checkbox") out[f.id] = idx % 2 === 0
      if (f.type === "select") out[f.id] = f.options?.[0] || ""
    })
    return out
  }, [form.fields, sessionNumber])

  const handleFieldChange = (fieldId: string, value: string | number | boolean | string[]) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleReflectionChange = (qid: string, value: string) => {
    setReflectionAnswers(prev => ({ ...prev, [qid]: value }))
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
      // Award XP for each reflection answer
      if (user && answeredCount > 0) {
        const { addXP } = await import("@/lib/storage")
        const result = addXP(user.id, totalXpEarnable)
        setXpGained(totalXpEarnable)
      }

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

      {/* AI Reflection Progress with XP Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-slate-300">Reflection Progress</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-400">{progressPct}%</p>
            {answeredCount > 0 && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-400">+{totalXpEarnable} XP</span>
              </div>
            )}
          </div>
        </div>
        <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
          />
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
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

      {/* Two-column: Form fields + Reflection Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-6">
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

        {/* Reflection Assistant */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-semibold text-white mb-3">Reflection Assistant</p>
          <div className="space-y-4">
            {reflectionQuestions.map((q, idx) => (
              <div key={q.id}>
                <label className="block text-xs text-slate-300 mb-1">{idx + 1}. {q.prompt}</label>
                <textarea
                  value={reflectionAnswers[q.id] || ""}
                  onChange={(e) => handleReflectionChange(q.id, e.target.value)}
                  rows={3}
                  placeholder="Type your reflection..."
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>
            ))}
          </div>

          {/* AI Insight summary (simple heuristic) */}
          {answeredCount > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <p className="text-xs text-purple-200">
                Insight: Your reflections highlight growth in <span className="font-semibold">communication and clinical reasoning</span>. Consider setting a specific goal for next session to reinforce learning.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Demo data per session per form */}
      <div className="mb-6">
        <button
          onClick={() => setShowDemo(s => !s)}
          className="text-xs px-3 py-1 rounded-md bg-white/10 border border-white/20 text-slate-300 hover:bg-white/15 transition-colors"
        >
          {showDemo ? "Hide" : "Show"} Demo Data for Session {sessionNumber}
        </button>
        {showDemo && (
          <div className="mt-3 p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-slate-400 mb-2">Example responses:</p>
            <ul className="text-xs text-slate-300 space-y-1">
              {form.fields.map(f => (
                <li key={f.id}>
                  <span className="text-slate-400">{f.label}:</span> {String(demoValues[f.id] ?? "")}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {loading ? "Submitting..." : "Submit Form"}
        </button>
      </div>

      {/* Success Message with XP Gained */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-center"
        >
          <p className="text-green-300 mb-2">✓ Form submitted successfully! Your supervisor will review it. Reflection saved.</p>
          {xpGained > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center gap-2 mt-2 text-yellow-300 font-semibold"
            >
              <Zap className="w-5 h-5" />
              <span>+{xpGained} XP Earned!</span>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

