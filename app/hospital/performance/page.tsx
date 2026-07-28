"use client";

import { useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { PerformanceInsights } from "@/components";
import { getPerformanceMetrics, getSessionFormSubmissions, getApplicationsByHospital } from "@/lib/storage";
import { StudentPerformanceMetrics, SessionFormSubmission } from "@/lib/types";
import { ArrowLeft, TrendingUp } from "lucide-react";

export default function HospitalPerformancePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<StudentPerformanceMetrics[]>([]);
  const [subs, setSubs] = useState<SessionFormSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "staff") {
      router.push("/hospital-login");
      return;
    }

    try {
      const apps = getApplicationsByHospital(user.hospitalId || "");
      const appIds = apps.map(a => a.id);

      const allMetrics = getPerformanceMetrics();
      const filteredMetrics = allMetrics.filter(m => appIds.includes(m.applicationId));

      const allSubs = getSessionFormSubmissions();
      const filteredSubs = allSubs.filter(s => appIds.includes(s.applicationId));

      startTransition(() => {
        setMetrics(filteredMetrics);
        setSubs(filteredSubs);
        setLoading(false);
      });
    } catch (error) {
      console.error("Failed to load hospital performance", error);
      startTransition(() => {
        setLoading(false);
      });
    }
  }, [user, router]);

  if (!user || user.role !== "staff") return null;

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center">
        <LiquidParallax />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />
        <div className="relative text-center">
          <div className="w-12 h-12 border-4 border-blue-400/40 border-t-blue-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading performance data...</p>
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
            <p className="text-slate-400 text-lg">Track student performance across your sessions and forms.</p>
          </div>
          <Link 
            href="/hospital" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 text-blue-300 hover:text-blue-200 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </Link>
        </div>

        {metrics.length === 0 ? (
          <div className="p-8 rounded-xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-sm text-center">
            <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Performance Data Yet</h3>
            <p className="text-slate-400">Review submitted forms to see performance metrics and analytics.</p>
          </div>
        ) : (
          <PerformanceInsights metrics={metrics} submissions={subs} title="Hospital Performance Overview" />
        )}
      </div>
    </div>
  );
}
