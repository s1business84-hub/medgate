"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createUser, findUserByEmail } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { Building2, Mail, Lock, Phone, User, CheckCircle2 } from "lucide-react";

export default function HospitalCreateAccount() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    institutionName: "",
    contactName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.institutionName || !form.contactName || !form.email || !form.password || !form.confirmPassword) {
      setError("Please complete all required fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const existing = findUserByEmail(form.email);
    if (existing) {
      setError("An account with this email already exists. Please sign in instead.");
      setLoading(false);
      return;
    }

    // Create hospital user and log them in
    const hospitalId = `h_${Date.now().toString(16)}`;
    createUser({
      email: form.email,
      role: "hospital",
      name: form.contactName || form.institutionName,
      hospitalId,
      password: form.password,
    });

    // Fire-and-forget welcome email
    fetch("/api/send-onboarding-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        name: form.institutionName || form.contactName,
        type: "welcome-hospital",
      }),
    }).catch((err) => console.error("Hospital welcome email failed", err));

    const loggedIn = login(form.email, form.password);
    if (!loggedIn) {
      setError("Registration failed. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess("Account created successfully. Redirecting to dashboard...");
    setLoading(false);
    setTimeout(() => router.push("/hospital"), 600);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />
      <div className="w-full max-w-xl">
        <div className="backdrop-blur-xl bg-white/10 border border-white/15 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Hospital Account</h1>
            <p className="text-indigo-100">Register your institution to manage applications</p>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {error && (
              <div className="p-4 bg-red-900/30 border border-red-700/40 rounded-lg">
                <p className="text-red-200 font-medium">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-4 bg-emerald-900/30 border border-emerald-700/40 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <p className="text-emerald-200 font-medium">{success}</p>
              </div>
            )}

            <div>
              <label className="block text-slate-200 font-semibold mb-2">Institution Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={form.institutionName}
                  onChange={update("institutionName")}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-100 placeholder-slate-400"
                  placeholder="e.g., City Hospital"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-200 font-semibold mb-2">Primary Contact Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={form.contactName}
                  onChange={update("contactName")}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-100 placeholder-slate-400"
                  placeholder="e.g., Dr. Aisha Khan"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-200 font-semibold mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-100 placeholder-slate-400"
                  placeholder="admin@hospital.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-200 font-semibold mb-2">Phone (optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-100 placeholder-slate-400"
                  placeholder="+971 50 123 4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-slate-200 font-semibold mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={update("password")}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-100 placeholder-slate-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-200 font-semibold mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={update("confirmPassword")}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-100 placeholder-slate-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-indigo-600 to-blue-600 text-white font-bold py-2 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="text-center">
              <p className="text-slate-300 text-sm mt-4">Already have an account?</p>
              <Link href="/hospital-login" className="text-indigo-300 hover:text-indigo-200 font-semibold">
                Hospital Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
