"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Heart, Users, CheckCircle, Upload, Menu, X } from "lucide-react";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { AuditExcelButton } from "@/components/audit-excel-button";
import { StudentSessions } from "./sessions";

export default function StudentPortal() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    if (user && user.role === "student") {
      const loadApplications = async () => {
        try {
          const { getApplications, getStudents } = await import("@/lib/storage");
          const allApps = getApplications();
          const myApps = allApps.filter((a: any) => a.studentId === user.id);
          
          // Load student/program details for enrichment
          const students = getStudents();
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
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
        <LiquidParallax />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />

        <div className="relative max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 animate-fade-in gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text bg-linear-to-r from-slate-900 via-blue-800 to-slate-900 text-transparent mb-2">Student Portal</h1>
              <p className="text-slate-300">Welcome back, {user.name}!</p>
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
                  <Link href="/programs">
                    <Button size="lg" className="bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg">
                      Browse Programs
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Application Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {applications.map(app => (
                      <button
                        key={app.id}
                        onClick={() => setSelectedApplicationId(app.id)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
                          selectedApplicationId === app.id
                            ? 'bg-linear-to-r from-cyan-500 to-indigo-600 text-white'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        {app.programName}
                      </button>
                    ))}
                  </div>

                  {/* Selected Application Details */}
                  {selectedApplicationId && (() => {
                    const selected = applications.find(a => a.id === selectedApplicationId);
                    return (
                      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg p-6">
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold text-slate-100 mb-2">{selected?.programName}</h2>
                          <p className="text-slate-300 mb-4">{selected?.hospitalName}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white/10 rounded-lg p-3">
                              <p className="text-xs text-slate-400">Status</p>
                              <p className="text-sm font-semibold text-slate-100">{selected?.status}</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3">
                              <p className="text-xs text-slate-400">Sessions</p>
                              <p className="text-sm font-semibold text-slate-100">{selected?.sessionCount || 1}</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3">
                              <p className="text-xs text-slate-400">Department</p>
                              <p className="text-sm font-semibold text-slate-100">{selected?.department || "N/A"}</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3">
                              <p className="text-xs text-slate-400">Submitted</p>
                              <p className="text-sm font-semibold text-slate-100">
                                {new Date(selected?.submissionDate).toLocaleDateString()}
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
    </div>
  );
}
