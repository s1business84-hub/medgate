import {
  Hero,
  TrustStrip,
  Benefits,
  HowItWorks,
  FeaturedProgrammes,
  About,
  SplitCta,
  Faq,
} from "@/components/home/landing";

export default function Home() {
  return (
    <main className="bg-slate-950">
      <Hero />
      <TrustStrip />
      <Benefits />
      <HowItWorks />
      <FeaturedProgrammes />
      <About />
      <SplitCta />
      <Faq />
    </main>
  );
}
