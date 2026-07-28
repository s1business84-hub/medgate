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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-indigo-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      </div>

      {/* Header */}
      <nav className="relative z-50 bg-slate-900/30 border-b border-white/10 sticky top-0 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Student Portal
              </h1>
              <p className="text-sm text-slate-400">Learning Journey & Progress</p>
            </motion.div>
            <motion.div 
              className="flex items-center gap-3 sm:gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.button 
                whileHover={{ scale: 1.05, rotate: [0, -10, 10, 0] }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 rounded-xl transition-all duration-200 bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-white/20 shadow-lg"
              >
                <Bell className="w-5 h-5 text-slate-300" />
                {unreadNotifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-indigo-500 to-indigo-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg ring-2 ring-slate-900"
                  >
                    {unreadNotifications}
                  </motion.span>
                )}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-xl transition-all duration-200 bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-white/20 shadow-lg"
              >
                <Settings className="w-5 h-5 text-slate-300" />
              </motion.button>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-blue-500/30 hover:ring-4 transition-all cursor-pointer"
              >
                <span className="relative z-10">D</span>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
              </motion.div>
            </motion.div>
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
                      ? "text-blue-300 bg-white/10 backdrop-blur-xl border border-blue-500/30 shadow-lg shadow-blue-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <motion.span
                      layoutId="doctor-portal-tab"
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
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
                  gradient: "from-blue-500 to-blue-500",
                  bgGradient: "from-blue-500/10 to-blue-500/10",
                },
                {
                  label: "Observations",
                  value: `${metrics?.completedObservations}/${metrics?.totalObservations}`,
                  icon: BookOpen,
                  gradient: "from-indigo-500 to-indigo-500",
                  bgGradient: "from-indigo-500/10 to-indigo-500/10",
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
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="group relative p-6 rounded-3xl border border-white/20 bg-white/8 backdrop-blur-3xl hover:border-white/40 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10"
                >
                  {/* Animated gradient border */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 rounded-3xl blur-xl transition-opacity duration-500`}
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Base glass tint */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient}`} />
                  
                  {/* Enhanced liquid shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <motion.div 
                      className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-3xl blur-2xl"
                      animate={{
                        x: [-100, 100],
                        y: [-50, 50],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />
                  </div>

                  {/* Floating particles */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 bg-gradient-to-r ${stat.gradient} rounded-full opacity-0 group-hover:opacity-40`}
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${30 + i * 20}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0, 0.6, 0],
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}

                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 mb-2 font-medium">{stat.label}</p>
                      <motion.p 
                        className="text-3xl font-bold bg-gradient-to-r from-white to-slate-100 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <motion.div 
                      className={`relative p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                      <motion.div
                        className="absolute inset-0 bg-white/30 rounded-xl blur-md opacity-0 group-hover:opacity-100"
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    </motion.div>
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
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="group relative bg-white/8 backdrop-blur-3xl rounded-3xl border border-white/20 p-6 hover:border-white/40 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10"
                  >
                    {/* Animated gradient glow */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500"
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />
                    
                    {/* Enhanced liquid shimmer effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <motion.div 
                        className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-blue-400/20 via-indigo-400/10 to-transparent rounded-full blur-3xl"
                        animate={{
                          x: [0, 30, 0],
                          y: [0, 20, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-blue-500/30 group-hover:ring-4 transition-all"
                            whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                          >
                            {student.name.split(" ")[0][0]}
                          </motion.div>
                          <div>
                            <p className="font-semibold text-white group-hover:text-blue-300 transition-colors">{student.name}</p>
                            <p className="text-sm text-slate-400">Level {student.level}</p>
                          </div>
                        </div>
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-xl ${
                            student.status === "active"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/20"
                              : student.status === "at_risk"
                              ? "bg-red-500/20 text-red-300 border border-red-500/30 shadow-lg shadow-red-500/20"
                              : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                          }`}
                        >
                          {student.status === "at_risk" ? "At Risk" : student.status === "active" ? "Active" : "Completed"}
                        </motion.span>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-300">Progress</span>
                          <motion.span 
                            className="text-sm font-bold text-white"
                            whileHover={{ scale: 1.1 }}
                          >
                            {student.progress}%
                          </motion.span>
                        </div>
                        <div className="relative w-full h-3 bg-slate-800/50 rounded-full overflow-hidden shadow-inner">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 rounded-full shadow-lg"
                            initial={{ width: 0 }}
                            animate={{ width: `${student.progress}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <motion.div
                              className="absolute top-0 right-0 w-1/3 h-full bg-white/30 rounded-full blur-sm"
                              animate={{
                                x: [-20, 20],
                                opacity: [0.3, 0.6, 0.3],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                              }}
                            />
                          </motion.div>
                        </div>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative w-full px-4 py-2.5 border border-blue-500/30 text-blue-300 bg-blue-500/10 rounded-xl hover:bg-blue-500/20 hover:border-blue-500/50 backdrop-blur-xl transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-blue-500/20 overflow-hidden group/btn"
                      >
                        <span className="relative z-10">View Details</span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-hover/btn:opacity-100"
                          animate={{
                            x: [-100, 100],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                        />
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
                  { day: "Monday", time: "08:00 AM - 12:00 PM", location: "Ward A", color: "from-blue-500 to-blue-500" },
                  { day: "Wednesday", time: "02:00 PM - 06:00 PM", location: "Ward B", color: "from-indigo-500 to-indigo-500" },
                  { day: "Friday", time: "09:00 AM - 01:00 PM", location: "Operating Theatre", color: "from-emerald-500 to-blue-500" },
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
                    gradient: "from-red-500 to-indigo-500",
                  },
                  {
                    type: "info",
                    title: "New Student Assignment",
                    message: "You have been assigned 1 new student.",
                    time: "1 day ago",
                    gradient: "from-blue-500 to-blue-500",
                  },
                  {
                    type: "success",
                    title: "Observation Completed",
                    message: "Your observation for Ahmed Hassan has been recorded.",
                    time: "3 days ago",
                    gradient: "from-emerald-500 to-blue-500",
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
