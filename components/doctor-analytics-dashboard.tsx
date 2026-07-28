"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Award } from "lucide-react";

interface DoctorAnalyticsDashboardProps {
  metrics?: {
    totalObservations: number;
    completedObservations: number;
    averageRating: number;
    studentsUnderSupervision: number;
  };
}

export function DoctorAnalyticsDashboard({ metrics }: DoctorAnalyticsDashboardProps) {
  const defaultMetrics = {
    totalObservations: 48,
    completedObservations: 42,
    averageRating: 4.6,
    studentsUnderSupervision: 12,
  };

  const data = metrics || defaultMetrics;

  const stats = [
    {
      label: "Total Observations",
      value: data.totalObservations,
      icon: BarChart3,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Completed",
      value: data.completedObservations,
      icon: Award,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Avg Rating",
      value: data.averageRating.toFixed(1),
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Students",
      value: data.studentsUnderSupervision,
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            className={`${stat.bg} rounded-2xl p-6 border border-slate-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <Icon className={`${stat.color} w-8 h-8 opacity-80`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
