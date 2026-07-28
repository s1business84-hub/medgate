"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { hospitals, programs } from "@/lib/mockData";
import { EligibilityChecker } from "@/components/eligibility-checker";
import { getProgramMetadata } from '@/lib/storage';
import { ProgramFilters } from "@/components/program-filters";
import { ReminderModal } from "@/components/reminder-modal";
import { HospitalsMap, hospitalCoords } from "@/components/hospitals-map";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Bell, MapPin } from "lucide-react";
import { ApplicationModal } from "@/components/application-modal";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { ScrollableViewport, ScrollSection } from "@/components/scrollable-viewport";
import { motionTokens } from "@/lib/motion";
import { ProgramsSkeleton } from "@/components/ui/skeleton";
import { fetchEligibilitySummary, type EligibilitySummary } from "@/lib/eligibility/storage";
import { useAuth } from "@/lib/auth-context";
import { VoiceProgramAssistant } from "@/components/voice-program-assistant";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { AnimatedProgramCard } from "@/components/AnimatedProgramCard";

export default function ProgramsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<{ name: string; hospital: string; programId?: string; hospitalId?: string } | null>(null);
  const [reminderModal, setReminderModal] = useState<{ open: boolean; programId: string; programName: string }>({
    open: false,
    programId: "",
    programName: "",
  });
  const [openMapProgram, setOpenMapProgram] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eligibilitySummary, setEligibilitySummary] = useState<EligibilitySummary | null>(null);
  const [voiceFilterIds, setVoiceFilterIds] = useState<string[]>([]);
  const [voiceFilterActive, setVoiceFilterActive] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState("");
  const reduce = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user || user.role !== "student") {
      return;
    }
    fetchEligibilitySummary(user.id).then(setEligibilitySummary);
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== "student") return;
    const handleUpdate = () => fetchEligibilitySummary(user.id).then(setEligibilitySummary);
    window.addEventListener("eligibility-updated", handleUpdate);
    return () => {
      window.removeEventListener("eligibility-updated", handleUpdate);
    };
  }, [user]);

  if (isLoading) {
    return (
      <ScrollableViewport
        showProgress={true}
        showNavigationDots={true}
        showArrows={true}
        snapToSections={false}
      >
        <ScrollSection id="programs">
          <main className="relative min-h-screen overflow-hidden text-slate-100">
            <LiquidParallax />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(96,165,250,0.15),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.12),transparent_35%),radial-gradient(circle_at_40%_80%,rgba(139,92,246,0.13),transparent_38%),linear-gradient(180deg,#0a0e1a_0%,#0f172a_50%,#0a0e1a_100%)]" />
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
              <div className="mb-8 h-8 w-64 bg-white/10 rounded-xl skeleton" />
              <div className="mb-12 h-6 w-full max-w-xl bg-white/10 rounded-xl skeleton" />
              <div className="mb-8">
                <div className="h-32 w-full bg-white/10 rounded-2xl skeleton" />
              </div>
              <div className="mb-12">
                <div className="h-32 w-full bg-white/10 rounded-2xl skeleton" />
              </div>
              <div className="mb-12">
                <div className="h-64 w-full bg-white/10 rounded-2xl skeleton" />
              </div>
              <ProgramsSkeleton />
            </div>
          </main>
        </ScrollSection>
      </ScrollableViewport>
    );
  }

  const toggleProgramExpansion = (programId: string) => {
    setExpandedProgram(expandedProgram === programId ? null : programId);
  };

  const handleApplyClick = (program: typeof programs[0], hospital: typeof hospitals[0]) => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent("/programs")}`);
      return;
    }

    setSelectedProgram({
      name: program.departmentName,
      hospital: hospital?.name || '',
      programId: program.id,
      hospitalId: hospital?.id,
    });
    setIsModalOpen(true);
  };

  const handleReminderClick = (program: typeof programs[0]) => {
    setReminderModal({
      open: true,
      programId: program.id,
      programName: program.departmentName,
    });
  };

  const visiblePrograms = voiceFilterActive
    ? programs.filter((program) => voiceFilterIds.includes(program.id))
    : programs;

  const renderEligibilityBadge = () => {
    if (!user || user.role !== "student") {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap border border-slate-400/40 text-slate-200 bg-slate-400/10">
          Log in to check eligibility
        </span>
      );
    }

    if (!eligibilitySummary) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap border border-slate-400/40 text-slate-200 bg-slate-400/10">
          Eligibility not checked
        </span>
      );
    }

    if (eligibilitySummary.eligibilityStatus === "ELIGIBLE") {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap border border-emerald-400/30 text-emerald-200 bg-emerald-500/15">
          Minimum criteria met
        </span>
      );
    }

    if (eligibilitySummary.eligibilityStatus === "REVIEW") {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap border border-amber-400/30 text-amber-200 bg-amber-500/15">
          Eligibility in review
        </span>
      );
    }

    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap border border-red-400/30 text-red-200 bg-red-500/15">
        Missing requirements
      </span>
    );
  };

  return (
    <ScrollableViewport
      showProgress={true}
      showNavigationDots={true}
      showArrows={true}
      snapToSections={false}
    >
      <ScrollSection id="programs">
      <main className="relative min-h-screen overflow-hidden text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(96,165,250,0.15),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.12),transparent_35%),radial-gradient(circle_at_40%_80%,rgba(139,92,246,0.13),transparent_38%),linear-gradient(180deg,#0a0e1a_0%,#0f172a_50%,#0a0e1a_100%)]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header */}
        <Reveal>
        <div className="text-center mb-8 sm:mb-12 space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text bg-linear-to-r from-blue-300 via-blue-200 to-indigo-200 text-transparent mb-3 sm:mb-4">Prototype Program Listings</h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto px-4">
            Prototype listings for demonstration only
          </p>
          {/* Demo Data Banner */}
          <div className="mt-6 mx-auto max-w-3xl px-4">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-xl p-4">
              <p className="text-sm text-amber-200 mb-3">
                <strong>Prototype Listings:</strong> The programs shown below are example listings for demonstration purposes only. Final observership and elective programs will be published by participating institutions during pilot onboarding.
              </p>
              <p className="text-sm text-amber-200">
                <strong>Program Scope:</strong> Electivio supports formal, institution-approved observership and elective programs only. Internships, residency, and fellowship placements are not offered or facilitated through the platform.
              </p>
            </div>
          </div>
        </div>
        </Reveal>


        {/* Program Filters */}
        <Reveal delay={0.1}>
        <div className="mb-8">
          <ProgramFilters />
        </div>
        </Reveal>

        {/* Eligibility Checker */}
        <Reveal delay={0.2}>
        <div className="mb-12 space-y-6">
          <EligibilityChecker />
          <VoiceProgramAssistant
            programs={programs}
            hospitals={hospitals}
            eligibilitySummary={eligibilitySummary}
            onFilter={(ids, active, query) => {
              setVoiceFilterIds(ids);
              setVoiceFilterActive(active);
              setVoiceQuery(query);
            }}
          />
          {voiceFilterActive && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <span className="text-xs text-slate-300">Voice filter active</span>
              {voiceQuery && <span className="text-xs text-slate-400">"{voiceQuery}"</span>}
              <button
                onClick={() => {
                  setVoiceFilterActive(false);
                  setVoiceFilterIds([]);
                  setVoiceQuery("");
                }}
                className="text-xs text-blue-200 hover:text-blue-100"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
        </Reveal>

        {/* Hospitals Map */}
        <Reveal delay={0.3}>
        <div className="mb-12">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-100">Hospital Locations</h2>
            <p className="text-slate-300 mt-2">Map locations are illustrative and do not represent confirmed participating institutions.</p>
          </div>
          <HospitalsMap />
        </div>
        </Reveal>

        {/* Programs Grid */}
        <div className="space-y-4">
          <AnimatePresence>
            {visiblePrograms.map((p, index) => {
              const h = hospitals.find((x) => x.id === p.hospitalId);
              const isExpanded = expandedProgram === p.id;
              return (
                <ScrollReveal key={p.id} direction="up" delay={index * 0.05} scale={0.98}>
                  <AnimatedProgramCard>
                    <LayoutGroup>
                      <motion.div
                        layout
                        className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden p-5 sm:p-7 lg:p-8 wrap-break-word"
                      >
                    <div className="absolute inset-0 bg-linear-to-r from-blue-400/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-linear-to-br from-white/70 to-transparent rounded-full blur-3xl" />
                    </div>

                    {/* Program Header */}
                    <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4 z-10">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-xl font-semibold text-slate-100 truncate group-hover:text-blue-200 transition-colors">{p.departmentName}</h2>
                      <p className="text-sm text-slate-300">{p.programType} • {h?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto justify-start lg:justify-end">
                    {(() => {
                      try {
                        const meta = getProgramMetadata(p.id);
                        if (meta && (meta.bestFor || meta.exposureLevel || meta.limitations || meta.notRecommendedFor)) {
                          return (
                            <span className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap border border-emerald-400/20 text-emerald-200 bg-emerald-700/10">
                              Program Notes
                            </span>
                          );
                        }
                      } catch (err) {
                        // ignore server/non-browser
                      }
                      if (p.bestFor || p.exposureLevel || p.limitations || p.notRecommendedFor) {
                        return (
                          <span className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap border border-emerald-400/20 text-emerald-200 bg-emerald-700/10">
                            Program Notes
                          </span>
                        );
                      }
                      return null;
                    })()}
                    <span className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap border border-slate-400/40 text-slate-200 bg-slate-400/10">
                      Capacity: Institution-defined
                    </span>
                    {renderEligibilityBadge()}
                    
                    {/* Reminder Button */}
                    <button
                      onClick={() => handleReminderClick(p)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-blue-400/15 hover:border-blue-300/40 transition-all group"
                      title="Set reminder for this program"
                    >
                      <Bell className="w-4 h-4 text-amber-200 group-hover:text-amber-100" />
                    </button>

                    {/* Map/Directions Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenMapProgram(openMapProgram === p.id ? null : p.id)}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-blue-400/15 hover:border-blue-300/40 transition-all"
                        title="View on map and get directions"
                        aria-expanded={openMapProgram === p.id}
                        aria-haspopup="true"
                      >
                        <MapPin className="w-4 h-4 text-blue-200" />
                      </button>
                      <div
                        className={`absolute right-0 top-full mt-2 w-48 rounded-lg bg-slate-900 border border-white/10 shadow-xl transition-all duration-200 z-20 ${openMapProgram === p.id ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}`}
                        role="menu"
                        aria-label="Map actions"
                      >
                        <a
                          href={`https://www.google.com/maps/search/${h?.name}+${h?.city}+${h?.emirate}+UAE`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 rounded-t-lg border-b border-white/10 transition-colors"
                        >
                          <MapPin className="w-4 h-4 text-blue-400" />
                          View on Google Maps
                        </a>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${hospitalCoords[h?.id || ""]?.[0]},${hospitalCoords[h?.id || ""]?.[1]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 rounded-b-lg transition-colors"
                        >
                          <MapPin className="w-4 h-4 text-indigo-400" />
                          Get Directions
                        </a>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleProgramExpansion(p.id)}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-400 hover:to-indigo-500 transition duration-150 ease-out text-sm shadow-lg w-full sm:w-auto active:scale-[0.98]"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          <span className="hidden sm:inline">Hide Details</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          <span className="hidden sm:inline">Show Details</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick Info Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center text-sm text-slate-300">
                    <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {h?.emirate}, {h?.city}
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-300">
                    <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {p.durationWeeksOptions[0]} weeks • {p.dailyHoursMax}h/day
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-300">
                    <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {p.handsOnLevel}
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-300">
                    <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>Fee: Set by institution</span>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="details"
                      layout
                      initial={reduce ? { opacity: 1 } : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={reduce ? { opacity: 1 } : { opacity: 0, height: 0 }}
                      transition={{ duration: motionTokens.duration.ui, ease: motionTokens.ease.standard }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Program Description */}
                      <div>
                        <h3 className="text-lg font-semibold text-slate-100 mb-3">Program Overview</h3>
                        <p className="text-slate-300 mb-4">{p.description}</p>
                        
                        <h4 className="text-md font-medium text-slate-100 mb-3 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">Requirements</h4>
                        <ul className="space-y-2">
                          {p.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="flex items-center text-sm text-slate-300 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                              <svg className="w-4 h-4 mr-2 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Hospital Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-slate-100 mb-3">Hospital Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-slate-300">
                            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="font-medium">Type:</span> <span className="ml-1">{h?.type}</span>
                          </div>
                          <div className="flex items-center text-sm text-slate-300">
                            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">Regulatory Authority:</span> <span className="ml-1">As per institutional declaration</span>
                          </div>
                          
                          <div className="text-sm text-slate-300">
                            <span className="font-medium">Departments:</span>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {h?.departments.map((dept, deptIndex) => (
                                <span key={deptIndex} className="px-2 py-1 bg-indigo-400/15 text-indigo-100 text-xs rounded-full border border-indigo-300/30">
                                  {dept}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-white/10 relative z-20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleApplyClick(p, h!);
                        }}
                        className="flex-1 text-center hover-scale rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 text-white py-3 font-semibold shadow-lg hover:from-blue-400 hover:to-indigo-500 transition-all duration-300 cursor-pointer"
                      >
                        Apply for this Program →
                      </button>
                      <Link
                        href={`/programs/${p.id}`}
                        className="flex-1 text-center hover-scale rounded-xl border border-white/15 bg-white/5 py-3 font-semibold text-slate-100 hover:bg-white/10 transition-colors"
                      >
                        View Full Details
                      </Link>
                    </div>
                  </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                      </motion.div>
                    </LayoutGroup>
                  </AnimatedProgramCard>
                </ScrollReveal>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Back to Home */}
        <Reveal delay={0.2}>
        <div className="text-center mt-12">
          <Link href="/" className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/15 bg-white/5 text-slate-100 font-semibold hover:bg-white/10 transition-all hover-scale">
            ← Back to Home
          </Link>
        </div>
        </Reveal>
      </div>

      {/* Application Modal */}
      {selectedProgram && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProgram(null);
          }}
          programName={selectedProgram.name}
          hospitalName={selectedProgram.hospital}
          programId={selectedProgram.programId}
          hospitalId={selectedProgram.hospitalId}
        />
      )}

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={reminderModal.open}
        programId={reminderModal.programId}
        programName={reminderModal.programName}
        onClose={() => setReminderModal({ open: false, programId: "", programName: "" })}
        onSuccess={() => {
          // Optional: Show success message or update UI
        }}
      />
      </main>
      </ScrollSection>
    </ScrollableViewport>
  );
}
