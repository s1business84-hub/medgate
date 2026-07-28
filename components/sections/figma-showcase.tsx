"use client"

import { motion } from "framer-motion"
import { FigmaEmbed, FigmaEmbedSection } from "@/components/figma-embed"

export function FigmaShowcase() {
  return (
    <div className="space-y-12 lg:space-y-20">
      {/* Platform Overview */}
      <FigmaEmbedSection
        fileId="REPLACE_WITH_YOUR_FIGMA_FILE_ID"
        nodeId="REPLACE_WITH_PLATFORM_OVERVIEW_NODE_ID"
        title="Platform Overview"
        description="Explore the centralized dashboard for managing observerships and electives"
        height="700px"
      />

      {/* Student Portal */}
      <FigmaEmbedSection
        fileId="REPLACE_WITH_YOUR_FIGMA_FILE_ID"
        nodeId="REPLACE_WITH_STUDENT_PORTAL_NODE_ID"
        title="Student Portal Experience"
        description="Browse programs, track applications, and manage your observership journey"
        height="650px"
      />

      {/* Hospital Dashboard */}
      <FigmaEmbedSection
        fileId="REPLACE_WITH_YOUR_FIGMA_FILE_ID"
        nodeId="REPLACE_WITH_HOSPITAL_DASHBOARD_NODE_ID"
        title="Hospital Management Console"
        description="Streamlined tools for hospitals to manage applications and trainee progress"
        height="700px"
      />

      {/* Key Features Highlight */}
      <section className="relative overflow-hidden bg-linear-to-b from-slate-900 via-slate-800 to-indigo-900 py-16 sm:py-24 lg:py-32 rounded-3xl border border-white/10">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-slate-700 mask-[linear-gradient(0deg,rgba(0,0,0,0.3),rgba(255,255,255,0.05))] -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10">
          <div className="h-96 w-96 rounded-full bg-linear-to-br from-indigo-500 to-indigo-500 opacity-15 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="text-xs sm:text-sm text-indigo-200/80 bg-indigo-500/10 border border-indigo-400/30 rounded-full px-3 py-1 inline-block mb-4">
              🎯 Key Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              What's Included
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Application Management",
                description: "Streamlined workflows for submitting and tracking applications",
                icon: "📋",
              },
              {
                title: "Eligibility Criteria",
                description: "Clear, structured requirements for each observership program",
                icon: "✅",
              },
              {
                title: "Real-time Dashboard",
                description: "Live status updates and progress tracking across all programs",
                icon: "📊",
              },
              {
                title: "Hospital Integration",
                description: "Dedicated tools for hospitals to manage trainee programs",
                icon: "🏥",
              },
              {
                title: "Notification System",
                description: "Keep all stakeholders updated on important milestones",
                icon: "🔔",
              },
              {
                title: "Document Management",
                description: "Secure upload and validation of required certificates",
                icon: "📄",
              },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
