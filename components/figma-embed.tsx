"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface FigmaEmbedProps {
  fileId: string;
  nodeId?: string;
  title?: string;
  allowFullscreen?: boolean;
  scrollable?: boolean;
  height?: string;
  className?: string;
}

export function FigmaEmbed({
  fileId,
  nodeId,
  title = "Figma Design",
  allowFullscreen = true,
  scrollable = true,
  height = "600px",
  className = "",
}: FigmaEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Figma embed script
    const script = document.createElement("script");
    script.src = "https://cdn.figma.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const embedUrl = nodeId
    ? `https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/${fileId}?node-id=${nodeId}`
    : `https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/${fileId}`;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
      className={`figma-embed-container rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl hover:border-white/20 transition-colors duration-300 ${className}`}
      style={{
        height,
      }}
    >
      <div className="relative w-full h-full">
        <iframe
          title={title}
          src={embedUrl}
          allowFullScreen={allowFullscreen}
          className={`w-full h-full border-0 ${scrollable ? "overflow-auto" : "overflow-hidden"}`}
          style={{
            pointerEvents: "auto",
            scrollBehavior: scrollable ? "smooth" : "auto",
          }}
        />
        {/* Gradient overlay for visual enhancement */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-slate-900 to-transparent pointer-events-none z-10" />
      </div>

      {/* Loading skeleton */}
      <div className="absolute inset-0 animate-pulse bg-linear-to-br from-slate-800 to-slate-900 -z-10" />
    </motion.div>
  );
}

export function FigmaEmbedSection({
  fileId,
  nodeId,
  title = "Design Showcase",
  description = "",
  height = "600px",
  showBadge = true,
}: {
  fileId: string;
  nodeId?: string;
  title?: string;
  description?: string;
  height?: string;
  showBadge?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-slate-900 via-slate-800 to-indigo-900 py-16 sm:py-24 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-700 mask-[linear-gradient(0deg,rgba(0,0,0,0.4),rgba(255,255,255,0.05))] -z-10" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 -z-10">
        <div className="h-96 w-96 rounded-full bg-linear-to-br from-blue-500 to-indigo-500 opacity-15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          {showBadge && (
            <div className="mb-4 inline-block">
              <span className="text-xs sm:text-sm text-blue-200/80 bg-blue-500/10 border border-blue-400/30 rounded-full px-3 py-1 inline-block">
                ✨ Interactive Design
              </span>
            </div>
          )}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            {title}
          </h2>
          {description && (
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>

        {/* Figma Embed */}
        <div className="relative">
          <FigmaEmbed
            fileId={fileId}
            nodeId={nodeId}
            height={height}
            scrollable={true}
            className="mx-auto max-w-5xl"
          />
        </div>
      </div>
    </section>
  );
}
