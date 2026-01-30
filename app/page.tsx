import { Hero } from "@/components/sections/hero-refined"
import { EnhancedFeatures } from "@/components/sections/enhanced-features"
import { FAQ } from "@/components/sections/faq"
import { ScrollableViewport, ScrollSection } from "@/components/scrollable-viewport"
import Navbar from "@/components/Navbar"

// Force Vercel rebuild
export default function Home() {
  return (
    <main className="relative min-h-screen text-slate-100 bg-slate-950">
      {/* Dark liquid glass background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-slate-950" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,255,0.12),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.10),transparent_50%)]" />

      <ScrollableViewport
        showProgress={true}
        showNavigationDots={true}
        showArrows={true}
        snapToSections={false}
      >
        <ScrollSection id="hero">
          <Hero />
        </ScrollSection>

        <ScrollSection id="features">
          {/* Show navbar before features section */}
          <Navbar />
          <EnhancedFeatures />
        </ScrollSection>

        <ScrollSection id="faq">
          <FAQ />
        </ScrollSection>
      </ScrollableViewport>
    </main>
  )
}