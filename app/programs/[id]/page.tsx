"use client"

import { hospitals, programs } from "@/lib/mockData";
import Link from "next/link";
import { useState } from "react";
import { ApplicationModal } from "@/components/application-modal";
import ExposureAcknowledgementLog from "@/app/audit/exposure-log";
import { useAuth } from "@/lib/auth-context";
import { use } from "react";
import { LiquidParallax } from "@/components/ui/liquid-parallax";


function ProgramContent({ id }: { id: string }) {
  const program = programs.find((p) => p.id === id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const { user } = useAuth();

  if (!program) return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />
      <div className="relative text-center animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Program not found</h1>
        <Link href="/programs" className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/15 bg-white/5 text-slate-100 font-semibold hover:bg-white/10 transition-all hover-scale">← Back to Programs</Link>
      </div>
    </main>
  );

  const hospital = hospitals.find((h) => h.id === program.hospitalId);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-8 animate-fade-in">
          <Link
            href="/programs"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-slate-100 font-semibold hover:bg-white/10 transition-all hover-scale"
          >
            ← Back to Programs
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mr-4 border border-cyan-300/30">
              <svg className="w-8 h-8 text-cyan-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-100">{program.departmentName}</h1>
              <p className="text-xl text-slate-300">{program.programType}</p>
            </div>
          </div>

          <div className="flex items-center justify-center text-slate-300 mb-6">
            <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {hospital?.name} • {hospital?.emirate}, {hospital?.city}
          </div>

          {/* Program Description */}
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-slate-300 leading-relaxed">{program.description}</p>
          </div>
        </div>

        {/* Requirements Section */}
        <div
          className="mb-12 animate-fade-in rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg drop-shadow-[0_0_10px_rgba(34,211,238,0.4)] p-8"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center mr-3 border border-cyan-300/30">
              <svg className="w-5 h-5 text-cyan-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Baseline Eligibility Requirements (Institution-Defined)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {program.requirements.map((req, index) => (
              <div key={index} className="flex items-start p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5 text-cyan-400 mr-3 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-slate-100">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital Information */}
        <div
          className="mb-12 animate-fade-in rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-8"
          style={{ animationDelay: '0.25s' }}
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3 border border-purple-300/30">
              <svg className="w-5 h-5 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-100">Hospital Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center text-slate-300">
                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-medium">Type:</span> <span className="ml-1">{hospital?.type}</span>
              </div>
              <div className="flex items-center text-slate-300">
                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Regulatory Authority:</span> <span className="ml-1">As per institutional declaration</span>
              </div>
              <div className="flex items-center text-slate-300">
                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium">Capacity:</span> <span className="ml-1">As defined by institution</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-slate-300">
                <span className="font-medium">Participating Departments:</span>
                <div className="text-xs text-slate-400 mt-1">Departments listed are illustrative and subject to institutional scheduling.</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {hospital?.departments.map((dept, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-400/15 text-purple-100 text-xs rounded-full border border-purple-300/30">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-slate-300">
                <span className="font-medium">Program Formats Available:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {hospital?.programTypes.map((type, index) => (
                    <span key={index} className="px-2 py-1 bg-cyan-400/15 text-cyan-100 text-xs rounded-full border border-cyan-300/30">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Program Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Eligibility */}
          <div
            className="animate-fade-in rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-8"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-3 border border-emerald-300/30">
                <svg className="w-5 h-5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-100">Eligibility</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-slate-300">
                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="font-medium">Minimum Academic Year:</span> <span className="ml-1">As defined by institution (example: {program.eligibility.yearOfStudyMin})</span>
              </div>
              <div className="flex items-center text-slate-300">
                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
                </svg>
                <span className="font-medium">Language Requirement:</span> <span className="ml-1">{program.eligibility.language}</span>
              </div>
            </div>
          </div>

          {/* Logistics */}
          <div
            className="animate-fade-in rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-8"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-sky-500/20 rounded-lg flex items-center justify-center mr-3 border border-sky-300/30">
                <svg className="w-5 h-5 text-sky-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-100">Logistics</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-slate-300">
                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Duration:</span> <span className="ml-1">{program.durationWeeksOptions.join(", ")} weeks</span>
              </div>
              <div className="text-slate-300">
                <div className="flex items-start">
                  <svg className="w-4 h-4 mr-2 mt-0.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <span className="font-medium">Start Dates:</span>
                    <p className="mt-1 text-slate-400">Determined by institution during onboarding</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-slate-300">
                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium">Capacity:</span> <span className="ml-1">Defined by institution</span>
              </div>
              <div className="flex items-start text-slate-300">
                <svg className="w-4 h-4 mr-2 mt-0.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <span className="font-medium">Clinical Access Level:</span> <span className="ml-1">Observational only</span>
                  <div className="text-sm text-slate-400">(Defined by hosting institution)</div>
                </div>
              </div>
              <div className="flex items-center text-slate-300">
                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Certificate:</span> <span className="ml-1">Provided upon successful completion</span>
              </div>
              <div className="flex items-center text-slate-300">
                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="font-medium">Fee:</span> <span className="ml-1">Determined by institution</span>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Required */}
        <div
          className="mb-12 animate-fade-in rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-8"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mr-3 border border-amber-300/30">
              <svg className="w-5 h-5 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-100">Required Documents</h2>
          </div>
          <div className="space-y-4">
            {program.requiredDocuments.map((doc, index) => {
              const [title, ...descParts] = doc.split(': ');
              const description = descParts.join(': ');
              return (
                <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-slate-300 mr-3 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <h3 className="text-slate-100 font-semibold mb-1">{title}</h3>
                      {description && <p className="text-slate-300 text-sm">{description}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* Exposure Acknowledgement Log (must be completed before applying) */}
        <div className="mb-8">
          {!acknowledged && user && (
            <ExposureAcknowledgementLog
              studentId={user.id}
              programId={program.id}
              // @ts-ignore
              onAcknowledged={() => setAcknowledged(true)}
            />
          )}
        </div>

        {/* Apply Button (only enabled after acknowledgement) */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-lg px-8 py-4 hover-scale rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 text-white font-semibold shadow-lg hover:from-cyan-400 hover:to-indigo-500 transition-all duration-300"
            disabled={!acknowledged}
          >
            {acknowledged ? "Apply for this Program →" : "Acknowledge Exposure to Apply"}
          </button>
          <p className="text-xs text-slate-400 mt-4 max-w-2xl mx-auto">
            Submission of an application does not guarantee placement. Final confirmation is subject to hospital approval and slot availability.
          </p>
        </div>

        {/* Application Modal */}
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          programName={program.departmentName}
          hospitalName={hospital?.name || ''}
          programId={program.id}
          hospitalId={hospital?.id}
        />
      </div>
    </main>
  );
}

export default function ProgramDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ProgramContent id={id} />;
}
