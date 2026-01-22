"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Heart, Users, CheckCircle, Upload, Menu, X } from "lucide-react";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { AuditExcelButton } from "@/components/audit-excel-button";

export default function StudentPortal() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If user is logged in and is a student, show full portal
  if (user && user.role === "student") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
        <LiquidParallax />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />

        <div className="relative max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 animate-fade-in gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text bg-linear-to-r from-slate-900 via-blue-800 to-slate-900 text-transparent mb-2">Student Portal</h1>
              <p className="text-slate-300">Welcome back, {user.name}!</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="btn-secondary hover-scale px-4 sm:px-6 py-2 sm:py-3 rounded-lg backdrop-blur-md border-white/30 bg-white/40"
              >
                Logout
              </button>
              <Link href="/" className="btn-secondary hover-scale px-4 sm:px-6 py-2 sm:py-3 rounded-lg backdrop-blur-md border-white/30 bg-white/40">
                ← Back to Home
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Audit Card */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg p-4 sticky top-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-2xl">📋</div>
                  <h3 className="text-lg font-semibold text-white">Your Records</h3>
                </div>
                <p className="text-xs text-slate-300 mb-4">Download copies of your applications, exposure logs, and training records.</p>
                <div className="space-y-2">
                  <AuditExcelButton
                    dataTypes={["applications", "exposureLogs", "completionAttestations"]}
                    filterApplications={(apps) => apps.filter((a) => a.studentId === user.id)}
                    className="w-full border-white/30 bg-white/40 text-slate-800 hover:bg-white/50"
                  />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-slate-100 mb-4">Welcome to Your Dashboard</h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Manage your applications and track your progress towards your dream clinical training opportunity.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-6 text-center">
                <Users className="w-12 h-12 text-cyan-200 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-100 mb-2">Pilot Platform</h3>
                <p className="text-slate-300">Preparing for UAE pilot collaborations</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-6 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-100 mb-2">UAE Coverage</h3>
                <p className="text-slate-300">Targeting major healthcare institutions</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-6 text-center">
                <Heart className="w-12 h-12 text-rose-200 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-100 mb-2">Active Development</h3>
                <p className="text-slate-300">Platform features in progress</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg p-12 text-center">
              <Upload className="w-24 h-24 text-cyan-300 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-100 mb-4">Manage Your Applications</h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                View and manage your submitted applications, track statuses, and prepare for upcoming interviews.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/programs">
                  <Button size="lg" className="bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg">
                    Browse More Programs
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg" className="border-white/25 text-slate-100 hover:bg-white/10">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Public content for non-logged-in users
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Student Portal</h1>
            <p className="text-slate-300">Early Access Portal for Observerships and Electives</p>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden sm:flex gap-4">
            <Link href="/login" className="inline-flex items-center px-4 py-2 rounded-lg bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium transition-all">
              Join Early Access
            </Link>
            <Link href="/" className="inline-flex items-center px-4 py-2 rounded-lg border border-white/25 text-slate-100 hover:bg-white/10 font-medium transition-all">
              ← Back to Home
            </Link>
          </div>
          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg border border-white/25 text-slate-100 hover:bg-white/10 transition-all"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu with Animation */}
        <div
          className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out mb-8 ${
            mobileMenuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <Link 
              href="/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium transition-all"
            >
              Get Notified
            </Link>
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg border border-white/25 text-slate-100 hover:bg-white/10 font-medium transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Early Access Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Early Access Registration</h2>
            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              Electivio is conducting a pilot rollout of formal observership and elective program listings in collaboration with healthcare institutions. By creating an account, students may register for early access, receive program updates, and be notified when applications open.
            </p>
            
            {/* No Live Programs Notice */}
            <div className="mb-8 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-xl">
              <p className="text-sm text-amber-200">
                <strong>Early Access:</strong> Observership and elective listings are currently in pilot preparation. Register to receive updates and priority access when applications open.
              </p>
            </div>

            {/* Benefits List */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">What You'll Get:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <span className="text-slate-300">Early access to pilot observership and elective program listings</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <span className="text-slate-300">Priority notifications when applications open</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <span className="text-slate-300">Direct updates related to partner institutions and program availability</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <span className="text-slate-300">Support materials, eligibility guidelines, and application information</span>
                </li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg">
                  Join Early Access
                </Button>
              </Link>
              <Link href="/programs">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/25 text-slate-100 hover:bg-white/10">
                  View Demo Listings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
