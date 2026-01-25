"use client"

import { motion } from "framer-motion"
import {
  Search,
  FileCheck,
  Clock,
  Heart,
  Zap
} from "lucide-react"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"

const features = [
  {
    name: "Structured Program Listings",
    description: "Designed to present observership and elective programs with clearly defined eligibility criteria, documentation requirements, duration, and intake limits set by participating institutions.",
    icon: Search,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Eligibility & Requirement Transparency",
    description: "Built to reduce back and forth communication by allowing hospitals to publish clear eligibility standards and students to understand requirements upfront.",
    icon: FileCheck,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    name: "Application Workflow Management",
    description: "Planned tools to support structured application submission, review stages, and status visibility aligned with institutional processes.",
    icon: Clock,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Institution-First Design",
    description: "Developed with hospital administrators in mind, prioritizing control, clarity, and governance over program intake and applicant review.",
    icon: Heart,
    gradient: "from-indigo-500 to-purple-500",
  },
]

export function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden text-slate-50">
      {/* Animated Background Elements with parallax drift */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full mix-blend-screen blur-3xl opacity-60 -z-10 animate-float" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-screen blur-3xl opacity-60 -z-10 animate-[float_3.8s_ease-in-out_infinite_1.2s]" />
      <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-cyan-300/20 rounded-full mix-blend-screen blur-3xl opacity-60 -z-10 animate-[float_4.4s_ease-in-out_infinite_2.1s]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-2 mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-6 h-6 text-amber-400" />
            </motion.div>
            <span className="text-sm font-semibold text-blue-200 uppercase tracking-wider">Powerful Features</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
          >
            What We&apos;re <br />
            <AnimatedGradientText>Building</AnimatedGradientText>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="mt-6 text-lg leading-8 text-slate-200"
          >
            Developing a comprehensive platform to support observership and elective program management.
          </motion.p>
        </div>

        <motion.div
          className="mx-auto mt-16 max-w-7xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.name}
                  variants={itemVariants}
                  className="group"
                  transition={{ delay: 0.08 * idx }}
                >
                  <motion.div
                    className="relative h-full overflow-hidden rounded-2xl bg-white/5 p-8 shadow-xl border border-white/10 backdrop-blur-lg"
                    whileHover={{
                      y: -8,
                      boxShadow: "0 25px 50px rgba(0,0,0,0.35)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Animated gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                    />

                    {/* Animated accent line */}
                    <motion.div
                      className={`absolute top-0 left-0 h-1 bg-linear-to-r ${feature.gradient}`}
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.4 }}
                    />

                    {/* Icon Container */}
                    <motion.div
                      className="relative mb-6 inline-block"
                      whileHover={{ scale: 1.15, rotate: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 14 }}
                    >
                      <div className={`inline-flex rounded-xl bg-linear-to-br ${feature.gradient} p-3 shadow-lg group-hover:shadow-2xl transition-all duration-300`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      {/* Glow effect */}
                      <div
                        className={`absolute inset-0 rounded-xl bg-linear-to-br ${feature.gradient} opacity-0 blur group-hover:opacity-40 transition-opacity duration-300`}
                      />
                    </motion.div>

                    {/* Content */}
                    <motion.h3
                      className="relative text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r transition-all duration-300"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${"var(--color)"})`,
                      }}
                    >
                      {feature.name}
                    </motion.h3>
                    <motion.p className="relative text-slate-200 group-hover:text-slate-100 transition-colors leading-relaxed">
                      {feature.description}
                    </motion.p>

                    {/* Bottom accent */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-blue-400 to-transparent"
                      initial={{ opacity: 0, scaleX: 0 }}
                      whileHover={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
