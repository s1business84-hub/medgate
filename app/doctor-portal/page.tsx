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
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-16 rounded-2xl bg-white border border-slate-200 shadow-sm mb-6" />
          <div className="flex gap-3 mb-8">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="h-10 w-32 rounded-full bg-slate-200/70 skeleton" />
            ))}
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="h-28 rounded-2xl border border-slate-200 bg-white p-6">
                <div className="h-4 w-24 rounded-full bg-slate-200/70 skeleton mb-3" />
                <div className="h-8 w-20 rounded-full bg-slate-200/70 skeleton" />
              </div>
            ))}
          </div>
          <div className="mt-8 h-96 rounded-2xl border border-slate-200 bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_60%)]" />
      {/* Header */}
      <nav className="bg-white/90 border-b border-slate-200 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Doctor Portal</h1>
              <p className="text-sm text-slate-500">Student Supervision & Analytics</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <button className="relative p-2 rounded-lg transition duration-150 ease-out hover:bg-slate-100 active:scale-[0.98]">
                <Bell className="w-5 h-5 text-slate-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <button className="p-2 rounded-lg transition duration-150 ease-out hover:bg-slate-100 active:scale-[0.98]">
                <Settings className="w-5 h-5 text-slate-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                D
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Tab Navigation */}
        <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2.5 rounded-full font-medium transition duration-150 ease-out flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
                    isActive
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <motion.span
                      layoutId="doctor-portal-tab"
                      className="absolute -bottom-2 left-3 right-3 h-0.5 bg-emerald-500 rounded-full"
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </button>
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
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  label: "Observations",
                  value: `${metrics?.completedObservations}/${metrics?.totalObservations}`,
                  icon: BookOpen,
                  color: "from-purple-500 to-pink-500",
                },
                {
                  label: "Average Rating",
                  value: metrics?.averageRating.toFixed(1),
                  icon: Award,
                  color: "from-yellow-500 to-orange-500",
                },
                {
                  label: "Performance",
                  value: "Excellent",
                  icon: TrendingUp,
                  color: "from-green-500 to-emerald-500",
                },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.2 }}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition duration-150 ease-out"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                      <stat.icon className="w-6 h-6 text-slate-600" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Analytics Dashboard */}
            <DoctorAnalyticsDashboard
              doctorName="Dr. Sample"
              departmentId="INT-001"
              metrics={{
                totalStudentsSupervised: 12,
                averageStudentProgress: 82,
                completedEvaluations: 42,
                pendingEvaluations: 6,
                studentPerformanceData: [
                  {
                    studentId: "STU001",
                    studentName: "Ahmed Hassan",
                    overallScore: 85,
                    evaluationsCount: 12,
                    categories: {
                      clinicalSkills: 85,
                      medicalKnowledge: 88,
                      communication: 82,
                      professionalism: 90,
                      teamwork: 83,
                    },
                    lastEvaluation: "2025-01-24",
                    status: "on-track",
                  },
                ],
                categoryBreakdown: [
                  {
                    category: "Clinical Skills",
                    averageScore: 83,
                    totalStudents: 12,
                    trend: "up",
                    percentageChange: 5,
                  },
                ],
                evaluationTrends: [
                  {
                    date: "2025-01-24",
                    completedCount: 42,
                    averageScore: 85,
                    students: 12,
                  },
                ],
                performanceAlerts: [],
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
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {studentAssignments.map((student, idx) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition duration-150 ease-out"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                          {student.name.split(" ")[0][0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{student.name}</p>
                          <p className="text-sm text-slate-500">Level {student.level}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          student.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : student.status === "at_risk"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {student.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Progress</span>
                        <span className="text-sm font-bold text-slate-900">{student.progress}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${student.progress}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                        />
                      </div>
                    </div>

                    <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition duration-150 ease-out text-sm font-medium active:scale-[0.98]">
                      View Details
                    </button>
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
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6">Supervision Schedule</h3>
              <div className="space-y-3">
                {[
                  { day: "Monday", time: "08:00 AM - 12:00 PM", location: "Ward A" },
                  { day: "Wednesday", time: "02:00 PM - 06:00 PM", location: "Ward B" },
                  { day: "Friday", time: "09:00 AM - 01:00 PM", location: "Operating Theatre" },
                ].map((slot, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition duration-150 ease-out"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{slot.day}</p>
                      <p className="text-sm text-slate-600">{slot.time}</p>
                    </div>
                    <p className="text-sm font-medium text-slate-700">{slot.location}</p>
                  </div>
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
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6">Notifications</h3>
              <div className="space-y-3">
                {[
                  {
                    type: "alert",
                    title: "Student At Risk",
                    message: "Omar Khalid is showing signs of struggle. Consider additional guidance.",
                    time: "2 hours ago",
                  },
                  {
                    type: "info",
                    title: "New Student Assignment",
                    message: "You have been assigned 1 new student.",
                    time: "1 day ago",
                  },
                  {
                    type: "success",
                    title: "Observation Completed",
                    message: "Your observation for Ahmed Hassan has been recorded.",
                    time: "3 days ago",
                  },
                ].map((notif, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                    className={`p-4 rounded-xl border-l-4 ${
                      notif.type === "alert"
                        ? "bg-red-50 border-red-500"
                        : notif.type === "info"
                        ? "bg-blue-50 border-blue-500"
                        : "bg-emerald-50 border-emerald-500"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{notif.title}</p>
                        <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap">{notif.time}</span>
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
