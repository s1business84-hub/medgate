"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Lock, UserPlus } from "lucide-react";
import { LiquidParallax } from "@/components/ui/liquid-parallax";

export default function HospitalLogin() {
  const [email, setEmail] = useState("hospital1@electivio.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = login(email, password);
    
    if (success) {
      router.push("/hospital");
    } else {
      setError("Invalid email or password");
    }
    
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/15 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Hospital Portal</h1>
            <p className="text-indigo-100">Manage observership applications</p>
          </div>

          {/* Content */}
          <div className="px-8 pt-6">
            <Button asChild variant="outline" className="w-full flex items-center justify-center gap-2">
              <Link href="/hospital/create-account">
                <UserPlus className="w-4 h-4" />
                Create Hospital Account
              </Link>
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700/40 rounded-lg">
                <p className="text-red-200 font-medium">{error}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-100 placeholder-slate-400"
                  placeholder="your@hospital.com"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-100 placeholder-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-indigo-600 to-blue-600 text-white font-bold py-2 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</p>
              <p className="text-xs text-blue-800">Email: hospital1@electivio.com</p>
              <p className="text-xs text-blue-800">Password: password</p>
            </div>
          </form>

          {/* Footer */}
          <div className="px-8 py-6 bg-white/5 border-t border-white/10 text-center space-y-3">
            <div>
              <p className="text-slate-300 text-sm mb-2">Not a hospital?</p>
              <Link
                href="/"
                className="text-indigo-300 hover:text-indigo-200 font-semibold transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
