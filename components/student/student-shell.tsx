"use client";

/**
 * Student portal navigation and orientation.
 *
 * The portal previously opened with five equally-weighted glowing buttons and
 * a wall of XP/gamification before any real work, so there was no answer to
 * "what do I do now". These pieces establish one primary action, a quiet
 * secondary toolbar, and jump-links into the long page.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  FileText,
  LineChart,
  LogOut,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ next step */

export type NextStep = {
  title: string;
  body: string;
  href: string;
  cta: string;
  icon: LucideIcon;
};

/**
 * One unambiguous next action, derived from where the student actually is.
 * Order matters: the earliest unmet requirement wins.
 */
export function resolveNextStep({
  verified,
  applicationCount,
  hasActionableApplication,
}: {
  verified: boolean;
  applicationCount: number;
  hasActionableApplication: boolean;
}): NextStep {
  if (!verified) {
    return {
      title: "Verify your documents",
      body: "Upload your passport, enrolment proof and medical certificates once. Every application reuses them.",
      href: "#verification",
      cta: "Go to verification",
      icon: ShieldCheck,
    };
  }
  if (applicationCount === 0) {
    return {
      title: "Find a programme to apply to",
      body: "Browse observerships and electives, and check the institution's criteria before you apply.",
      href: "/programs",
      cta: "Browse programmes",
      icon: Search,
    };
  }
  if (hasActionableApplication) {
    return {
      title: "An application needs your attention",
      body: "One of your applications is waiting on information from you. Open it to see what's outstanding.",
      href: "#applications",
      cta: "Review applications",
      icon: FileText,
    };
  }
  return {
    title: "You're all caught up",
    body: "Your applications are with the institutions. We'll update the status here as they progress — no need to email anyone.",
    href: "#applications",
    cta: "View applications",
    icon: LineChart,
  };
}

export function NextStepCard({ step }: { step: NextStep }) {
  const Icon = step.icon;
  return (
    <section
      aria-labelledby="next-step-heading"
      className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-blue-500/[0.07] backdrop-blur-xl p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30">
          <Icon className="h-6 w-6" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-300">
            Your next step
          </p>
          <h2
            id="next-step-heading"
            className="mt-1 text-lg sm:text-xl font-bold text-white"
          >
            {step.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">{step.body}</p>
        </div>

        <Link
          href={step.href}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          {step.cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- toolbar */

const TOOLS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/programs", label: "Programmes", icon: Search },
  { href: "/student/progress", label: "Progress", icon: LineChart },
  { href: "/student/form-submission", label: "Forms", icon: FileText },
  { href: "/student/career-path", label: "Career path", icon: Briefcase },
];

/** Quiet secondary navigation — one visual weight, no competing glow. */
export function StudentToolbar({
  onLogout,
  children,
}: {
  onLogout: () => void;
  children?: React.ReactNode;
}) {
  return (
    <nav
      aria-label="Student tools"
      className="flex items-center gap-1.5 overflow-x-auto sm:flex-wrap sm:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {TOOLS.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-medium text-slate-200 backdrop-blur-xl transition-colors hover:border-blue-500/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <t.icon className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="hidden sm:inline">{t.label}</span>
        </Link>
      ))}

      {children}

      <button
        onClick={onLogout}
        aria-label="Sign out"
        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-medium text-slate-400 backdrop-blur-xl transition-colors hover:border-red-500/30 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </nav>
  );
}

/* ---------------------------------------------------------- section nav */

const SECTIONS = [
  { id: "next", label: "Overview" },
  { id: "applications", label: "Applications" },
  { id: "verification", label: "Documents" },
  { id: "guidelines", label: "Requirements" },
];

/** Sticky jump-nav so the long page stops feeling like an endless scroll. */
export function StudentSectionNav() {
  const [active, setActive] = useState("next");

  useEffect(() => {
    const onScroll = () => {
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 160) current = s.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-14 sm:top-16 z-30 -mx-4 mb-6 border-b border-white/10 bg-slate-950/85 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
      <nav
        aria-label="Sections"
        className="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={active === s.id ? "true" : undefined}
            className={cn(
              "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
              active === s.id
                ? "bg-blue-500/15 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            )}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
