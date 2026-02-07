"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  Heart,
  X,
  Zap
} from "lucide-react"

const footerLinks = {
  product: [
    { name: "Student Portal", href: "/student" },
    { name: "For Hospitals", href: "/for-hospitals" },
  ],
  company: [
    { name: "About", href: "/about" },
  ],
  support: [
    { name: "Legal Disclaimer & Terms", href: "/legal" },
  ],
}

export function Footer() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [openModal, setOpenModal] = useState<"purpose" | "programs" | null>(null)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes("@")) {
      setStatus("error")
      setMessage("Please enter a valid email address")
      return
    }

    setStatus("loading")
    
    try {
      const response = await fetch("/api/subscribe-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message)
        setEmail("")
      } else {
        setStatus("error")
        setMessage(data.error || "Something went wrong")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Failed to subscribe. Please try again.")
    }
  }

  return (
    <footer className="relative text-white overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-slate-950/70 backdrop-blur-xl" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.22),transparent_32%),radial-gradient(circle_at_30%_70%,rgba(79,70,229,0.22),transparent_30%)]" />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-cyan-500 to-indigo-500">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">Electivio</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Connecting medical students with clinical training opportunities
              across the UAE. Building the future of medical education.
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]" />
                helloelectivio@gmail.com
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]" />
                +971 54 453 0209 (Founder)
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]" />
                Dubai, UAE
              </div>
            </div>
          </motion.div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-semibold text-cyan-300 mb-4 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Product</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-cyan-300 transition-colors duration-200 hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => setOpenModal("programs")}
                    className="text-sm text-slate-400 hover:text-cyan-300 transition-colors duration-200 hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] text-left"
                  >
                    Browse Programs
                  </button>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-semibold text-indigo-300 mb-4 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-indigo-300 transition-colors duration-200 hover:drop-shadow-[0_0_6px_rgba(129,140,248,0.4)]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => setOpenModal("purpose")}
                    className="text-sm text-slate-400 hover:text-indigo-300 transition-colors duration-200 hover:drop-shadow-[0_0_6px_rgba(129,140,248,0.4)] text-left"
                  >
                    Our Purpose
                  </button>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-semibold text-purple-300 mb-4 drop-shadow-[0_0_8px_rgba(192,132,250,0.5)]">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-purple-300 transition-colors duration-200 hover:drop-shadow-[0_0_6px_rgba(192,132,250,0.4)]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Newsletter & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h3 className="text-sm font-semibold text-cyan-300 mb-4 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-4">
              Get the latest updates on new programs and features.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={status === "loading" || status === "success"}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="w-full bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)] hover:drop-shadow-[0_0_16px_rgba(34,211,238,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed ✓" : "Subscribe"}
              </button>
              {message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-xs ${
                    status === "success" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {message}
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-slate-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400 drop-shadow-[0_0_6px_rgba(148,163,184,0.2)]">
              © 2025 Electivio. All rights reserved.
            </p>
            <p className="text-sm text-slate-400 mt-2 md:mt-0 flex items-center drop-shadow-[0_0_6px_rgba(239,68,68,0.3)]">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" /> in Dubai
            </p>
          </div>
        </motion.div>
      </div>

      {/* Purpose Modal */}
      <AnimatePresence>
        {openModal === "purpose" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenModal(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl border border-white/10 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Our Purpose</h2>
                <button
                  onClick={() => setOpenModal(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6 text-slate-300">
                <div>
                  <p className="text-lg leading-relaxed">
                    Electivio exists to <span className="text-cyan-400 font-semibold">simplify and standardize</span> access to medical observerships and elective programs across the UAE.
                  </p>
                </div>

                <div className="pl-4 border-l-2 border-cyan-400">
                  <p className="text-base leading-relaxed">
                    Today, medical students often face <span className="text-slate-200 font-medium">fragmented information</span>, unclear eligibility criteria, and slow, manual communication when seeking clinical exposure. At the same time, healthcare institutions lack a structured, policy-aligned way to publish programs and manage applications efficiently.
                  </p>
                </div>

                <div className="pl-4 border-l-2 border-indigo-400">
                  <p className="text-base leading-relaxed">
                    Electivio bridges this gap by providing a <span className="text-slate-200 font-medium">centralized platform</span> where institutions define requirements clearly and students understand opportunities upfront—reducing administrative friction for both sides.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-linear-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20">
                  <p className="text-cyan-300 leading-relaxed font-medium text-center">
                    💡 Our purpose is not to replace institutional processes, but to <span className="text-cyan-200 font-bold">support them</span> through clarity, structure, and transparency.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">What We Are Building</h3>
                  <p className="text-base mb-4">
                    Electivio is being developed as a program management and discovery platform designed around real institutional workflows and student needs. We focus on three core areas:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                      <h4 className="text-lg font-bold text-cyan-400 mb-2">1. Program Standardization</h4>
                      <p className="text-sm">
                        We help hospitals and clinics publish observership and elective programs with clearly defined eligibility criteria, documentation requirements, duration, and intake limits—set entirely by the institution.
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                      <h4 className="text-lg font-bold text-indigo-400 mb-2">2. Administrative Efficiency</h4>
                      <p className="text-sm">
                        By centralizing program information and application workflows, Electivio reduces repetitive back and forth communication and improves visibility for students and administrators alike.
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                      <h4 className="text-lg font-bold text-emerald-400 mb-2">3. Institutional Control & Governance</h4>
                      <p className="text-sm">
                        Electivio is built institution-first. Hospitals retain full control over program approvals, intake capacity, and internal policies while benefiting from a structured digital interface.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-linear-to-br from-emerald-500/10 to-indigo-500/10 border border-white/10 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Our Focus Today</h3>
                  <p className="text-base mb-4">
                    Electivio is currently in early development and preparing for pilot collaborations with healthcare institutions across the UAE. Our immediate focus is to:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Zap className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                      <span className="text-sm">Launch pilot programs with select institutions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Zap className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                      <span className="text-sm">Validate workflows with real users</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Zap className="w-4 h-4 text-indigo-400 mt-1 flex-shrink-0" />
                      <span className="text-sm">Refine eligibility logic and application processes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Programs Modal */}
      <AnimatePresence>
        {openModal === "programs" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenModal(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl border border-white/10 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Browse Programs</h2>
                <button
                  onClick={() => setOpenModal(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6 text-slate-300">
                <div>
                  <h3 className="text-xl font-bold text-cyan-300 mb-3">Explore Clinical Opportunities</h3>
                  <p className="text-base leading-relaxed mb-6">
                    Discover structured observership and elective opportunities across the UAE. Browse programs that match your interests and eligibility, with clear requirements and transparent timelines.
                  </p>
                  <p className="text-base text-slate-400 mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <strong className="text-amber-200">Prototype Listings:</strong> The programs shown are example listings for demonstration purposes only. Final observership and elective programs will be published by participating institutions during pilot onboarding.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white">Program Scope</h4>
                  <p className="text-base leading-relaxed">
                    Electivio supports formal, institution-approved observership and elective programs only. Internships, residency, and fellowship placements are not offered or facilitated through the platform.
                  </p>
                </div>

                <div className="bg-linear-to-br from-cyan-500/10 to-blue-500/10 border border-white/10 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-cyan-300 mb-3">What You'll Find</h3>
                  <ul className="space-y-3 text-base">
                    <li className="flex items-start gap-3">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>Clear eligibility criteria for each program</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>Documentation requirements and deadlines</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>Program duration and intake information</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>Direct application process</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>Hospital location and contact details</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/programs"
                  onClick={() => setOpenModal(null)}
                  className="inline-block w-full text-center bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                >
                  View All Programs →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}
