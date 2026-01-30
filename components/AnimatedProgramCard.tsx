/**
 * AnimatedProgramCard Component
 * Smooth hover animations using react-spring
 * Lift, shadow, and scale effects optimized for performance
 */

"use client";

import { useSpring, animated, config } from "@react-spring/web";
import { useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "./animation/usePrefersReducedMotion";

interface AnimatedProgramCardProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedProgramCard({ children, className = "" }: AnimatedProgramCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const springProps = useSpring({
    transform: isHovered && !prefersReducedMotion
      ? "translateY(-8px) scale(1.02)"
      : "translateY(0px) scale(1)",
    boxShadow: isHovered && !prefersReducedMotion
      ? "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 80px rgba(99, 102, 241, 0.15)"
      : "0 4px 6px rgba(0, 0, 0, 0.1)",
    config: config.gentle,
  });

  return (
    <animated.div
      style={springProps}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
    >
      {children}
    </animated.div>
  );
}
