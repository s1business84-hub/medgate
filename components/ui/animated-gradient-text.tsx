"use client"

import { motion } from "framer-motion"

interface AnimatedGradientTextProps {
  children: string
  className?: string
  duration?: number
}

export function AnimatedGradientText({
  children,
  className = "",
  duration = 6,
}: AnimatedGradientTextProps) {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      initial={{ backgroundPosition: "0%" }}
      animate={{ backgroundPosition: "100%" }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      style={{
        background: `linear-gradient(90deg,
          rgb(96, 165, 250),   /* blue-400 */
          rgb(129, 140, 248),  /* indigo-400 */
          rgb(59, 130, 246),   /* blue-500 */
          rgb(96, 165, 250))`,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </motion.span>
  )
}
