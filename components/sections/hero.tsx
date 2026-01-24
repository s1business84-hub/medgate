"use client"

import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Users, Award } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { HeroOrb } from "@/components/hero-orb"

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
    <section className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-700 mask-[linear-gradient(0deg,rgba(0,0,0,0.4),rgba(255,255,255,0.05))] -z-10" />
      <div className="absolute top-0 right-0 -z-10">
        <div className="h-96 w-96 rounded-full bg-linear-to-br from-blue-500 to-indigo-500 opacity-20 blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 -z-10">
        <div className="h-96 w-96 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 opacity-15 blur-3xl" />
      </div>

      {/* 3D Spline Orb with Electivio Branding */}
      <div className="relative w-full">
        <HeroOrb />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge removed as per pilot copy guidance */}

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-tight"
          >
            A Centralized Platform for
            <br />
            <span className="block">
              <AnimatedGradientText>Medical&nbsp;Observerships</AnimatedGradientText>
            </span>
            <span className="block">
              <AnimatedGradientText>and&nbsp;Electives</AnimatedGradientText>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl leading-7 sm:leading-8 text-blue-100 max-w-2xl mx-auto px-4"
          >
            Electivio is being developed to help hospitals and medical students manage formal observership and elective programs through structured eligibility criteria, transparent requirements, and standardized workflows.
          </motion.p>

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

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link href="/programs">
              <Button size="lg" className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 text-base px-6 py-3">
                Browse Programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 text-base px-6 py-3">
                For Trainees
              </Button>
            </Link>
            <Link href="/for-hospitals">
              <Button size="lg" className="w-full sm:w-auto bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 text-base px-6 py-3">
                For Hospitals
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 text-base px-6 py-3">
                Join Us!
              </Button>
            </Link>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
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