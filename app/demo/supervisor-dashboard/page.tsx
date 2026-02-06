"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Users, BarChart3, TrendingUp, Award, FileText, CheckCircle } from "lucide-react";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { mockStudents, mockApplications } from "@/lib/mockData";

export default function SupervisorDemoDashboard() {
  const [students] = useState<any[]>(mockStudents);
  const [applications] = useState<any[]>(mockApplications);

  // Calculate metrics
  const totalStudents = students.length;
  const totalApplications = applications.length;
  const approvedApplications = applications.filter(app => app.status === "Approved").length;
  const avgProgress = students.length > 0 
    ? Math.round(students.reduce((acc: number, s: any) => acc + (s.formProgress || 0), 0) / students.length)
    : 0;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Supervisor Dashboard - Demo
            </h1>
            <p className="text-slate-400">Track student progress and manage observerships</p>
          </div>
          <Link href="/login">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-white/10 bg-linear-to-br from-purple-500/10 to-pink-500/10 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <p className="text-slate-400 text-sm">Total Students</p>
            </div>
            <p className="text-3xl font-bold text-white">{totalStudents}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-white/10 bg-linear-to-br from-blue-500/10 to-cyan-500/10 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <p className="text-slate-400 text-sm">Avg Progress</p>
            </div>
            <p className="text-3xl font-bold text-white">{avgProgress}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-white/10 bg-linear-to-br from-green-500/10 to-emerald-500/10 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-green-400" />
              <p className="text-slate-400 text-sm">Applications</p>
            </div>
            <p className="text-3xl font-bold text-white">{totalApplications}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-white/10 bg-linear-to-br from-orange-500/10 to-yellow-500/10 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-orange-400" />
              <p className="text-slate-400 text-sm">Approved</p>
            </div>
            <p className="text-3xl font-bold text-white">{approvedApplications}</p>
          </motion.div>
        </div>

        {/* Students List */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold">Student Overview</h2>
          </div>

          <div className="space-y-3">
            {students.map((student, idx) => {
              const studentApps = applications.filter(app => app.studentId === student.id);
              const approvedApps = studentApps.filter(app => app.status === "Approved");

              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-white text-lg">{student.name}</p>
                      <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                        Year {student.year || 2}
                      </span>
                    </div>
                    <p className="text-sm text-purple-300">{student.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>GMUID: {student.gmuid || "GMU" + student.id}</span>
                      <span>Applications: {studentApps.length}</span>
                      <span>Approved: {approvedApps.length}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="mb-2">
                      <p className="text-2xl font-bold text-cyan-400">{student.formProgress || 0}%</p>
                      <p className="text-xs text-slate-400">Progress</p>
                    </div>
                    <div className="w-32 bg-slate-700/50 rounded-full h-2">
                      <div
                        className="bg-linear-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${student.formProgress || 0}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold">Recent Applications</h2>
          </div>

          <div className="space-y-3">
            {applications.slice(0, 5).map((app, idx) => {
              const student = students.find(s => s.id === app.studentId);
              const statusColors = {
                Approved: "bg-green-500/20 text-green-300",
                Pending: "bg-yellow-500/20 text-yellow-300",
                Submitted: "bg-blue-500/20 text-blue-300",
                Rejected: "bg-red-500/20 text-red-300",
              };

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-white">{student?.name || "Unknown Student"}</p>
                    <p className="text-sm text-slate-400 mt-1">Program ID: {app.programId}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Submitted: {new Date(app.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[app.status as keyof typeof statusColors] || statusColors.Submitted}`}>
                      {app.status}
                    </span>
                    {app.sessionCount && (
                      <p className="text-xs text-slate-400 mt-2">{app.sessionCount} Sessions</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 p-4 rounded-lg border border-purple-500/30 bg-purple-500/10 text-center">
          <p className="text-slate-300">
            This is a demo dashboard with sample data. 
            <Link href="/login" className="text-purple-400 hover:text-purple-300 ml-2 underline">
              Sign up to access the full platform
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
