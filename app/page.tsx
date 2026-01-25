import { Hero } from "@/components/sections/hero"
import { Features } from "@/components/sections/features"
import { FAQ } from "@/components/sections/faq"
import { ScrollableViewport, ScrollSection } from "@/components/scrollable-viewport"
import Navbar from "@/components/Navbar"

// Force Vercel rebuild
export default function Home() {
  return (
    <main className="relative min-h-screen text-slate-50">
      {/* Premium sticky navbar with blur */}
      <Navbar />
      {/* Continuity background + subtle aurora */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_30%_70%,rgba(79,70,229,0.16),transparent_30%),linear-gradient(180deg,#0b1220_0%,#0f172a_45%,#0b1220_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 [filter:blur(40px)]">
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-purple-400/35 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-24 right-1/4 h-72 w-72 rounded-full bg-cyan-400/30 animate-[pulse_10s_ease-in-out_infinite]" />
      </div>

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
          <Features />
        </ScrollSection>

        <ScrollSection id="faq">
          <FAQ />
        </ScrollSection>
      </ScrollableViewport>
    </main>
  )
}