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
    <main className="bg-white">
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
