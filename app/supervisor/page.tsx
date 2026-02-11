"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";
import { TrendingUp, Users, Target, BarChart3, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import Reveal from "@/components/Reveal";
import { SupervisorNotifications } from "@/components/supervisor-notifications";

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

interface AcademicGoal {
  id: string;
  studentId: string;
  type: "academic";
  category: string;
  targetValue: number;
  deadline: string;
  setBy: "supervisor";
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

// Empty initial state - students will be added when they create applications
// Data will be synced from student applications and observerships

export default function SupervisorDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<
    "overview" | "observerships" | "students" | "forms" | "roles" | "applications" | "progress" | "goals"
  >("overview");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [progressForm, setProgressForm] = useState({
    category: "skills",
    value: 0,
    notes: "",
  });
  const [academicGoals, setAcademicGoals] = useState<AcademicGoal[]>([]);
  const [goalForm, setGoalForm] = useState({
    studentId: "",
    category: "skills",
    targetValue: 80,
    deadline: "",
  });
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    name: "",
    gmuid: "",
    year: 1,
    category: "year-1",
  });

  useEffect(() => {
    if (!user || user.role !== "supervisor") {
      router.push("/login");
      return;
    }
    queueMicrotask(() => setIsCheckingAuth(false));
  }, [user, router]);

  // Load students from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("supervisor_students");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as StudentData[];
          queueMicrotask(() => setStudents(parsed));
        } catch {}
      }
    }
  }, []);

  // Save students to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("supervisor_students", JSON.stringify(students));
      } catch {}
    }
  }, [students]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedGoals = window.localStorage.getItem("student_goals");
      if (savedGoals) {
        try {
          const parsed = JSON.parse(savedGoals) as AcademicGoal[];
          queueMicrotask(() => setAcademicGoals(parsed.filter((g) => g.type === "academic")));
        } catch {}
      }
    }
  }, []);

  const promoteStudent = (id: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, level: Math.min(s.level + 1, 5) } : s
      )
    );
  };

  const addAcademicGoal = () => {
    if (!goalForm.studentId || !goalForm.deadline) return;
    const newGoal: AcademicGoal = {
      id: Date.now().toString(),
      studentId: goalForm.studentId,
      type: "academic",
      category: goalForm.category,
      targetValue: goalForm.targetValue,
      deadline: goalForm.deadline,
      setBy: "supervisor",
    };

    const saved = window.localStorage.getItem("student_goals");
    const existing = saved ? (JSON.parse(saved) as AcademicGoal[]) : [];
    const updated = [...existing, newGoal];
    window.localStorage.setItem("student_goals", JSON.stringify(updated));
    setAcademicGoals(updated.filter((g) => g.type === "academic"));
    setGoalForm({ studentId: "", category: "skills", targetValue: 80, deadline: "" });
  };

  const deleteAcademicGoal = (goalId: string) => {
    const saved = window.localStorage.getItem("student_goals");
    const existing = saved ? (JSON.parse(saved) as AcademicGoal[]) : [];
    const updated = existing.filter((g) => g.id !== goalId);
    window.localStorage.setItem("student_goals", JSON.stringify(updated));
    setAcademicGoals(updated.filter((g) => g.type === "academic"));
  };

  const addStudentManually = () => {
    if (!newStudentForm.name.trim() || !newStudentForm.gmuid.trim()) {
      alert("Please fill in student name and GMUID");
      return;
    }
    const newStudent: StudentData = {
      id: `stu-${Date.now()}`,
      name: newStudentForm.name,
      gmuid: newStudentForm.gmuid,
      year: newStudentForm.year,
      formProgress: 0,
      category: newStudentForm.category,
      avgProgress: 0,
      entries: 0,
      lastUpdate: new Date().toISOString().slice(0, 10),
      completedPrograms: 0,
      level: 1,
      role: undefined,
      formsAssigned: [],
      observerships: [],
      applications: [],
    };
    const updated = [...students, newStudent];
    setStudents(updated);
    window.localStorage.setItem("supervisor_students", JSON.stringify(updated));
    setShowAddStudentModal(false);
    setNewStudentForm({ name: "", gmuid: "", year: 1, category: "year-1" });
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
    setStudents([]);
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

  if (!user || user.role !== "supervisor") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center">
        <LiquidParallax />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />
        <div className="relative text-center">
          <div className="w-12 h-12 border-4 border-indigo-400/40 border-t-indigo-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (isCheckingAuth) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center">
        <LiquidParallax />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />
        <div className="relative text-center">
          <div className="w-12 h-12 border-4 border-indigo-400/40 border-t-indigo-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading supervisor dashboard...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-purple-900/20 to-slate-950 flex items-center justify-center">
        <LiquidParallax depth={14} className="opacity-70" />
        <p className="text-slate-300 relative z-10">Loading supervisor dashboard...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-900 via-slate-950 to-black">
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
                <h1 className="text-5xl font-bold bg-linear-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent flex items-center gap-2">
                  Supervisor Dashboard
                </h1>
                <p className="text-xl text-slate-300">Track student progress, visualize clinical development, and gain AI-powered insights</p>
              </div>
            </div>
            {user && <SupervisorNotifications userId={user.id} />}
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
                className={`p-6 rounded-xl border border-white/10 bg-linear-to-br ${stat.color}/10 backdrop-blur-sm hover:border-white/20 transition-all`}
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
            { id: "goals", label: "Goals" },
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddStudentModal(true)}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-lg text-base flex items-center gap-2"
          >
            <span className="text-xl">➕</span> ADD STUDENT MANUALLY
          </motion.button>
          <button onClick={resetDemo} className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 text-sm">
            Reset Demo Data
          </button>
          <button onClick={exportToCSV} className="px-4 py-2 rounded-md bg-linear-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white text-sm">
            Export to CSV
          </button>
          <label className="px-4 py-2 rounded-md bg-linear-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white text-sm cursor-pointer">
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
                      className="text-xs px-3 py-1 rounded-md bg-linear-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
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
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddStudentModal(true)}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-lg text-lg flex items-center justify-center gap-3 mb-6"
            >
              <span className="text-2xl">➕</span> ADD STUDENT MANUALLY
            </motion.button>
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
                            <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className="bg-linear-to-r from-cyan-500 to-indigo-500 h-2 rounded-full" />
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
          <>
            <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-cyan-600/20 to-indigo-600/20 border-2 border-cyan-500/50">
              <h3 className="text-xl font-bold text-cyan-200 mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span> Quick Add Observership
              </h3>
              <p className="text-sm text-cyan-100 mb-4">Select a student below and use the form in their card to add observerships/electives</p>
            </div>
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
                            className="bg-linear-to-r from-cyan-500 to-indigo-500 h-2 rounded-full"
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
                      className="text-xs px-3 py-1 rounded-md bg-linear-to-r from-cyan-600 to-indigo-600 text-white"
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
          </>
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
          <>
            <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50">
              <h3 className="text-xl font-bold text-blue-200 mb-4 flex items-center gap-2">
                <span className="text-2xl">📄</span> Assign Forms to Students
              </h3>
              <p className="text-sm text-blue-100 mb-4">Click the buttons below each student to assign Consent, Checklist, or Feedback forms</p>
            </div>
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
          </>
        )}

        {/* Goals Tab */}
        {activeTab === "goals" && (
          <>
            <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-2 border-green-500/50">
              <h3 className="text-xl font-bold text-green-200 mb-2 flex items-center gap-2">
                <span className="text-2xl">🎯</span> Academic Goal Assignment
              </h3>
              <p className="text-sm text-green-100">Use the form below to assign academic goals to students</p>
            </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-300" />
                  Academic Goal Assignment
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300">Student</label>
                    <select
                      value={goalForm.studentId}
                      onChange={(e) => setGoalForm({ ...goalForm, studentId: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    >
                      <option value="">Select student...</option>
                      {filteredStudents.map((student) => (
                        <option key={student.id} value={student.id}>{student.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-300">Category</label>
                    <select
                      value={goalForm.category}
                      onChange={(e) => setGoalForm({ ...goalForm, category: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    >
                      {progressCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-300">Target: {goalForm.targetValue}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={goalForm.targetValue}
                      onChange={(e) => setGoalForm({ ...goalForm, targetValue: parseInt(e.target.value, 10) })}
                      className="w-full mt-2 accent-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-300">Deadline</label>
                    <input
                      type="date"
                      value={goalForm.deadline}
                      onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                  </div>
                  <button
                    onClick={addAcademicGoal}
                    className="w-full px-4 py-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-600 text-white font-semibold hover:opacity-90 transition"
                  >
                    Assign Academic Goal
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {filteredStudents.length === 0 ? (
                <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-slate-300">
                  No students available to assign goals.
                </div>
              ) : (
                filteredStudents.map((student) => {
                  const studentGoals = academicGoals.filter((g) => g.studentId === student.id);
                  return (
                    <div key={student.id} className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-white">{student.name}</h4>
                          <p className="text-xs text-slate-400">Academic Goals</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                          {studentGoals.length} goals
                        </span>
                      </div>
                      {studentGoals.length > 0 ? (
                        <div className="space-y-2">
                          {studentGoals.map((goal) => (
                            <div key={goal.id} className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-white capitalize">{goal.category}</p>
                                <p className="text-xs text-slate-400">
                                  Target: {goal.targetValue}% • Due {new Date(goal.deadline).toLocaleDateString()}
                                </p>
                              </div>
                              <button
                                onClick={() => deleteAcademicGoal(goal.id)}
                                className="text-xs px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">No academic goals assigned yet.</p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
          </>
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
                <div className="space-y-2 max-h-150 overflow-y-auto">
                  {filteredStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student.id)}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        selectedStudent === student.id
                          ? "bg-linear-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400"
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
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 min-h-30"
                        rows={5}
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      onClick={handleLogProgress}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-4 bg-linear-to-r from-cyan-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-xl shadow-lg transition-all"
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

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-purple-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Add Student Manually
              </h2>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="text-slate-400 text-2xl">×</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Student Name *</label>
                <input
                  type="text"
                  value={newStudentForm.name}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  placeholder="e.g., John Smith"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">GMUID *</label>
                <input
                  type="text"
                  value={newStudentForm.gmuid}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, gmuid: e.target.value })}
                  placeholder="e.g., GMU-12345"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Year of Study</label>
                <select
                  value={newStudentForm.year}
                  onChange={(e) => {
                    const year = parseInt(e.target.value);
                    setNewStudentForm({ ...newStudentForm, year, category: `year-${year}` });
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(y => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg border border-white/20 text-slate-300 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={addStudentManually}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-lg transition-all"
                >
                  Add Student
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
