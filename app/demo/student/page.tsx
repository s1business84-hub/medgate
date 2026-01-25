"use client";

import { motion, cubicBezier } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookOpen, Award, Brain, TrendingUp } from "lucide-react";
import { LiquidParallax } from "@/components/ui/liquid-parallax";

export default function StudentDemoPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: cubicBezier(0.16, 1, 0.3, 1) },
    },
  };

  const samplePrograms = [
    {
      id: 1,
      name: "Clinical Research Fellowship",
      institution: "Medical University of Vienna",
      status: "In Progress",
      progress: 65,
      icon: "🔬",
    },
    {
      id: 2,
      name: "Advanced Surgery Certification",
      institution: "ETH Zurich",
      status: "Completed",
      progress: 100,
      icon: "🏥",
    },
    {
      id: 3,
      name: "Healthcare Management Program",
      institution: "University of Bern",
      status: "Not Started",
      progress: 0,
      icon: "📊",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-950/50 to-black/70" />

      <motion.div
        className="relative max-w-6xl mx-auto px-4 py-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-8">
          <Link href="/login">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Student Portal Demo
          </h1>
          <p className="text-xl text-slate-300">
            Welcome to your medical education dashboard. Track your progress across multiple programs and institutions.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: BookOpen, label: "Active Programs", value: "3", color: "from-blue-500 to-cyan-500" },
            { icon: Award, label: "Certifications", value: "2", color: "from-purple-500 to-pink-500" },
            { icon: Brain, label: "Learning Hours", value: "245", color: "from-green-500 to-emerald-500" },
            { icon: TrendingUp, label: "Avg. Progress", value: "55%", color: "from-orange-500 to-red-500" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`rounded-xl border border-white/10 bg-gradient-to-br ${stat.color}/10 p-6 backdrop-blur-sm hover:border-white/20 transition-colors`}
            >
              <stat.icon className="w-6 h-6 mb-3 text-white" />
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Programs Section */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6">Your Programs</h2>
          <div className="space-y-4">
            {samplePrograms.map((program, idx) => (
              <motion.div
                key={program.id}
                variants={itemVariants}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{program.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{program.name}</h3>
                      <p className="text-slate-400 text-sm">{program.institution}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      program.status === "Completed"
                        ? "bg-green-500/20 text-green-300"
                        : program.status === "In Progress"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-slate-500/20 text-slate-300"
                    }`}
                  >
                    {program.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="bg-slate-700/50 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${program.progress}%` }}
                    transition={{ duration: 1, delay: idx * 0.2 }}
                  />
                </div>
                <p className="text-slate-400 text-sm mt-2">{program.progress}% Complete</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants} className="mt-12 text-center">
          <p className="text-slate-400 mb-4">This is a demo of the student portal. Start by creating an account or logging in.</p>
          <Link href="/login">
            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
              Go Back to Login
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
