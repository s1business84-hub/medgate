/**
 * GSAP Animation Examples Component
 * Demonstrates various GSAP animations in practice
 */

'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Zap, Play } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function GSAPAnimationShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const scrollBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Box entrance animation
    gsap.fromTo(
      boxRef.current,
      { scale: 0, opacity: 0, rotate: -180 },
      { scale: 1, opacity: 1, rotate: 0, duration: 1, ease: 'elastic.out' }
    );

    // Counter animation
    const obj = { value: 0 };
    gsap.to(obj, {
      value: 100,
      duration: 2,
      delay: 0.5,
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.floor(obj.value).toString();
        }
      },
      ease: 'power2.out',
    });

    // Pulse animation
    gsap.to(pulseRef.current, {
      scale: 1.1,
      yoyo: true,
      repeat: -1,
      duration: 1.5,
      ease: 'sine.inOut',
    });

    // Scroll trigger animation
    gsap.fromTo(
      scrollBoxRef.current,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: scrollBoxRef.current,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
        },
      }
    );

    return () => {
        gsap.globalTimeline.clear();
    };
  }, []);

  return (
    <div ref={containerRef} className="space-y-12 py-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-cyan-400">
          <Zap className="w-6 h-6" />
          <h2 className="text-3xl font-bold">GSAP Animation Examples</h2>
        </div>
        <p className="text-slate-400">Explore powerful animations powered by GSAP</p>
      </div>

      {/* Box Animation */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Elastic Scale & Rotate</h3>
        <div className="flex justify-center">
          <div
            ref={boxRef}
            className="w-24 h-24 bg-linear-to-br from-cyan-500 to-indigo-600 rounded-lg shadow-lg"
          />
        </div>
        <p className="text-center text-sm text-slate-400">
          Animates with elastic easing for a playful effect
        </p>
      </div>

      {/* Counter Animation */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Number Counter</h3>
        <div className="flex justify-center">
          <div className="px-8 py-4 bg-slate-800/50 border border-cyan-500/30 rounded-lg">
            <div ref={counterRef} className="text-5xl font-bold text-cyan-400">
              0
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">Animates from 0 to 100</p>
          </div>
        </div>
      </div>

      {/* Pulse Animation */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Pulse Effect</h3>
        <div className="flex justify-center">
          <div
            ref={pulseRef}
            className="w-32 h-32 bg-linear-to-br from-emerald-500 to-teal-600 rounded-full shadow-lg flex items-center justify-center"
          >
            <Play className="w-12 h-12 text-white" />
          </div>
        </div>
        <p className="text-center text-sm text-slate-400">
          Continuously pulses with smooth scaling
        </p>
      </div>

      {/* Scroll Animation */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Scroll Trigger Animation</h3>
        <div
          ref={scrollBoxRef}
          className="p-6 bg-linear-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg backdrop-blur-sm"
        >
          <p className="text-slate-300">
            This box animates as it enters the viewport. Scroll down to see it in action!
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-lg space-y-3">
        <h4 className="font-semibold text-white">Available GSAP Features:</h4>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>✓ Tweens: Animate any property smoothly</li>
          <li>✓ Timelines: Sequence multiple animations</li>
          <li>✓ ScrollTrigger: Animations on scroll</li>
          <li>✓ Easing: 30+ easing functions</li>
          <li>✓ Callbacks: onStart, onUpdate, onComplete</li>
          <li>✓ Stagger: Animate multiple elements sequentially</li>
        </ul>
      </div>

      {/* Usage Guide */}
      <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-lg space-y-4">
        <h4 className="font-semibold text-white">Quick Start:</h4>
        <pre className="p-4 bg-slate-900/50 rounded text-xs text-green-400 overflow-x-auto">
          {`import { fadeIn, scaleIn } from '@/lib/gsap-animations';

// Simple animation
fadeIn('.my-element');

// With options
scaleIn('.my-element', 0.8, 0.2);

// Using hooks
const ref = useGSAPAnimation(fadeIn, { duration: 0.5 });
<div ref={ref}>Animates on mount!</div>`}
        </pre>
      </div>
    </div>
  );
}
