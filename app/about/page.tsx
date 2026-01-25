"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Award, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.15),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.12),transparent_35%),radial-gradient(circle_at_40%_80%,rgba(139,92,246,0.13),transparent_38%),linear-gradient(180deg,#0a0e1a_0%,#0f172a_50%,#0a0e1a_100%)]" />
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-50"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute top-10 left-10 w-56 h-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-10 right-8 w-64 h-64 rounded-full bg-purple-500/15 blur-3xl" />
      </motion.div>
      
      <div className="relative max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
        >
          <Link href="/" className="flex items-center text-indigo-300 hover:text-indigo-200 transition-colors group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm" className="border-white/15 text-slate-100 hover:bg-white/10">
              Login / Sign Up
            </Button>
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
            <AnimatedGradientText>About Electivio</AnimatedGradientText>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Electivio is being developed to connect medical students with structured clinical observership and elective opportunities across the UAE. The platform focuses on improving transparency, standardization, and communication between students and healthcare institutions.
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-100 mb-8 text-center">
            <AnimatedGradientText>Our Story</AnimatedGradientText>
          </h2>
          <div className="relative rounded-2xl shadow-lg overflow-hidden group backdrop-blur-xl bg-white/5 border border-white/10 hover:shadow-2xl transition-all duration-300 p-8 md:p-12">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-cyan-400/10 via-transparent to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Liquid glass shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
              <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-linear-to-br from-white to-transparent rounded-full blur-xl" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                Electivio is an early-stage platform being developed to address long-standing challenges in accessing and managing medical observership and elective programs.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                Today, students often encounter fragmented information, unclear eligibility criteria, and slow, manual communication when seeking clinical exposure. At the same time, healthcare institutions lack standardized tools to publish requirements and manage applicant workflows efficiently.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                Electivio aims to standardize how institutions define and publish program requirements, and how students discover and engage with them—creating a clearer, more transparent process for both sides. The platform is currently preparing for pilot collaborations with healthcare institutions in the UAE.
              </p>
            </div>
          </div>
        </motion.section>

        {/* What We Do */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: "easeOut", delay: 0.05 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
              <AnimatedGradientText>What We Do</AnimatedGradientText>
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Three core areas that guide our development
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Standardize Program Information',
                description: 'We are building tools to help institutions clearly define eligibility criteria, documentation requirements, and intake limits for observership and elective programs.',
                gradient: 'from-blue-500 to-cyan-500',
                bgGradient: 'from-cyan-400/20 to-cyan-400/10',
                number: '01'
              },
              {
                icon: Target,
                title: 'Reduce Administrative Friction',
                description: 'Electivio is designed to reduce repetitive back-and-forth by centralizing program information and application workflows.',
                gradient: 'from-purple-500 to-pink-500',
                bgGradient: 'from-fuchsia-400/20 to-pink-400/10',
                number: '02'
              },
              {
                icon: Award,
                title: 'Support Institutional Governance',
                description: 'The platform prioritizes institutional control, allowing hospitals to manage programs in line with their internal policies and capacity.',
                gradient: 'from-indigo-500 to-blue-500',
                bgGradient: 'from-indigo-400/20 to-blue-400/10',
                number: '03'
              }
            ].map((item, index) => (
              <motion.div 
                key={item.title} 
                className="group relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 p-8"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Animated gradient overlay */}
                <div className={`absolute inset-0 bg-linear-to-br ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Liquid glass shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                  <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-linear-to-br from-white to-transparent rounded-full blur-xl" />
                </div>

                {/* Number badge */}
                <div className="absolute top-6 right-6 text-5xl font-bold text-slate-700 group-hover:text-slate-600 transition-colors">
                  {item.number}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon Container */}
                  <div className="mb-6 inline-block">
                    <div className={`p-4 rounded-xl bg-linear-to-br ${item.gradient} shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-slate-100 mb-3">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-300 group-hover:text-slate-200 transition-colors leading-relaxed">
                    {item.description}
                  </p>

                  {/* Accent line */}
                  <div className={`mt-6 h-1 bg-linear-to-r ${item.gradient} rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                </div>

                {/* Floating elements for visual interest */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '0.5s' }} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.08 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-100 mb-12">
            <AnimatedGradientText>Our Founders</AnimatedGradientText>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <motion.div className="rounded-2xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-300" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
              <div className="w-12 h-12 rounded-full bg-linear-to-r from-cyan-500 to-indigo-600 mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg">KD</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">Kashish Devnani</h3>
              <p className="text-slate-300">Founder & Program Director</p>
              <p className="text-sm text-slate-400 mt-3">Leads Electivio&apos;s platform direction and institutional collaboration strategy, working closely with healthcare institutions to translate program requirements into structured, transparent workflows within the platform.</p>
            </motion.div>
            
            <motion.div className="rounded-2xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-300" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }} viewport={{ once: true }}>
              <div className="w-12 h-12 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg">SN</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">Sanskaar Nair</h3>
              <p className="text-slate-300">Co-Founder & Lead Engineer</p>
              <p className="text-sm text-slate-400 mt-3">Architects and engineers the Electivio platform, overseeing system design, backend infrastructure, and application workflows that support institutional onboarding and secure applicant management.</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-slate-100 mb-4">
            <AnimatedGradientText>Ready to Start Your Journey?</AnimatedGradientText>
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Explore structured observership and elective opportunities and stay informed as Electivio prepares for pilot collaborations across the UAE.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/programs">
              <Button size="lg" className="bg-linear-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-transform duration-300 hover:-translate-y-0.5">
                Browse Programs
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-white/15 text-slate-100 hover:bg-white/10 hover:-translate-y-0.5 transition-transform duration-300">
                Create Account
              </Button>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}