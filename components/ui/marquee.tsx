"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface MarqueeProps {
  items: string[];
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

export function Marquee({ items, speed = 50, direction = "left", className = "" }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    const track = trackRef.current;
    const itemWidth = track.scrollWidth / 2;
    
    const tl = gsap.timeline({ repeat: -1 });
    
    if (direction === "left") {
      tl.fromTo(
        track,
        { x: 0 },
        { x: -itemWidth, duration: speed, ease: "none" }
      );
    } else {
      tl.fromTo(
        track,
        { x: -itemWidth },
        { x: 0, duration: speed, ease: "none" }
      );
    }

    return () => {
      tl.kill();
    };
  }, [items, speed, direction]);

  const doubledItems = [...items, ...items];

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex gap-8 whitespace-nowrap">
        {doubledItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <span>{item}</span>
            <span className="text-cyan-400">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
