"use client"

import { useState } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { ChevronDown, Sparkles, MessageCircle, Star, Zap, Heart } from "lucide-react"
import Link from "next/link"

const faqs = [
  {
    question: "What is Electivio?",
    answer: "Electivio is a comprehensive platform connecting medical students with hospital residency programs and specialized training opportunities. We bridge the gap between educational aspirations and clinical excellence.",
    category: "General",
    color: "from-blue-500/40 to-cyan-500/40"
  },
  {
    question: "How do I apply for programs?",
    answer: "Browse available programs, check your eligibility using our Eligibility Checker, and submit your application directly through our platform. Hospitals will review your application and contact you with next steps.",
    category: "Applications",
    color: "from-purple-500/40 to-pink-500/40"
  },
  {
    question: "What are the eligibility criteria?",
    answer: "Eligibility varies by program and hospital. Use our Eligibility Checker tool to instantly determine which programs match your qualifications. Criteria typically include medical degree status, specialization, and years of experience.",
    category: "Eligibility",
    color: "from-emerald-500/40 to-teal-500/40"
  },
  {
    question: "Can I apply to multiple programs?",
    answer: "Yes! You can apply to as many programs as you qualify for. We encourage exploring multiple opportunities to find the perfect fit for your career goals.",
    category: "Applications",
    color: "from-orange-500/40 to-red-500/40"
  },
  {
    question: "How long does the application process take?",
    answer: "Application processing times vary by hospital, typically ranging from 2-4 weeks. You'll receive email updates on your application status throughout the process.",
    category: "General",
    color: "from-indigo-500/40 to-blue-500/40"
  },
  {
    question: "Is there a fee to use Electivio?",
    answer: "Browsing programs and using our tools is completely free. Hospitals may have their own application requirements, but Electivio itself charges no fees for students.",
    category: "General",
    color: "from-green-500/40 to-emerald-500/40"
  },
  {
    question: "How do I set reminders for applications?",
    answer: "Click the bell icon on any program card to set application reminders. We'll notify you via email before important deadlines to keep you on track.",
    category: "Features",
    color: "from-yellow-500/40 to-orange-500/40"
  },
  {
    question: "Can hospitals contact me directly?",
    answer: "Yes, hospitals use the contact information from your application to reach out regarding your application status, interviews, and next steps.",
    category: "General",
    color: "from-pink-500/40 to-rose-500/40"
  }
]

const categories = ["All", ...Array.from(new Set(faqs.map(f => f.category)))]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredFaqs = selectedCategory === "All" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory)

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  // Animated background orbs
  const orbVariants = {
    animate: {
      y: [0, -30, 0],
      opacity: [0.3, 0.5, 0.3]
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Animated background orbs */}
      <motion.div
        variants={orbVariants}
        animate="animate"
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-10 w-96 h-96 bg-linear-to-r from-blue-600 to-cyan-600 rounded-full blur-3xl opacity-20"
      />
      <motion.div
        variants={orbVariants}
        animate="animate"
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        className="absolute bottom-40 right-20 w-80 h-80 bg-linear-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-20"
      />
      <motion.div
        variants={orbVariants}
        animate="animate"
        transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        className="absolute top-1/2 right-1/4 w-72 h-72 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full blur-3xl opacity-15"
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Find answers to common questions about Electivio and your journey to medical excellence
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/50"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence>
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={`${selectedCategory}-${index}`}
                variants={itemVariants}
                layout
                className="group"
              >
                {/* Card with dynamic color gradient */}
                <motion.div
                  className={`relative rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-400 overflow-hidden backdrop-blur-sm ${
                    openIndex === index
                      ? "bg-white/12 border border-white/20"
                      : "bg-white/6 border border-white/10"
                  }`}
                  whileHover={{ y: -4 }}
                >
                  {/* Dynamic gradient background */}
                  <div
                    className={`absolute inset-0 bg-linear-to-r ${faq.color} opacity-0 group-hover:opacity-100 transition-opacity duration-400`}
                  />

                  {/* Glass shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                    <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-linear-to-br from-white to-transparent rounded-full blur-2xl" />
                  </div>

                  {/* Active state glow */}
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent"
                    />
                  )}

                  {/* Animated glow ring for active state */}
                  {openIndex === index && (
                    <motion.div
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -inset-px rounded-2xl bg-linear-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 blur-md -z-10"
                    />
                  )}

                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="relative flex w-full items-center justify-between px-6 py-5 text-left cursor-pointer z-10"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <motion.div
                        animate={{
                          rotate: openIndex === index ? 360 : 0,
                          scale: openIndex === index ? 1.2 : 1
                        }}
                        transition={{ duration: 0.3 }}
                        className="shrink-0"
                      >
                        <MessageCircle className="w-5 h-5 text-blue-300 drop-shadow-[0_0_12px_rgba(147,197,253,0.5)]" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors">
                          {faq.question}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">{faq.category}</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="shrink-0"
                    >
                      <ChevronDown className="w-5 h-5 text-slate-300" />
                    </motion.div>
                  </button>

                  {/* Expanded Answer */}
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative border-t border-white/10 px-6 py-5 z-10"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05, duration: 0.2 }}
                        >
                          <p className="text-slate-200 leading-relaxed text-base">
                            {faq.answer}
                          </p>
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="mt-4 flex items-center gap-2 text-xs uppercase tracking-widest text-blue-300/90"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>Learn more in our docs</span>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl border border-white/10 p-8 backdrop-blur-sm">
            <Heart className="w-8 h-8 text-red-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3 bg-linear-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              Still have questions?
            </h3>
            <p className="text-slate-300 mb-6">
              Can't find what you're looking for? Reach out to our support team.
            </p>
            <motion.div
              className="flex gap-4 justify-center flex-wrap"
              whileHover={{ scale: 1.02 }}
            >
              <motion.a
                href="/about"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-shadow"
              >
                Learn More
              </motion.a>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white/10 rounded-full font-semibold text-white border border-white/20 hover:bg-white/20 transition-colors"
              >
                Back Home
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
