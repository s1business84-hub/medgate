/**
 * StaggerGroup Component
 * Wraps children and animates them in sequence with stagger delay
 * Respects prefers-reduced-motion
 */

"use client";

import { motion, type Variants } from "framer-motion";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
}

export function StaggerGroup({
  children,
  className = "",
  staggerDelay = 0.1,
  initialDelay = 0.2,
}: StaggerGroupProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const containerVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
        delayChildren: prefersReducedMotion ? 0 : initialDelay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
}

export function StaggerItem({ children, className = "", y = 20 }: StaggerItemProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const itemVariants: Variants = {
    hidden: { 
      opacity: prefersReducedMotion ? 1 : 0, 
      y: prefersReducedMotion ? 0 : y 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
