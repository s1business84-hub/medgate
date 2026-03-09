"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { StudentGuidelines } from "@/components/student-guidelines";
import { StudentInbox } from "@/components/student-inbox";
import { StaggerGroup, StaggerItem } from "@/components/animation/StaggerGroup";

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

  const backgroundParticles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 6 + Math.random() * 2,
        delay: Math.random() * 3,
      })),
    []
  );

  // Move load function outside useEffect so it can be reused
  const loadApplications = useCallback(async () => {
    if (!user) return;
    
    try {
      const { getApplications, getStudents, getStudentProgress } = await import("@/lib/storage");
      const allApps = getApplications();
      const students = getStudents();
      
      // Try to find applications by user.id (from User table) or by student record
      // First, try to find a student record by email
      const studentRecord = students.find((s: any) => s.email === user.email);
      
      // Filter applications by either user.id (for newly created accounts) or studentRecord.id (for existing students)
      const myApps = allApps.filter((a: any) => 
        a.studentId === user.id || (studentRecord && a.studentId === studentRecord.id)
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
  }, [user, selectedApplicationId]);

  useEffect(() => {
    if (user && user.role === "student") {
      loadApplications();
    }
  }, [user, selectedApplicationId, loadApplications]);

  // Reload applications when page comes into focus
  useEffect(() => {
    const handleFocus = () => {
      if (user && user.role === "student") {
        setLoadingApps(true);
        loadApplications();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user, loadApplications]);

  // If user is logged in and is a student, show full portal
  if (user && user.role === "student") {
    return (
      <div className="relative min-h-screen overflow-hidden text-slate-100">
        <LiquidParallax depth={26} className="opacity-90" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(6,182,212,0.25),transparent_40%),radial-gradient(circle_at_90%_30%,rgba(59,130,246,0.2),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(168,85,247,0.2),transparent_40%)]" />
        
        {/* Enhanced animated background orbs */}
        <div className="pointer-events-none absolute inset-0">
          {/* Top left cyan orb */}
          <motion.div
            className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-transparent blur-3xl"
            animate={{ 
              y: [0, -24, 0], 
              scale: [1, 1.08, 1],
              x: [0, 12, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          />
          
          {/* Right indigo orb */}
          <motion.div
            className="absolute right-[-15%] top-1/3 h-96 w-96 rounded-full bg-gradient-to-bl from-indigo-600/30 via-purple-500/20 to-transparent blur-3xl"
            animate={{ 
              y: [0, 28, 0], 
              scale: [1.05, 0.98, 1.05],
              x: [0, -14, 0],
            }}
            transition={{ duration: 22, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          />
          
          {/* Bottom pink orb */}
          <motion.div
            className="absolute left-1/4 -bottom-40 h-96 w-96 rounded-full bg-gradient-to-t from-pink-500/25 via-rose-500/15 to-transparent blur-3xl"
            animate={{ 
              y: [0, -20, 0], 
              rotate: [0, 3, -3, 0],
              scale: [1, 1.06, 1],
            }}
            transition={{ duration: 24, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          />
          
          {/* Floating particles */}
          {backgroundParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1.5 h-1.5 bg-cyan-400/40 rounded-full"
              style={{
                left: particle.left,
                top: particle.top,
              }}
              animate={{
                y: [0, -24, 0],
                opacity: [0, 0.55, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header with XP Meter */}
          <Reveal>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 sm:mb-8 gap-5 sm:gap-6">
            <div className="flex-1">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-400 bg-clip-text text-transparent mb-2"
              >
                Student Portal
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-base sm:text-lg text-slate-200"
              >
                Welcome back, <span className="font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">{user.name}!</span>
              </motion.p>
              {/* Level & XP Section */}
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 max-w-xl">
                {/* Level Badge */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2"
                >
                  <div className="px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 shadow-lg shadow-purple-500/50 ring-2 ring-purple-400/30">
                    ⭐ Level {Math.ceil(xpData.xpPoints / 100)}
                  </div>
                </motion.div>
                {/* XP Meter */}
                <div className="flex-1 min-w-max sm:min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-sm text-yellow-300 font-bold">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="w-5 h-5" />
                      </motion.div>
                      XP Progress
                    </span>
                    <span className="text-sm font-bold text-yellow-200">{xpData.xpPoints % 100} / 100 XP</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gradient-to-r from-slate-800 to-slate-700 overflow-hidden border border-yellow-500/40 shadow-lg shadow-yellow-500/20">
                    <motion.div
                      className="h-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 shadow-lg shadow-yellow-500/40"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((xpData.xpPoints % 100) * 1, 100)}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />
                  </div>
                  <p className="text-xs text-slate-300 mt-2 font-semibold">
                    💡 Earn XP: Complete forms • Log sessions • Finish goals • Internship progress
                  </p>
                </div>
              </div>
            </div>
            <StaggerGroup className="flex flex-wrap gap-2 w-full lg:w-auto" staggerDelay={0.06} initialDelay={0.1}>
              <StaggerItem>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Link
                    href="/student/career-path"
                    className="btn-secondary hover-scale px-3 sm:px-5 py-2.5 sm:py-3 rounded-lg backdrop-blur-xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-600/30 to-blue-600/30 hover:from-purple-500/40 hover:to-blue-500/40 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50 text-sm sm:text-base"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Career Path
                  </Link>
                </motion.div>
              </StaggerItem>
              <StaggerItem>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Link
                    href="/student/progress"
                    className="btn-secondary hover-scale px-3 sm:px-5 py-2.5 sm:py-3 rounded-lg backdrop-blur-xl border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-600/30 to-teal-600/30 hover:from-cyan-500/40 hover:to-teal-500/40 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-500/50 text-sm sm:text-base"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7H7v10h6V7z M17 7h-2v4h2V7z M5 20h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v13a2 2 0 002 2z" />
                    </svg>
                    Progress
                  </Link>
                </motion.div>
              </StaggerItem>
              <StaggerItem>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Link
                    href="/student/form-submission"
                    className="btn-secondary hover-scale px-3 sm:px-5 py-2.5 sm:py-3 rounded-lg backdrop-blur-xl border-2 border-blue-500/50 bg-gradient-to-br from-blue-600/30 to-indigo-600/30 hover:from-blue-500/40 hover:to-indigo-500/40 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50 text-sm sm:text-base"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Forms
                  </Link>
                </motion.div>
              </StaggerItem>
              <StaggerItem>
                <StudentInbox />
              </StaggerItem>
              <StaggerItem>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="btn-secondary hover-scale px-3 sm:px-5 py-2.5 sm:py-3 rounded-lg backdrop-blur-xl border-2 border-red-500/50 bg-gradient-to-br from-red-600/30 to-rose-600/30 hover:from-red-500/40 hover:to-rose-500/40 text-white font-bold shadow-lg shadow-red-500/30 transition-all hover:shadow-red-500/50 text-sm sm:text-base"
                >
                  Logout
                </motion.button>
              </StaggerItem>
              <StaggerItem>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Link 
                    href="/" 
                    className="btn-secondary hover-scale px-3 sm:px-5 py-2.5 sm:py-3 rounded-lg backdrop-blur-xl border-2 border-slate-400/50 bg-gradient-to-br from-slate-600/30 to-slate-500/30 hover:from-slate-500/40 hover:to-slate-400/40 text-white font-bold shadow-lg shadow-slate-500/30 transition-all hover:shadow-slate-500/50 text-sm sm:text-base"
                  >
                    ← Back to Home
                  </Link>
                </motion.div>
              </StaggerItem>
            </StaggerGroup>
          </div>
          </Reveal>

          {/* Student Stats */}
          <Reveal delay={0.1}>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {/* Learning Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="group relative rounded-2xl border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-600/40 to-blue-600/30 backdrop-blur-xl p-4 sm:p-6 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:border-cyan-400/70 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Animated gradient glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <div className="relative z-10 flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider">Learning Hours</span>
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg className="w-6 h-6 text-cyan-300 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
              </div>
              <motion.div 
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent mb-2"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {studentStats.learningHours}
              </motion.div>
              <p className="text-xs sm:text-sm text-cyan-100/90 font-semibold">hours completed</p>
            </motion.div>

            {/* Average Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="group relative rounded-2xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-600/40 to-pink-600/30 backdrop-blur-xl p-4 sm:p-6 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:border-purple-400/70 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Animated gradient glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <div className="relative z-10 flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">Avg Progress</span>
                <motion.div 
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <svg className="w-6 h-6 text-purple-300 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </motion.div>
              </div>
              <motion.div 
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-2"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {studentStats.avgProgress}%
              </motion.div>
              <p className="text-xs sm:text-sm text-purple-100/90 font-semibold">per course</p>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="group relative rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-600/40 to-teal-600/30 backdrop-blur-xl p-4 sm:p-6 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:border-emerald-400/70 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Animated gradient glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <div className="relative z-10 flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Certifications</span>
                <motion.div 
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <svg className="w-6 h-6 text-emerald-300 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </motion.div>
              </div>
              <motion.div 
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent mb-2"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {studentStats.certifications}
              </motion.div>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-semibold">{studentStats.certifications === 0 ? 'none yet' : studentStats.certifications === 1 ? 'earned' : 'earned'}</p>
            </motion.div>
          </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Left Sidebar - Audit Card */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border-2 border-blue-500/50 bg-gradient-to-br from-blue-600/40 to-cyan-600/30 backdrop-blur-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 p-4 sm:p-5 sticky top-8 overflow-hidden hover:border-blue-400/70 transition-all duration-300"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="relative z-10 flex items-center gap-3 mb-4">
                  <motion.div 
                    className="text-3xl"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    📋
                  </motion.div>
                  <h3 className="text-lg font-bold text-blue-100">Your Records</h3>
                </div>
                <p className="text-sm text-blue-100/90 mb-4 font-semibold">Download copies of your applications, exposure logs, and training records.</p>
                <div className="space-y-2">
                  <AuditExcelButton
                    dataTypes={["applications", "exposureLogs", "completionAttestations"]}
                    filterApplications={(apps) => apps.filter((a) => a.studentId === user.id)}
                    className="w-full border-2 border-blue-400/50 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-100 hover:bg-gradient-to-r hover:from-blue-500/50 hover:to-cyan-500/50 hover:text-white font-bold shadow-lg hover:shadow-blue-500/50 transition-all rounded-lg py-2.5"
                  />
                </div>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {/* XP System Reminder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative p-6 rounded-2xl border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-600/40 to-orange-600/30 backdrop-blur-xl shadow-2xl shadow-yellow-500/30 overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <div className="relative z-10 flex items-start gap-4">
                  <motion.div 
                    className="text-4xl flex-shrink-0"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ⚡
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-yellow-200 mb-3">XP Earning Guide</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="text-sm text-yellow-50">
                        <p className="font-bold text-yellow-100 mb-2 flex items-center gap-2">
                          <span className="px-2 py-1 rounded-lg bg-yellow-500/30 border border-yellow-500/50">⚙️</span>
                          Complete Activities
                        </p>
                        <ul className="space-y-1.5 text-xs">
                          <li className="flex items-center gap-2">
                            <span className="text-yellow-300 font-bold">✓</span> <strong className="text-yellow-200">+10 XP</strong> per form completion
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-yellow-300 font-bold">✓</span> <strong className="text-yellow-200">+5 XP</strong> per application submission
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-yellow-300 font-bold">✓</span> <strong className="text-yellow-200">+3 XP</strong> per reflection logged
                          </li>
                        </ul>
                      </div>
                      <div className="text-sm text-yellow-50">
                        <p className="font-bold text-yellow-100 mb-2 flex items-center gap-2">
                          <span className="px-2 py-1 rounded-lg bg-yellow-500/30 border border-yellow-500/50">🏆</span>
                          Achievements
                        </p>
                        <ul className="space-y-1.5 text-xs">
                          <li className="flex items-center gap-2">
                            <span className="text-yellow-300 font-bold">✓</span> <strong className="text-yellow-200">+15 XP</strong> per program completion
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-yellow-300 font-bold">✓</span> <strong className="text-yellow-200">+20 XP</strong> per certification earned
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-yellow-300 font-bold">⭐</span> <strong className="text-yellow-200">100 XP = Level Up!</strong>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-sm text-yellow-100/90 mt-3 font-semibold">🚀 Keep engaging to level up and unlock new opportunities!</p>
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
                      <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg">
                        Browse Programs
                      </Button>
                    </Link>
                    <AIListingSuggestions />
                  </div>
                </div>
              ) : (
                <>
                  {/* Application List - Grid Layout */}
                  <div className="space-y-6">
                    <motion.h2 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent"
                    >
                      Your Applications
                    </motion.h2>
                    
                    {/* Grid Container */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {applications.map((app, idx) => {
                          const getStatusColor = (status: string) => {
                            switch (status) {
                              case 'Accepted':
                              case 'Stage 2 Accepted':
                              case 'In Training':
                                return 'bg-gradient-to-r from-green-600/50 to-emerald-600/50 text-green-200 border-green-400/50 shadow-lg shadow-green-500/30';
                              case 'Pending':
                              case 'Submitted':
                                return 'bg-gradient-to-r from-yellow-600/50 to-amber-600/50 text-yellow-200 border-yellow-400/50 shadow-lg shadow-yellow-500/30';
                              case 'Rejected':
                                return 'bg-gradient-to-r from-red-600/50 to-rose-600/50 text-red-200 border-red-400/50 shadow-lg shadow-red-500/30';
                              case 'Completed':
                                return 'bg-gradient-to-r from-blue-600/50 to-cyan-600/50 text-blue-200 border-blue-400/50 shadow-lg shadow-blue-500/30';
                              default:
                                return 'bg-gradient-to-r from-slate-600/50 to-slate-500/50 text-slate-200 border-slate-400/50';
                            }
                          };

                          return (
                            <motion.button
                              key={app.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              onClick={() => setSelectedApplicationId(app.id)}
                              whileHover={{ scale: 1.03, y: -4 }}
                              className={`relative w-full text-left p-4 sm:p-6 rounded-2xl transition-all border-2 overflow-hidden group/card cursor-pointer ${
                                selectedApplicationId === app.id
                                  ? 'bg-gradient-to-br from-cyan-600/50 to-blue-600/40 border-cyan-300/80 shadow-2xl shadow-cyan-500/50'
                                  : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:from-cyan-500/20 hover:to-blue-500/15 hover:border-cyan-400/60 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/40'
                              }`}
                            >
                              {/* Animated gradient background */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
                              />
                              
                              {/* Status badge positioned absolutely */}
                              <div className="absolute top-4 right-4 z-20">
                                <motion.span 
                                  whileHover={{ scale: 1.05 }}
                                  className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getStatusColor(app.status)} transition-all block text-center`}
                                >
                                  {app.status === 'Stage 2 Accepted' ? 'Stage 2' : app.status}
                                </motion.span>
                              </div>
                              
                              {/* Content */}
                              <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                  <h3 className="text-lg font-bold text-cyan-100 mb-1 line-clamp-2 pr-28">{app.programName}</h3>
                                  <p className="text-sm text-slate-300 mb-3 line-clamp-1">{app.hospitalName}</p>
                                  
                                  {/* Progress bar */}
                                  <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-xs font-semibold text-slate-300">Progress</span>
                                      <span className="text-xs font-bold text-cyan-300">{app.progressPercentage || 0}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-cyan-500/30">
                                      <motion.div
                                        className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 shadow-lg shadow-cyan-500/40"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${app.progressPercentage || 0}%` }}
                                        transition={{ duration: 0.8, delay: idx * 0.05 }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Footer info */}
                                <div className="space-y-2 pt-3 border-t border-white/10">
                                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                                    <span className="text-cyan-400">📚</span>
                                    <span>{app.sessionCount || 1} session{(app.sessionCount || 1) > 1 ? 's' : ''}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                                    <span className="text-purple-400">📅</span>
                                    <span>Applied {new Date(app.submissionDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                    </div>
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
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative rounded-2xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-600/40 to-indigo-600/30 backdrop-blur-xl shadow-2xl shadow-purple-500/30 p-4 sm:p-7 overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                          animate={{
                            backgroundPosition: ['0% 0%', '100% 100%'],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                        <div className="relative z-10 mb-6">
                          <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4 mb-4">
                            <div className="flex-1">
                              <motion.h2 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-2"
                              >
                                {selected?.programName}
                              </motion.h2>
                              <p className="text-lg text-purple-100/90 font-semibold">{selected?.hospitalName}</p>
                            </div>
                            <motion.div 
                              whileHover={{ scale: 1.05 }}
                              className={`px-5 py-3 rounded-xl border-2 ${getStatusColor(selected?.status)} flex items-center gap-3 font-bold text-lg shadow-lg`}
                            >
                              <span className="text-2xl">{getStatusIcon(selected?.status)}</span>
                              <div>
                                <p className="text-xs opacity-80">Status</p>
                                <p className="text-sm">{selected?.status}</p>
                              </div>
                            </motion.div>
                          </div>

                          {/* Program Progress Section */}
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="mt-6 p-5 rounded-xl bg-gradient-to-br from-pink-600/40 to-rose-600/30 border-2 border-pink-500/50 shadow-lg shadow-pink-500/20"
                          >
                            <h3 className="text-lg font-bold text-pink-100 mb-5">Program Progress</h3>
                            
                            {/* Overall Progress */}
                            <div className="space-y-5">
                              <div>
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-sm font-semibold text-pink-100">Overall Completion</span>
                                  <motion.span 
                                    className="text-sm font-bold text-pink-200"
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    65%
                                  </motion.span>
                                </div>
                                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-pink-400/30 shadow-inner">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 shadow-lg shadow-pink-500/40"
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                    transition={{ duration: 0.8 }}
                                  />
                                </div>
                              </div>

                              {/* Form Completion */}
                              <div>
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-sm font-semibold text-pink-100">Form Completion</span>
                                  <motion.span 
                                    className="text-sm font-bold text-blue-200"
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    52%
                                  </motion.span>
                                </div>
                                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-blue-400/30 shadow-inner">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 shadow-lg shadow-blue-500/40"
                                    initial={{ width: 0 }}
                                    animate={{ width: '52%' }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                  />
                                </div>
                              </div>

                              {/* Module Completion */}
                              <div>
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-sm font-semibold text-pink-100">Module Completion</span>
                                  <motion.span 
                                    className="text-sm font-bold text-emerald-200"
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    78%
                                  </motion.span>
                                </div>
                                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-emerald-400/30 shadow-inner">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-500/40"
                                    initial={{ width: 0 }}
                                    animate={{ width: '78%' }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>

                          {selected?.notes && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="mt-6 p-5 rounded-xl bg-gradient-to-br from-blue-600/40 to-cyan-600/30 border-2 border-blue-500/50 shadow-lg shadow-blue-500/20"
                            >
                              <p className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-2">💬 Notes from Hospital</p>
                              <p className="text-sm text-blue-100 font-semibold">{selected.notes}</p>
                            </motion.div>
                          )}
                          
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-4 sm:mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
                          >
                            {[
                              {
                                label: 'Sessions',
                                value: selected?.sessionCount || 1,
                                icon: '📚',
                                color: 'from-cyan-600/40 to-blue-600/30 border-cyan-500/50 shadow-cyan-500/20'
                              },
                              {
                                label: 'Department',
                                value: selected?.department || "General",
                                icon: '🏥',
                                color: 'from-purple-600/40 to-pink-600/30 border-purple-500/50 shadow-purple-500/20'
                              },
                              {
                                label: 'Submitted',
                                value: new Date(selected?.submissionDate).toLocaleDateString(),
                                icon: '📅',
                                color: 'from-emerald-600/40 to-teal-600/30 border-emerald-500/50 shadow-emerald-500/20'
                              },
                              {
                                label: 'Regulatory',
                                value: selected?.regulatory?.type || "None",
                                icon: '⚖️',
                                color: 'from-orange-600/40 to-rose-600/30 border-orange-500/50 shadow-orange-500/20'
                              },
                            ].map((stat, idx) => (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + idx * 0.05 }}
                                whileHover={{ y: -2 }}
                                className={`relative bg-gradient-to-br ${stat.color} border-2 rounded-xl p-4 shadow-lg transition-all`}
                              >
                                <p className="text-xs font-bold text-white/90 uppercase tracking-wider mb-2">{stat.icon} {stat.label}</p>
                                <motion.p 
                                  className="text-sm font-bold text-white truncate"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {stat.value}
                                </motion.p>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>

                        {/* Sessions Component */}
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="mt-8 pt-8 border-t-2 border-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20"
                        >
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
                        </motion.div>
                      </motion.div>
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
      <LiquidParallax depth={28} className="opacity-95" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-950/50 to-black/70" />
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-16 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"
          animate={{ y: [0, -28, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 13, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-8%] top-1/4 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"
          animate={{ y: [0, 32, 0], scale: [1.04, 0.98, 1.04] }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/4 bottom-[-10%] h-96 w-96 rounded-full bg-sky-400/15 blur-3xl"
          animate={{ y: [0, -24, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">Student Portal</h1>
            <p className="text-sm sm:text-base text-slate-300">Early Access Portal for Observerships and Electives</p>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden sm:flex gap-4">
            <Link href="/login" className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium transition-all">
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
        </motion.div>

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
              className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium transition-all"
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
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg p-5 sm:p-8"
            whileHover={{ y: -6, boxShadow: "0 24px 60px -30px rgba(14,165,233,0.5)" }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 mb-3 sm:mb-4">Early Access Registration</h2>
            <p className="text-base sm:text-lg text-slate-300 mb-4 sm:mb-6 leading-relaxed">
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
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg">
                  Join Early Access
                </Button>
              </Link>
              <Link href="/programs">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/25 text-slate-100 hover:bg-white/10">
                  View Demo Listings
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Student Guidelines Section */}
      <StudentGuidelines />
      
      {/* Supervisor Chat */}
      <SupervisorChat />
    </div>
  );
}
