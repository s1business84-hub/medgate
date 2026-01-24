"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
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
  // Lock the segment count on first render to avoid changing hook call counts
  const segmentCountRef = useRef(Math.max(1, Math.min(segments, 6)));

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Create segments that reveal progressively (stable across renders)
  const segmentArray = useMemo(
    () => Array.from({ length: segmentCountRef.current }, (_, i) => i),
    []
  );

  // Precompute motion transforms for each segment to keep hooks in a stable order
  const segmentTransforms = useMemo(
    () =>
      segmentArray.map((index) => {
        const start = index / segmentCountRef.current;
        const end = (index + 1) / segmentCountRef.current;

        const opacity = useTransform(
          scrollYProgress,
          [start - 0.1, start, end, end + 0.1],
          [0, 1, 1, 0]
        );

        const scale = useTransform(scrollYProgress, [start, end], [1.2, 1]);

        const y = useTransform(scrollYProgress, [start, end], ["20%", "0%"]);

        const clipPath = `inset(${(index * 100) / segmentCountRef.current}% 0 ${
          ((segmentCountRef.current - index - 1) * 100) / segmentCountRef.current
        }% 0)`;

        return { opacity, scale, y, clipPath, start, end };
      }),
    [scrollYProgress, segmentArray]
  );

  const textTransforms = useMemo(
    () =>
      segmentArray.map((index) => {
        const start = index / segmentCountRef.current;
        const end = (index + 1) / segmentCountRef.current;

        const textOpacity = useTransform(
          scrollYProgress,
          [start, start + 0.1, end - 0.1, end],
          [0, 1, 1, 0]
        );

        const textY = useTransform(scrollYProgress, [start, end], ["30%", "-30%"]);

        return { textOpacity, textY };
      }),
    [scrollYProgress, segmentArray]
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height: `${segments * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full">
        <div className="relative h-full w-full">
          {segmentArray.map((index) => {
            const { opacity, scale, y, clipPath } = segmentTransforms[index];

            return (
              <motion.div
                key={index}
                className="absolute inset-0"
                style={{
                  opacity,
                  scale,
                  y,
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
                      opacity: 0.3 + (index * 0.2) / segmentCountRef.current,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}

          {/* Additional parallax text overlays */}
          {segmentArray.map((index) => {
            const { textOpacity, textY } = textTransforms[index];

            return (
              <motion.div
                key={`text-${index}`}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  opacity: textOpacity,
                  y: textY,
                }}
              >
                <div className="text-center px-4">
                  <h3 className="text-4xl md:text-6xl font-bold text-white/90 drop-shadow-2xl">
                    {getSegmentTitle(index, segmentCountRef.current)}
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

function getSegmentTitle(index: number, total: number): string {
  const titles = [
    "Discover Excellence",
    "Transform Your Journey",
    "Build Your Future",
    "Achieve Greatness",
  ];

  return titles[index] || `Section ${index + 1}`;
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

  const leftX = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);
  const rightX = useTransform(scrollYProgress, [0, 1], ["50%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 flex">
        {/* Left half */}
        <motion.div
          className="relative w-1/2 h-full overflow-hidden"
          style={{ x: leftX, opacity }}
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
          style={{ x: rightX, opacity }}
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
