"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/lib/motion";

export function AccordionItem({
  q,
  a,
}: {
  q: string;
  a: string;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <button
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-medium text-slate-100">{q}</span>
        <motion.span
          animate={reduce ? {} : { rotate: open ? 180 : 0 }}
          transition={{ duration: motionTokens.duration.ui, ease: motionTokens.ease.standard }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200"
          aria-hidden
        >
          ˅
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, height: 0 }}
            transition={{ duration: motionTokens.duration.ui, ease: motionTokens.ease.standard }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-sm text-slate-300">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
