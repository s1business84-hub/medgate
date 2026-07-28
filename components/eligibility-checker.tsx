"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

const requirements = [
  "Proof of active medical student status (enrollment letter or student ID)",
  "Valid passport copy",
  "Valid visa status or legal presence in UAE (tourist or resident)",
  "Updated CV or resume",
  "Passport-style photograph",
  "Vaccinations and screenings (required by some programs)",
]

export function EligibilityChecker() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg p-4 sm:p-6 mb-8"
    >
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-slate-100">Minimum Requirements & Eligibility</h3>
        <p className="text-xs sm:text-sm text-slate-300">These must be met for all programs.</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {requirements.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 p-3 sm:p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl"
          >
            <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5" />
            <p className="text-sm sm:text-base text-slate-200 leading-snug">{item}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-linear-to-r from-blue-500/10 to-indigo-500/10 border border-blue-400/30 text-sm text-slate-200">
        <strong>Note:</strong> Requirements vary by institution. Each program sets its own eligibility criteria, documentation needs, and approval process. Academic transcripts, vaccinations, and screenings are required by some programs but not all.
      </div>
    </motion.div>
  )
}
