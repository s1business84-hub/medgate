"use client";

import { motion, useReducedMotion } from "framer-motion";
import React from "react";
import { motionTokens } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number; // Optional for backward compatibility
};

export function Reveal({ children, delay = 0, className, y = motionTokens.distance.y }: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: motionTokens.duration.page,
        ease: motionTokens.ease.standard,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
