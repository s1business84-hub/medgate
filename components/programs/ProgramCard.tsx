"use client";

import React, { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/lib/motion";

export function ProgramCard({
  title,
  meta,
  details,
}: {
  title: string;
  meta: string;
  details: string;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <LayoutGroup>
      <motion.div layout className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100">{title}</h3>
            <p className="mt-1 text-sm text-slate-300">{meta}</p>
          </div>

          <motion.button
            onClick={() => setOpen((v) => !v)}
            whileTap={reduce ? {} : { scale: 0.98 }}
            transition={{ duration: motionTokens.duration.fast }}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100"
          >
            {open ? "Hide Details" : "Show Details"}
          </motion.button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="details"
              layout
              initial={reduce ? { opacity: 1 } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, height: 0 }}
              transition={{ duration: motionTokens.duration.ui, ease: motionTokens.ease.standard }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-xl bg-white/5 p-3 text-sm text-slate-200 leading-relaxed">
                {details}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
