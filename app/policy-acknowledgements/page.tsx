"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText, Lock, HeartHandshake } from "lucide-react";
import { LiquidParallax } from "@/components/ui/liquid-parallax";

export default function PolicyAcknowledgementsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <LiquidParallax className="opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />

      <div className="relative max-w-4xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">Policy Acknowledgements</h1>
          </div>
          <p className="text-slate-300 leading-relaxed mb-6">
            To keep observership programs safe and compliant, every applicant must acknowledge the policies below.
            This confirmation is required before eligibility can be auto-matched to programs.
          </p>

          <div className="space-y-5">
            <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/50">
              <FileText className="w-5 h-5 text-cyan-300 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-white">Observership scope (no hands-on care)</h2>
                <p className="text-sm text-slate-300">Observerships are strictly observational. No clinical procedures or direct patient care are permitted.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/50">
              <Lock className="w-5 h-5 text-cyan-300 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-white">Confidentiality / NDA</h2>
                <p className="text-sm text-slate-300">Applicants agree to maintain confidentiality of all institutional and patient information.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/50">
              <ShieldCheck className="w-5 h-5 text-cyan-300 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-white">Hospital policies acknowledgement</h2>
                <p className="text-sm text-slate-300">Participants agree to follow hospital policies, safety protocols, and site-specific requirements.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/50">
              <Lock className="w-5 h-5 text-cyan-300 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-white">Patient data handling acknowledgement</h2>
                <p className="text-sm text-slate-300">No patient data should be recorded, stored, or shared outside approved institutional systems.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/50">
              <HeartHandshake className="w-5 h-5 text-cyan-300 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-white">Code of conduct</h2>
                <p className="text-sm text-slate-300">Applicants must uphold professional behavior, respect patient privacy, and follow staff guidance.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5 text-sm text-cyan-100">
            These acknowledgements are kept short and current to reduce friction while meeting institutional requirements.
          </div>
        </div>
      </div>
    </div>
  );
}
