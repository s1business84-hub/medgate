"use client";

import { motion, useReducedMotion } from "framer-motion";
import React from "react";
import { motionTokens } from "@/lib/motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: motionTokens.duration.page, ease: motionTokens.ease.standard }}
    >
      {children}
    </motion.div>
  );
}
