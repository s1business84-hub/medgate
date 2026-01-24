import { Hero } from "@/components/sections/hero"
import { Features } from "@/components/sections/features"
import { FigmaShowcase } from "@/components/sections/figma-showcase"
import { FAQ } from "@/components/sections/faq"
import { ScrollableViewport, ScrollSection } from "@/components/scrollable-viewport"
import { ParallaxImage } from "@/components/parallax-image"

// Force Vercel rebuild
export default function Home() {
  return (
    <main className="relative min-h-screen text-slate-50">
      {/* Continuity background from hero through footer */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_30%_70%,rgba(79,70,229,0.16),transparent_30%),linear-gradient(180deg,#0b1220_0%,#0f172a_45%,#0b1220_100%)]" />

      <ScrollableViewport
        showProgress={true}
        showNavigationDots={true}
        showArrows={true}
        snapToSections={false}
      >
        <ScrollSection id="hero">
          <Hero />
        </ScrollSection>

        <ScrollSection id="parallax">
          <ParallaxImage
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070"
            alt="Medical Excellence Journey"
            segments={4}
          />
        </ScrollSection>

        <ScrollSection id="features">
          <Features />
        </ScrollSection>

        <ScrollSection id="showcase" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <FigmaShowcase />
        </ScrollSection>

        <ScrollSection id="faq">
          <FAQ />
        </ScrollSection>
      </ScrollableViewport>
    </main>
  )
}