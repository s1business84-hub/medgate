"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Award, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { ScrollableViewport, ScrollSection } from "@/components/scrollable-viewport"

export default function AboutPage() {
  return (
    <ScrollableViewport
      showProgress={true}
      showNavigationDots={true}
      showArrows={true}
      snapToSections={false}
    >
      <ScrollSection id="about">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="relative min-h-screen overflow-hidden bg-slate-950">
        {/* Dark liquid glass background */}
        <LiquidParallax className="opacity-20" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,255,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.12),transparent_50%)]" />
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-30"
          animate={{ opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-10 right-8 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl" />
        </motion.div>
        
        <div className="relative max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
        >
          <Link href="/" className="flex items-center text-slate-300 hover:text-cyan-400 transition-all duration-300 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm" className="border-white/20 text-slate-300 hover:bg-white/10 hover:text-cyan-400">
              Login / Sign Up
            </Button>
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            About Electivio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            Electivio is being developed to connect medical students with structured clinical observership and elective opportunities across the UAE. The platform focuses on improving transparency, standardization, and communication between students and healthcare institutions.
          </motion.p>
        </motion.div>

        {/* Our Story */}
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-8 text-center"
          >
            Our Story
          </motion.h2>
          <div className="relative rounded-3xl shadow-xl overflow-hidden group backdrop-blur-xl bg-white/5 border border-white/10 hover:shadow-2xl transition-all duration-300 p-8 md:p-12">
            {/* Liquid glass shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-linear-to-bl from-cyan-500/20 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-linear-to-tr from-indigo-500/15 to-transparent rounded-full blur-2xl" />
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
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-white mb-4"
            >
              What We Do
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="text-lg text-slate-400 max-w-2xl mx-auto"
            >
              Three core areas that guide our development
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Standardize Program Information',
                description: 'We are building tools to help institutions clearly define eligibility criteria, documentation requirements, and intake limits for observership and elective programs.',
                gradient: 'from-cyan-400 to-cyan-500',
                number: '01'
              },
              {
                icon: Target,
                title: 'Reduce Administrative Friction',
                description: 'Electivio is designed to reduce repetitive back-and-forth by centralizing program information and application workflows.',
                gradient: 'from-indigo-400 to-indigo-500',
                number: '02'
              },
              {
                icon: Award,
                title: 'Support Institutional Governance',
                description: 'The platform prioritizes institutional control, allowing hospitals to manage programs in line with their internal policies and capacity.',
                gradient: 'from-cyan-500 to-indigo-600',
                number: '03'
              }
            ].map((item, index) => (
              <motion.div 
                key={item.title} 
                className="group relative rounded-3xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 p-8"
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: index * 0.15 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ scale: 1.02, y: -8, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
              >
                {/* Liquid glass shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 right-0 w-full h-full bg-linear-to-bl from-cyan-500/10 via-transparent to-indigo-500/5 blur-xl" />
                </div>

                {/* Number badge */}
                <div className="absolute top-6 right-6 text-5xl font-bold text-white/10 group-hover:text-white/20 transition-colors">
                  {item.number}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon Container */}
                  <div className="mb-6 inline-block">
                    <div className={`p-4 rounded-2xl bg-linear-to-br ${item.gradient} shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                    {item.description}
                  </p>

                  {/* Accent line */}
                  <div className={`mt-6 h-1 bg-linear-to-r ${item.gradient} rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                </div>
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
          <h2 className="text-4xl font-bold text-white mb-12">
            Our Founders
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <motion.div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 hover:shadow-xl hover:border-white/20 transition-all duration-300" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
              <div className="w-16 h-16 rounded-full bg-linear-to-r from-cyan-400 to-indigo-500 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">KD</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Kashish Devnani</h3>
              <p className="text-cyan-400 font-medium mb-3">Founder & Program Director</p>
              <p className="text-sm text-slate-400 leading-relaxed">Leads Electivio&apos;s platform direction and institutional collaboration strategy, working closely with healthcare institutions to translate program requirements into structured, transparent workflows within the platform.</p>
            </motion.div>
            
            <motion.div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 hover:shadow-xl hover:border-white/20 transition-all duration-300" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }} viewport={{ once: true }}>
              <div className="w-16 h-16 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">SN</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Sanskaar Nair</h3>
              <p className="text-indigo-400 font-medium mb-3">Co-Founder & Lead Engineer</p>
              <p className="text-sm text-slate-400 leading-relaxed">Architects and engineers the Electivio platform, overseeing system design, backend infrastructure, and application workflows that support institutional onboarding and secure applicant management.</p>
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
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Explore structured observership and elective opportunities and stay informed as Electivio prepares for pilot collaborations across the UAE.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/programs">
              <Button size="lg" className="bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 text-white">
                Browse Programs
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-white/20 text-slate-300 hover:bg-white/10 hover:text-cyan-400 hover:-translate-y-1 transition-transform duration-300">
                Create Account
              </Button>
            </Link>
          </div>
        </motion.section>
      </div>
      </motion.div>
      </ScrollSection>
    </ScrollableViewport>
  );
}