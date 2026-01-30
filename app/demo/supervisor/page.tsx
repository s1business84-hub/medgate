"use client";

import { motion, cubicBezier } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BarChart3, TrendingUp, Users, AlertCircle } from "lucide-react";
import { LiquidParallax } from "@/components/ui/liquid-parallax";

export default function SupervisorDemoPage() {
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

  const features = [
    {
      icon: Users,
      title: "Student Progress Tracking",
      description: "Monitor clinical development for all assigned students with GMUID and year-level data.",
      metrics: "5 Students",
    },
    {
      icon: BarChart3,
      title: "Form Progress Visualization",
      description: "Track completion status across multiple clinical rotations and competency areas.",
      metrics: "Avg 73% Complete",
    },
    {
      icon: TrendingUp,
      title: "AI-Powered Insights",
      description: "Get automated analysis of student performance trends and intervention recommendations.",
      metrics: "Real-time Analytics",
    },
    {
      icon: AlertCircle,
      title: "Performance Alerts",
      description: "Identify students needing support and track year-wise performance metrics.",
      metrics: "1 Needs Support",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />

      <motion.div
        className="relative max-w-6xl mx-auto px-4 py-16 md:py-20"
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
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Supervisor Dashboard
          </h1>
          <p className="text-xl text-slate-300">
            Track student progress, visualize clinical development, and gain AI-powered insights into your cohort's performance.
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Students", value: "5", color: "from-purple-500 to-pink-500" },
            { label: "Avg Form Progress", value: "73%", color: "from-blue-500 to-cyan-500" },
            { label: "Avg Log Entries", value: "10", color: "from-green-500 to-emerald-500" },
            { label: "Programs Completed", value: "10", color: "from-orange-500 to-yellow-500" },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`rounded-xl border border-white/10 bg-linear-to-br ${metric.color}/10 p-6 backdrop-blur-sm hover:border-white/20 transition-colors`}
            >
              <p className="text-slate-400 text-sm mb-2">{metric.label}</p>
              <p className="text-3xl font-bold text-white">{metric.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6">Supervisor Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-colors">
                    <feature.icon className="w-6 h-6 text-purple-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm mb-3">{feature.description}</p>
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
                      {feature.metrics}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Student Data Sample */}
        <motion.div
          variants={itemVariants}
          className="mt-12 rounded-xl border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-purple-300 mb-4">Sample Student Data</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <p className="font-semibold text-white">Ahmed Al Mansouri</p>
                  <p className="text-xs text-purple-300">GMUID: GMU-2024-001 | Year 4</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-cyan-400">85%</p>
                  <p className="text-xs text-slate-400">Form Progress</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <p className="font-semibold text-white">Fatima Al Kaabi</p>
                  <p className="text-xs text-purple-300">GMUID: GMU-2024-002 | Year 3</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-cyan-400">72%</p>
                  <p className="text-xs text-slate-400">Form Progress</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                <div>
                  <p className="font-semibold text-white">Hassan Al Noor</p>
                  <p className="text-xs text-purple-300">GMUID: GMU-2024-005 | Year 1</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-400">45%</p>
                  <p className="text-xs text-slate-400">Needs Support</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants} className="mt-12 text-center">
          <p className="text-slate-400 mb-4">Ready to monitor your students' progress?</p>
          <Link href="/supervisor">
            <button className="px-8 py-3 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
              Access Full Dashboard
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
