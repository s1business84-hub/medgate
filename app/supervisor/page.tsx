"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Target, BarChart3, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import Reveal from "@/components/Reveal";

interface StudentData {
  id: string;
  name: string;
  gmuid: string;
  year: number;
  formProgress: number;
  category: string;
  avgProgress: number;
  entries: number;
  lastUpdate: string;
  completedPrograms: number;
}

// Mock demo data
const mockStudents: StudentData[] = [
  {
    id: "STU001",
    name: "Ahmed Al Mansouri",
    gmuid: "GMU-2024-001",
    year: 4,
    formProgress: 85,
    category: "Clinical Skills",
    avgProgress: 82,
    entries: 12,
    lastUpdate: "2025-01-23",
    completedPrograms: 3,
  },
  {
    id: "STU002",
    name: "Fatima Al Kaabi",
    gmuid: "GMU-2024-002",
    year: 3,
    formProgress: 72,
    category: "Medical Knowledge",
    avgProgress: 75,
    entries: 9,
    lastUpdate: "2025-01-22",
    completedPrograms: 2,
  },
  {
    id: "STU003",
    name: "Mohammed Al Owais",
    gmuid: "GMU-2024-003",
    year: 2,
    formProgress: 65,
    category: "Communication",
    avgProgress: 68,
    entries: 8,
    lastUpdate: "2025-01-20",
    completedPrograms: 1,
  },
  {
    id: "STU004",
    name: "Layla Al Mansouri",
    gmuid: "GMU-2024-004",
    year: 4,
    formProgress: 90,
    category: "Professionalism",
    avgProgress: 88,
    entries: 15,
    lastUpdate: "2025-01-24",
    completedPrograms: 4,
  },
  {
    id: "STU005",
    name: "Hassan Al Noor",
    gmuid: "GMU-2024-005",
    year: 1,
    formProgress: 45,
    category: "Clinical Skills",
    avgProgress: 52,
    entries: 5,
    lastUpdate: "2025-01-19",
    completedPrograms: 0,
  },
];

export default function SupervisorDashboard() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Mock demo data
  const mockStudentsLocal: StudentData[] = [
    {
      id: "STU001",
      name: "Ahmed Al Mansouri",
      gmuid: "GMU-2024-001",
      year: 4,
      formProgress: 85,
      category: "Clinical Skills",
      avgProgress: 82,
      entries: 12,
      lastUpdate: "2025-01-23",
      completedPrograms: 3,
    },
    {
      id: "STU002",
      name: "Fatima Al Kaabi",
      gmuid: "GMU-2024-002",
      year: 3,
      formProgress: 72,
      category: "Medical Knowledge",
      avgProgress: 75,
      entries: 9,
      lastUpdate: "2025-01-22",
      completedPrograms: 2,
    },
    {
      id: "STU003",
      name: "Mohammed Al Owais",
      gmuid: "GMU-2024-003",
      year: 2,
      formProgress: 65,
      category: "Communication",
      avgProgress: 68,
      entries: 8,
      lastUpdate: "2025-01-20",
      completedPrograms: 1,
    },
    {
      id: "STU004",
      name: "Layla Al Mansouri",
      gmuid: "GMU-2024-004",
      year: 4,
      formProgress: 90,
      category: "Professionalism",
      avgProgress: 88,
      entries: 15,
      lastUpdate: "2025-01-24",
      completedPrograms: 4,
    },
    {
      id: "STU005",
      name: "Hassan Al Noor",
      gmuid: "GMU-2024-005",
      year: 1,
      formProgress: 45,
      category: "Clinical Skills",
      avgProgress: 52,
      entries: 5,
      lastUpdate: "2025-01-19",
      completedPrograms: 0,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 800);
  }, []);
  const categories = [
    { id: "all", label: "All Students", emoji: "👥" },
    { id: "year-4", label: "Year 4", emoji: "🎓" },
    { id: "year-3", label: "Year 3", emoji: "📚" },
    { id: "year-2", label: "Year 2", emoji: "📖" },
    { id: "year-1", label: "Year 1", emoji: "🌱" },
  ];

  const filteredStudents =
    filter === "all"
      ? students
      : students.filter(
          (s) => s.year === parseInt(filter.split("-")[1])
        );

  // Analytics calculations
  const overallStats = {
    totalStudents: students.length,
    avgFormProgress: Math.round(
      students.reduce((sum, s) => sum + s.formProgress, 0) / (students.length || 1)
    ),
    avgEntries: Math.round(
      students.reduce((sum, s) => sum + s.entries, 0) / (students.length || 1)
    ),
    completedPrograms: students.reduce((sum, s) => sum + s.completedPrograms, 0),
  };

  // AI Insights
  const insights = {
    topPerformer:
      students.length > 0
        ? students.reduce((prev, current) =>
            current.formProgress > prev.formProgress ? current : prev
          )
        : null,
    needsSupport: students.filter((s) => s.formProgress < 60),
    yearAverages: {
      "Year 4": Math.round(
        students
          .filter((s) => s.year === 4)
          .reduce((sum, s) => sum + s.formProgress, 0) /
          (students.filter((s) => s.year === 4).length || 1)
      ),
      "Year 3": Math.round(
        students
          .filter((s) => s.year === 3)
          .reduce((sum, s) => sum + s.formProgress, 0) /
          (students.filter((s) => s.year === 3).length || 1)
      ),
      "Year 2": Math.round(
        students
          .filter((s) => s.year === 2)
          .reduce((sum, s) => sum + s.formProgress, 0) /
          (students.filter((s) => s.year === 2).length || 1)
      ),
      "Year 1": Math.round(
        students
          .filter((s) => s.year === 1)
          .reduce((sum, s) => sum + s.formProgress, 0) /
          (students.filter((s) => s.year === 1).length || 1)
      ),
    },
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-purple-900/20 to-slate-950 flex items-center justify-center">
        <LiquidParallax depth={14} className="opacity-70" />
        <p className="text-slate-300 relative z-10">Loading supervisor dashboard...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-purple-900/20 to-slate-950">
      <LiquidParallax depth={14} className="opacity-70" />

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <Reveal>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <ArrowLeft className="w-6 h-6 text-slate-300" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                  Supervisor Dashboard
                </h1>
                <p className="text-slate-300">Track student progress and clinical development</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Students", value: overallStats.totalStudents, icon: Users },
            { label: "Avg Form Progress", value: `${overallStats.avgFormProgress}%`, icon: TrendingUp },
            { label: "Avg Entries", value: overallStats.avgEntries, icon: Target },
            { label: "Programs Completed", value: overallStats.completedPrograms, icon: BarChart3 },
          ].map((stat, idx) => (
            <Reveal key={stat.label} delay={0.1 * idx} y={20}>
              <motion.div
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <stat.icon className="w-12 h-12 text-purple-400/30" />
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* AI Insights */}
        <Reveal delay={0.3} y={20}>
          <div className="mb-8 p-6 rounded-2xl border border-purple-500/30 bg-purple-500/10 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span> AI Insights
            </h2>
            <div className="space-y-3">
              {insights.topPerformer && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <p className="text-slate-300">
                    <span className="text-purple-300 font-semibold">Top Performer:</span> {insights.topPerformer.name} (GMUID: {insights.topPerformer.gmuid}, Year {insights.topPerformer.year}) with {insights.topPerformer.formProgress}% progress
                  </p>
                </motion.div>
              )}
              {insights.needsSupport.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                >
                  <p className="text-red-300">
                    <span className="font-semibold">Needs Support:</span> {insights.needsSupport.length} student(s) with &lt;60% progress. Consider intervention.
                  </p>
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <p className="text-slate-300">
                  <span className="text-green-300 font-semibold">Year Averages:</span> Year 4: {insights.yearAverages["Year 4"]}% | Year 3: {insights.yearAverages["Year 3"]}% | Year 2: {insights.yearAverages["Year 2"]}% | Year 1: {insights.yearAverages["Year 1"]}%
                </p>
              </motion.div>
            </div>
          </div>
        </Reveal>

        {/* Year Filter */}
        <Reveal delay={0.2} y={20}>
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  filter === cat.id
                    ? "bg-linear-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
              >
                {cat.emoji} {cat.label}
              </motion.button>
            ))}
          </div>
        </Reveal>

        {/* Student Progress Grid */}
        {filteredStudents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student, idx) => (
              <Reveal key={student.id} delay={0.05 * idx} y={20}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/20 transition-all"
                >
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">{student.name}</h3>
                    <p className="text-xs text-purple-300 font-mono mb-1">GMUID: {student.gmuid}</p>
                    <p className="text-sm text-slate-400">Year {student.year} | {student.completedPrograms} programs completed</p>
                  </div>

                  {/* Form Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-slate-300">Form Progress</p>
                      <p className="text-sm font-bold text-cyan-400">{student.formProgress}%</p>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${student.formProgress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-linear-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2 rounded bg-white/5">
                      <p className="text-slate-400">Avg Progress</p>
                      <p className="text-lg font-bold text-slate-200">{student.avgProgress}%</p>
                    </div>
                    <div className="p-2 rounded bg-white/5">
                      <p className="text-slate-400">Log Entries</p>
                      <p className="text-lg font-bold text-slate-200">{student.entries}</p>
                    </div>
                  </div>

                  {/* Last Update */}
                  <p className="text-xs text-slate-500 mt-3">
                    Last update: {new Date(student.lastUpdate).toLocaleDateString()}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={0.2}>
            <div className="text-center py-16 px-6">
              <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-200 mb-2">No Students Found</h2>
              <p className="text-slate-400">
                Adjust your filters to see student data.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
