import { Hero } from "@/components/sections/hero-refined"
import { EnhancedFeatures } from "@/components/sections/enhanced-features"
import { FAQ } from "@/components/sections/faq"

export default function Home() {
  return (
    <main className="relative text-slate-100 bg-slate-950">
      {/* Dark liquid glass background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-slate-950" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,255,0.12),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.10),transparent_50%)]" />

      <section id="hero">
        <Hero />
      </section>

      <section id="features">
        <EnhancedFeatures />
      </section>

      <section id="faq">
        <FAQ />
      </section>
    </main>
  )
}
