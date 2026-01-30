/**
 * Student Portal Guidelines Component
 * Shows import guidelines, eligibility criteria, and application requirements
 */

"use client";

import { motion } from "framer-motion";
import { FileText, CheckCircle2, AlertCircle, Upload } from "lucide-react";
import { ScrollReveal } from "./animation/ScrollReveal";
import { StaggerGroup, StaggerItem } from "./animation/StaggerGroup";

const guidelines = [
  {
    title: "Document Requirements",
    items: [
      "Valid passport or national ID",
      "Medical certificate (issued within 6 months)",
      "Immunization records",
      "Medical fitness certificate",
      "Police clearance certificate",
      "Nursing license (if applicable)",
      "Specialty certifications",
    ],
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Eligibility Criteria",
    items: [
      "Enrolled in recognized medical/nursing program",
      "Minimum GPA of 3.0 or equivalent",
      "Clear background check",
      "No disciplinary actions",
      "Valid professional license",
      "Fluent in English or Arabic",
      "Commitment to program duration",
    ],
    icon: CheckCircle2,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Application Requirements",
    items: [
      "Completed application form",
      "Resume/CV (max 2 pages)",
      "Cover letter (150-250 words)",
      "2 professional references",
      "Essay on learning goals (500 words)",
      "Proof of enrollment",
      "Contact hospital directly if needed",
    ],
    icon: Upload,
    color: "from-purple-500 to-pink-500",
  },
];

const steps = [
  {
    step: 1,
    title: "Complete Your Profile",
    description: "Fill out all required information accurately",
  },
  {
    step: 2,
    title: "Upload Documents",
    description: "Submit required documents in PDF format",
  },
  {
    step: 3,
    title: "Browse Programs",
    description: "Use Eligibility Checker to find matching programs",
  },
  {
    step: 4,
    title: "Submit Application",
    description: "Review and submit application to hospital",
  },
  {
    step: 5,
    title: "Track Status",
    description: "Monitor application progress in real-time",
  },
  {
    step: 6,
    title: "Get Feedback",
    description: "Receive acceptance, waitlist, or feedback",
  },
];

export function StudentGuidelines() {
  return (
    <section className="py-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Getting Started on Electivio
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Guidelines to help you prepare a strong application for observership and elective programs
            </p>
          </div>
        </ScrollReveal>

        {/* Guidelines Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <StaggerGroup staggerDelay={0.12} initialDelay={0.1}>
            {guidelines.map((guideline) => {
              const Icon = guideline.icon;
              return (
                <StaggerItem key={guideline.title}>
                  <ScrollReveal direction={guideline.title === "Eligibility Criteria" ? "down" : "up"} delay={0}>
                    <motion.div className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-white/20 transition-all duration-300">
                      <div className={`absolute inset-0 bg-linear-to-br ${guideline.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />

                      <div className="relative z-10">
                        <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${guideline.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-6">{guideline.title}</h3>

                        <ul className="space-y-3">
                          {guideline.items.map((item, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              viewport={{ once: true }}
                              className="flex items-start gap-3 text-slate-300"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                              <span>{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>

        {/* Application Process Steps */}
        <ScrollReveal direction="up">
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8">Application Process</h3>
            <div className="relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/30 via-indigo-500/30 to-cyan-500/30" />

              <div className="grid md:grid-cols-6 gap-4 relative z-10">
                <StaggerGroup staggerDelay={0.1} initialDelay={0.2}>
                  {steps.map((item) => (
                    <StaggerItem key={item.step}>
                      <motion.div className="relative">
                        {/* Number circle */}
                        <motion.div
                          className="w-16 h-16 rounded-full bg-linear-to-br from-cyan-500 to-indigo-600 border-4 border-slate-950 flex items-center justify-center mx-auto mb-4 shadow-lg"
                          whileHover={{ scale: 1.1 }}
                        >
                          <span className="text-white font-bold text-lg">{item.step}</span>
                        </motion.div>

                        {/* Content */}
                        <div className="text-center">
                          <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                          <p className="text-sm text-slate-400">{item.description}</p>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Important Notes */}
        <ScrollReveal direction="up">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-xl p-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-amber-100 mb-2">Important Notes</h4>
                <ul className="space-y-2 text-amber-100/80 text-sm">
                  <li>• All documents must be in English or officially translated</li>
                  <li>• Submit applications at least 4-6 weeks before program start date</li>
                  <li>• Hospital response times vary (typically 2-4 weeks)</li>
                  <li>• You can apply to multiple programs simultaneously</li>
                  <li>• Update your profile with any new qualifications or certifications</li>
                  <li>• Contact the hospital directly for clarification on requirements</li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
