"use client";

import { useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { PerformanceInsights } from "@/components/performance-insights";
import { getPerformanceMetrics, getSessionFormSubmissions, getApplications } from "@/lib/storage";
import { StudentPerformanceMetrics, SessionFormSubmission } from "@/lib/types";

export default function StudentPerformancePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<StudentPerformanceMetrics[]>([]);
  const [subs, setSubs] = useState<SessionFormSubmission[]>([]);

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login");
      return;
    }

    try {
      const allMetrics = getPerformanceMetrics();
      const myMetrics = allMetrics.filter(m => m.studentId === user.id);

      const applications = getApplications().filter(a => a.studentId === user.id);
      const appIds = applications.map(a => a.id);
      const allSubs = getSessionFormSubmissions();

      startTransition(() => {
        setMetrics(myMetrics);
        setSubs(allSubs.filter(s => appIds.includes(s.applicationId)));
      });
    } catch (error) {
      console.error("Failed to load performance", error);
    }
  }, [user, router]);

  if (!user || user.role !== "student") return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />

      <div className="relative max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Performance on the Go</h1>
            <p className="text-slate-300">Track your ratings, strengths, and progress across sessions.</p>
          </div>
          <Link href="/student" className="text-sm text-cyan-300 hover:text-cyan-200">← Back to student portal</Link>
        </div>

        {metrics.length === 0 ? (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-slate-300">
            No performance data yet. Complete session forms to see your metrics.
          </div>
        ) : (
          <PerformanceInsights metrics={metrics} submissions={subs} />
        )}
      </div>
    </div>
  );
}
