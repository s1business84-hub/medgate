"use client";

import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/lib/motion";

export function Toast({
  open,
  message,
}: {
  open: boolean;
  message: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
            transition={{ duration: motionTokens.duration.ui, ease: motionTokens.ease.emphasis }}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-lg"
          >
            <p className="text-sm">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
