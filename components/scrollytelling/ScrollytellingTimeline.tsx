'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || !timelineRef.current) return;

    const ctx = gsap.context(() => {
      // Animate the vertical line
      gsap.fromTo(
        timelineRef.current,
        {
          height: 0,
        },
        {
          height: '100%',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 0.6,
            markers: false,
          },
        }
      );

      // Animate each step card
      stepsRef.current.forEach((step, idx) => {
        if (!step) return;

        gsap.fromTo(
          step,
          {
            opacity: 0,
            y: 100,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            scrollTrigger: {
              trigger: step,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 0.6,
              markers: false,
            },
          }
        );

        // Animate the icon
        const icon = step.querySelector('.step-icon');
        if (icon) {
          gsap.fromTo(
            icon,
            {
              rotate: -180,
              scale: 0,
            },
            {
              rotate: 0,
              scale: 1,
              duration: 0.8,
              scrollTrigger: {
                trigger: step,
                start: 'top 70%',
                end: 'top 20%',
                scrub: 0.6,
                markers: false,
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative py-20 md:py-32 perf-section">
      {/* Central connecting line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-0" ref={timelineRef} />

      {/* Timeline steps */}
      <div className="space-y-12 md:space-y-16 max-w-4xl mx-auto px-6">
        {steps.map((step, idx) => (
          <div
            key={step.step}
            ref={(el) => {
              stepsRef.current[idx] = el;
            }}
            className={`relative flex items-start gap-8 md:gap-12 ${
              idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            {/* Step number circle - on timeline */}
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-8 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl border-4 border-slate-950 z-10 step-icon">
              <span className="text-white font-bold text-2xl">{step.step}</span>
            </div>

            {/* Left spacer for alignment */}
            <div className="hidden md:block flex-1" />

            {/* Card content */}
            <motion.div
              className="flex-1 group relative rounded-3xl border border-white/20 bg-white/8 backdrop-blur-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-white/30 perf-card"
              whileHover={{ scale: 1.02 }}
            >
              {/* Base gradient glass tint */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-white/3 to-indigo-500/5" />

              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-transparent to-indigo-600/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Liquid glass shine effect */}
              <div className="absolute inset-0 transition-opacity duration-300">
                <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-white/25 via-white/10 to-transparent rounded-full blur-3xl group-hover:from-white/35 transition-all" />
              </div>

              {/* Animated left accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

              <div className="relative z-10 p-8 md:p-10">
                <h3 className="text-2xl font-bold text-slate-100 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-300 group-hover:text-slate-200 transition-colors leading-relaxed text-lg">
                  {step.description}
                </p>
              </div>
            </motion.div>

            {/* Right spacer for alignment */}
            <div className="hidden md:block flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
