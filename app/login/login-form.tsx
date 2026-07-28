"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { createUser, getCurrentUser, findUserByEmail } from "@/lib/storage";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { Toast } from "@/components/ui/Toast";
import { motion } from "framer-motion";
import { motionTokens } from "@/lib/motion";
import { StaggerGroup, StaggerItem } from "@/components/animation/StaggerGroup";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { usePrefersReducedMotion } from "@/components/animation/usePrefersReducedMotion";

type WelcomeVariant = "welcome-student" | "welcome-hospital"

async function sendWelcomeEmail(email: string, name: string, type: WelcomeVariant) {
  const res = await fetch("/api/send-onboarding-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, type }),
  });

  if (!res.ok) {
    throw new Error("Failed to send welcome email");
  }
}

function getInitialRole(searchParams: ReturnType<typeof useSearchParams>) {
  const roleParam = searchParams?.get("role");
  if (roleParam === "hospital") return "staff";
  if (roleParam === "supervisor") return "supervisor";
  if (roleParam === "admin") return "admin";
  return "student";
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "staff" | "supervisor" | "admin">(() => getInitialRole(searchParams));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 2200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const success = login(email, password);
        if (success) {
          const u = getCurrentUser();
          showToast(`Welcome back, ${u?.name || "User"}!`);
          setTimeout(() => {
            if (next) {
              router.push(next);
            } else if (u?.role === "staff") {
              router.push("/hospital");
            } else if (u?.role === "supervisor") {
              router.push("/supervisor");
            } else if (u?.role === "admin") {
              router.push("/admin");
            } else {
              router.push("/student");
            }
          }, 500);
        } else {
          setError("Invalid email or password");
        }
      } else {
        if (!name || !email || !password) {
          setError("Please fill in all fields");
          return;
        }

        const existing = findUserByEmail(email);
        if (existing) {
          setError("An account with this email already exists. Please sign in.");
          return;
        }

        createUser({ email, role, name, password });

        // Send welcome email for the selected role
        const variant: WelcomeVariant = (role === "staff" || role === "supervisor" || role === "admin") ? "welcome-hospital" : "welcome-student"
        sendWelcomeEmail(email, name || "", variant).catch((err) => console.error("Welcome email failed", err))

        const success = login(email, password);
        if (success) {
          const u = getCurrentUser();
          showToast(`Account created! Welcome, ${u?.name || "User"}!`);
          setTimeout(() => {
            if (next) {
              router.push(next);
            } else if (u?.role === "staff") {
              router.push("/hospital");
            } else if (u?.role === "supervisor") {
              router.push("/supervisor");
            } else if (u?.role === "admin") {
              router.push("/admin");
            } else {
              router.push("/student");
            }
          }, 500);
        } else {
          setError("Registration failed");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-visible bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />
      <motion.div
        initial={{ opacity: 0, y: motionTokens.distance.y }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionTokens.duration.page, ease: motionTokens.ease.standard }}
        className="relative max-w-md w-full"
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] p-8">
          <div className="text-center mb-8">
            {next && (
              <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
                Sign in or create an account to continue
              </p>
            )}
            <h1 className="text-3xl font-bold text-slate-100 mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-slate-300">
              {isLogin
                ? "Sign in to continue"
                : "Create your Electivio account"}
            </p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <StaggerGroup staggerDelay={0.08} initialDelay={0.2}>
            {!isLogin && (
              <StaggerItem>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name
                    </label>
                    <motion.input
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-white/15 bg-white/5 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              </StaggerItem>
            )}

            <StaggerItem>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <motion.input
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-white/15 bg-white/5 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </StaggerItem>

            <StaggerItem>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <motion.input
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-white/15 bg-white/5 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </StaggerItem>

            {error && (
              <StaggerItem>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-indigo-500/10 border border-indigo-300/30 text-indigo-100 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              </StaggerItem>
            )}

            <StaggerItem>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={isSubmitting ? {} : { scale: 1.02 }}
                whileTap={isSubmitting ? {} : { scale: 0.98 }}
                transition={{ duration: motionTokens.duration.ui }}
                className="w-full bg-linear-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-400 hover:to-indigo-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-out font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              </motion.button>
            </StaggerItem>
          </StaggerGroup>
        </form>

        <StaggerGroup className="mt-6 text-center space-y-3" staggerDelay={0.06} initialDelay={0.5}>
          {isLogin && (
            <StaggerItem>
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-200 hover:text-blue-100 text-sm"
              >
                Don&apos;t have an account? Sign up
              </button>
            </StaggerItem>
          )}

          {!isLogin && (
            <StaggerItem>
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-200 hover:text-blue-100 text-sm"
              >
                Already have an account? Sign in
              </button>
            </StaggerItem>
          )}

          <StaggerItem>
            <Link href="/" className="text-slate-300 hover:text-slate-100 text-sm">
              ← Back to Home
            </Link>
          </StaggerItem>
        </StaggerGroup>
      </div>
      </motion.div>

      <Toast open={toastOpen} message={toastMessage} />
    </div>
  );
}
