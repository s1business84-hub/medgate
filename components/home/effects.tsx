"use client";

/**
 * Restrained visual effects for the marketing surface.
 *
 * Curated from a much flashier wishlist: aurora wash, gradient headline,
 * rotating keyword, glow-border cards and real-data counters made the cut.
 * Starfields, meteors, orbital rings and film grain did not — they read as
 * a crypto site, not a healthcare platform.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------- aurora */

/** Slow two-blob aurora. Pure CSS transforms, GPU-friendly, no canvas. */
export function Aurora({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className={cn(
          "absolute -top-32 left-[10%] h-[28rem] w-[36rem] rounded-full",
          "bg-[radial-gradient(closest-side,rgba(59,130,246,0.16),transparent)]",
          "blur-3xl",
          !reduce && "animate-aurora-a"
        )}
      />
      <div
        className={cn(
          "absolute -top-20 right-[5%] h-[24rem] w-[30rem] rounded-full",
          "bg-[radial-gradient(closest-side,rgba(99,102,241,0.12),transparent)]",
          "blur-3xl",
          !reduce && "animate-aurora-b"
        )}
      />
      {/* third blob — a touch of teal so the wash reads as more than a
          single blue gradient without competing with the brand colour */}
      <div
        className={cn(
          "absolute top-1/3 left-1/3 h-[22rem] w-[26rem] rounded-full",
          "bg-[radial-gradient(closest-side,rgba(45,212,191,0.09),transparent)]",
          "blur-3xl",
          !reduce && "animate-aurora-c"
        )}
      />
    </div>
  );
}

/* ------------------------------------------------------ rotating word */

export function RotatingWord({
  words,
  interval = 2600,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval, reduce]);

  // Reserve width of the longest word so the line doesn't reflow.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span className={cn("relative inline-grid overflow-hidden align-bottom", className)}>
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {longest}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index]}
          initial={reduce ? false : { y: "70%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? undefined : { y: "-70%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="col-start-1 row-start-1"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ----------------------------------------------------------- count-up */

/** Animated counter for REAL numbers only — dashboards, not marketing. */
export function CountUp({
  value,
  duration = 0.9,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce || value === 0) {
      // Synchronizing external state (IntersectionObserver's inView, via
      // useInView) into React state on change is exactly what effects are
      // for — there's no render-time equivalent for "start when scrolled
      // into view."
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      // ease-out cubic
      setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {display}
    </span>
  );
}

/* --------------------------------------------------------- glow card */

/**
 * Liquid-glass card with an animated glow border on hover.
 * The glow is a masked gradient ring, so card content stays untouched.
 *
 * `accent` picks the glow/border hue from a small curated set — blue stays
 * the default and dominant brand colour, but letting a handful of cards
 * carry teal, violet or amber instead of forcing everything to blue is what
 * keeps a grid of otherwise-identical cards from reading as monotonous.
 * This is not a general-purpose colour prop: exactly these four, chosen to
 * stay inside the same "clean healthcare SaaS" register.
 */
const GLOW_ACCENTS = {
  blue: {
    border: "hover:border-blue-500/30",
    ring: "rgba(59,130,246,0.35), rgba(99,102,241,0.12), rgba(59,130,246,0.35)",
  },
  teal: {
    border: "hover:border-teal-400/30",
    ring: "rgba(45,212,191,0.35), rgba(59,130,246,0.12), rgba(45,212,191,0.35)",
  },
  violet: {
    border: "hover:border-violet-400/30",
    ring: "rgba(167,139,250,0.35), rgba(99,102,241,0.12), rgba(167,139,250,0.35)",
  },
  amber: {
    border: "hover:border-amber-400/30",
    ring: "rgba(251,191,36,0.35), rgba(99,102,241,0.12), rgba(251,191,36,0.35)",
  },
} as const;

export function GlowCard({
  children,
  className,
  accent = "blue",
}: {
  children: React.ReactNode;
  className?: string;
  accent?: keyof typeof GLOW_ACCENTS;
}) {
  const { border, ring } = GLOW_ACCENTS[accent];
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl",
        "transition-colors duration-300",
        border,
        className
      )}
    >
      {/* animated gradient ring, only visible on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(120deg, ${ring})`,
          backgroundSize: "250% 250%",
          animation: "glow-pan 4s linear infinite",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />
      {children}
    </div>
  );
}
