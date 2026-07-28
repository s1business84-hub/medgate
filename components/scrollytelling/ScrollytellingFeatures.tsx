"use client";

/**
 * Feature grid with a liquid-glass hover treatment.
 *
 * Previously drove card opacity directly off a GSAP ScrollTrigger `scrub`
 * value keyed to scroll position. Scrub-tied opacity depends on the
 * trigger's start/end offsets staying accurate after mount — any layout
 * shift above it (a parallax hero resizing, fonts loading) desyncs the
 * math and leaves cards stuck at partial or zero opacity. Reproduced this
 * directly on /for-hospitals: cards rendered invisible on load and only
 * appeared after a manual scroll jump. `whileInView` uses
 * IntersectionObserver, fires once, and can't get stuck this way.
 */

import { motion, useReducedMotion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureReveal {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  delay: number;
}

interface ScrollytellingFeaturesProps {
  features: FeatureReveal[];
}

export function ScrollytellingFeatures({ features }: ScrollytellingFeaturesProps) {
  const reduce = useReducedMotion();

  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-colors duration-300 hover:border-blue-500/30"
          >
            {/* animated glow ring on hover, matches GlowCard elsewhere on the site */}
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

            <div className="relative z-10 p-6 lg:p-8">
              <div
                className={cn(
                  "mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110",
                  feature.gradient
                )}
              >
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
              <p className="leading-relaxed text-slate-300">{feature.description}</p>
              <div
                className={cn(
                  "mt-5 h-1 origin-left scale-x-0 rounded-full bg-gradient-to-r transition-transform duration-500 group-hover:scale-x-100",
                  feature.gradient
                )}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
