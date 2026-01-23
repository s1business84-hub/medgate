"use client";

import { useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { PerformanceInsights } from "@/components/performance-insights";
import { getPerformanceMetrics, getSessionFormSubmissions, getApplicationsByHospital } from "@/lib/storage";
import { StudentPerformanceMetrics, SessionFormSubmission } from "@/lib/types";

export default function HospitalPerformancePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<StudentPerformanceMetrics[]>([]);
  const [subs, setSubs] = useState<SessionFormSubmission[]>([]);

  useEffect(() => {
    if (!user || user.role !== "hospital") {
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
      });
    } catch (error) {
      console.error("Failed to load hospital performance", error);
    }
  }, [user, router]);

  if (!user || user.role !== "hospital") return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />

      <div className="relative max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Performance on the Go</h1>
            <p className="text-slate-300">Track student performance across your sessions and forms.</p>
          </div>
          <Link href="/hospital" className="text-sm text-cyan-300 hover:text-cyan-200">← Back to hospital portal</Link>
        </div>

        {metrics.length === 0 ? (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-slate-300">
            No performance data yet. Review submitted forms to see metrics.
          </div>
        ) : (
          <PerformanceInsights metrics={metrics} submissions={subs} title="Hospital Performance Overview" />
        )}
      </div>
    </div>
  );
}
