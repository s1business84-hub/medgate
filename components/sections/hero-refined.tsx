"use client"

import { motion } from "framer-motion"
import { CheckCircle, Users, Award, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { RevealText } from "@/components/ui/reveal-text"
import { MagneticHover } from "@/components/ui/magnetic-hover"
import Reveal from "@/components/Reveal"
import { PageTransition } from "@/components/ui/page-transition"
import { Phone3D } from "../3d-phone"

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

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [targetUrl, setTargetUrl] = useState<string>("")

  const handleNavigate = (e: React.MouseEvent, url: string) => {
    e.preventDefault()
    setTargetUrl(url)
    setIsTransitioning(true)
  }

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
      {/* Page transition */}
      <PageTransition 
        isOpen={isTransitioning} 
        onComplete={() => setIsTransitioning(false)}
        targetUrl={targetUrl}
      />

      {/* Liquid glass gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-900/60 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(14,165,233,0.18),transparent_45%),radial-gradient(circle_at_80%_25%,rgba(99,102,241,0.18),transparent_40%),radial-gradient(circle_at_55%_80%,rgba(236,72,153,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="mx-auto max-w-2xl">
            {/* Minimal badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
                stagger={0.02}
              >
                Medical Training
              </RevealText>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  <AnimatedGradientText>Simplified</AnimatedGradientText>
                </h1>
              </motion.div>
            </div>

            {/* Subtitle */}
            <Reveal delay={0.4} y={20}>
              <p className="mt-6 text-lg sm:text-xl leading-8 text-slate-400 max-w-xl">
                Centralized platform for medical observerships and electives.
                <br className="hidden sm:block" />
                Structured workflows. Transparent requirements.
              </p>
            </Reveal>

            {/* CTA Buttons */}
            <Reveal delay={0.7} y={30}>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <MagneticHover>
                  <button 
                    onClick={(e) => handleNavigate(e, "/programs")}
                    className="group relative inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-semibold text-base hover:bg-slate-100 transition-all duration-500 shadow-lg hover:shadow-2xl hover:scale-105"
                  >
                    <span>Browse Programs</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </MagneticHover>
                
                <MagneticHover>
                  <Link href="/purpose">
                    <button className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-semibold text-base border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all duration-500 hover:scale-105">
                      Our Purpose
                    </button>
                  </Link>
                </MagneticHover>
              </div>
            </Reveal>
          </div>

          {/* Right Column - 3D Phone */}
          <Reveal delay={0.3} y={40}>
            <div className="flex justify-center lg:justify-end">
              <Phone3D />
            </div>
          </Reveal>
        </div>

        {/* Stats section below */}
        <div className="hero-stats mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="hero-stat group relative"
              whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
            >
              <div className="relative rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 hover:border-slate-700 transition-all duration-500 hover:shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                    <stat.icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
