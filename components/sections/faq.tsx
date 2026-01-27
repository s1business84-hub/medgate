"use client"

import { motion, AnimatePresence, cubicBezier } from "framer-motion"
import { ChevronDown, MessageCircle, HelpCircle, Sparkles } from "lucide-react"
import * as React from "react"

const faqs = [
  {
    question: "Is Electivio a placement or recruitment service?",
    answer: "No. Electivio does not place students or guarantee acceptance. The platform supports observership and elective program discovery and application workflows as defined by participating institutions.",
  },
  {
    question: "What programs does Electivio support?",
    answer: "Electivio focuses on formal, institution-approved observership and elective programs.",
  },
  {
    question: "Does Electivio offer internships or residency placements?",
    answer: "No. Electivio does not provide internships, residency, or fellowship placements.",
  },
  {
    question: "Is Electivio live yet?",
    answer: "Electivio is currently in early development and preparing for pilot collaborations with healthcare institutions.",
  },
  {
    question: "Who can use Electivio?",
    answer: "Medical students and institutions participating in approved pilot programs.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: cubicBezier(0.16, 1, 0.3, 1) },
    },
  }

  const accentGradients = [
    "from-cyan-400/40 via-blue-500/30 to-indigo-500/30",
    "from-purple-400/40 via-pink-500/30 to-orange-400/30",
    "from-emerald-400/40 via-teal-400/30 to-cyan-400/30",
    "from-amber-400/40 via-orange-500/30 to-rose-400/30",
    "from-sky-400/40 via-indigo-400/30 to-fuchsia-400/30",
  ] as const

  return (
    <section
      id="faq"
      className="py-24 sm:py-32 relative overflow-hidden bg-slate-950 text-slate-100"
    >
      {/* Dark gradient decorative elements */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 4, -2, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-10 w-80 h-80 bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-indigo-500/10 rounded-full blur-3xl opacity-70 -z-10"
      />
      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -3, 2, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-6 w-96 h-96 bg-gradient-to-tr from-purple-500/15 via-fuchsia-500/15 to-blue-500/10 rounded-full blur-3xl opacity-70 -z-10"
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.08),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.06),transparent_35%)] -z-10"
      />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-2 mb-6"
          >
            <HelpCircle className="w-6 h-6 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Questions & Answers</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: cubicBezier(0.16, 1, 0.3, 1) }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-white"
          >
            Frequently asked questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mt-6 text-lg leading-8 text-slate-300"
          >
            Everything you need to know about getting started with Electivio.
            Can&apos;t find the answer you&apos;re looking for? Reach out to our support team.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mx-auto mt-16 max-w-3xl"
        >
          <div className="space-y-5">
            <AnimatePresence>
              {faqs.map((faq, index) => (
                <motion.div key={index} variants={itemVariants} className="group">
                  {/** Card with liquid glass effect **/}
                  <motion.div
                    className={`relative rounded-3xl shadow-lg hover:shadow-xl transition-all duration-400 overflow-hidden backdrop-blur-xl ${openIndex === index ? "bg-white/10 border border-white/20" : "bg-white/5 border border-white/10"}`}
                    whileHover={{ y: -6, scale: 1.01 }}
                  >
                    {/* Subtle gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />

                    {/* Liquid glass shine effect */}
                    <div className={`absolute inset-0 transition-opacity duration-300 ${openIndex === index ? "opacity-100" : "opacity-0 group-hover:opacity-80"}`}>
                      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-cyan-500/20 via-blue-500/15 to-transparent rounded-full blur-2xl" />
                      <div className="absolute bottom-0 left-0 w-2/5 h-2/5 bg-gradient-to-tr from-indigo-500/15 to-transparent rounded-full blur-xl" />
                    </div>

                    {/* Active state subtle overlay */}
                    {openIndex === index && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent"
                      />
                    )}

                    {/* Soft glow ring */}
                    <motion.div
                      animate={{ opacity: openIndex === index ? 0.3 : 0 }}
                      className="absolute -inset-px rounded-3xl bg-gradient-to-r from-blue-300/20 via-purple-300/20 to-pink-300/20 blur-sm"
                    />

                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="relative flex w-full items-center justify-between px-6 py-5 text-left cursor-pointer z-10"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <motion.div
                          animate={{ rotate: openIndex === index ? 360 : 0, scale: openIndex === index ? 1.1 : 1 }}
                          transition={{ duration: 0.2 }}
                          className="shrink-0"
                        >
                            <MessageCircle className="h-5 w-5 text-cyan-400" />
                        </motion.div>
                          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
                          {faq.question}
                        </h3>
                      </div>
                      <motion.div
                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0"
                      >
                          <ChevronDown className="h-5 w-5 text-slate-400" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.16, ease: "easeInOut" }}
                          className="relative border-t border-white/10 px-6 py-4 z-10"
                        >
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.01, duration: 0.1 }}
                            className="text-slate-300 leading-relaxed"
                          >
                            {faq.answer}
                          </motion.p>
                          <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cyan-400/80">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>In Development</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
