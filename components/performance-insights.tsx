"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Award, Target, BarChart3, CheckCircle2, TrendingUpIcon } from "lucide-react";
import { SessionFormSubmission, StudentPerformanceMetrics } from "@/lib/types";

interface PerformanceInsightsProps {
  metrics: StudentPerformanceMetrics[];
  submissions?: SessionFormSubmission[];
  title?: string;
}

const trendConfig = {
  improving: { color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/40", icon: TrendingUp },
  stable: { color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/40", icon: Minus },
  declining: { color: "text-rose-400", bg: "bg-rose-500/20", border: "border-rose-500/40", icon: TrendingDown },
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

  const totalCompleted = useMemo(() => metrics.reduce((sum, m) => sum + m.completedForms, 0), [metrics]);
  const totalPending = useMemo(() => metrics.reduce((sum, m) => sum + m.pendingForms, 0), [metrics]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-slate-600"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-linear-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-sm text-slate-400">Track ratings, trends, and achievements</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-xl bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-xs text-amber-300/80 uppercase tracking-wide">Average Rating</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">{avgRating.toFixed(1)}</span>
                  {renderStars(Math.round(avgRating))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-xl bg-linear-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-xs text-emerald-300/80 uppercase tracking-wide">Completed</p>
                <span className="text-2xl font-bold text-white">{totalCompleted}</span>
                <span className="text-sm text-emerald-300 ml-2">forms</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-xl bg-linear-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-300 font-bold text-lg">{totalPending}</span>
              </div>
              <div>
                <p className="text-xs text-blue-300/80 uppercase tracking-wide">Pending</p>
                <span className="text-2xl font-bold text-white">{totalPending}</span>
                <span className="text-sm text-blue-300 ml-2">forms</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Detailed Performance Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-linear-to-b from-cyan-500 to-indigo-500 rounded-full" />
          Performance by Application
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((m, idx) => {
            const trend = trendConfig[m.performanceTrend] || trendConfig.stable;
            const TrendIcon = trend.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="p-5 rounded-xl bg-linear-to-br from-white/5 to-white/2 border border-white/10 backdrop-blur-sm hover:border-cyan-500/40 transition-all shadow-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Session Progress</p>
                    <p className="text-sm font-semibold text-slate-300 truncate">{m.applicationId.slice(0, 12)}...</p>
                  </div>
                  <div className={`px-2 py-1 rounded-lg ${trend.bg} border ${trend.border} flex items-center gap-1`}>
                    <TrendIcon className={`w-3 h-3 ${trend.color}`} />
                    <span className={`text-xs font-bold ${trend.color} capitalize`}>
                      {m.performanceTrend}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-3xl font-bold text-white">{m.averageRating.toFixed(1)}</span>
                    <span className="text-sm text-slate-400 mb-1">/5.0</span>
                  </div>
                  {renderStars(Math.round(m.averageRating))}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-white/10">
                  <div className="text-center p-2 rounded-lg bg-emerald-500/10">
                    <p className="text-xs text-emerald-300">Completed</p>
                    <p className="text-xl font-bold text-emerald-400">{m.completedForms}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-amber-500/10">
                    <p className="text-xs text-amber-300">Pending</p>
                    <p className="text-xl font-bold text-amber-400">{m.pendingForms}</p>
                  </div>
                </div>

                {m.keyStrengths?.length ? (
                  <div className="mb-2">
                    <p className="text-xs text-emerald-400 font-semibold mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Strengths
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">{m.keyStrengths.slice(0, 3).join(", ")}</p>
                  </div>
                ) : null}
                {m.areasForImprovement?.length ? (
                  <div>
                    <p className="text-xs text-amber-400 font-semibold mb-1 flex items-center gap-1">
                      <TrendingUpIcon className="w-3 h-3" /> Areas to Improve
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">{m.areasForImprovement.slice(0, 3).join(", ")}</p>
                  </div>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Timeline Chart */}
      {timeline.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl bg-linear-to-br from-slate-900/50 to-slate-800/30 border border-white/10 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
            <div className="w-1 h-5 bg-linear-to-b from-cyan-500 to-indigo-500 rounded-full" />
            Rating Timeline
          </h3>
          <p className="text-sm text-slate-400 mb-6">Performance evolution across sessions</p>
          
          <div className="flex items-end justify-between gap-2 h-48 px-4">
            {timeline.map((t, idx) => {
              const heightPercent = (t.rating / 5) * 100;
              const isRecent = idx >= timeline.length - 3;
              return (
                <motion.div
                  key={idx}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05, duration: 0.4 }}
                  className="flex flex-col items-center gap-3 flex-1 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative w-full flex flex-col items-center"
                  >
                    {/* Rating Badge */}
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="px-2 py-1 rounded-md bg-slate-800 border border-cyan-500/40 shadow-lg">
                        <p className="text-xs font-bold text-cyan-300">{t.rating.toFixed(1)}</p>
                      </div>
                    </div>
                    
                    {/* Bar */}
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isRecent
                          ? "bg-linear-to-t from-cyan-500 via-indigo-500 to-purple-500"
                          : "bg-linear-to-t from-slate-600 to-slate-500"
                      } group-hover:shadow-lg group-hover:shadow-cyan-500/50`}
                      style={{ height: `${Math.max(heightPercent, 10)}%` }}
                    />
                  </motion.div>
                  
                  {/* Label */}
                  <div className="text-center">
                    <p className={`text-xs font-semibold ${
                      isRecent ? "text-cyan-300" : "text-slate-400"
                    }`}>
                      {t.sessionNumber ? `S${t.sessionNumber}` : t.date.slice(0, 5)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Y-axis labels */}
          <div className="flex justify-between mt-4 pt-4 border-t border-white/10">
            <span className="text-xs text-slate-500">Rating Scale</span>
            <div className="flex gap-4 text-xs text-slate-400">
              {[1, 2, 3, 4, 5].map(n => (
                <span key={n}>{n}</span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
