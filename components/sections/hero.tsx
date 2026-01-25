"use client"

import { motion } from "framer-motion"
import { CheckCircle, Users, Award } from "lucide-react"
import Link from "next/link"

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import Reveal from "@/components/Reveal"
import NavigationMenu from "@/components/NavigationMenu"
import MagneticButton from "@/components/MagneticButton"
const stats = [
  {
    label: "Infrastructure",
    value: "Hospital Ready",
    icon: Users,
  },
  {
    label: "UAE",
    value: "Target Coverage",
    icon: Award,
  },
  {
    label: "Active",
    value: "Development Phase",
    icon: CheckCircle,
  },
]

const features = [
  "Streamlined application workflows (planned)",
  "Application status dashboard (planned)",
  "Institution onboarding workflows (in development)",
  "Eligibility criteria logic (in development)",
]

export function Hero() {
  return (
    <section className="relative overflow-visible bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-700 mask-[linear-gradient(0deg,rgba(0,0,0,0.4),rgba(255,255,255,0.05))] -z-10" />
      <div className="absolute top-0 right-0 -z-10">
        <div className="h-96 w-96 rounded-full bg-linear-to-br from-blue-500 to-indigo-500 opacity-20 blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 -z-10">
        <div className="h-96 w-96 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 opacity-15 blur-3xl" />
      </div>

      {/* 3D Spline Orb with Electivio Branding */}
      {/* Removed */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Animated Electivio Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 sm:mb-12"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold">
              <AnimatedGradientText>Electivio</AnimatedGradientText>
            </h1>
          </motion.div>

          {/* Headline */}
          <Reveal delay={0.1} y={20}>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-tight">
              A Centralized Platform for
              <br />
              <span className="block">
                <AnimatedGradientText>Medical&nbsp;Observerships</AnimatedGradientText>
              </span>
              <span className="block">
                <AnimatedGradientText>and&nbsp;Electives</AnimatedGradientText>
              </span>
            </h1>
          </Reveal>

          {/* Subheadline */}
          <Reveal delay={0.2} y={30} className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl leading-7 sm:leading-8 text-blue-100 max-w-2xl mx-auto px-4">
            Electivio is being developed to help hospitals and medical students manage formal observership and elective programs through structured eligibility criteria, transparent requirements, and standardized workflows.
          </Reveal>

          {/* Why Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.23 }}
            viewport={{ once: true }}
            className="mt-4 flex justify-center"
          >
            <Link href="/purpose">
              <button className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Why? Learn Our Purpose →
              </button>
            </Link>
          </motion.div>

          {/* Pilot Phase Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            viewport={{ once: true }}
            className="mt-4 sm:mt-5 px-4 inline-block"
          >
            <span className="text-xs sm:text-sm text-blue-200/80 bg-blue-500/10 border border-blue-400/30 rounded-full px-3 py-1 inline-block">
              🔄 Pilot Phase: Platform in early development
            </span>
          </motion.div>

          {/* Primary CTA Buttons + Navigation Menu */}
          <div className="mt-8 sm:mt-10 space-y-6 sm:space-y-0">
            {/* Top Row: Main CTAs (Continue to left of For Hospitals) */}
            <Reveal delay={0.3} y={30} className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
              {/* Continue to menu placed first; For Hospitals available inside menu */}
              <NavigationMenu />

              <Link href="/login">
                <MagneticButton className="w-full sm:w-auto border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 text-base px-6 py-3 rounded-lg bg-white text-slate-900 font-medium">
                  Join Us!
                </MagneticButton>
              </Link>
            </Reveal>
          </div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm text-slate-600"
          >
            {features.map((feature) => (
              <div key={feature} className="flex items-center justify-center sm:justify-start">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500 shrink-0" />
                <span className="text-center sm:text-left">{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="mx-auto mt-16 sm:mt-20 max-w-7xl px-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 + index * 0.1 }}
                className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md p-6 sm:p-8 shadow-lg ring-1 ring-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-linear-to-r from-blue-400 to-indigo-400 shadow-lg">
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-blue-200">{stat.label}</div>
                  </div>
                </div>
                <div className="absolute -right-2 -top-2 sm:-right-4 sm:-top-4 h-16 w-16 sm:h-24 sm:w-24 rounded-full bg-linear-to-br from-blue-400 to-indigo-400 opacity-10" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}