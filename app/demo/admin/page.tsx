"use client";

import { motion, cubicBezier } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BarChart3, Shield, Zap, Globe } from "lucide-react";
import { LiquidParallax } from "@/components/ui/liquid-parallax";

export default function AdminDemoPage() {
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
      icon: Globe,
      title: "Global Network Management",
      description: "Oversee all participating institutions and their training programs worldwide.",
      metrics: "156 Institutions",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Real-time dashboards tracking trainee completion rates and program effectiveness.",
      metrics: "2,847 Active Trainees",
    },
    {
      icon: Shield,
      title: "Compliance & Verification",
      description: "Manage credential verification and ensure regulatory compliance across all institutions.",
      metrics: "99.8% Verified",
    },
    {
      icon: Zap,
      title: "System Performance",
      description: "Monitor platform health, manage user accounts, and system-wide configurations.",
      metrics: "99.99% Uptime",
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
            Admin Control Panel
          </h1>
          <p className="text-xl text-slate-300">
            Advanced system management tools for overseeing the MedGate platform and all connected institutions.
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Institutions", value: "156", color: "from-purple-500 to-pink-500" },
            { label: "Active Users", value: "3,200+", color: "from-blue-500 to-cyan-500" },
            { label: "Programs Listed", value: "2,100+", color: "from-green-500 to-emerald-500" },
            { label: "Platform Health", value: "Optimal", color: "from-orange-500 to-yellow-500" },
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
          <h2 className="text-2xl font-bold mb-6">Admin Features</h2>
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

        {/* Security Notice */}
        <motion.div
          variants={itemVariants}
          className="mt-12 rounded-xl border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm p-6"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-purple-300 shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Enterprise Security</h3>
              <p className="text-slate-300">
                All admin activities are logged and monitored. Two-factor authentication is required for all accounts. Data is encrypted end-to-end.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants} className="mt-12 text-center">
          <p className="text-slate-400 mb-4">This is a demo of the admin control panel. Contact us to request administrator access.</p>
          <Link href="/login">
            <button className="px-8 py-3 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
              Back to Login
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
