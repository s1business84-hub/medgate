'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, idx) => {
        if (!item) return;

        // Create a staggered reveal animation based on scroll position
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 35%',
            scrub: 0.6,
            markers: false,
          },
        });

        tl.fromTo(
          item,
          {
            opacity: 0,
            y: 60,
            scale: 0.9,
            rotateX: 20,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 1,
          },
          0
        );

        // Animate icon separately for more dynamism
        const icon = item.querySelector('.feature-icon');
        if (icon) {
          tl.fromTo(
            icon,
            {
              scale: 0,
              rotate: -180,
              opacity: 0,
            },
            {
              scale: 1,
              rotate: 0,
              opacity: 1,
              duration: 0.8,
            },
            0.1
          );
        }

        // Animate accent bar
        const accent = item.querySelector('.feature-accent');
        if (accent) {
          gsap.fromTo(
            accent,
            {
              width: 0,
              opacity: 0,
            },
            {
              width: '100%',
              opacity: 1,
              duration: 0.6,
              scrollTrigger: {
                trigger: item,
                start: 'top 70%',
                end: 'top 40%',
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
    <div
      ref={containerRef}
      style={{ perspective: '1200px' }}
      className="py-20 md:py-32"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto px-6">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            ref={(el) => {
              itemsRef.current[idx] = el;
            }}
            className="group relative rounded-3xl border border-white/20 bg-white/8 backdrop-blur-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 hover:border-white/30"
            whileHover={{ y: -8 }}
          >
            {/* Base gradient glass tint - always visible */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-white/3 to-indigo-500/5" />

            {/* Animated gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/8 via-transparent to-indigo-600/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Liquid glass shine effect - top left shimmer */}
            <div className="absolute inset-0 transition-opacity duration-300">
              <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-white/25 via-white/10 to-transparent rounded-full blur-3xl group-hover:from-white/35 transition-all" />
              <div className="absolute bottom-[-20%] right-[-10%] w-1/2 h-1/2 bg-gradient-to-tl from-indigo-400/10 to-transparent rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 p-6 lg:p-8">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 feature-icon`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-300 group-hover:text-slate-200 transition-colors leading-relaxed mb-4">
                {feature.description}
              </p>
              <div
                className={`h-1 bg-gradient-to-r ${feature.gradient} rounded-full feature-accent`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
