"use client";

/**
 * Vertical zigzag timeline. See ScrollytellingFeatures for why this no
 * longer uses GSAP ScrollTrigger scrub — the same opacity-tied-to-scroll
 * fragility applied here to the connecting line, each step card, and the
 * step-number icons.
 */

import { motion, useReducedMotion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineStep {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
}

interface ScrollytellingTimelineProps {
  steps: TimelineStep[];
}

export function ScrollytellingTimeline({ steps }: ScrollytellingTimelineProps) {
  const reduce = useReducedMotion();

  return (
    <div className="relative py-12 md:py-16">
      {/*
        Connecting line. Rails to the left gutter on mobile and only moves to
        centre from md up, where the zigzag spacers actually exist. Previously
        it sat at left-1/2 at every width, so on mobile — where the spacers are
        hidden and cards span full width — it drew straight through the cards.
      */}
      <motion.div
        aria-hidden
        className="absolute left-8 top-0 bottom-0 w-1 origin-top bg-gradient-to-b from-transparent via-blue-500 to-transparent md:left-1/2 md:-translate-x-1/2"
        initial={reduce ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="mx-auto max-w-4xl space-y-12 px-6 md:space-y-16">
        {steps.map((step, idx) => (
          <div
            key={step.step}
            className={cn(
              "relative flex items-start gap-0 md:gap-12",
              idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            )}
          >
            {/* Step number circle — sits on the line at both breakpoints */}
            <motion.div
              className="absolute left-8 top-8 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-slate-950 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl md:left-1/2 md:h-16 md:w-16"
              initial={reduce ? false : { scale: 0, rotate: -90 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-xl font-bold text-white md:text-2xl">{step.step}</span>
            </motion.div>

            <div className="hidden flex-1 md:block" />

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group relative ml-12 flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-colors duration-300 hover:border-blue-500/30 md:ml-0"
            >
              {/* animated glow ring on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(120deg, rgba(59,130,246,0.35), rgba(99,102,241,0.12), rgba(59,130,246,0.35))",
                  backgroundSize: "250% 250%",
                  animation: "glow-pan 4s linear infinite",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  padding: "1px",
                }}
              />

              <div className="relative z-10 p-8 md:p-10">
                <h3 className="mb-3 text-2xl font-bold text-white">{step.title}</h3>
                <p className="text-lg leading-relaxed text-slate-300">
                  {step.description}
                </p>
              </div>
            </motion.div>

            <div className="hidden flex-1 md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
