"use client";

import { useMemo } from "react";
import { SessionFormSubmission, StudentPerformanceMetrics } from "@/lib/types";

interface PerformanceInsightsProps {
  metrics: StudentPerformanceMetrics[];
  submissions?: SessionFormSubmission[];
  title?: string;
}

const trendColor = {
  improving: "text-emerald-300",
  stable: "text-slate-300",
  declining: "text-rose-300",
};

export function PerformanceInsights({ metrics, submissions = [], title = "Performance Insights" }: PerformanceInsightsProps) {
  const timeline = useMemo(() => {
    return submissions
      .filter(s => s.supervisorReview?.rating)
      .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
      .map(s => ({
        date: new Date(s.submittedAt).toLocaleDateString(),
        rating: s.supervisorReview?.rating || 0,
        sessionNumber: (s as any).sessionNumber || undefined,
      }));
  }, [submissions]);

  const avgRating = useMemo(() => {
    const ratings = metrics.map(m => m.averageRating).filter(Boolean);
    return ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  }, [metrics]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="text-sm text-slate-400">Ratings and progress across sessions</p>
        </div>
        <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
          Avg Rating: <span className="font-semibold">{avgRating.toFixed(1)}</span>
        </div>
      </div>

      {/* Trend cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Application</p>
                <p className="text-base font-semibold text-white">{m.applicationId}</p>
              </div>
              <span className={`text-sm font-semibold ${trendColor[m.performanceTrend] || "text-slate-200"}`}>
                {m.performanceTrend === "improving" ? "↑ Improving" : m.performanceTrend === "declining" ? "↓ Declining" : "→ Stable"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="flex-1">
                <p className="text-xs text-slate-400">Average Rating</p>
                <div className="text-lg font-bold">{m.averageRating.toFixed(1)}</div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400">Completed</p>
                <div className="text-lg font-bold">{m.completedForms}</div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400">Pending</p>
                <div className="text-lg font-bold">{m.pendingForms}</div>
              </div>
            </div>
            {m.keyStrengths?.length ? (
              <p className="text-xs text-emerald-200">Strengths: {m.keyStrengths.slice(0, 3).join(", ")}</p>
            ) : null}
            {m.areasForImprovement?.length ? (
              <p className="text-xs text-amber-200">Improve: {m.areasForImprovement.slice(0, 3).join(", ")}</p>
            ) : null}
          </div>
        ))}
      </div>

      {/* Timeline ratings */}
      {timeline.length > 0 && (
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-sm text-slate-300 mb-3">Rating over time</p>
          <div className="flex items-end gap-3">
            {timeline.map((t, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div
                  className="w-8 rounded-t bg-gradient-to-t from-cyan-500 to-indigo-500"
                  style={{ height: `${Math.max(t.rating, 1) * 18}px` }}
                  title={`Rating ${t.rating}`}
                />
                <span className="text-xs text-slate-400 text-center w-12 leading-tight">
                  {t.sessionNumber ? `S${t.sessionNumber}` : t.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
