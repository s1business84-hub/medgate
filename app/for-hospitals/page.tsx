"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Users, FileCheck, BarChart3, Shield, CheckCircle2, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollableViewport, ScrollSection } from "@/components/scrollable-viewport";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { StaggerGroup, StaggerItem } from "@/components/animation/StaggerGroup";

async function sendOnboardingEmail(email: string) {
  const res = await fetch("/api/send-onboarding-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, type: "onboarding-pack" }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
    console.error("Email API error:", errorData);
    throw new Error(errorData.error || "Failed to send onboarding email");
  }
  
  return res.json();
}

export default function ForHospitalsPage() {
  const [onboardingEmail, setOnboardingEmail] = useState("");
  const [onboardingStatus, setOnboardingStatus] = useState<"idle" | "sent" | "error">("idle");
  const [onboardingError, setOnboardingError] = useState("");
  const [showFounderContact, setShowFounderContact] = useState(false);

  const handleSendOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardingEmail.trim()) {
      setOnboardingError("Please enter your email");
      return;
    }
    setOnboardingError("");
    setOnboardingStatus("idle");
    
    try {
      await sendOnboardingEmail(onboardingEmail.trim());
      setOnboardingStatus("sent");
    } catch (error) {
      console.error("Onboarding email error:", error);
      setOnboardingStatus("error");
      setOnboardingError("Unable to send onboarding steps. Please try again.");
    }
  };

  return (
    <ScrollableViewport
      showProgress={true}
      showNavigationDots={true}
      showArrows={true}
      snapToSections={false}
    >
      <ScrollSection id="for-hospitals">
        <div className="relative min-h-screen overflow-hidden text-slate-100">
          <LiquidParallax />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.15),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.12),transparent_35%),radial-gradient(circle_at_40%_80%,rgba(139,92,246,0.13),transparent_38%),linear-gradient(180deg,#0a0e1a_0%,#0f172a_50%,#0a0e1a_100%)]" />
          
          <div className="relative max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <Link href="/" className="flex items-center text-cyan-300 hover:text-cyan-200 transition-all duration-300 hover:translate-x-1">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-linear-to-br from-cyan-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-100 mb-6">
            Built to Support Hospital-Managed <span className="block"><AnimatedGradientText>Observership and Elective Programs</AnimatedGradientText></span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Electivio is being developed to support healthcare institutions in managing formal observership and elective programs through structured intake, clear eligibility standards, and transparent application workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/hospital/create-account">
              <Button size="lg" className="bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold shadow-lg">
                Join Us Now
              </Button>
            </Link>
            <button
              onClick={() => setShowFounderContact(!showFounderContact)}
              className="px-8 py-3 rounded-lg font-semibold text-white bg-white/10 border border-white/25 hover:bg-white/15 transition-all duration-300"
            >
              Schedule a Pilot Intro Call
            </button>
          </div>
          
          {/* Founder Contact Dropdown Card - Shows when Schedule button clicked */}
          <AnimatePresence>
            {showFounderContact && (
              <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 max-w-2xl mx-auto overflow-hidden"
              >
                <div className="bg-linear-to-br from-cyan-600/20 to-indigo-600/20 border border-cyan-500/30 rounded-xl backdrop-blur-xl p-8">
                  <h3 className="text-2xl font-bold text-slate-100 mb-6">Contact our founders</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-4 pb-4 border-b border-white/10">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <Phone className="w-6 h-6 text-cyan-300" />
                      </div>
                      <div>
                        <p className="text-slate-100 font-semibold mb-1">Founder Kashish</p>
                        <p className="text-cyan-300 font-mono text-lg">+971 054 453 0209</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <Phone className="w-6 h-6 text-indigo-300" />
                      </div>
                      <div>
                        <p className="text-slate-100 font-semibold mb-1">Co-founder Sanskaar Nair</p>
                        <p className="text-indigo-300 font-mono text-lg">+971 056 906 9315</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Ready to bring Electivio to your institution? Get in touch to discuss pilot collaboration opportunities.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Benefits Section */}
        <section className="mb-20">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
                <AnimatedGradientText>Why Choose Electivio?</AnimatedGradientText>
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Designed to support observership and elective program management for healthcare institutions
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            <StaggerGroup staggerDelay={0.12} initialDelay={0.2}>
              {[
                {
                  icon: Shield,
                  title: 'Designed for Institutional Control',
                  description: 'Hospitals define eligibility criteria, documentation requirements, intake capacity, and review workflows. Electivio supports, not overrides, institutional processes.',
                  gradient: 'from-blue-600 to-cyan-600',
                  bgGradient: 'from-blue-50 to-cyan-50',
                  index: 0
                },
                {
                  icon: FileCheck,
                  title: 'Standardized Intake',
                  description: 'Built to centralize program information and applications, reducing unstructured emails, calls, and ad-hoc requests.',
                  gradient: 'from-indigo-600 to-purple-600',
                  bgGradient: 'from-indigo-50 to-purple-50',
                  index: 1
                },
                {
                  icon: CheckCircle2,
                  title: 'Clear Applicant Alignment',
                  description: 'Students apply based on published criteria, helping institutions receive applications aligned with their requirements.',
                  gradient: 'from-purple-600 to-pink-600',
                  bgGradient: 'from-purple-50 to-pink-50',
                  index: 2
                },
                {
                  icon: Shield,
                  title: 'Privacy-First Architecture',
                  description: 'Designed with role-based access and data protection principles to support responsible handling of applicant information.',
                  gradient: 'from-green-600 to-emerald-600',
                  bgGradient: 'from-green-50 to-emerald-50',
                  index: 3
                }
              ].map((benefit) => (
                <StaggerItem key={benefit.title}>
                  <ScrollReveal direction={benefit.index % 2 === 0 ? "left" : "right"} delay={0}>
                    <motion.div 
                      className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300"
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    >
                      {/* Animated gradient overlay */}
                      <div className={`absolute inset-0 bg-linear-to-br from-cyan-600/10 via-transparent to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      {/* Liquid glass shine effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-linear-to-br from-white to-transparent rounded-full blur-xl" />
                      </div>
                      
                      <div className="relative z-10 p-8">
                        <div className={`w-16 h-16 bg-linear-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                          <benefit.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-3">
                          {benefit.title}
                        </h3>
                        <p className="text-slate-300 group-hover:text-slate-200 transition-colors leading-relaxed">
                          {benefit.description}
                        </p>
                        <div className={`mt-6 h-1 bg-linear-to-r ${benefit.gradient} rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                      </div>
                    </motion.div>
                  </ScrollReveal>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* Features Section */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative bg-linear-to-br from-cyan-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden group border border-white/10">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-48 -mt-48 group-hover:scale-125 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl -ml-40 -mb-40 group-hover:scale-110 transition-transform duration-500" />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-8 text-center">Platform Capabilities (Planned)</h2>
              
              <div className="relative">
                <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory">
                  {[
                  { icon: CheckCircle2, title: 'Eligibility Criteria & Program Requirements', desc: 'Define and publish program-specific eligibility and documentation standards' },
                  { icon: FileCheck, title: 'Institution-Defined Intake Parameters', desc: 'Set custom requirements aligned with your institutional policies' },
                  { icon: Users, title: 'Application Submission Interface (Planned)', desc: 'Central platform for receiving and organizing applications' },
                  { icon: BarChart3, title: 'Status Visibility Tools (In Development)', desc: 'Dashboard to track application progress and program workflows' },
                  { icon: Shield, title: 'Role-Based Access for Administrators', desc: 'Secure access controls for program coordinators and reviewers' },
                  { icon: Shield, title: 'Secure Data Handling', desc: 'Privacy-focused architecture with encrypted data management' }
                  ].map((feature, idx) => (
                    <motion.div 
                      key={feature.title}
                      className="min-w-[280px] sm:min-w-[340px] md:min-w-[360px] snap-start backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4 shrink-0">
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                          <p className="text-slate-100">{feature.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* How It Works */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-4xl font-bold text-slate-100 mb-12 text-center">
            <AnimatedGradientText>How Electivio Is Designed to Support Hospitals</AnimatedGradientText>
          </h2>
          
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: 'Define Program Criteria',
                description: 'Hospitals set eligibility and documentation requirements specific to their observership and elective programs.',
                icon: Building2
              },
              {
                step: 2,
                title: 'Prepare Structured Publication',
                description: 'Institutions plan and publish program details when ready, with clear requirements and expectations.',
                icon: FileCheck
              },
              {
                step: 3,
                title: 'Receive & Review Applications (Planned)',
                description: 'The platform will support aligned application submission and review dashboards for program coordinators.',
                icon: Users
              },
              {
                step: 4,
                title: 'Manage Program Workflows (Under Development)',
                description: 'Tools are being built to help manage program intake, status visibility, and applicant tracking.',
                icon: BarChart3
              }
            ].map((step) => (
              <div 
                key={step.step}
                className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-cyan-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Animated left accent */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-linear-to-b from-cyan-500 to-indigo-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                
                <div className="relative z-10 p-8">
                  <div className="flex items-start">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mr-6 shrink-0 bg-linear-to-br from-cyan-500 to-indigo-600 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-2xl">{step.step}</span>
                    </div>
                    <div className="grow">
                      <h3 className="text-2xl font-bold text-slate-100 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-slate-300 group-hover:text-slate-200 transition-colors leading-relaxed text-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8 md:p-12 overflow-hidden group">
            {/* Animated gradient glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-linear-to-br from-cyan-400 to-indigo-400 rounded-full opacity-0 blur-3xl group-hover:opacity-20 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-slate-100 mb-6">Pilot Partner Intake</h2>
              <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Healthcare institutions interested in participating in early pilot collaborations can request onboarding information.
              </p>
              <form onSubmit={handleSendOnboarding} className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                <input
                  type="email"
                  value={onboardingEmail}
                  onChange={(e) => setOnboardingEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="w-full sm:max-w-xs px-4 py-3 border border-white/15 bg-white/5 text-slate-100 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold shadow-lg"
                >
                  Request Onboarding Pack
                </Button>
              </form>
              {onboardingError && (
                <p className="text-sm text-rose-200 mt-3">{onboardingError}</p>
              )}
              {onboardingStatus === "sent" && (
                <p className="text-sm text-cyan-200 mt-3">
                  Onboarding steps sent from helloelectivio@gmail.com. Please check your inbox.
                </p>
              )}
              {onboardingStatus === "error" && (
                <p className="text-sm text-rose-200 mt-3">
                  Unable to send onboarding steps right now. Please retry.
                </p>
              )}
              <div className="mt-6 text-sm text-slate-300">
                We send onboarding steps from <span className="text-cyan-200">helloelectivio@gmail.com</span>.
              </div>
            </div>
          </div>
        </section>
      </div>
      </div>
      </ScrollSection>
    </ScrollableViewport>
  );
}
