"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Dynamically import Spline to avoid SSR issues
const Spline = dynamic(
  () => import("@splinetool/react-spline").catch(() => () => null),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 border-4 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    ),
  }
);

function FallbackOrb() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Animated gradient orb fallback */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
        <div className="absolute inset-0 rounded-full bg-linear-to-br from-cyan-500/30 via-blue-500/30 to-indigo-600/30 blur-2xl animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-linear-to-tr from-blue-400/20 to-purple-500/20 blur-xl animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute inset-8 rounded-full bg-linear-to-br from-cyan-400/40 via-blue-500/40 to-indigo-500/40 blur-lg" />
      </div>
    </div>
  );
}

export function HeroOrb() {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
      {/* Spline 3D Orb or Fallback */}
      <div className="absolute inset-0 z-0">
        {hasError ? (
          <FallbackOrb />
        ) : (
          <Suspense fallback={<FallbackOrb />}>
            <Spline
              scene="https://prod.spline.design/pfe2UgQYwfrRHzNtMG7TPygq/scene.splinecode"
              className="w-full h-full"
              onError={() => setHasError(true)}
            />
          </Suspense>
        )}
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
            <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-2xl">
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-linear-to-br from-blue-400/15 to-cyan-400/15 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-linear-to-br from-indigo-400/15 to-purple-400/15 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
