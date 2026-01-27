"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";

interface RevealTextProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  splitType?: "words" | "chars" | "lines";
}

export function RevealText({ 
  children, 
  className = "", 
  delay = 0, 
  stagger = 0.03,
  splitType = "words" 
}: RevealTextProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current || typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    const split = new SplitText(textRef.current, { type: splitType });
    const targets = splitType === "words" ? split.words : splitType === "chars" ? split.chars : split.lines;

    gsap.fromTo(
      targets,
      { opacity: 0, y: 20, rotationX: -90 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        stagger,
        delay,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      split.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [children, delay, stagger, splitType]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
}
