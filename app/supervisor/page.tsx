"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Target, BarChart3, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import Reveal from "@/components/Reveal";

interface Observership {
  id: string;
  title: string;
  type: "observership" | "elective";
  totalSessions: number;
  sessionsCompleted: number;
  assignedSupervisor?: string;
}

interface ApplicationRecord {
  id: string;
  program: string;
  status: "pending" | "approved" | "declined" | "waitlisted";
  appliedOn: string;
}

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
  level: number; // 1-5
  role?: string;
  formsAssigned?: string[];
  observerships?: Observership[];
  applications?: ApplicationRecord[];
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
    level: 4,
    role: "Observer",
    formsAssigned: ["Consent", "Checklist"],
    observerships: [
      { id: "OBS-1", title: "Internal Medicine", type: "observership", totalSessions: 10, sessionsCompleted: 8, assignedSupervisor: "Dr. Aisha Al Shehhi" },
      { id: "ELC-1", title: "Cardiology Elective", type: "elective", totalSessions: 12, sessionsCompleted: 9, assignedSupervisor: "Prof. Mohammed Al Kaabi" },
    ],
    applications: [
      { id: "APP-101", program: "Surgery Observership", status: "approved", appliedOn: "2025-01-05" },
      { id: "APP-102", program: "Radiology Elective", status: "pending", appliedOn: "2025-01-18" },
    ],
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
    level: 3,
    role: "Observer",
    formsAssigned: ["Consent"],
    observerships: [
      { id: "OBS-2", title: "Pediatrics", type: "observership", totalSessions: 8, sessionsCompleted: 5, assignedSupervisor: "Dr. Latifa Al Mansoori" },
      { id: "ELC-2", title: "Dermatology Elective", type: "elective", totalSessions: 6, sessionsCompleted: 3, assignedSupervisor: "Dr. Hana Al Hashmi" },
    ],
    applications: [
      { id: "APP-103", program: "Neurology Observership", status: "waitlisted", appliedOn: "2025-01-10" },
    ],
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
    level: 2,
    role: "Observer",
    formsAssigned: [],
    observerships: [
      { id: "OBS-3", title: "Emergency Medicine", type: "observership", totalSessions: 10, sessionsCompleted: 4, assignedSupervisor: "Dr. Omar Al Janabi" },
    ],
    applications: [
      { id: "APP-104", program: "Orthopedics Elective", status: "declined", appliedOn: "2025-01-12" },
    ],
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
    level: 5,
    role: "Team Lead",
    formsAssigned: ["Consent", "Checklist", "Feedback"],
    observerships: [
      { id: "OBS-4", title: "Surgery", type: "observership", totalSessions: 12, sessionsCompleted: 12, assignedSupervisor: "Prof. Ahmed Al Zaabi" },
      { id: "ELC-3", title: "ICU Elective", type: "elective", totalSessions: 8, sessionsCompleted: 7, assignedSupervisor: "Dr. Salma Al Mazrouei" },
    ],
    applications: [
      { id: "APP-105", program: "Pathology Observership", status: "approved", appliedOn: "2025-01-08" },
    ],
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
    level: 1,
    role: "Observer",
    formsAssigned: [],
    observerships: [
      { id: "OBS-5", title: "Family Medicine", type: "observership", totalSessions: 6, sessionsCompleted: 2 },
    ],
    applications: [
      { id: "APP-106", program: "Anesthesiology Elective", status: "pending", appliedOn: "2025-01-21" },
    ],
  },
];

export default function SupervisorDashboard() {
  const getInitialStudents = () => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("supervisor_students");
      if (saved) {
        try {
          return JSON.parse(saved) as StudentData[];
        } catch {}
      }
    }
    return mockStudents;
  };

  const [students, setStudents] = useState<StudentData[]>(getInitialStudents);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<
    "overview" | "observerships" | "students" | "forms" | "roles" | "applications" | "progress"
  >("overview");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [progressForm, setProgressForm] = useState({
    category: "skills",
    value: 0,
    notes: "",
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("supervisor_students", JSON.stringify(students));
    } catch {}
  }, [students]);

  const promoteStudent = (id: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, level: Math.min(s.level + 1, 5) } : s
      )
    );
  };

  const levelBadge = (level: number) => {
    const labels = ["Novice", "Junior", "Intermediate", "Advanced", "Leader"];
    const colors = [
      "bg-slate-600",
      "bg-blue-600",
      "bg-indigo-600",
      "bg-purple-600",
      "bg-pink-600",
    ];
    return { label: labels[level - 1], color: colors[level - 1] };
  };

  const generateObserverId = useCallback(() => {
    return `OBS-${Math.random().toString(36).slice(2, 7)}`;
  }, []);

  const addObservership = useCallback((id: string, obs: Omit<Observership, "id">) => {
    const newObs: Observership = { id: generateObserverId(), ...obs };
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, observerships: [...(s.observerships || []), newObs] } : s))
    );
  }, [generateObserverId]);

  const resetDemo = () => {
    setStudents(mockStudents);
    try {
      window.localStorage.removeItem("supervisor_students");
    } catch {}
  };

  const updateSessionCount = (studentId: string, obsId: string, delta: number) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              observerships: (s.observerships || []).map((obs) =>
                obs.id === obsId
                  ? {
                      ...obs,
                      sessionsCompleted: Math.max(
                        0,
                        Math.min(obs.totalSessions, obs.sessionsCompleted + delta)
                      ),
                    }
                  : obs
              ),
            }
          : s
      )
    );
  };

  const handleLogProgress = () => {
    if (!selectedStudent || progressForm.value < 0 || progressForm.value > 100) return;

    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      category: progressForm.category,
      value: progressForm.value,
      notes: progressForm.notes,
    };

    // Update student's progress entries in localStorage
    const storageKey = `progress_${selectedStudent}`;
    const existing = localStorage.getItem(storageKey);
    const entries = existing ? JSON.parse(existing) : [];
    entries.push(newEntry);
    localStorage.setItem(storageKey, JSON.stringify(entries));

    // Update student stats
    setStudents((prev) =>
      prev.map((s) =>
        s.id === selectedStudent
          ? { ...s, entries: s.entries + 1, lastUpdate: new Date().toISOString().slice(0, 10) }
          : s
      )
    );

    // Reset form
    setProgressForm({ category: "skills", value: 0, notes: "" });
  };

  const progressCategories = [
    { id: "skills", label: "Clinical Skills", emoji: "🏥" },
    { id: "knowledge", label: "Medical Knowledge", emoji: "📚" },
    { id: "communication", label: "Communication", emoji: "💬" },
    { id: "professionalism", label: "Professionalism", emoji: "⭐" },
  ];

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Name",
      "GMUID",
      "Year",
      "Level",
      "Role",
      "FormProgress",
      "AvgProgress",
      "Entries",
      "CompletedPrograms",
      "FormsAssigned",
      "Observerships",
      "Applications",
    ];
    const rows = students.map((s) => [
      s.id,
      s.name,
      s.gmuid,
      s.year,
      s.level,
      s.role || "",
      s.formProgress,
      s.avgProgress,
      s.entries,
      s.completedPrograms,
      (s.formsAssigned || []).join(";"),
      (s.observerships || [])
        .map((o) => `${o.title}|${o.type}|${o.totalSessions}|${o.sessionsCompleted}`)
        .join(";"),
      (s.applications || [])
        .map((a) => `${a.program}|${a.status}|${a.appliedOn}`)
        .join(";"),
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `supervisor-data-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n");
        const headers = lines[0].split(",");
        const imported: StudentData[] = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(",");
          const formsAssigned = values[10] ? values[10].split(";").filter(Boolean) : [];
          const observerships = values[11]
            ? values[11].split(";").filter(Boolean).map((o) => {
                const [title, type, totalSessions, sessionsCompleted] = o.split("|");
                return {
                  id: `OBS-${Math.random().toString(36).slice(2, 7)}`,
                  title,
                  type: type as "observership" | "elective",
                  totalSessions: parseInt(totalSessions, 10),
                  sessionsCompleted: parseInt(sessionsCompleted, 10),
                };
              })
            : [];
          const applications = values[12]
            ? values[12].split(";").filter(Boolean).map((a) => {
                const [program, status, appliedOn] = a.split("|");
                return {
                  id: `APP-${Math.random().toString(36).slice(2, 7)}`,
                  program,
                  status: status as "pending" | "approved" | "declined" | "waitlisted",
                  appliedOn,
                };
              })
            : [];
          imported.push({
            id: values[0],
            name: values[1],
            gmuid: values[2],
            year: parseInt(values[3], 10),
            level: parseInt(values[4], 10),
            role: values[5] || undefined,
            formProgress: parseInt(values[6], 10),
            avgProgress: parseInt(values[7], 10),
            entries: parseInt(values[8], 10),
            completedPrograms: parseInt(values[9], 10),
            formsAssigned,
            observerships,
            applications,
            category: "Imported",
            lastUpdate: new Date().toISOString().slice(0, 10),
          });
        }
        setStudents(imported);
      } catch (err) {
        alert("Failed to import CSV. Please check file format.");
      }
    };
    reader.readAsText(file);
  };
  const categories = [
    { id: "all", label: "All Students", emoji: "👥" },
    { id: "year-7", label: "Year 7", emoji: "🌟" },
    { id: "year-6", label: "Year 6", emoji: "⭐" },
    { id: "year-5", label: "Year 5", emoji: "🏆" },
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
      "Year 7": Math.round(
        students
          .filter((s) => s.year === 7)
          .reduce((sum, s) => sum + s.formProgress, 0) /
          (students.filter((s) => s.year === 7).length || 1)
      ),
      "Year 6": Math.round(
        students
          .filter((s) => s.year === 6)
          .reduce((sum, s) => sum + s.formProgress, 0) /
          (students.filter((s) => s.year === 6).length || 1)
      ),
      "Year 5": Math.round(
        students
          .filter((s) => s.year === 5)
          .reduce((sum, s) => sum + s.formProgress, 0) /
          (students.filter((s) => s.year === 5).length || 1)
      ),
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black">
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
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent flex items-center gap-2">
                  Supervisor Dashboard
                </h1>
                <p className="text-xl text-slate-300">Track student progress, visualize clinical development, and gain AI-powered insights</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Students", value: overallStats.totalStudents, icon: Users, color: "from-purple-500 to-pink-500" },
            { label: "Avg Form Progress", value: `${overallStats.avgFormProgress}%`, icon: TrendingUp, color: "from-blue-500 to-cyan-500" },
            { label: "Avg Entries", value: overallStats.avgEntries, icon: Target, color: "from-green-500 to-emerald-500" },
            { label: "Programs Completed", value: overallStats.completedPrograms, icon: BarChart3, color: "from-orange-500 to-yellow-500" },
          ].map((stat, idx) => (
            <Reveal key={stat.label} delay={0.1 * idx} y={20}>
              <motion.div
                whileHover={{ y: -4 }}
                className={`p-6 rounded-xl border border-white/10 bg-gradient-to-br ${stat.color}/10 backdrop-blur-sm hover:border-white/20 transition-all`}
              >
                <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
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
                  <span className="text-green-300 font-semibold">Year Averages:</span> Year 7: {insights.yearAverages["Year 7"]}% | Year 6: {insights.yearAverages["Year 6"]}% | Year 5: {insights.yearAverages["Year 5"]}% | Year 4: {insights.yearAverages["Year 4"]}% | Year 3: {insights.yearAverages["Year 3"]}% | Year 2: {insights.yearAverages["Year 2"]}% | Year 1: {insights.yearAverages["Year 1"]}%
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

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "progress", label: "Log Progress" },
            { id: "observerships", label: "Observerships" },
            { id: "students", label: "Students" },
            { id: "forms", label: "Forms" },
            { id: "roles", label: "Roles" },
            { id: "applications", label: "Applications" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-linear-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                  : "bg-white/10 text-slate-300 hover:bg-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <button onClick={resetDemo} className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 text-sm">
            Reset Demo Data
          </button>
          <button onClick={exportToCSV} className="px-4 py-2 rounded-md bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white text-sm">
            Export to CSV
          </button>
          <label className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white text-sm cursor-pointer">
            Import from CSV
            <input type="file" accept=".csv" onChange={importFromCSV} className="hidden" />
          </label>
        </div>

        {/* Student Progress Grid */}
        {activeTab === "overview" && (
          filteredStudents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student, idx) => (
              <Reveal key={student.id} delay={0.05 * idx} y={20}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/20 transition-all"
                >
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">{student.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full text-white ${levelBadge(student.level).color}`}>
                        {levelBadge(student.level).label}
                      </span>
                    </div>
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

                  {/* Supervisor Assignments */}
                  {student.observerships && student.observerships.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs font-semibold text-cyan-300 mb-2">Assigned Supervisors</p>
                      <div className="space-y-1">
                        {student.observerships.map((obs) => (
                          <div key={obs.id} className="text-xs text-slate-400 flex items-start gap-2">
                            <span className="text-cyan-400 mt-1">→</span>
                            <div>
                              <p className="text-slate-300">{obs.title}</p>
                              {obs.assignedSupervisor && (
                                <p className="text-cyan-300 text-xs">{obs.assignedSupervisor}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Promote Action */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => promoteStudent(student.id)}
                      className="text-xs px-3 py-1 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                    >
                      Promote Level
                    </button>
                  </div>
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
          )
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="space-y-6">
            {filteredStudents.map((student) => (
              <div key={student.id} className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{student.name}</h3>
                    <p className="text-xs text-purple-300">GMUID: {student.gmuid} | Year {student.year}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full text-white ${levelBadge(student.level).color}`}>
                    {levelBadge(student.level).label}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-slate-400 mb-2">Role</p>
                    <p className="text-sm text-slate-200">{student.role || "None"}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-slate-400 mb-2">Assigned Forms</p>
                    <div className="flex flex-wrap gap-2">
                      {(student.formsAssigned || []).length === 0 ? (
                        <span className="text-xs text-slate-400">None</span>
                      ) : (
                        (student.formsAssigned || []).map((f) => (
                          <span key={f} className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                            {f}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-slate-400 mb-2">Observerships / Electives</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {(student.observerships || []).map((obs) => {
                      const pct = Math.round((obs.sessionsCompleted / obs.totalSessions) * 100);
                      return (
                        <div key={obs.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm text-slate-300">
                              {obs.title} <span className="text-xs text-slate-400">({obs.type})</span>
                            </p>
                            <p className="text-sm font-bold text-cyan-400">{pct}%</p>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2 rounded-full" />
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-slate-400">Sessions: {obs.sessionsCompleted}/{obs.totalSessions}</p>
                            <div className="flex gap-1">
                              <button
                                onClick={() => updateSessionCount(student.id, obs.id, -1)}
                                className="px-2 py-0.5 text-xs rounded bg-white/10 hover:bg-white/20"
                              >
                                -
                              </button>
                              <button
                                onClick={() => updateSessionCount(student.id, obs.id, 1)}
                                className="px-2 py-0.5 text-xs rounded bg-white/10 hover:bg-white/20"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-slate-400 mb-2">Applications</p>
                  <div className="space-y-2">
                    {(student.applications || []).map((app) => (
                      <div key={app.id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-300">{app.program}</p>
                          <p className="text-xs text-slate-400">Applied: {new Date(app.appliedOn).toLocaleDateString()}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-slate-300">{app.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Observerships Tab */}
        {activeTab === "observerships" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div key={student.id} className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white">{student.name}</h3>
                  <p className="text-xs text-purple-300">GMUID: {student.gmuid}</p>
                </div>
                <div className="space-y-3">
                  {(student.observerships || []).map((obs) => {
                    const pct = Math.round((obs.sessionsCompleted / obs.totalSessions) * 100);
                    return (
                      <div key={obs.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm text-slate-300">
                            {obs.title} <span className="text-xs text-slate-400">({obs.type})</span>
                          </p>
                          <p className="text-sm font-bold text-cyan-400">{pct}%</p>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2 rounded-full"
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-slate-400">
                            Sessions: {obs.sessionsCompleted}/{obs.totalSessions}
                          </p>
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateSessionCount(student.id, obs.id, -1)}
                              className="px-2 py-0.5 text-xs rounded bg-white/10 hover:bg-white/20"
                            >
                              -
                            </button>
                            <button
                              onClick={() => updateSessionCount(student.id, obs.id, 1)}
                              className="px-2 py-0.5 text-xs rounded bg-white/10 hover:bg-white/20"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Quick add observership */}
                <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-slate-400 mb-2">Create Observership/Elective</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input id={`title-${student.id}`} placeholder="Title" className="px-2 py-1 text-xs rounded bg-white/10 text-slate-200" />
                    <select id={`type-${student.id}`} className="px-2 py-1 text-xs rounded bg-white/10 text-slate-200">
                      <option value="observership">Observership</option>
                      <option value="elective">Elective</option>
                    </select>
                    <input id={`total-${student.id}`} type="number" placeholder="Total Sessions" className="px-2 py-1 text-xs rounded bg-white/10 text-slate-200" />
                    <input id={`done-${student.id}`} type="number" placeholder="Completed" className="px-2 py-1 text-xs rounded bg-white/10 text-slate-200" />
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      className="text-xs px-3 py-1 rounded-md bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
                      onClick={() => {
                        const title = (document.getElementById(`title-${student.id}`) as HTMLInputElement)?.value || "Untitled";
                        const type = ((document.getElementById(`type-${student.id}`) as HTMLSelectElement)?.value as any) || "observership";
                        const totalSessions = parseInt((document.getElementById(`total-${student.id}`) as HTMLInputElement)?.value || "6", 10);
                        const sessionsCompleted = parseInt((document.getElementById(`done-${student.id}`) as HTMLInputElement)?.value || "0", 10);
                        addObservership(student.id, { title, type, totalSessions, sessionsCompleted });
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === "roles" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div key={student.id} className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{student.name}</h3>
                  <span className="text-xs text-slate-400">Current: {student.role || "None"}</span>
                </div>
                <div className="flex gap-2">
                  {["Observer", "Elective", "Team Lead"].map((r) => (
                    <button
                      key={r}
                      onClick={() =>
                        setStudents((prev) => prev.map((s) => (s.id === student.id ? { ...s, role: r } : s)))
                      }
                      className="text-xs px-3 py-1 rounded-md bg-white/10 hover:bg-white/20"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Forms Tab */}
        {activeTab === "forms" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div key={student.id} className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-white mb-2">{student.name}</h3>
                <div className="mb-3">
                  <p className="text-xs text-slate-400">Assigned Forms:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(student.formsAssigned || []).map((f) => (
                      <span key={f} className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  {["Consent", "Checklist", "Feedback"].map((f) => (
                    <button
                      key={f}
                      onClick={() =>
                        setStudents((prev) =>
                          prev.map((s) =>
                            s.id === student.id
                              ? { ...s, formsAssigned: Array.from(new Set([...(s.formsAssigned || []), f])) }
                              : s
                          )
                        )
                      }
                      className="text-xs px-3 py-1 rounded-md bg-white/10 hover:bg-white/20"
                    >
                      Assign {f}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-white mb-3">{student.name}</h3>
                <div className="space-y-3">
                  {(student.applications || []).map((app) => (
                    <div key={app.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-300">{app.program}</p>
                          <p className="text-xs text-slate-400">Applied: {new Date(app.appliedOn).toLocaleDateString()}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-slate-300">
                          {app.status}
                        </span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        {[
                          { label: "Approve", status: "approved" },
                          { label: "Decline", status: "declined" },
                          { label: "Waitlist", status: "waitlisted" },
                        ].map((action) => (
                          <button
                            key={action.label}
                            onClick={() =>
                              setStudents((prev) =>
                                prev.map((s) =>
                                  s.id === student.id
                                    ? {
                                        ...s,
                                        applications: (s.applications || []).map((a) =>
                                          a.id === app.id ? { ...a, status: action.status as any } : a
                                        ),
                                      }
                                    : s
                                )
                              )
                            }
                            className="text-xs px-3 py-1 rounded-md bg-white/10 hover:bg-white/20"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Progress Logging Tab */}
        {activeTab === "progress" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Student Selection Panel */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-white mb-4">Select Student</h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student.id)}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        selectedStudent === student.id
                          ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400"
                          : "bg-white/5 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <p className="text-sm font-semibold text-white">{student.name}</p>
                      <p className="text-xs text-slate-400">{student.gmuid}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300">
                          {student.entries} entries
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${levelBadge(student.level).color} text-white`}>
                          {levelBadge(student.level).label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Entry Form */}
            <div className="lg:col-span-2">
              {selectedStudent ? (
                <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Log Progress Entry</h3>
                    <p className="text-slate-300">
                      Recording progress for: <span className="font-semibold text-cyan-400">
                        {students.find(s => s.id === selectedStudent)?.name}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">Category</label>
                      <div className="grid grid-cols-2 gap-3">
                        {progressCategories.map((cat) => (
                          <motion.button
                            key={cat.id}
                            onClick={() => setProgressForm({ ...progressForm, category: cat.id })}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              progressForm.category === cat.id
                                ? "border-cyan-400 bg-cyan-500/20"
                                : "border-white/10 bg-white/5 hover:border-white/20"
                            }`}
                          >
                            <div className="text-3xl mb-2">{cat.emoji}</div>
                            <div className="text-sm font-medium text-slate-200">{cat.label}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Progress Value Slider */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">
                        Progress Assessment: {progressForm.value}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={progressForm.value}
                        onChange={(e) => setProgressForm({ ...progressForm, value: parseInt(e.target.value) })}
                        className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-2">
                        <span>Beginning</span>
                        <span>Developing</span>
                        <span>Proficient</span>
                        <span>Expert</span>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Observation Notes</label>
                      <textarea
                        value={progressForm.notes}
                        onChange={(e) => setProgressForm({ ...progressForm, notes: e.target.value })}
                        placeholder="e.g., Demonstrated improved suturing technique, actively participated in 3 procedures, showed excellent patient communication..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 min-h-[120px]"
                        rows={5}
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      onClick={handleLogProgress}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-xl shadow-lg transition-all"
                    >
                      Save Progress Entry
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="p-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-bold text-white mb-2">No Student Selected</h3>
                  <p className="text-slate-400">
                    Select a student from the list to log their clinical progress
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
