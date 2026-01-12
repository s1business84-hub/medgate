import { Hero } from "@/components/sections/hero"
import { Features } from "@/components/sections/features"
import { FAQ } from "@/components/sections/faq"

// Force Vercel rebuild
export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden text-slate-50">
      {/* Continuity background from hero through footer */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_30%_70%,rgba(79,70,229,0.16),transparent_30%),linear-gradient(180deg,#0b1220_0%,#0f172a_45%,#0b1220_100%)]" />

      <Hero />
      <Features />
      <FAQ />
    </main>
  )
}