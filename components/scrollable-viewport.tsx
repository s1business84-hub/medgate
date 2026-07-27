"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ScrollableViewportProps {
  children: React.ReactNode;
  showProgress?: boolean;
  showNavigationDots?: boolean;
  showArrows?: boolean;
  /** Retained for API compatibility; snapping is no longer used. */
  snapToSections?: boolean;
  className?: string;
}

/**
 * Renders children in normal document flow and decorates the page with a scroll
 * progress bar, section dots, and scroll arrows driven by window scroll.
 *
 * This previously wrapped children in a fixed-height `overflow-y-auto` element.
 * That nested scroller broke `whileInView` reveals (they resolve against the
 * viewport, not the inner container), leaving sections stuck at zero opacity,
 * and it detached the sticky site header. Using window scroll fixes both.
 */
export function ScrollableViewport({
  children,
  showProgress = true,
  showNavigationDots = true,
  showArrows = true,
  className = "",
}: ScrollableViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [totalSections, setTotalSections] = useState(0);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const [mounted, setMounted] = useState(false);

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.0001,
    mass: 0.5,
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll("[data-section]");
    setTotalSections(sections.length);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;

      setCanScrollUp(scrollTop > 50);
      setCanScrollDown(
        scrollTop < document.documentElement.scrollHeight - viewportHeight - 50
      );

      // Active section = the last one whose top has passed the viewport middle.
      let current = 0;
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportHeight / 2) current = index;
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const sections = containerRef.current?.querySelectorAll("[data-section]");
    (sections?.[index] as HTMLElement | undefined)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollBy = (direction: "up" | "down") => {
    const amount = window.innerHeight * 0.8;
    window.scrollBy({
      top: direction === "down" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {showProgress && mounted && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-500 origin-left z-50"
          style={{ scaleX }}
        />
      )}

      {children}

      {/* Navigation Dots */}
      {showNavigationDots && totalSections > 1 && mounted && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
          {Array.from({ length: totalSections }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => scrollToSection(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === index
                  ? "bg-cyan-400 ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-slate-900"
                  : "bg-slate-600 hover:bg-slate-500"
              }`}
              aria-label={`Go to section ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Arrows */}
      {showArrows && mounted && (
        <>
          {canScrollUp && (
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => scrollBy("up")}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-40 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 group"
              aria-label="Scroll up"
            >
              <ChevronUp className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
            </motion.button>
          )}

          {canScrollDown && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => scrollBy("down")}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 group"
              aria-label="Scroll down"
            >
              <ChevronDown className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
            </motion.button>
          )}
        </>
      )}
    </div>
  );
}

export function ScrollSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section data-section id={id} className={`w-full ${className}`}>
      {children}
    </section>
  );
}
