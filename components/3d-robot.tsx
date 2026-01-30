"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Robot3D() {
  const [isWaving, setIsWaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 3500);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative w-full h-96 rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-950/70 backdrop-blur-xl shadow-2xl shadow-cyan-500/20"
      style={{ perspective: "1200px" }}
    >
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-900/20 via-slate-950/50 to-slate-950" />
      
      {/* Animated lighting effects */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl"
        />
      </div>

      {/* Robot Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          animate={{ rotateY: isWaving ? 0 : [0, 360] }}
          transition={{ duration: isWaving ? 0.5 : 20, repeat: !isWaving ? Infinity : 0 }}
          style={{ transformStyle: "preserve-3d" }}
          className="w-32 h-40"
        >
          {/* Robot Head */}
          <motion.div
            className="absolute top-0 left-1/2 w-16 h-16 bg-linear-to-b from-cyan-400 to-cyan-600 rounded-full shadow-xl"
            style={{
              transform: "translateX(-50%)",
              boxShadow: "0 0 20px rgba(0, 217, 255, 0.5)",
            }}
          >
            {/* Left Eye */}
            <div className="absolute top-5 left-3 w-3 h-3 bg-white rounded-full shadow-lg animate-pulse" />
            {/* Right Eye */}
            <div className="absolute top-5 right-3 w-3 h-3 bg-white rounded-full shadow-lg animate-pulse" />
          </motion.div>

          {/* Robot Body */}
          <div className="absolute top-14 left-1/2 w-12 h-16 bg-linear-to-b from-cyan-500 to-cyan-700 rounded-lg shadow-xl" style={{ transform: "translateX(-50%)" }} />

          {/* Left Arm */}
          <motion.div
            className="absolute top-16 -left-8 w-8 h-12 bg-linear-to-b from-cyan-400 to-cyan-600 rounded shadow-lg"
            animate={{ rotateZ: [0, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Right Arm (Waving) */}
          <motion.div
            className="absolute top-16 -right-8 w-8 h-12 bg-linear-to-b from-cyan-400 to-cyan-600 rounded shadow-lg origin-top"
            animate={{
              rotateZ: isWaving ? [0, -120, 0] : [0],
            }}
            transition={{
              duration: isWaving ? 0.6 : 0,
              repeat: isWaving ? 5 : 0,
              repeatType: "reverse",
            }}
          />

          {/* Left Leg */}
          <div className="absolute bottom-0 -left-3 w-4 h-8 bg-linear-to-b from-cyan-600 to-cyan-800 rounded shadow-lg" />

          {/* Right Leg */}
          <div className="absolute bottom-0 -right-3 w-4 h-8 bg-linear-to-b from-cyan-600 to-cyan-800 rounded shadow-lg" />

          {/* Chest Light */}
          <motion.div
            className="absolute top-20 left-1/2 w-3 h-3 bg-cyan-300 rounded-full"
            style={{ transform: "translateX(-50%)" }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* Animated greeting */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-8 left-0 right-0 text-center pointer-events-none z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <p className="text-xl font-bold bg-linear-to-r from-cyan-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
            👋 Welcome to Medgate
          </p>
        </motion.div>
      </motion.div>

      {/* Corner accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-cyan-500/20 via-transparent to-transparent pointer-events-none rounded-bl-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-tr from-cyan-500/10 via-transparent to-transparent pointer-events-none rounded-tr-full" />
    </motion.div>
  );
}

