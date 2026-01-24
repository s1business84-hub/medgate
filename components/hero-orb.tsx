"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Dynamically import Spline to avoid SSR issues
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-32 h-32 border-4 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  ),
});

export function HeroOrb() {
  return (
    <div className="relative w-full h-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
      {/* Spline 3D Orb */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
              <div className="w-32 h-32 border-4 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" />
            </div>
          }
        >
          <Spline
            scene="https://prod.spline.design/pfe2UgQYwfrRHzNtMG7TPygq/scene.splinecode"
            className="w-full h-full"
          />
        </Suspense>
      </div>

      {/* Electivio Branding Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="text-center"
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-2xl">
              Electivio
            </span>
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-4 text-lg sm:text-xl md:text-2xl text-blue-200/90 font-light tracking-wide"
          >
            Medical Observerships & Electives
          </motion.div>
        </motion.div>
      </div>

      {/* Color-matched glow effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/15 to-cyan-400/15 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-indigo-400/15 to-purple-400/15 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
