"use client"

import { motion, useReducedMotion } from "framer-motion"
import React, { useRef, useState } from "react"

type Props = {
  strength?: number
  className?: string
  children?: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
}

export default function MagneticButton({ 
  strength = 8, 
  className, 
  children,
  onClick,
  type = "button",
  disabled = false
}: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLButtonElement | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)
    setPos({ x: (x / (r.width / 2)) * strength, y: (y / (r.height / 2)) * strength })
  }

  function onLeave() {
    setPos({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.98 }}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={className}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}
