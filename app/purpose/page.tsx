"use client";

import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PurposePage() {
  const [activeCard, setActiveCard] = useState<"students" | "hospitals">("students");

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <LiquidParallax />
      
      {/* Animated gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-r from-cyan-600/0 via-indigo-600/10 to-emerald-600/0 animate-pulse" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_2s]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <Link href="/" className="inline-flex items-center px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10 transition-all hover:translate-x-1">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-8">
            Our <AnimatedGradientText className="text-5xl md:text-7xl font-bold">Purpose</AnimatedGradientText>
          </h1>
        </div>

        {/* Our Purpose Section */}
        <section className="mb-24 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="group relative bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-8 md:p-12 mb-12 overflow-hidden hover:border-cyan-400/30 transition-all duration-500"
          >
            {/* Animated gradient background */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute inset-0 bg-linear-to-br from-cyan-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
            />
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-20 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  y: [0, 30, 0],
                  x: [0, -15, 0],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 left-20 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl"
              />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <div className="inline-flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 bg-linear-to-br from-cyan-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-cyan-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                    Our Purpose
                  </h2>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="text-lg md:text-xl text-slate-200 leading-relaxed font-medium"
                >
                  MedGate exists to <span className="text-cyan-300 font-semibold">simplify and standardize</span> access to medical observerships and elective programs across the UAE.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="pl-4 border-l-2 border-cyan-400/50"
                >
                  <p className="text-lg text-slate-300 leading-relaxed">
                    Today, medical students often face <span className="text-slate-200 font-medium">fragmented information</span>, unclear eligibility criteria, and slow, manual communication when seeking clinical exposure. At the same time, healthcare institutions lack a structured, policy-aligned way to publish programs and manage applications efficiently.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  viewport={{ once: true }}
                  className="pl-4 border-l-2 border-indigo-400/50"
                >
                  <p className="text-lg text-slate-300 leading-relaxed">
                    MedGate bridges this gap by providing a <span className="text-slate-200 font-medium">centralized platform</span> where institutions define requirements clearly and students understand opportunities upfront—reducing administrative friction for both sides.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="mt-8 p-6 rounded-2xl bg-linear-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-400/20"
                >
                  <p className="text-lg text-cyan-100 leading-relaxed font-medium text-center">
                    💡 Our purpose is not to replace institutional processes, but to <span className="text-cyan-300 font-bold">support them</span> through clarity, structure, and transparency.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* What We Are Building Section */}
        <section className="mb-24 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-3xl font-bold text-slate-100 mb-4">What We Are Building</h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-12">
            MedGate is being developed as a program management and discovery platform designed around real institutional workflows and student needs. We focus on three core areas:
          </p>
          
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl p-8 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-2xl font-bold text-cyan-300 mb-3">1. Program Standardization</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                We help hospitals and clinics publish observership and elective programs with clearly defined eligibility criteria, documentation requirements, duration, and intake limits—set entirely by the institution.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl p-8 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-2xl font-bold text-indigo-300 mb-3">2. Administrative Efficiency</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                By centralizing program information and application workflows, MedGate reduces repetitive back and forth communication and improves visibility for students and administrators alike.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl p-8 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-2xl font-bold text-emerald-300 mb-3">3. Institutional Control & Governance</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                MedGate is built institution-first. Hospitals retain full control over program approvals, intake capacity, and internal policies while benefiting from a structured digital interface.
              </p>
            </div>
          </div>
        </section>
        {/* Our Focus Today Section */}
        <section className="mb-24 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="bg-linear-to-br from-cyan-600/20 to-indigo-600/20 border border-cyan-500/30 rounded-3xl backdrop-blur-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-slate-100 mb-6">Our Focus Today</h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              MedGate is currently in early development and preparing for pilot collaborations with healthcare institutions across the UAE.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed mb-6">Our immediate focus is to:</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/30 mr-3 mt-1 shrink-0">
                  <Zap className="w-4 h-4 text-cyan-300" />
                </span>
                <span className="text-lg text-slate-300">Launch pilot programs with select institutions</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/30 mr-3 mt-1 shrink-0">
                  <Zap className="w-4 h-4 text-indigo-300" />
                </span>
                <span className="text-lg text-slate-300">Validate workflows with real users</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/30 mr-3 mt-1 shrink-0">
                  <Zap className="w-4 h-4 text-emerald-300" />
                </span>
                <span className="text-lg text-slate-300">Refine eligibility logic and application processes</span>
              </li>
            </ul>
            <p className="text-lg text-slate-300 leading-relaxed">
              This phased approach ensures the platform is aligned with institutional standards and regulatory expectations from the start.
            </p>
          </div>
        </section>

        {/* Looking Ahead Section */}
        <section className="mb-24 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-slate-100 mb-6">Looking Ahead</h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              As the platform evolves, MedGate aims to expand coverage across all UAE emirates and continue improving how clinical training opportunities are accessed and managed—without compromising institutional autonomy or academic standards.
            </p>
          </div>
        </section>

        {/* Swappable Apple-Style CTA Cards */}
        <section className="mb-24 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-100 mb-6">
              Join <AnimatedGradientText>MedGate</AnimatedGradientText>
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Whether you are a medical student seeking structured clinical exposure or a healthcare institution looking to streamline program management, MedGate is being built with you in mind.
            </p>

            {/* Toggle Buttons */}
            <div className="flex justify-center gap-3 mb-8">
              <button
                onClick={() => setActiveCard("students")}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  activeCard === "students"
                    ? "bg-linear-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
                    : "bg-white/10 text-slate-300 hover:bg-white/15"
                }`}
              >
                For Students
              </button>
              <button
                onClick={() => setActiveCard("hospitals")}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  activeCard === "hospitals"
                    ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "bg-white/10 text-slate-300 hover:bg-white/15"
                }`}
              >
                For Hospitals
              </button>
            </div>
          </div>

          {/* Swappable Card Container */}
          <div className="relative h-80 md:h-72">
            <AnimatePresence mode="wait">
              {activeCard === "students" ? (
                <motion.div
                  key="students"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-linear-to-br from-cyan-600/30 to-blue-600/30 border border-cyan-500/50 rounded-3xl backdrop-blur-xl p-8 md:p-12 shadow-2xl overflow-hidden group"
                >
                  <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold text-white mb-6">Browse Programs</h3>
                    <p className="text-lg text-cyan-100 leading-relaxed mb-8">
                      Discover structured observership and elective opportunities across the UAE. Explore programs that match your interests and eligibility, with clear requirements and transparent timelines.
                    </p>
                    <Link href="/programs">
                      <Button size="lg" className="bg-white text-cyan-600 hover:bg-cyan-50 font-semibold shadow-lg hover:shadow-xl">
                        Explore Programs
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="hospitals"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-linear-to-br from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 rounded-3xl backdrop-blur-xl p-8 md:p-12 shadow-2xl overflow-hidden group"
                >
                  <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold text-white mb-6">For Hospitals</h3>
                    <p className="text-lg text-emerald-100 leading-relaxed mb-8">
                      Streamline your observership and elective program management. Publish clear eligibility criteria, manage applications efficiently, and connect with qualified students—all while maintaining institutional control.
                    </p>
                    <Link href="/for-hospitals">
                      <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold shadow-lg hover:shadow-xl">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
