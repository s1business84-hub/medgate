"use client"

import { motion, useReducedMotion, cubicBezier } from "framer-motion"
import React from "react"

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  once?: boolean
  y?: number
}

export default function Reveal({
  children,
  className,
  delay = 0,
  once = true,
  y = 14,
}: RevealProps) {
  const reduce = useReducedMotion()

  const variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.55,
        ease: cubicBezier(0.16, 1, 0.3, 1),
        delay,
      },
    },
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.25 }}
    >
      {children}
    </motion.div>
  )
}
