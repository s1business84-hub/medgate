'use client'

import { motion } from 'framer-motion'
import { CheckCircle, FileText, AlertCircle, BookOpen, Zap, Trophy } from 'lucide-react'
import Reveal from './Reveal'
import { StaggerGroup } from './animation/StaggerGroup'

export const ImportGuidelines = () => {
  const requirements = [
    { icon: FileText, label: 'Valid Medical Documentation', desc: 'Official credentials and licenses' },
    { icon: CheckCircle, label: 'Complete Application', desc: 'All required fields filled accurately' },
    { icon: AlertCircle, label: 'Background Clearance', desc: 'Clean background check verification' },
  ]

  const process = [
    { step: 1, title: 'Submit Application', desc: 'Complete the form with all required documents' },
    { step: 2, title: 'Initial Review', desc: 'Admin team verifies your submission' },
    { step: 3, title: 'Document Verification', desc: 'Credentials are validated against registries' },
    { step: 4, title: 'Background Check', desc: 'Security clearance process initiated' },
    { step: 5, title: 'Interview Stage', desc: 'You may be contacted for clarifications' },
    { step: 6, title: 'Final Decision', desc: 'Approval notification sent via email' },
  ]

  return (
    <div className="mt-12 space-y-8">
      {/* Guidelines Header */}
      <Reveal y={20} delay={0.1}>
        <div className="p-8 rounded-2xl bg-linear-to-br from-slate-950 via-indigo-950/20 to-slate-950 border border-indigo-500/20 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-indigo-500/20">
              <BookOpen className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">Import Guidelines</h3>
              <p className="text-slate-300">
                Before submitting your application, review these essential guidelines and requirements to ensure a smooth import process.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Requirements */}
      <Reveal y={20} delay={0.2}>
        <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            Key Requirements
          </h4>
          <StaggerGroup>
            <div className="grid md:grid-cols-3 gap-4">
              {requirements.map((req, idx) => {
                const Icon = req.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
                  >
                    <Icon className="w-5 h-5 text-blue-400 mb-2" />
                    <p className="font-semibold text-white mb-1">{req.label}</p>
                    <p className="text-sm text-slate-400">{req.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </StaggerGroup>
        </div>
      </Reveal>

      {/* 6-Step Process */}
      <Reveal y={20} delay={0.3}>
        <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <h4 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            6-Step Import Process
          </h4>
          <StaggerGroup>
            <div className="space-y-4">
              {process.map((item, idx) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex gap-4 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </StaggerGroup>
        </div>
      </Reveal>

      {/* Eligibility Info */}
      <Reveal y={20} delay={0.4}>
        <div className="p-8 rounded-2xl border border-blue-500/20 bg-linear-to-br from-blue-950/20 via-slate-950 to-slate-950 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <Trophy className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Eligibility Requirements</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Valid medical or healthcare license from recognized institution
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Minimum 2 years of clinical experience (may vary by role)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Professional liability insurance (for certain positions)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Current CPR/BLS certification
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Clean criminal background check
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
