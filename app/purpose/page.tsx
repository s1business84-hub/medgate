"use client";

import Link from "next/link";
import { ArrowLeft, Zap, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger, Observer, Draggable, SplitText } from "gsap/all";
import { usePrefersReducedMotion } from "@/components/animation/usePrefersReducedMotion";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { StaggerGroup, StaggerItem } from "@/components/animation/StaggerGroup";

export default function PurposePage() {
  const [activeCard, setActiveCard] = useState<"students" | "hospitals">("students");
  const lookingAheadRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: lookingAheadRef, offset: ["start end", "end start"] });
  // Background overlay opacity on scroll
  const redBgOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.35]);
  // Plane flight path - from bottom-left corner flying up to top-right (touching the sky)
  const planeX = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const planeY = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const planeRotate = useTransform(scrollYProgress, [0, 1], [-45, -35]);
  const planeOpacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Observer, Draggable, SplitText);
    const ctx = gsap.context(() => {
      // Only animate if user doesn't prefer reduced motion
      if (!prefersReducedMotion) {
        const headings = gsap.utils.toArray<HTMLElement>(".purpose-heading");
        headings.forEach((heading) => {
          const split = new SplitText(heading, { type: "words" });
          gsap.from(split.words, {
            opacity: 0,
            y: 24,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: { trigger: heading, start: "top 80%" },
          });
        });

        gsap.utils.toArray<HTMLElement>(".purpose-card").forEach((card) => {
          gsap.fromTo(
            card,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
            }
          );
        });
      }

      const panel = document.querySelector(".purpose-plane-panel");
      if (panel) {
        Observer.create({
          target: panel,
          type: "wheel,touch,pointer",
          onUp: () => setActiveCard("hospitals"),
          onDown: () => setActiveCard("students"),
        });
      }

      const plane = document.querySelector(".purpose-plane");
      if (plane) {
        Draggable.create(plane as Element, {
          type: "x,y",
          bounds: panel || window,
          onDrag: function () {
            gsap.to(this.target, { rotate: this.x / 15, duration: 0.2, ease: "power2.out", overwrite: "auto" });
          },
        });
      }
    });

    return () => ctx.revert();
  }, [setActiveCard, prefersReducedMotion]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <LiquidParallax className="opacity-10" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.06),transparent_50%)]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-indigo-500/8 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_2s]" />
      </div>

      <div className="relative w-full px-6 lg:px-12 xl:px-16 py-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-center justify-between mb-12 max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center px-3 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl text-slate-300 hover:bg-white/10 transition-all hover:translate-x-1 shadow-lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="text-center mb-12 max-w-7xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} className="purpose-heading text-5xl md:text-7xl font-bold text-white mb-6">
            Our Purpose
          </motion.h1>
          {/* Subtle divider line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-1 w-24 mx-auto bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full"
          />
        </motion.div>

        <div className="max-w-7xl mx-auto">
        <section className="mb-24">
          <motion.div initial={{ opacity: 0, y: 80 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true, amount: 0.2 }} className="purpose-card group relative bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-8 md:p-12 mb-12 overflow-hidden hover:border-cyan-400/30 hover:shadow-2xl transition-all duration-700">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }} viewport={{ once: true }} className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div animate={{ y: [0, -20, 0], x: [0, 10, 0], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 right-20 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
              <motion.div animate={{ y: [0, 30, 0], x: [0, -15, 0], opacity: [0.05, 0.2, 0.05] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-20 left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                  <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="mb-6">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-12 h-12 bg-linear-to-br from-cyan-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </motion.div>
                      <h2 className="purpose-heading text-3xl md:text-4xl font-bold text-white">
                        Our Purpose
                      </h2>
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="space-y-6">
                    <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} viewport={{ once: true }} className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
                      Electivio exists to <span className="text-cyan-400 font-semibold">simplify and standardize</span> access to medical observerships and elective programs across the UAE.
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} viewport={{ once: true }} className="pl-4 border-l-2 border-cyan-400">
                      <p className="text-lg text-slate-400 leading-relaxed">
                        Today, medical students often face <span className="text-slate-200 font-medium">fragmented information</span>, unclear eligibility criteria, and slow, manual communication when seeking clinical exposure. At the same time, healthcare institutions lack a structured, policy-aligned way to publish programs and manage applications efficiently.
                      </p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }} viewport={{ once: true }} className="pl-4 border-l-2 border-indigo-400">
                      <p className="text-lg text-slate-400 leading-relaxed">
                        Electivio bridges this gap by providing a <span className="text-slate-200 font-medium">centralized platform</span> where institutions define requirements clearly and students understand opportunities upfront—reducing administrative friction for both sides.
                      </p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.8 }} viewport={{ once: true }} className="mt-8 p-6 rounded-2xl bg-linear-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20">
                      <p className="text-lg text-cyan-300 leading-relaxed font-medium text-center">
                        💡 Our purpose is not to replace institutional processes, but to <span className="text-cyan-200 font-bold">support them</span> through clarity, structure, and transparency.
                      </p>
                    </motion.div>
                  </motion.div>
            </div>
          </motion.div>
        </section>

        <section className="mb-24">
          <ScrollReveal direction="up">
            <h2 className="purpose-heading text-3xl font-bold text-white mb-4">What We Are Building</h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-12">
              Electivio is being developed as a program management and discovery platform designed around real institutional workflows and student needs. We focus on three core areas:
            </p>
          </ScrollReveal>
          <StaggerGroup staggerDelay={0.15} initialDelay={0.1}>
            <StaggerItem>
              <ScrollReveal direction="left" delay={0}>
                <div className="purpose-card bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl p-8 hover:bg-white/10 hover:shadow-xl transition-all duration-500">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">1. Program Standardization</h3>
                  <p className="text-lg text-slate-400 leading-relaxed">
                    We help hospitals and clinics publish observership and elective programs with clearly defined eligibility criteria, documentation requirements, duration, and intake limits—set entirely by the institution.
                  </p>
                </div>
              </ScrollReveal>
            </StaggerItem>
            <StaggerItem>
              <ScrollReveal direction="right" delay={0}>
                <div className="purpose-card bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl p-8 hover:bg-white/10 hover:shadow-xl transition-all duration-500">
                  <h3 className="text-2xl font-bold text-indigo-400 mb-3">2. Administrative Efficiency</h3>
                  <p className="text-lg text-slate-400 leading-relaxed">
                    By centralizing program information and application workflows, Electivio reduces repetitive back and forth communication and improves visibility for students and administrators alike.
                  </p>
                </div>
              </ScrollReveal>
            </StaggerItem>
            <StaggerItem>
              <ScrollReveal direction="left" delay={0}>
                <div className="purpose-card bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl p-8 hover:bg-white/10 hover:shadow-xl transition-all duration-500">
                  <h3 className="text-2xl font-bold text-emerald-400 mb-3">3. Institutional Control & Governance</h3>
                  <p className="text-lg text-slate-400 leading-relaxed">
                    Electivio is built institution-first. Hospitals retain full control over program approvals, intake capacity, and internal policies while benefiting from a structured digital interface.
                  </p>
                </div>
              </ScrollReveal>
            </StaggerItem>
          </StaggerGroup>
        </section>

        <section className="mb-24">
          <motion.div initial={{ opacity: 0, y: 80 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="purpose-card bg-linear-to-br from-emerald-500/10 to-indigo-500/10 border border-white/10 rounded-3xl backdrop-blur-xl p-8 md:p-12 shadow-xl">
            <h2 className="purpose-heading text-3xl font-bold text-white mb-6">Our Focus Today</h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              Electivio is currently in early development and preparing for pilot collaborations with healthcare institutions across the UAE.
            </p>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">Our immediate focus is to:</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/30 mr-3 mt-1 shrink-0">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </span>
                <span className="text-lg text-slate-300">Launch pilot programs with select institutions</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/30 mr-3 mt-1 shrink-0">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </span>
                <span className="text-lg text-slate-300">Validate workflows with real users</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/30 mr-3 mt-1 shrink-0">
                  <Zap className="w-4 h-4 text-indigo-400" />
                </span>
                <span className="text-lg text-slate-300">Refine eligibility logic and application processes</span>
              </li>
            </ul>
            <p className="text-lg text-slate-400 leading-relaxed">
              This phased approach ensures the platform is aligned with institutional standards and regulatory expectations from the start.
            </p>
          </motion.div>
        </section>

        <section className="mb-24">
          <motion.div
            ref={lookingAheadRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="purpose-card purpose-plane-panel relative overflow-visible rounded-3xl backdrop-blur-xl p-8 md:p-12"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Subtle overlay that changes with scroll */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-indigo-500/5 rounded-3xl"
              style={{ opacity: redBgOpacity }}
            />

            <motion.h2
              className="purpose-heading text-3xl font-bold mb-6 text-white"
            >
              Looking Ahead
            </motion.h2>

            <div className="relative">
              <p className="text-lg text-slate-400 leading-relaxed mb-4">
                As the platform evolves, Electivio aims to expand coverage across all UAE emirates and continue improving how clinical training opportunities are accessed and managed—without compromising institutional autonomy or academic standards.
              </p>
              
              {/* Plane animation with trail - positioned in top-left, flying toward sky */}
              <motion.div
                aria-hidden
                className="absolute top-0 left-0 pointer-events-none"
                style={{ 
                  x: planeX, 
                  y: planeY,
                  opacity: planeOpacity
                }}
              >
                {/* Dotted trail line */}
                <svg 
                  className="absolute top-0 left-0 w-[600px] h-[500px]" 
                  style={{ 
                    transform: 'translate(-50px, 50px)',
                    overflow: 'visible'
                  }}
                >
                  <motion.path
                    d="M 0 400 Q 150 300, 300 150 T 600 0"
                    stroke="url(#planeGradient)"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    style={{ 
                      pathLength: scrollYProgress,
                      opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.6, 0.6, 0])
                    }}
                  />
                  <defs>
                    <linearGradient id="planeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="rgb(99, 102, 241)" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Plane icon */}
                <motion.div
                  style={{ rotate: planeRotate }}
                  className="relative"
                >
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 border-2 border-white backdrop-blur-md flex items-center justify-center shadow-2xl">
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                  {/* Glowing effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-400/40 blur-xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="purpose-heading text-3xl font-bold text-white mb-6">
              Join Electivio
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Whether you are a medical student seeking structured clinical exposure or a healthcare institution looking to streamline program management, Electivio is being built with you in mind.
            </p>
            <div className="flex justify-center gap-3 mb-8">
              <button
                onClick={() => setActiveCard("students")}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  activeCard === "students"
                    ? "bg-linear-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                For Students
              </button>
              <button
                onClick={() => setActiveCard("hospitals")}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  activeCard === "hospitals"
                    ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                For Hospitals
              </button>
            </div>
          </div>
          <div className="relative h-80 md:h-72">
            <AnimatePresence mode="wait">
              {activeCard === "students" ? (
                <motion.div key="students" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="purpose-card absolute inset-0 bg-linear-to-br from-cyan-500/10 to-blue-500/10 border border-white/10 rounded-3xl backdrop-blur-xl p-8 md:p-12 shadow-2xl overflow-hidden group">
                  <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold text-cyan-300 mb-6">Browse Programs</h3>
                    <p className="text-lg text-slate-400 leading-relaxed mb-8">
                      Discover structured observership and elective opportunities across the UAE. Explore programs that match your interests and eligibility, with clear requirements and transparent timelines.
                    </p>
                    <Link href="/programs">
                      <Button size="lg" className="bg-cyan-600 text-white hover:bg-cyan-700 font-semibold shadow-lg hover:shadow-xl">
                        Explore Programs
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="hospitals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="purpose-card absolute inset-0 bg-linear-to-br from-emerald-500/10 to-teal-500/10 border border-white/10 rounded-3xl backdrop-blur-xl p-8 md:p-12 shadow-2xl overflow-hidden group">
                  <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold text-emerald-300 mb-6">For Hospitals</h3>
                    <p className="text-lg text-slate-400 leading-relaxed mb-8">
                      Streamline your observership and elective program management. Publish clear eligibility criteria, manage applications efficiently, and connect with qualified students—all while maintaining institutional control.
                    </p>
                    <Link href="/for-hospitals">
                      <Button size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700 font-semibold shadow-lg hover:shadow-xl">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}
