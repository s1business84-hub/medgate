"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Users, BarChart3, TrendingUp, Award, FileText, CheckCircle, Brain, Target, AlertTriangle, Sparkles } from "lucide-react";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { mockStudents, mockApplications } from "@/lib/mockData";

export default function SupervisorDemoDashboard() {
  const [students] = useState<any[]>(mockStudents);
  const [applications] = useState<any[]>(mockApplications);
  const [selectedTab, setSelectedTab] = useState<"overview" | "students" | "insights">("overview");

  // Calculate metrics
  const totalStudents = students.length;
  const totalApplications = applications.length;
  const approvedApplications = applications.filter(app => app.status === "Approved").length;
  const avgProgress = students.length > 0 
    ? Math.round(students.reduce((acc: number, s: any) => acc + (s.formProgress || 0), 0) / students.length)
    : 0;
  
  // AI Insights
  const aiInsights = [
    {
      type: "success",
      icon: TrendingUp,
      title: "Strong Performance Trend",
      description: "73% average form completion shows excellent engagement across the cohort",
      color: "from-green-500 to-emerald-500"
    },
    {
      type: "warning",
      icon: AlertTriangle,
      title: "Attention Needed",
      description: "1 student below 50% completion rate - consider additional support",
      color: "from-yellow-500 to-orange-500"
    },
    {
      type: "info",
      icon: Target,
      title: "Milestone Achievement",
      description: "3 students on track to complete all requirements ahead of schedule",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Supervisor Dashboard
            </h1>
            <p className="text-slate-400">Track student progress • Manage observerships • AI-powered insights</p>
          </div>
          <Link href="/login">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "students", label: "Students", icon: Users },
            { id: "insights", label: "AI Insights", icon: Brain },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedTab === tab.id
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/50"
                  : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Key Metrics - Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-500/10 via-purple-500/5 to-transparent p-6 backdrop-blur-sm hover:border-purple-500/40 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-500/20 backdrop-blur-sm">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
                  Active
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-2">Total Students</p>
              <p className="text-4xl font-bold text-white mb-2">{totalStudents}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +2 this month
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative rounded-2xl border border-cyan-500/20 bg-linear-to-br from-cyan-500/10 via-cyan-500/5 to-transparent p-6 backdrop-blur-sm hover:border-cyan-500/40 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-cyan-500/20 backdrop-blur-sm">
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
                  Avg
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-2">Completion Rate</p>
              <p className="text-4xl font-bold text-white mb-2">{avgProgress}%</p>
              <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-2">
                <div
                  className="bg-linear-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${avgProgress}%` }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative rounded-2xl border border-emerald-500/20 bg-linear-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-6 backdrop-blur-sm hover:border-emerald-500/40 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/20 backdrop-blur-sm">
                  <FileText className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                  Total
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-2">Applications</p>
              <p className="text-4xl font-bold text-white mb-2">{totalApplications}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">
                  {approvedApplications} approved
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group relative rounded-2xl border border-orange-500/20 bg-linear-to-br from-orange-500/10 via-orange-500/5 to-transparent p-6 backdrop-blur-sm hover:border-orange-500/40 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-500/20 backdrop-blur-sm">
                  <CheckCircle className="w-6 h-6 text-orange-400" />
                </div>
                <div className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold">
                  +{approvedApplications}
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-2">Approved Programs</p>
              <p className="text-4xl font-bold text-white mb-2">{approvedApplications}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-400 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {Math.round((approvedApplications / totalApplications) * 100)}% approval rate
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Insights Section */}
        {selectedTab === "insights" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
                <p className="text-sm text-slate-400">Real-time analytics and recommendations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aiInsights.map((insight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-all"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${insight.color}/20 mb-4`}>
                    <insight.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{insight.title}</h3>
                  <p className="text-sm text-slate-400">{insight.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Students List */}
        {(selectedTab === "overview" || selectedTab === "students") && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Student Overview</h2>
                  <p className="text-sm text-slate-400">{students.length} active students</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-400 font-semibold">Live Data</span>
              </div>
            </div>

            <div className="space-y-3">
              {students.map((student, idx) => {
                const studentApps = applications.filter(app => app.studentId === student.id);
                const approvedApps = studentApps.filter(app => app.status === "Approved");
                const progressColor = student.formProgress >= 80 ? "from-green-500 to-emerald-500" : 
                                     student.formProgress >= 50 ? "from-cyan-500 to-blue-500" : 
                                     "from-orange-500 to-yellow-500";

                return (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative rounded-xl p-5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {student.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-white text-lg">{student.name}</p>
                            <p className="text-sm text-purple-300">{student.email}</p>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
                            Year {student.year || 2}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-6 ml-13 mt-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            GMUID: {student.gmuid || "GMU" + student.id}
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 className="w-3 h-3" />
                            {studentApps.length} Applications
                          </span>
                          <span className="flex items-center gap-1 text-green-400">
                            <CheckCircle className="w-3 h-3" />
                            {approvedApps.length} Approved
                          </span>
                        </div>
                      </div>

                      <div className="text-right ml-6">
                        <div className="mb-3">
                          <p className={`text-3xl font-bold bg-linear-to-r ${progressColor} bg-clip-text text-transparent`}>
                            {student.formProgress || 0}%
                          </p>
                          <p className="text-xs text-slate-400">Completion</p>
                        </div>
                        <div className="w-40">
                          <div className="w-full bg-slate-700/50 rounded-full h-2 mb-1">
                            <div
                              className={`bg-linear-to-r ${progressColor} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${student.formProgress || 0}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>0%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Applications */}
        {selectedTab === "overview" && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <FileText className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Recent Applications</h2>
                <p className="text-sm text-slate-400">Latest submissions and updates</p>
              </div>
            </div>

            <div className="space-y-3">
              {applications.slice(0, 5).map((app, idx) => {
                const student = students.find(s => s.id === app.studentId);
                const statusColors = {
                  Approved: "bg-green-500/20 text-green-300 border-green-500/30",
                  Pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                  Submitted: "bg-blue-500/20 text-blue-300 border-blue-500/30",
                  Rejected: "bg-red-500/20 text-red-300 border-red-500/30",
                };
                const statusIcons = {
                  Approved: CheckCircle,
                  Pending: AlertTriangle,
                  Submitted: FileText,
                  Rejected: AlertTriangle,
                };
                const StatusIcon = statusIcons[app.status as keyof typeof statusIcons] || FileText;

                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative rounded-xl p-5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                            {student?.name?.split(' ').map((n: string) => n[0]).join('') || "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{student?.name || "Unknown Student"}</p>
                            <p className="text-xs text-slate-400">Program ID: {app.programId}</p>
                          </div>
                        </div>
                        <div className="ml-11 flex items-center gap-4 text-xs text-slate-400">
                          <span>Submitted: {new Date(app.submissionDate).toLocaleDateString()}</span>
                          {app.sessionCount && (
                            <span className="flex items-center gap-1">
                              <BarChart3 className="w-3 h-3" />
                              {app.sessionCount} Sessions
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-lg text-sm font-semibold border flex items-center gap-2 ${statusColors[app.status as keyof typeof statusColors] || statusColors.Submitted}`}>
                          <StatusIcon className="w-4 h-4" />
                          {app.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Demo Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 rounded-2xl border border-purple-500/30 bg-linear-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Experience the Full Platform</p>
                <p className="text-slate-400 text-sm">This is a demo dashboard with sample data. Create an account to access all features.</p>
              </div>
            </div>
            <Link href="/login">
              <button className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                Get Started
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
