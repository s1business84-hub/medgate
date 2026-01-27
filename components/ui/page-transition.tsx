"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface PageTransitionProps {
  isOpen: boolean
  onComplete: () => void
  targetUrl?: string
}

export function PageTransition({ isOpen, onComplete, targetUrl }: PageTransitionProps) {
  const router = useRouter()
  const lineCount = 20 // Number of vertical lines

  useEffect(() => {
    if (!isOpen) return
    
    // Navigate after lines start closing
    const navigateTimer = setTimeout(() => {
      if (targetUrl) {
        router.push(targetUrl)
      }
    }, 600)

    // Complete animation
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 1400)

    return () => {
      clearTimeout(navigateTimer)
      clearTimeout(completeTimer)
    }
  }, [isOpen, targetUrl, router, onComplete])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 pointer-events-none">
          <div className="relative w-full h-full flex">
            {Array.from({ length: lineCount }).map((_, index) => (
              <motion.div
                key={index}
                className="flex-1 bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/30"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: [0, 1, 1, 0] }}
                transition={{
                  duration: 1.4,
                  delay: index * 0.02,
                  times: [0, 0.4, 0.6, 1],
                  ease: [0.22, 1, 0.36, 1]
                }}
                style={{
                  transformOrigin: "top",
                }}
              >
                {/* Subtle gradient overlay for depth */}
                <motion.div
                  className="w-full h-full bg-linear-to-b from-cyan-500/10 via-transparent to-blue-500/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 1.4,
                    delay: index * 0.02,
                    times: [0, 0.3, 0.7, 1],
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Center loading indicator */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.4, times: [0, 0.3, 0.7, 1] }}
          >
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
