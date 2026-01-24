"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ScrollableViewportProps {
  children: React.ReactNode;
  showProgress?: boolean;
  showNavigationDots?: boolean;
  showArrows?: boolean;
  snapToSections?: boolean;
  className?: string;
}

export function ScrollableViewport({
  children,
  showProgress = true,
  showNavigationDots = true,
  showArrows = true,
  snapToSections = true,
  className = "",
}: ScrollableViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [totalSections, setTotalSections] = useState(0);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll("[data-section]");
    setTotalSections(sections.length);

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      setCanScrollUp(scrollTop > 50);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 50);

      // Determine active section
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        if (
          rect.top >= containerRect.top &&
          rect.top < containerRect.top + clientHeight / 2
        ) {
          setActiveSection(index);
        }
      });
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll("[data-section]");
    const targetSection = sections[index] as HTMLElement;

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollBy = (direction: "up" | "down") => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = window.innerHeight * 0.8;
    container.scrollBy({
      top: direction === "down" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Progress Bar */}
      {showProgress && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 origin-left z-50"
          style={{ scaleX }}
        />
      )}

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className={`w-full h-full overflow-y-auto overflow-x-hidden ${
          snapToSections ? "snap-y snap-mandatory" : ""
        } scroll-smooth ${className}`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(59, 130, 246, 0.5) rgba(15, 23, 42, 0.3)",
        }}
      >
        {children}
      </div>

      {/* Navigation Dots */}
      {showNavigationDots && totalSections > 0 && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
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
      {showArrows && (
        <>
          {canScrollUp && (
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={() => scrollBy("up")}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-40 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 group"
              aria-label="Scroll up"
            >
              <ChevronUp className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
            </motion.button>
          )}

          {canScrollDown && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => scrollBy("down")}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 group animate-bounce"
              aria-label="Scroll down"
            >
              <ChevronDown className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
            </motion.button>
          )}
        </>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        /* Webkit browsers (Chrome, Safari) */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 4px;
          transition: background 0.3s ease;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }

        /* Smooth scroll behavior */
        .scroll-smooth {
          scroll-behavior: smooth;
        }

        /* Snap points */
        .snap-y {
          scroll-snap-type: y proximity;
        }

        .snap-mandatory {
          scroll-snap-type: y mandatory;
        }

        [data-section] {
          scroll-snap-align: start;
          scroll-snap-stop: normal;
        }
      `}</style>
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
    <section
      data-section
      id={id}
      className={`min-h-screen w-full ${className}`}
    >
      {children}
    </section>
  );
}
