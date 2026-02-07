"use client"

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Heart, Share2, MapPin, Clock, Users, CheckCircle, AlertCircle } from "lucide-react";
import Reveal from "@/components/Reveal";
import { motion } from "framer-motion";
import { ApplicationModal } from "@/components/application-modal";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { hospitals } from "@/lib/mockData";

interface Program {
  id: string;
  departmentName: string;
  programType: string;
  description: string;
  durationWeeksOptions: number[];
  dailyHoursMax: number;
  handsOnLevel: string;
  learningObjectives?: string[];
  keySkills?: string[];
  requirements: string[];
  hospitalId: string;
  bestFor?: string;
  exposureLevel?: string;
  limitations?: string;
  notRecommendedFor?: string;
}

interface Hospital {
  id: string;
  name: string;
  city: string;
  emirate: string;
  type: string;
  departments: string[];
}

interface ProgramDetailClientProps {
  program: Program;
  hospital: Hospital;
  relatedPrograms: Program[];
}

export function ProgramDetailClient({ program, hospital, relatedPrograms }: ProgramDetailClientProps) {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.15),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.12),transparent_35%),radial-gradient(circle_at_40%_80%,rgba(139,92,246,0.13),transparent_38%),linear-gradient(180deg,#0a0e1a_0%,#0f172a_50%,#0a0e1a_100%)]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Navigation Header */}
        <Reveal>
          <div className="flex items-center justify-between mb-8">
            <Link href="/programs" className="flex items-center gap-2 text-slate-300 hover:text-cyan-200 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Programs</span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-rose-400/15 hover:border-rose-300/40 transition-all"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-rose-400 text-rose-400" : "text-slate-400"}`} />
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: program.departmentName,
                      text: `Check out ${program.departmentName} at ${hospital.name}`,
                      url: window.location.href,
                    });
                  }
                }}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-cyan-400/15 hover:border-cyan-300/40 transition-all"
              >
                <Share2 className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Hero Section */}
        <Reveal delay={0.1}>
          <motion.div className="mb-8 rounded-2xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 sm:p-10 overflow-hidden relative">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none">
              <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-linear-to-br from-cyan-500/30 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-linear-to-tl from-indigo-500/30 to-transparent rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-linear-to-br from-cyan-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text bg-linear-to-r from-cyan-300 via-sky-200 to-indigo-200 text-transparent mb-2">
                    {program.departmentName}
                  </h1>
                  <p className="text-lg text-slate-300">{program.programType} Program</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-400">Location</p>
                    <p className="text-sm font-medium text-slate-200">{hospital.city}, {hospital.emirate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <div>
                    <p className="text-xs text-slate-400">Duration</p>
                    <p className="text-sm font-medium text-slate-200">{program.durationWeeksOptions[0]} weeks</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs text-slate-400">Intensity</p>
                    <p className="text-sm font-medium text-slate-200">{program.dailyHoursMax}h/day</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Reveal>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Reveal delay={0.15}>
              <motion.div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">Program Overview</h2>
                <p className="text-slate-300 leading-relaxed mb-4">{program.description}</p>
                {(program.learningObjectives || program.keySkills) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                    {program.learningObjectives && program.learningObjectives.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-400 font-medium mb-2">Learning Objectives</p>
                        <ul className="space-y-2">
                          {program.learningObjectives.slice(0, 3).map((obj, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {program.keySkills && program.keySkills.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-400 font-medium mb-2">Key Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {program.keySkills.slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-full text-xs bg-cyan-500/15 text-cyan-200 border border-cyan-300/30">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </Reveal>

            {/* Requirements */}
            <Reveal delay={0.2}>
              <motion.div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
                <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {program.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="w-5 h-5 rounded-full bg-linear-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-white">{idx + 1}</span>
                      </div>
                      <span className="text-slate-300">{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Reveal>

            {/* Hospital Details */}
            <Reveal delay={0.25}>
              <motion.div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
                <h2 className="text-2xl font-bold text-slate-100 mb-6">About {hospital.name}</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-2">Hospital Type</p>
                    <p className="text-slate-300">{hospital.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-2">Location</p>
                    <p className="text-slate-300">{hospital.city}, {hospital.emirate}, UAE</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-3">Departments</p>
                    <div className="flex flex-wrap gap-2">
                      {hospital.departments.map((dept, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full text-xs bg-purple-500/15 text-purple-200 border border-purple-300/30">
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-slate-400 font-medium mb-2">Program Capacity</p>
                    <p className="text-sm text-slate-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-400" />
                      Set by the institution
                    </p>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Info */}
            <Reveal delay={0.2}>
              <motion.div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sticky top-6">
                <h3 className="text-lg font-bold text-slate-100 mb-4">Program Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-xs text-slate-400">Program Type</span>
                    <span className="text-sm font-medium text-slate-200">{program.programType}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-xs text-slate-400">Hands-on Level</span>
                    <span className="text-sm font-medium text-cyan-200">{program.handsOnLevel}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-xs text-slate-400">Daily Hours</span>
                    <span className="text-sm font-medium text-slate-200">{program.dailyHoursMax}h</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-xs text-slate-400">Duration</span>
                    <span className="text-sm font-medium text-slate-200">{program.durationWeeksOptions[0]}w</span>
                  </div>

                  {/* Fee Info */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="rounded-lg bg-amber-500/10 border border-amber-400/30 p-4">
                      <p className="text-xs text-amber-200 font-medium mb-1">Program Fee</p>
                      <p className="text-sm text-amber-100">Set by the institution</p>
                      <p className="text-xs text-amber-200/70 mt-2">Contact the hospital for specific pricing information</p>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                    <button
                      onClick={() => setIsApplicationModalOpen(true)}
                      className="w-full bg-linear-to-r from-cyan-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-cyan-400 hover:to-indigo-500 transition-all duration-300 shadow-lg"
                    >
                      Apply Now
                    </button>
                    <a
                      href={`https://www.google.com/maps/search/${hospital.name}+${hospital.city}+${hospital.emirate}+UAE`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 border border-white/15 bg-white/5 py-3 rounded-xl font-semibold text-slate-100 hover:bg-white/10 transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      View Location
                    </a>
                  </div>
                </div>
              </motion.div>
            </Reveal>

            {/* Important Notes */}
            <Reveal delay={0.25}>
              <motion.div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  Important Notes
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-1">•</span>
                    <span>All programs must be approved by the institutional review board or equivalent regulatory authority</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-1">•</span>
                    <span>Programs are subject to institutional capacity and operational requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-1">•</span>
                    <span>Fee structures are determined by each institution</span>
                  </li>
                </ul>
              </motion.div>
            </Reveal>
          </div>
        </div>

        {/* Related Programs */}
        {relatedPrograms.length > 0 && (
          <Reveal delay={0.3}>
            <motion.div>
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Related Programs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPrograms.map((relatedProgram) => (
                  <Link
                    key={relatedProgram.id}
                    href={`/programs/${relatedProgram.id}`}
                    className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                  >
                    <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-200 transition-colors mb-2">
                      {relatedProgram.departmentName}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">{relatedProgram.programType}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{relatedProgram.durationWeeksOptions[0]} weeks</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/15 text-cyan-200">
                        {relatedProgram.handsOnLevel}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </Reveal>
        )}
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        programName={program.departmentName}
        hospitalName={hospital.name}
        programId={program.id}
        hospitalId={hospital.id}
      />
    </main>
  );
}