"use client"

import React, { useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

type Props = {
  children: React.ReactNode
  className?: string
  maxTilt?: number // degrees
}

export default function TiltCard({ children, className, maxTilt = 7 }: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 })

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height

    const ry = (px - 0.5) * (maxTilt * 2)
    const rx = (0.5 - py) * (maxTilt * 2)

    setT({ rx, ry, gx: px * 100, gy: py * 100 })
  }

  function onLeave() {
    setT({ rx: 0, ry: 0, gx: 50, gy: 50 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{ rotateX: t.rx, rotateY: t.ry }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      style={{ transformStyle: "preserve-3d" }}
      className={["relative rounded-2xl", className].join(" ")}
    >
      {/* glare */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(220px circle at ${t.gx}% ${t.gy}%, rgba(255,255,255,0.22), transparent 55%)`,
          mixBlendMode: "overlay",
        }}
      />
      <div style={{ transform: "translateZ(0.1px)" }} className="relative">
        {children}
      </div>
    </motion.div>
  )
}
