"use client";

/**
 * Electivio marketing landing sections — light "clean healthcare SaaS" system.
 *
 * Deliberately restrained: white/slate-50 surfaces, deep navy type, medical
 * teal as the single brand colour, amber used once as a warm accent. Motion is
 * a short fade-up on entry and nothing else — no parallax, shaders, orbital
 * timelines or glass stacking. Every section is written mobile-first.
 */

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  ClipboardList,
  LineChart,
  ArrowRight,
  Check,
  ChevronDown,
  Building2,
  GraduationCap,
  MapPin,
  CalendarDays,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- helpers */

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  blurb,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  blurb?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-300">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
        {title}
      </h2>
      {blurb && (
        <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-300">{blurb}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------- hero */

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* one soft teal wash, no orbs or shaders */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(20,184,166,0.16),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 pt-12 pb-14 sm:pt-20 sm:pb-20 lg:pt-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <FadeUp>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-200">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              Pilot programmes opening with UAE institutions
            </span>

            <h1 className="mt-5 text-[2.15rem] leading-[1.1] sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05] font-bold tracking-tight text-white">
              Clinical training,{" "}
              <span className="text-teal-300">structured end to end</span>
            </h1>

            <p className="mt-4 sm:mt-5 text-base sm:text-lg leading-relaxed text-slate-300 max-w-xl">
              Electivio gives hospitals a clear intake process for observerships and
              electives — and gives students one place to check eligibility, apply,
              and track every step afterwards.
            </p>

            {/* exactly two CTAs */}
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/student"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 text-sm sm:text-base font-semibold text-white shadow-sm transition-colors hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                I&apos;m a student
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/for-hospitals"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-slate-950 px-6 text-sm sm:text-base font-semibold text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <Building2 className="h-4 w-4" />
                I&apos;m a hospital
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <PlatformPreview />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------- interactive platform preview */

const TRACKER = [
  { label: "Applied", done: true },
  { label: "Under review", done: true },
  { label: "Interview", done: false, current: true },
  { label: "Accepted", done: false },
  { label: "Completed", done: false },
];

function PlatformPreview() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-slate-950 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)] overflow-hidden">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-slate-900/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-2 text-[11px] font-medium text-slate-400">
          Application status
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              Cardiology Observership
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-400">
              Dubai Health Authority · 4 weeks
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300 ring-1 ring-amber-500/30">
            Interview
          </span>
        </div>

        {/* vertical on mobile, horizontal from sm */}
        <ol className="mt-5 space-y-3 sm:space-y-0 sm:flex sm:items-start sm:gap-1">
          {TRACKER.map((s, i) => (
            <li key={s.label} className="flex sm:flex-col sm:flex-1 items-start sm:items-center gap-3 sm:gap-2">
              <div className="flex sm:w-full items-center gap-0 sm:gap-1">
                <span
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold ring-1",
                    s.done
                      ? "bg-teal-600 text-white ring-teal-500"
                      : s.current
                        ? "bg-slate-950 text-teal-300 ring-2 ring-teal-400"
                        : "bg-slate-950 text-slate-500 ring-slate-200"
                  )}
                >
                  {s.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "hidden sm:block h-0.5 flex-1 rounded",
                    i === TRACKER.length - 1
                      ? "opacity-0"
                      : s.done
                        ? "bg-teal-500"
                        : "bg-slate-200"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[11px] leading-tight sm:text-center",
                  s.done || s.current ? "text-white font-medium" : "text-slate-500"
                )}
              >
                {s.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ trust strip */

const INSTITUTIONS = [
  "UAE Hospitals",
  "Medical Institutions",
  "Training Programmes",
  "Clinical Sites",
  "Academic Partners",
];

export function TrustStrip() {
  return (
    <section className="border-y border-white/10 bg-slate-900/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          Built for
        </p>
        <ul className="mt-5 grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-x-4 gap-y-3 sm:gap-x-8">
          {INSTITUTIONS.map((name) => (
            <li
              key={name}
              className="flex items-center gap-2 text-sm font-medium text-slate-300"
            >
              <span className="h-1 w-1 shrink-0 rounded-full bg-teal-500" />
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- benefits */

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Verified programmes",
    body: "Every listing is defined and published by the institution itself, with its own eligibility rules and document requirements.",
  },
  {
    icon: ClipboardList,
    title: "Structured applications",
    body: "One consistent submission format across hospitals, so students stop guessing and coordinators stop chasing missing paperwork.",
  },
  {
    icon: LineChart,
    title: "Trackable training records",
    body: "Status is visible to both sides from submission through completion — no email threads, no silent waiting.",
  },
];

export function Benefits() {
  return (
    <section className="bg-slate-950">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-14 sm:py-20">
        <SectionHeading
          eyebrow="Why Electivio"
          title="Three things the platform is built to get right"
          blurb="Not a placement service. An intake and tracking layer that hospitals control and students can follow."
        />

        <div className="mt-9 sm:mt-12 grid gap-4 sm:gap-6 md:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <FadeUp key={b.title} delay={i * 0.06}>
              {/* the one place a spotlight treatment is used */}
              <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-6 transition-shadow hover:border-teal-500/40">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-16 left-1/2 h-32 w-56 -translate-x-1/2 rounded-full bg-teal-400/0 blur-2xl transition-colors duration-500 group-hover:bg-teal-400/25"
                />
                <div className="relative">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-500/10 text-teal-300 ring-1 ring-teal-500/25">
                    <b.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{b.body}</p>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- how it works */

const STUDENT_STEPS = [
  { title: "Check eligibility", body: "Match your year, licence and documents against a programme's published criteria before you apply." },
  { title: "Submit once", body: "Upload your documents and application in the format the institution defined." },
  { title: "Track every stage", body: "Follow review, interview and decision without chasing anyone by email." },
  { title: "Complete and record", body: "Finish the placement with a record of what you did and when." },
];

const HOSPITAL_STEPS = [
  { title: "Define the programme", body: "Set eligibility, documents and intake windows to your own policy." },
  { title: "Publish when ready", body: "Make the programme visible only once your requirements are final." },
  { title: "Review applications", body: "See complete, comparable submissions in one queue instead of an inbox." },
  { title: "Manage the placement", body: "Track applicants through to completion with role-based access." },
];

export function HowItWorks() {
  const [tab, setTab] = useState<"student" | "hospital">("student");
  const steps = tab === "student" ? STUDENT_STEPS : HOSPITAL_STEPS;

  return (
    <section id="how-it-works" className="scroll-mt-20 bg-slate-900/60 border-y border-white/10">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-14 sm:py-20">
        <SectionHeading eyebrow="How it works" title="The same process, from both sides" />

        {/* tabs — full-width targets on mobile */}
        <div
          role="tablist"
          aria-label="Choose a perspective"
          className="mx-auto mt-7 grid w-full max-w-xs grid-cols-2 gap-1 rounded-xl border border-white/10 bg-slate-950 p-1"
        >
          {(["student", "hospital"] as const).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={cn(
                "h-10 rounded-lg text-sm font-semibold capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400",
                tab === k ? "bg-teal-600 text-white" : "text-slate-300 hover:bg-white/5"
              )}
            >
              {k}
            </button>
          ))}
        </div>

        <ol className="mt-9 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <FadeUp key={s.title} delay={i * 0.05}>
              <li className="relative h-full rounded-2xl border border-white/10 bg-slate-950 p-5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-600 text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3.5 text-base font-semibold text-white">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{s.body}</p>
              </li>
            </FadeUp>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ featured programmes */

const PROGRAMMES = [
  { specialty: "Cardiology", hospital: "Dubai Health Authority", city: "Dubai", weeks: "4 weeks", intake: "Opens Sept 2026", status: "Pilot" },
  { specialty: "Internal Medicine", hospital: "Sheikh Shakhbout Medical City", city: "Abu Dhabi", weeks: "6 weeks", intake: "Opens Oct 2026", status: "Pilot" },
  { specialty: "Paediatrics", hospital: "Al Qassimi Hospital", city: "Sharjah", weeks: "4 weeks", intake: "Preparing", status: "Planned" },
];

export function FeaturedProgrammes() {
  return (
    <section className="bg-slate-950">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <SectionHeading
            align="left"
            eyebrow="Programmes"
            title="Example listings"
            blurb="Illustrative of the listing format while pilot programmes are being finalised with partner institutions."
          />
          <Link
            href="/programs"
            className="shrink-0 -mx-2 inline-flex min-h-[44px] items-center gap-1.5 rounded px-2 text-sm font-semibold text-teal-300 hover:text-teal-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Browse all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMMES.map((p, i) => (
            <FadeUp key={p.specialty} delay={i * 0.06}>
              <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-slate-950 p-5 transition-shadow hover:border-teal-500/40">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-white">{p.specialty}</h3>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1",
                      p.status === "Pilot"
                        ? "bg-teal-500/10 text-teal-200 ring-teal-500/30"
                        : "bg-slate-900/60 text-slate-300 ring-slate-200"
                    )}
                  >
                    {p.status}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-300">{p.hospital}</p>

                <dl className="mt-4 space-y-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
                    <dd>{p.city}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-slate-500" />
                    <dd>{p.weeks}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0 text-slate-500" />
                    <dd>{p.intake}</dd>
                  </div>
                </dl>

                <Link
                  href="/programs"
                  className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg border border-white/15 text-sm font-semibold text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  View details
                </Link>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------- about (merged in) */

export function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-slate-900/60 border-y border-white/10">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          <FadeUp>
            <SectionHeading
              align="left"
              eyebrow="About"
              title="Built with institutions, not around them"
              blurb="Electivio connects medical students with clinical training across the UAE. Hospitals keep control of eligibility, intake and decisions — the platform makes that process legible to everyone involved."
            />
            <p className="mt-4 text-sm leading-relaxed text-slate-300 max-w-xl">
              We are in early development and preparing pilot collaborations with
              healthcare institutions. Electivio is not a placement or recruitment
              service and does not guarantee acceptance.
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { name: "Kashish", role: "Founder & Program Director", body: "Leads platform direction and institutional collaboration, translating programme requirements into structured workflows." },
                { name: "Sanskaar", role: "Co-Founder & Lead Engineer", body: "Architects the platform — system design, infrastructure and the application workflows behind institutional onboarding." },
              ].map((f) => (
                <article key={f.name} className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-teal-500/10 text-sm font-bold text-teal-300 ring-1 ring-teal-500/25">
                    {f.name.charAt(0)}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-white">{f.name}</h3>
                  <p className="text-xs font-medium text-teal-300">{f.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{f.body}</p>
                </article>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- split CTA */

export function SplitCta() {
  const cards = [
    {
      icon: GraduationCap,
      audience: "For students",
      title: "Register for early access",
      body: "Get notified when pilot listings open, with eligibility guidance ahead of time.",
      href: "/student",
      cta: "Join early access",
      dark: false,
    },
    {
      icon: Building2,
      audience: "For hospitals",
      title: "Talk to us about a pilot",
      body: "See how programme intake, eligibility and review workflows would map to your institution.",
      href: "/for-hospitals",
      cta: "Schedule an intro call",
      dark: true,
    },
  ];

  return (
    <section className="bg-slate-950">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {cards.map((c, i) => (
            <FadeUp key={c.audience} delay={i * 0.06}>
              <article
                className={cn(
                  "flex h-full flex-col rounded-2xl p-6 sm:p-8",
                  c.dark
                    ? "border border-teal-500/30 bg-teal-500/10 text-white"
                    : "border border-white/10 bg-slate-900/60 text-white"
                )}
              >
                <span
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-xl",
                    c.dark ? "bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/30" : "bg-white/5 text-teal-300 ring-1 ring-white/10"
                  )}
                >
                  <c.icon className="h-5 w-5" />
                </span>
                <p
                  className={cn(
                    "mt-4 text-xs font-semibold uppercase tracking-[0.14em]",
                    "text-teal-300"
                  )}
                >
                  {c.audience}
                </p>
                <h3 className="mt-1.5 text-xl sm:text-2xl font-bold tracking-tight">{c.title}</h3>
                <p className={cn("mt-2 text-sm leading-relaxed", "text-slate-300")}>
                  {c.body}
                </p>
                <Link
                  href={c.href}
                  className={cn(
                    "mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                    c.dark
                      ? "bg-teal-600 text-white hover:bg-teal-500 focus-visible:ring-teal-400"
                      : "bg-teal-600 text-white hover:bg-teal-500 focus-visible:ring-teal-400"
                  )}
                >
                  {c.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- FAQ (merged in) */

const FAQS = [
  {
    q: "Is Electivio a placement or recruitment service?",
    a: "No. Electivio does not place students or guarantee acceptance. The platform supports observership and elective programme discovery and application workflows as defined by participating institutions.",
  },
  {
    q: "What programmes does Electivio support?",
    a: "Electivio focuses on formal, institution-approved observership and elective programmes.",
  },
  {
    q: "Does Electivio offer internships or residency placements?",
    a: "No. Electivio does not provide internships, residency, or fellowship placements.",
  },
  {
    q: "Is Electivio live yet?",
    a: "Electivio is currently in early development and preparing for pilot collaborations with healthcare institutions.",
  },
  {
    q: "Who can use Electivio?",
    a: "Medical students and institutions participating in approved pilot programmes.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 bg-slate-900/60 border-t border-white/10">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 py-14 sm:py-20">
        <SectionHeading eyebrow="FAQ" title="Common questions" />

        <div className="mt-8 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <h3>
                  <button
                    id={`faq-t-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-p-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400"
                  >
                    <span className="text-[15px] font-semibold text-white">{f.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-p-${i}`}
                  role="region"
                  aria-labelledby={`faq-t-${i}`}
                  hidden={!isOpen}
                  className="px-5 pb-4 -mt-1"
                >
                  <p className="text-sm leading-relaxed text-slate-300">{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
