"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  BookOpen,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Calendar,
  Users,
  AlertCircle,
  TrendingUp,
  Award,
} from "lucide-react";
import { DoctorAnalyticsDashboard } from "@/components/doctor-analytics-dashboard";

interface StudentAssignment {
  id: string;
  name: string;
  level: number;
  progress: number;
  status: "active" | "completed" | "at_risk";
}

interface ObservationMetrics {
  totalObservations: number;
  completedObservations: number;
  averageRating: number;
  studentsUnderSupervision: number;
}

export default function DoctorPortal() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "students" | "schedule" | "notifications">("dashboard");
  const [unreadNotifications, setUnreadNotifications] = useState(5);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "students", label: "My Students", icon: Users },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "notifications", label: "Notifications", icon: Bell },
  ] as const;

  const mockStudentsData: StudentAssignment[] = [
    {
      id: "STU001",
      name: "Ahmed Hassan",
      level: 5,
      progress: 85,
      status: "active",
    },
    {
      id: "STU002",
      name: "Layla Mohammed",
      level: 3,
      progress: 65,
      status: "active",
    },
    {
      id: "STU003",
      name: "Omar Khalid",
      level: 4,
      progress: 45,
      status: "at_risk",
    },
    {
      id: "STU004",
      name: "Hana Ahmed",
      level: 5,
      progress: 92,
      status: "completed",
    },
  ];

  const mockMetricsData: ObservationMetrics = {
    totalObservations: 48,
    completedObservations: 42,
    averageRating: 4.6,
    studentsUnderSupervision: 12,
  };

  const [studentAssignments, setStudentAssignments] = useState<StudentAssignment[]>(mockStudentsData);
  const [metrics, setMetrics] = useState<ObservationMetrics | null>(mockMetricsData);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-16 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl mb-6 animate-pulse" />
          <div className="flex gap-3 mb-8">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="h-12 w-36 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="h-32 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <div className="h-4 w-24 rounded-full bg-white/10 animate-pulse mb-3" />
                <div className="h-8 w-20 rounded-full bg-white/10 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="mt-8 h-96 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.1),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(168,85,247,0.08),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Header */}
      <nav className="relative z-50 bg-slate-900/50 border-b border-white/10 sticky top-0 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Student Portal</h1>
              <p className="text-sm text-slate-400">Learning Journey & Progress</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-lg transition-all duration-200 bg-white/5 hover:bg-white/10 border border-white/10"
              >
                <Bell className="w-5 h-5 text-slate-300" />
                {unreadNotifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
                  >
                    {unreadNotifications}
                  </motion.span>
                )}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg transition-all duration-200 bg-white/5 hover:bg-white/10 border border-white/10"
              >
                <Settings className="w-5 h-5 text-slate-300" />
              </motion.button>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-cyan-500/20">
                D
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Tab Navigation */}
        <div className="mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative px-5 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? "text-cyan-300 bg-white/10 backdrop-blur-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <motion.span
                      layoutId="doctor-portal-tab"
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
            {/* KPI Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                {
                  label: "Students",
                  value: metrics?.studentsUnderSupervision,
                  icon: Users,
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-500/10 to-cyan-500/10",
                },
                {
                  label: "Observations",
                  value: `${metrics?.completedObservations}/${metrics?.totalObservations}`,
                  icon: BookOpen,
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-500/10 to-pink-500/10",
                },
                {
                  label: "Average Rating",
                  value: metrics?.averageRating.toFixed(1),
                  icon: Award,
                  gradient: "from-yellow-500 to-orange-500",
                  bgGradient: "from-yellow-500/10 to-orange-500/10",
                },
                {
                  label: "Performance",
                  value: "Excellent",
                  icon: TrendingUp,
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-500/10 to-emerald-500/10",
                },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group relative p-6 rounded-3xl border border-white/20 bg-white/8 backdrop-blur-3xl hover:border-white/30 transition-all duration-300 overflow-hidden"
                >
                  {/* Base glass tint */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient}`} />
                  
                  {/* Liquid shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl" />
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Analytics Dashboard */}
            <DoctorAnalyticsDashboard
              metrics={{
                totalObservations: 48,
                completedObservations: 42,
                averageRating: 4.6,
                studentsUnderSupervision: 12,
              }}
            />
            </motion.div>
          )}

        {/* Students Tab */}
          {activeTab === "students" && (
            <motion.div
              key="students"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {studentAssignments.map((student, idx) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    whileHover={{ y: -4 }}
                    className="group relative bg-white/8 backdrop-blur-3xl rounded-3xl border border-white/20 p-6 hover:border-white/30 transition-all duration-300 overflow-hidden"
                  >
                    {/* Liquid shimmer effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-cyan-500/20">
                            {student.name.split(" ")[0][0]}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{student.name}</p>
                            <p className="text-sm text-slate-400">Level {student.level}</p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-xl ${
                            student.status === "active"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : student.status === "at_risk"
                              ? "bg-red-500/20 text-red-300 border border-red-500/30"
                              : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                          }`}
                        >
                          {student.status === "at_risk" ? "At Risk" : student.status === "active" ? "Active" : "Completed"}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-300">Progress</span>
                          <span className="text-sm font-bold text-white">{student.progress}%</span>
                        </div>
                        <div className="relative w-full h-3 bg-slate-800/50 rounded-full overflow-hidden">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${student.progress}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-2.5 border border-cyan-500/30 text-cyan-300 bg-cyan-500/10 rounded-xl hover:bg-cyan-500/20 backdrop-blur-xl transition-all duration-200 text-sm font-medium"
                      >
                        View Details
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        {/* Schedule Tab */}
          {activeTab === "schedule" && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/8 backdrop-blur-3xl rounded-3xl border border-white/20 p-6"
            >
              <h3 className="text-lg font-bold text-white mb-6">Supervision Schedule</h3>
              <div className="space-y-3">
                {[
                  { day: "Monday", time: "08:00 AM - 12:00 PM", location: "Ward A", color: "from-blue-500 to-cyan-500" },
                  { day: "Wednesday", time: "02:00 PM - 06:00 PM", location: "Ward B", color: "from-purple-500 to-pink-500" },
                  { day: "Friday", time: "09:00 AM - 01:00 PM", location: "Operating Theatre", color: "from-emerald-500 to-teal-500" },
                ].map((slot, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    whileHover={{ x: 4 }}
                    className="group relative flex items-center justify-between p-4 border border-white/10 rounded-2xl hover:bg-white/5 hover:border-white/20 transition-all duration-200 overflow-hidden"
                  >
                    {/* Gradient accent */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${slot.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                    <div className="relative z-10">
                      <p className="font-semibold text-white">{slot.day}</p>
                      <p className="text-sm text-slate-400">{slot.time}</p>
                    </div>
                    <p className="text-sm font-medium text-slate-300">{slot.location}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/8 backdrop-blur-3xl rounded-3xl border border-white/20 p-6"
            >
              <h3 className="text-lg font-bold text-white mb-6">Notifications</h3>
              <div className="space-y-3">
                {[
                  {
                    type: "alert",
                    title: "Student At Risk",
                    message: "Omar Khalid is showing signs of struggle. Consider additional guidance.",
                    time: "2 hours ago",
                    gradient: "from-red-500 to-rose-500",
                  },
                  {
                    type: "info",
                    title: "New Student Assignment",
                    message: "You have been assigned 1 new student.",
                    time: "1 day ago",
                    gradient: "from-blue-500 to-cyan-500",
                  },
                  {
                    type: "success",
                    title: "Observation Completed",
                    message: "Your observation for Ahmed Hassan has been recorded.",
                    time: "3 days ago",
                    gradient: "from-emerald-500 to-teal-500",
                  },
                ].map((notif, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.3 }}
                    whileHover={{ scale: 1.01 }}
                    className={`group relative p-4 rounded-2xl border-l-4 bg-white/5 hover:bg-white/10 transition-all duration-200 overflow-hidden ${
                      notif.type === "alert"
                        ? "border-red-500"
                        : notif.type === "info"
                        ? "border-blue-500"
                        : "border-emerald-500"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{notif.title}</p>
                        <p className="text-sm text-slate-300 mt-1">{notif.message}</p>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{notif.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
