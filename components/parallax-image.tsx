"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";

interface ParallaxImageProps {
  src: string;
  alt: string;
  segments?: number;
  className?: string;
}

export function ParallaxImage({
  src,
  alt,
  segments = 4,
  className = "",
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Clamp and memoize segment count to keep hook order stable
  const segmentCount = useMemo(() => Math.max(1, Math.min(segments, 6)), [segments]);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Track scroll progress once and derive values without multiple useTransform calls
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setProgress(v);
  });

  // Create segments that reveal progressively (stable across renders)
  const segmentArray = useMemo(
    () => Array.from({ length: segmentCount }, (_, i) => i),
    [segmentCount]
  );

  const segmentMeta = useMemo(
    () =>
      segmentArray.map((index) => {
        const start = index / segmentCount;
        const end = (index + 1) / segmentCount;
        const clipPath = `inset(${(index * 100) / segmentCount}% 0 ${
          ((segmentCount - index - 1) * 100) / segmentCount
        }% 0)`;
        return { start, end, clipPath };
      }),
    [segmentArray, segmentCount]
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height: `${segmentCount * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full">
        <div className="relative h-full w-full">
          {segmentArray.map((index) => {
            const { start, end, clipPath } = segmentMeta[index];
            const opacity = interpRange(progress, [start - 0.1, start, end, end + 0.1], [0, 1, 1, 0]);
            const scale = interpRange(progress, [start, end], [1.2, 1]);
            const y = interpRange(progress, [start, end], [20, 0]);

            return (
              <motion.div
                key={index}
                className="absolute inset-0"
                style={{
                  opacity,
                  scale,
                  y: `${y}%`,
                  clipPath,
                }}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={src}
                    alt={`${alt} - segment ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  {/* Gradient overlay for depth */}
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/20"
                    style={{
                      opacity: 0.3 + (index * 0.2) / segmentCount,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}

          {/* Additional parallax text overlays */}
          {segmentArray.map((index) => {
            const { start, end } = segmentMeta[index];
            const textOpacity = interpRange(progress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]);
            const textY = interpRange(progress, [start, end], [30, -30]);

            return (
              <motion.div
                key={`text-${index}`}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  opacity: textOpacity,
                  y: `${textY}%`,
                }}
              >
                <div className="text-center px-4">
                  <h3 className="text-4xl md:text-6xl font-bold text-white/90 drop-shadow-2xl">
                    {getSegmentTitle(index)}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getSegmentTitle(index: number): string {
  const titles = [
    "Discover Excellence",
    "Transform Your Journey",
    "Build Your Future",
    "Achieve Greatness",
  ];

  return titles[index] || `Section ${index + 1}`;
}

// Simple linear interpolation with clamping
function interpRange(
  value: number,
  input: number[],
  output: number[]
): number {
  if (input.length !== output.length) return output[output.length - 1] ?? 0;
  if (value <= input[0]) return output[0];
  if (value >= input[input.length - 1]) return output[output.length - 1];

  for (let i = 0; i < input.length - 1; i++) {
    const start = input[i];
    const end = input[i + 1];
    if (value >= start && value <= end) {
      const t = (value - start) / (end - start);
      return lerp(output[i], output[i + 1], t);
    }
  }

  return output[output.length - 1];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Simpler version with horizontal split
export function SplitParallaxImage({
  src,
  alt,
  className = "",
}: Omit<ParallaxImageProps, "segments">) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setProgress(v));

  const leftX = interpRange(progress, [0, 1], [-50, 0]);
  const rightX = interpRange(progress, [0, 1], [50, 0]);
  const opacity = interpRange(progress, [0, 0.5, 1], [0, 1, 1]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 flex">
        {/* Left half */}
        <motion.div
          className="relative w-1/2 h-full overflow-hidden"
          style={{ x: `${leftX}%`, opacity }}
        >
          <Image
            src={src}
            alt={`${alt} - left`}
            fill
            className="object-cover object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/50" />
        </motion.div>

        {/* Right half */}
        <motion.div
          className="relative w-1/2 h-full overflow-hidden"
          style={{ x: `${rightX}%`, opacity }}
        >
          <Image
            src={src}
            alt={`${alt} - right`}
            fill
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-slate-900/50" />
        </motion.div>
      </div>

      {/* Center content */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity }}
      >
        <div className="text-center px-4 z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl">
            {alt}
          </h2>
        </div>
      </motion.div>
    </div>
  );
}
