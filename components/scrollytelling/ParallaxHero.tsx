'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxHeroProps {
  children: React.ReactNode;
  className?: string;
  parallaxStrength?: number;
}

export function ParallaxHero({
  children,
  className = '',
  parallaxStrength = 0.5,
}: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax effect for background elements
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          y: -100 * parallaxStrength,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            markers: false,
          },
        });
      }

      // Subtle fade and scale on content
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          {
            opacity: 1,
            y: 0,
          },
          {
            opacity: 0.3,
            y: -50,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'center top',
              scrub: 1,
              markers: false,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [parallaxStrength]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
    >
      {/* Parallax background layer */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.15),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.12),transparent_35%),radial-gradient(circle_at_40%_80%,rgba(139,92,246,0.13),transparent_38%),linear-gradient(180deg,#0a0e1a_0%,#0f172a_50%,#0a0e1a_100%)]"
      />

      {/* Main content */}
      <div ref={contentRef} className="relative z-10">
        {children}
      </div>
    </div>
  );
}
