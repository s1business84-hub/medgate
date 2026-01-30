"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Heart, Users, CheckCircle, Upload, Menu, X, Zap } from "lucide-react";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { AuditExcelButton } from "@/components/audit-excel-button";
import { StudentSessions } from "./sessions";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { AIListingSuggestions } from "@/components/ai-listing-suggestions";
import { SupervisorChat } from "@/components/supervisor-chat";
import { StudentVerificationCenter } from "@/components/student-verification-center";

export default function StudentPortal() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [loadingApps, setLoadingApps] = useState(true);
  const [xpData, setXpData] = useState({ xpPoints: 0, reflectionsCompleted: 0 });
  const [studentStats, setStudentStats] = useState({
    learningHours: 0,
    avgProgress: 0,
    certifications: 0,
  });

  useEffect(() => {
    if (user && user.role === "student") {
      const loadApplications = async () => {
        try {
          const { getApplications, getStudents, getStudentProgress } = await import("@/lib/storage");
          const allApps = getApplications();
          const students = getStudents();
          
          // Find student record by email to get the correct studentId
          const studentRecord = students.find((s: any) => s.email === user.email);
          const myApps = allApps.filter((a: any) => 
            studentRecord ? a.studentId === studentRecord.id : a.studentId === user.id
          );
          
          // Load XP data
          if (studentRecord) {
            const progress = getStudentProgress(studentRecord.id);
            if (progress) {
              setXpData(progress);
            }
            
            // Calculate learning hours, average progress, and certifications
            const completedApps = myApps.filter((a: any) => a.status === 'Completed');
            const totalHours = completedApps.reduce((sum: number, app: any) => sum + (app.totalHours || 0), 0);
            const progressValues = myApps.map((a: any) => a.progressPercentage || 0).filter((p: number) => p > 0);
            const avgProgress = progressValues.length > 0 ? Math.round(progressValues.reduce((a: number, b: number) => a + b, 0) / progressValues.length) : 0;
            const certCount = myApps.filter((a: any) => a.certificateEarned).length;
            
            setStudentStats({
              learningHours: totalHours,
              avgProgress: avgProgress,
              certifications: certCount,
            });
          }
          
          // Load program details for enrichment
          const enrichedApps = await Promise.all(
            myApps.map(async (app: any) => {
              try {
                const mockProgramsRaw = localStorage.getItem("mockPrograms");
                const mockPrograms = mockProgramsRaw ? JSON.parse(mockProgramsRaw) : [];
                const program = mockPrograms.find((p: any) => p.id === app.programId);
                return {
                  ...app,
                  programName: program?.name || "Unknown Program",
                  hospitalName: program?.hospitalName || "Unknown Hospital",
                };
              } catch {
                return app;
              }
            })
          );
          
          setApplications(enrichedApps);
          if (enrichedApps.length > 0 && !selectedApplicationId) {
            setSelectedApplicationId(enrichedApps[0].id);
          }
        } catch (error) {
          console.error("Error loading applications:", error);
        } finally {
          setLoadingApps(false);
        }
      };

      loadApplications();
    }
  }, [user, selectedApplicationId]);

  // If user is logged in and is a student, show full portal
  if (user && user.role === "student") {
    return (
      <div className="relative min-h-screen overflow-hidden text-slate-100">
        <LiquidParallax />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.15),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.12),transparent_35%),radial-gradient(circle_at_40%_80%,rgba(139,92,246,0.13),transparent_38%),linear-gradient(180deg,#0a0e1a_0%,#0f172a_50%,#0a0e1a_100%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-8">
          {/* Header with XP Meter */}
          <Reveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text bg-linear-to-r from-slate-900 via-blue-800 to-slate-900 text-transparent mb-2">Student Portal</h1>
              <p className="text-slate-300">Welcome back, {user.name}!</p>
              {/* Level & XP Section */}
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-lg">
                {/* Level Badge */}
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full text-sm font-bold text-white bg-linear-to-r from-purple-600 to-pink-600">
                    Level {Math.ceil(xpData.xpPoints / 100)}
                  </div>
                </div>
                {/* XP Meter */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-sm text-yellow-400 font-semibold">
                      <Zap className="w-4 h-4" />
                      XP Progress
                    </span>
                    <span className="text-sm font-bold text-yellow-300">{xpData.xpPoints % 100} / 100 XP</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden border border-yellow-500/20">
                    <motion.div
                      className="h-full bg-linear-to-r from-yellow-400 to-orange-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((xpData.xpPoints % 100) * 1, 100)}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/student/career-path"
                className="btn-secondary hover-scale px-4 sm:px-6 py-2 sm:py-3 rounded-lg backdrop-blur-md border-purple-500/30 bg-linear-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-white font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Career Path
              </Link>
              <Link
                href="/student/progress"
                className="btn-secondary hover-scale px-4 sm:px-6 py-2 sm:py-3 rounded-lg backdrop-blur-md border-cyan-500/30 bg-linear-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-white font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7H7v10h6V7z M17 7h-2v4h2V7z M5 20h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v13a2 2 0 002 2z" />
                </svg>
                Progress
              </Link>
              <Link
                href="/student/form-submission"
                className="btn-secondary hover-scale px-4 sm:px-6 py-2 sm:py-3 rounded-lg backdrop-blur-md border-blue-500/30 bg-linear-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 text-white font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Forms
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="btn-secondary hover-scale px-4 sm:px-6 py-2 sm:py-3 rounded-lg backdrop-blur-md border-white/30 bg-white/40"
              >
                Logout
              </button>
              <Link href="/" className="btn-secondary hover-scale px-4 sm:px-6 py-2 sm:py-3 rounded-lg backdrop-blur-md border-white/30 bg-white/40">
                ← Back to Home
              </Link>
            </div>
          </div>
          </Reveal>

          {/* Student Stats */}
          <Reveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Learning Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-cyan-500/30 bg-linear-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Learning Hours</span>
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-cyan-300 mb-1">{studentStats.learningHours}</div>
              <p className="text-xs text-cyan-200/70">hours completed</p>
            </motion.div>

            {/* Average Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-xl border border-purple-500/30 bg-linear-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Avg Progress</span>
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-purple-300 mb-1">{studentStats.avgProgress}%</div>
              <p className="text-xs text-purple-200/70">per course</p>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-emerald-500/30 bg-linear-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Certifications</span>
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-emerald-300 mb-1">{studentStats.certifications}</div>
              <p className="text-xs text-emerald-200/70">{studentStats.certifications === 0 ? 'none yet' : studentStats.certifications === 1 ? 'earned' : 'earned'}</p>
            </motion.div>
          </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Audit Card */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg p-4 sticky top-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-2xl">📋</div>
                  <h3 className="text-lg font-semibold text-white">Your Records</h3>
                </div>
                <p className="text-xs text-slate-300 mb-4">Download copies of your applications, exposure logs, and training records.</p>
                <div className="space-y-2">
                  <AuditExcelButton
                    dataTypes={["applications", "exposureLogs", "completionAttestations"]}
                    filterApplications={(apps) => apps.filter((a) => a.studentId === user.id)}
                    className="w-full border-white/30 bg-white/40 text-slate-800 hover:bg-white/50"
                  />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {/* XP System Reminder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-lg border border-yellow-500/40 bg-linear-to-r from-yellow-500/15 to-orange-500/15 backdrop-blur-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⚡</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-yellow-300 mb-2">XP Earning Guide</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="text-sm text-yellow-100">
                        <p className="font-semibold text-yellow-200 mb-1">Complete Activities:</p>
                        <ul className="space-y-1 text-xs">
                          <li>✓ <strong>+10 XP</strong> per form completion</li>
                          <li>✓ <strong>+5 XP</strong> per application submission</li>
                          <li>✓ <strong>+3 XP</strong> per reflection logged</li>
                        </ul>
                      </div>
                      <div className="text-sm text-yellow-100">
                        <p className="font-semibold text-yellow-200 mb-1">Achievements:</p>
                        <ul className="space-y-1 text-xs">
                          <li>✓ <strong>+15 XP</strong> per program completion</li>
                          <li>✓ <strong>+20 XP</strong> per certification earned</li>
                          <li>✓ <strong>100 XP = Level Up!</strong></li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-xs text-yellow-100/80 mt-2">Keep engaging to level up and unlock new opportunities!</p>
                  </div>
                </div>
              </motion.div>

              <StudentVerificationCenter studentName={user.name} studentEmail={user.email} studentId={user.id} />

              {loadingApps ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-white/5 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <Upload className="w-24 h-24 text-slate-400 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-slate-100 mb-4">No Active Applications</h2>
                  <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                    You don't have any submitted applications yet. Browse available programs and submit your application.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/programs">
                      <Button size="lg" className="bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg">
                        Browse Programs
                      </Button>
                    </Link>
                    <AIListingSuggestions />
                  </div>
                </div>
              ) : (
                <>
                  {/* Application List */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-100">Your Applications</h2>
                    {applications.map(app => {
                      const getStatusColor = (status: string) => {
                        switch (status) {
                          case 'Accepted':
                          case 'Stage 2 Accepted':
                          case 'In Training':
                            return 'bg-green-500/20 text-green-300 border-green-500/30';
                          case 'Pending':
                          case 'Submitted':
                            return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
                          case 'Rejected':
                            return 'bg-red-500/20 text-red-300 border-red-500/30';
                          case 'Completed':
                            return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
                          default:
                            return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
                        }
                      };

                      return (
                        <button
                          key={app.id}
                          onClick={() => setSelectedApplicationId(app.id)}
                          className={`w-full text-left p-4 rounded-lg transition-all ${
                            selectedApplicationId === app.id
                              ? 'bg-white/10 border-2 border-cyan-500/50'
                              : 'bg-white/5 border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-slate-100 mb-1">{app.programName}</h3>
                              <p className="text-sm text-slate-400 mb-2">{app.hospitalName}</p>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span>{app.sessionCount || 1} session{(app.sessionCount || 1) > 1 ? 's' : ''}</span>
                                <span>•</span>
                                <span>Applied {new Date(app.submissionDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="shrink-0">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(app.status)}`}>
                                {app.status}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Application Details */}
                  {selectedApplicationId && (() => {
                    const selected = applications.find(a => a.id === selectedApplicationId);
                    if (!selected) return null;

                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'Accepted':
                        case 'Stage 2 Accepted':
                        case 'In Training':
                          return 'bg-green-500/20 text-green-300 border-green-500/50';
                        case 'Pending':
                        case 'Submitted':
                          return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
                        case 'Rejected':
                          return 'bg-red-500/20 text-red-300 border-red-500/50';
                        case 'Completed':
                          return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
                        default:
                          return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
                      }
                    };

                    const getStatusIcon = (status: string) => {
                      switch (status) {
                        case 'Accepted':
                        case 'Stage 2 Accepted':
                        case 'In Training':
                          return '✓';
                        case 'Pending':
                        case 'Submitted':
                          return '⏳';
                        case 'Rejected':
                          return '✗';
                        case 'Completed':
                          return '🎓';
                        default:
                          return '•';
                      }
                    };

                    return (
                      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg p-6">
                        <div className="mb-6">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <h2 className="text-2xl font-bold text-slate-100 mb-2">{selected?.programName}</h2>
                              <p className="text-slate-300 mb-2">{selected?.hospitalName}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-lg border-2 ${getStatusColor(selected?.status)} flex items-center gap-2`}>
                              <span className="text-xl">{getStatusIcon(selected?.status)}</span>
                              <div>
                                <p className="text-xs opacity-80">Status</p>
                                <p className="text-sm font-bold">{selected?.status}</p>
                              </div>
                            </div>
                          </div>

                          {/* Program Progress Section */}
                          <div className="mt-6 p-4 rounded-lg bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                            <h3 className="text-sm font-bold text-white mb-4">Program Progress</h3>
                            
                            {/* Overall Progress */}
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-slate-300">Overall Completion</span>
                                  <span className="text-sm font-bold text-purple-300">65%</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-linear-to-r from-purple-500 to-pink-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                    transition={{ duration: 0.8 }}
                                  />
                                </div>
                              </div>

                              {/* Form Completion */}
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-slate-300">Form Completion</span>
                                  <span className="text-sm font-bold text-blue-300">52%</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-linear-to-r from-blue-500 to-cyan-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: '52%' }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                  />
                                </div>
                              </div>

                              {/* Module Completion */}
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-slate-300">Module Completion</span>
                                  <span className="text-sm font-bold text-emerald-300">78%</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-linear-to-r from-emerald-500 to-teal-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: '78%' }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {selected?.notes && (
                            <div className="mb-4 p-4 rounded-lg bg-white/10 border border-white/20">
                              <p className="text-xs text-slate-400 mb-1">Notes from Hospital:</p>
                              <p className="text-sm text-slate-200">{selected.notes}</p>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/10 rounded-lg p-3">
                              <p className="text-xs text-slate-400 mb-1">Sessions</p>
                              <p className="text-lg font-bold text-slate-100">{selected?.sessionCount || 1}</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3">
                              <p className="text-xs text-slate-400 mb-1">Department</p>
                              <p className="text-sm font-semibold text-slate-100">{selected?.department || "General"}</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3">
                              <p className="text-xs text-slate-400 mb-1">Submitted</p>
                              <p className="text-sm font-semibold text-slate-100">
                                {new Date(selected?.submissionDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3">
                              <p className="text-xs text-slate-400 mb-1">Regulatory</p>
                              <p className="text-sm font-semibold text-slate-100">
                                {selected?.regulatory?.type || "None"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Sessions Component */}
                        <div className="border-t border-white/10 pt-6">
                          <StudentSessions
                            applicationId={selected?.id}
                            onSessionStart={(sessionId, sessionNum) => {
                              console.log(`Started session ${sessionNum}`);
                            }}
                            onSessionComplete={(sessionId, sessionNum) => {
                              console.log(`Completed session ${sessionNum}`);
                            }}
                            onFillForm={(sessionId, sessionNum) => {
                              console.log(`Fill form for session ${sessionNum}`);
                            }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Public content for non-logged-in users
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Student Portal</h1>
            <p className="text-slate-300">Early Access Portal for Observerships and Electives</p>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden sm:flex gap-4">
            <Link href="/login" className="inline-flex items-center px-4 py-2 rounded-lg bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium transition-all">
              Join Early Access
            </Link>
            <Link href="/" className="inline-flex items-center px-4 py-2 rounded-lg border border-white/25 text-slate-100 hover:bg-white/10 font-medium transition-all">
              ← Back to Home
            </Link>
          </div>
          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg border border-white/25 text-slate-100 hover:bg-white/10 transition-all"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu with Animation */}
        <div
          className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out mb-8 ${
            mobileMenuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <Link 
              href="/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium transition-all"
            >
              Get Notified
            </Link>
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg border border-white/25 text-slate-100 hover:bg-white/10 font-medium transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Early Access Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Early Access Registration</h2>
            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              Electivio is conducting a pilot rollout of formal observership and elective program listings in collaboration with healthcare institutions. By creating an account, students may register for early access, receive program updates, and be notified when applications open.
            </p>
            
            {/* No Live Programs Notice */}
            <div className="mb-8 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-xl">
              <p className="text-sm text-amber-200">
                <strong>Early Access:</strong> Observership and elective listings are currently in pilot preparation. Register to receive updates and priority access when applications open.
              </p>
            </div>

            {/* Benefits List */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">What You'll Get:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <span className="text-slate-300">Early access to pilot observership and elective program listings</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <span className="text-slate-300">Priority notifications when applications open</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <span className="text-slate-300">Direct updates related to partner institutions and program availability</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <span className="text-slate-300">Support materials, eligibility guidelines, and application information</span>
                </li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg">
                  Join Early Access
                </Button>
              </Link>
              <Link href="/programs">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/25 text-slate-100 hover:bg-white/10">
                  View Demo Listings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Supervisor Chat */}
      <SupervisorChat />
    </div>
  );
}
