import { Hero } from "@/components/sections/hero-refined"
import { EnhancedFeatures } from "@/components/sections/enhanced-features"
import { FAQ } from "@/components/sections/faq"
import { ScrollableViewport, ScrollSection } from "@/components/scrollable-viewport"
import Navbar from "@/components/Navbar"

// Force Vercel rebuild
export default function Home() {
  return (
    <main className="relative min-h-screen text-slate-50">
      {/* Premium sticky navbar with blur */}
      <Navbar />
      {/* Refined background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-slate-950" />

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
          <EnhancedFeatures />
        </ScrollSection>

        <ScrollSection id="faq">
          <FAQ />
        </ScrollSection>
      </ScrollableViewport>
    </main>
  )
}