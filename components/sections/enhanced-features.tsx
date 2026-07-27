"use client";

import { Marquee } from "@/components/ui/marquee";
import { RevealText } from "@/components/ui/reveal-text";
import { MagneticHover } from "@/components/ui/magnetic-hover";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const partners = [
  "UAE HOSPITALS",
  "MEDICAL INSTITUTIONS",
  "TRAINING PROGRAMS",
  "HEALTHCARE PROVIDERS",
  "CLINICAL SITES",
  "ACADEMIC PARTNERS",
];

export function EnhancedFeatures() {
  return (
    <section className="relative bg-slate-950 py-24 sm:py-32 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-900/50 -z-10" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <RevealText className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white" stagger={0.02}>
            Built for Excellence
          </RevealText>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-slate-400"
          >
            A comprehensive platform designed around institutional needs and student success
          </motion.p>
        </div>

        {/* Partners marquee */}
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-sm font-medium text-slate-500 mb-8"
          >
            BUILT FOR
          </motion.p>
          <Marquee items={partners} speed={40} className="py-4" />
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-linear-to-br from-slate-900 to-slate-800 border border-slate-800 p-12 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)] -z-10" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Explore available programs or learn more about how Electivio can streamline your clinical training journey
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticHover>
              <Link href="/programs">
                <button className="group inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-semibold hover:bg-slate-100 transition-all duration-300">
                  <span>View Programs</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </MagneticHover>
            <MagneticHover>
              <Link href="/for-hospitals">
                <button className="inline-flex items-center gap-2 bg-slate-800 text-white px-8 py-4 rounded-full font-semibold border border-slate-700 hover:bg-slate-700 transition-all duration-300">
                  For Hospitals
                </button>
              </Link>
            </MagneticHover>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
