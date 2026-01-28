"use client"

import { motion } from "framer-motion"
import { CheckCircle, Users, Award, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { RevealText } from "@/components/ui/reveal-text"
import { MagneticHover } from "@/components/ui/magnetic-hover"
import Reveal from "@/components/Reveal"
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
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !heroRef.current) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-stat",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".hero-stats",
            start: "top 80%",
          },
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
      {/* Refined background with subtle gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.08),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.06),transparent_35%)]" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-900/50 to-slate-950" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Minimal badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-900/50 border border-slate-800 rounded-full px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Pilot Phase • Early Development
            </span>
          </motion.div>

          {/* Main headline with reveal animation */}
          <div className="mb-6">
            <RevealText 
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white leading-[1.1]"
              stagger={0.02}
            >
              Medical Training
            </RevealText>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1]">
                <AnimatedGradientText>Simplified</AnimatedGradientText>
              </h1>
            </motion.div>
          </div>

          {/* Subtitle */}
          <Reveal delay={0.4} y={20}>
            <p className="mt-6 text-lg sm:text-xl leading-8 text-slate-400 max-w-2xl mx-auto">
              Centralized platform for medical observerships and electives.
              <br className="hidden sm:block" />
              Structured workflows. Transparent requirements.
            </p>
          </Reveal>

          {/* CTA Buttons */}
          <Reveal delay={0.5} y={20}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticHover>
                <Link href="/programs">
                  <button className="group relative inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-semibold text-base hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <span>Browse Programs</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </MagneticHover>
              
              <MagneticHover>
                <Link href="/purpose">
                  <button className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-semibold text-base border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all duration-300">
                    Our Purpose
                  </button>
                </Link>
              </MagneticHover>
            </div>
          </Reveal>

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

        {/* Stats with Flow Design Agency hover effects */}
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
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 + index * 0.1 }}
                className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md p-6 sm:p-8 shadow-lg ring-1 ring-white/20 hover:bg-white/15 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 cursor-pointer group"
              >
                <div className="flex items-center">
                  <motion.div 
                    className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-linear-to-r from-blue-400 to-indigo-400 shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </motion.div>
                  <div className="ml-3 sm:ml-4">
                    <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-blue-200 transition-colors">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-blue-200 group-hover:text-blue-100 transition-colors">{stat.label}</div>
                  </div>
                </div>
                <motion.div 
                  className="absolute -right-2 -top-2 sm:-right-4 sm:-top-4 h-16 w-16 sm:h-24 sm:w-24 rounded-full bg-linear-to-br from-blue-400 to-indigo-400"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}