"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  Heart
} from "lucide-react"

const footerLinks = {
  product: [
    { name: "Browse Programs", href: "/programs" },
    { name: "Student Portal", href: "/student" },
    { name: "For Hospitals", href: "/for-hospitals" },
  ],
  company: [
    { name: "About", href: "/#about" },
    { name: "Our Purpose", href: "/purpose" },
  ],
  support: [
    { name: "Legal Disclaimer & Terms", href: "/legal" },
  ],
}

export function Footer() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

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
                electivio.app@gmail.com
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
                    status === "success" ? "text-cyan-300" : "text-red-400"
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
    </footer>
  )
}
