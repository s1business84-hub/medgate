"use client";

import { useEffect, useState, useMemo, startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { PerformanceInsights } from "@/components";
import { getPerformanceMetrics, getSessionFormSubmissions, getApplications } from "@/lib/storage";
import { StudentPerformanceMetrics, SessionFormSubmission, Application } from "@/lib/types";
import { CareerStrategizer } from "@/components/career-strategizer";
import { ArrowLeft, TrendingUp } from "lucide-react";

export default function StudentPerformancePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<StudentPerformanceMetrics[]>([]);
  const [subs, setSubs] = useState<SessionFormSubmission[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login");
      return;
    }

    try {
      const allMetrics = getPerformanceMetrics();
      const myMetrics = allMetrics.filter(m => m.studentId === user.id);

      const myApplications = getApplications().filter(a => a.studentId === user.id);
      const appIds = myApplications.map(a => a.id);
      const allSubs = getSessionFormSubmissions();

      startTransition(() => {
        setMetrics(myMetrics);
        setSubs(allSubs.filter(s => appIds.includes(s.applicationId)));
        setApplications(myApplications);
        setLoading(false);
      });
    } catch (error) {
      console.error("Failed to load performance", error);
      startTransition(() => {
        setLoading(false);
      });
    }
  }, [user, router]);


  // Aggregate department performance for AI/summary
  const departmentPerformance = useMemo(() => {
    // Map: department -> { ratings: number[], trend: string[] }
    const deptMap: Record<string, { ratings: number[]; trends: ("improving"|"stable"|"declining")[] }> = {};
    metrics.forEach(m => {
      const app = applications.find(a => a.id === m.applicationId);
      const dept = app?.department || "Other";
      if (!deptMap[dept]) deptMap[dept] = { ratings: [], trends: [] };
      if (typeof m.averageRating === "number") deptMap[dept].ratings.push(m.averageRating);
      if (m.performanceTrend) deptMap[dept].trends.push(m.performanceTrend);
    });
    return Object.entries(deptMap).map(([department, { ratings, trends }]) => {
      const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      // Most common trend
      const trend = trends.length ? trends.sort((a,b) => trends.filter(v=>v===a).length - trends.filter(v=>v===b).length).pop() : "stable";
      return {
        department,
        averageRating: avg,
        trend: trend as "improving"|"stable"|"declining",
        strengths: [], // Could aggregate strengths if needed
      };
    }).sort((a, b) => b.averageRating - a.averageRating);
  }, [metrics, applications]);

  // Completed departments
  const completedDepartments = useMemo(() => departmentPerformance.map(d => d.department), [departmentPerformance]);

  // Skills acquired (mock: aggregate keyStrengths)
  const skillsAcquired = useMemo(() => {
    const all = metrics.flatMap(m => m.keyStrengths || []);
    return Array.from(new Set(all));
  }, [metrics]);

  // Completed sessions
  const completedSessions = metrics.reduce((sum, m) => sum + m.completedForms, 0);

  if (!user || user.role !== "student") return null;

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center">
        <LiquidParallax />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />
        <div className="relative text-center">
          <div className="w-12 h-12 border-4 border-blue-400/40 border-t-blue-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading your performance...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />

      <div className="relative max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-linear-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold text-white">Performance on the Go</h1>
            </div>
            <p className="text-slate-400 text-lg">Track your ratings, strengths, and progress across sessions.</p>
          </div>
          <Link 
            href="/student" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 text-blue-300 hover:text-blue-200 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </Link>
        </div>

        {/* Department Performance Summary */}
        {departmentPerformance.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl border border-blue-500/20 bg-blue-900/10 p-6">
              <h3 className="text-lg font-bold text-blue-200 mb-4">Department Performance</h3>
              <ul className="space-y-2">
                {departmentPerformance.map((dept) => (
                  <li key={dept.department} className="flex items-center justify-between">
                    <span className="font-medium text-white">{dept.department}</span>
                    <span className="text-blue-300">{dept.averageRating.toFixed(1)} avg</span>
                    <span className={
                      dept.trend === "improving" ? "text-emerald-400" : dept.trend === "declining" ? "text-indigo-400" : "text-blue-400"
                    }>{dept.trend}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-900/10 p-6">
              <h3 className="text-lg font-bold text-indigo-200 mb-4">AI Strategy Pathway</h3>
              <CareerStrategizer
                studentId={user.id}
                completedDepartments={completedDepartments}
                completedSessions={completedSessions}
                skillsAcquired={skillsAcquired}
                departmentPerformance={departmentPerformance}
              />
            </div>
          </div>
        )}

        {metrics.length === 0 ? (
          <div className="p-8 rounded-xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-sm text-center">
            <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Performance Data Yet</h3>
            <p className="text-slate-400">Complete session forms to see your metrics and track your progress.</p>
          </div>
        ) : (
          <PerformanceInsights metrics={metrics} submissions={subs} />
        )}
      </div>
    </div>
  );
}
