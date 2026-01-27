import { Hero } from "@/components/sections/hero-refined"
import { EnhancedFeatures } from "@/components/sections/enhanced-features"
import { FAQ } from "@/components/sections/faq"
import { ScrollableViewport, ScrollSection } from "@/components/scrollable-viewport"
import Navbar from "@/components/Navbar"

// Force Vercel rebuild
export default function Home() {
  return (
    <main className="relative min-h-screen text-slate-900">
      {/* Premium sticky navbar with blur */}
      <Navbar />
      {/* Light gradient background with liquid glass */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(147,197,253,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(196,181,253,0.12),transparent_50%)]" />

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