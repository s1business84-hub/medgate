"use client";

import { motion, cubicBezier } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, BookMarked, TrendingUp, CheckCircle } from "lucide-react";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { loginUser } from "@/lib/storage";
import { mockUsers } from "@/lib/mockData";

export default function HospitalDemoPage() {
  const router = useRouter();
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

  const sampleTrainees = [
    {
      id: 1,
      name: "Dr. Sarah Mueller",
      program: "Surgical Residency",
      completion: 78,
      status: "On Track",
    },
    {
      id: 2,
      name: "Dr. James Rodriguez",
      program: "Internal Medicine",
      completion: 45,
      status: "In Progress",
    },
    {
      id: 3,
      name: "Dr. Emma Johnson",
      program: "Emergency Medicine",
      completion: 92,
      status: "Near Completion",
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
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Hospital Admin Dashboard
          </h1>
          <p className="text-xl text-slate-300">
            Manage your trainee programs and track clinical education progress across all departments.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Users, label: "Active Trainees", value: "24", color: "from-blue-500 to-cyan-500" },
            { icon: BookMarked, label: "Programs", value: "8", color: "from-purple-500 to-pink-500" },
            { icon: CheckCircle, label: "Completed", value: "6", color: "from-green-500 to-emerald-500" },
            { icon: TrendingUp, label: "Avg Completion", value: "72%", color: "from-orange-500 to-red-500" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`rounded-xl border border-white/10 bg-linear-to-br ${stat.color}/10 p-6 backdrop-blur-sm hover:border-white/20 transition-colors`}
            >
              <stat.icon className="w-6 h-6 mb-3 text-white" />
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trainees Section */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6">Trainee Progress</h2>
          <div className="space-y-4">
            {sampleTrainees.map((trainee, idx) => (
              <motion.div
                key={trainee.id}
                variants={itemVariants}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{trainee.name}</h3>
                    <p className="text-slate-400 text-sm">{trainee.program}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      trainee.status === "Near Completion"
                        ? "bg-green-500/20 text-green-300"
                        : trainee.status === "On Track"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {trainee.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="bg-slate-700/50 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-linear-to-r from-orange-500 to-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${trainee.completion}%` }}
                    transition={{ duration: 1, delay: idx * 0.2 }}
                  />
                </div>
                <p className="text-slate-400 text-sm mt-2">{trainee.completion}% Complete</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants} className="mt-12 text-center">
          <p className="text-slate-400 mb-4">Ready to manage your hospital's applications?</p>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                const usersKey = "electivio_users";
                window.localStorage.setItem(usersKey, JSON.stringify(mockUsers));
              }
              setTimeout(() => {
                const loggedInUser = loginUser("hospital1@electivio.com", "password");
                if (loggedInUser) {
                  window.location.href = "/hospital";
                }
              }, 100);
            }}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
          >
            Access Full Dashboard
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
