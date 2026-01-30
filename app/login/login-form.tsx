"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { createUser, getCurrentUser, findUserByEmail } from "@/lib/storage";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { DemoButton } from "@/components/demo-button";
import { Toast } from "@/components/ui/Toast";
import { motion } from "framer-motion";
import { motionTokens } from "@/lib/motion";

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
            if (u?.role === "staff") {
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
            if (u?.role === "staff") {
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
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center px-4">
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
            <h1 className="text-3xl font-bold text-slate-100 mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-slate-300">
              {isLogin ? `Sign in as a ${role === "staff" ? "Hospital" : role === "supervisor" ? "Supervisor" : role === "admin" ? "Admin" : "Student"}` : `Create a ${role === "staff" ? "Hospital" : role === "supervisor" ? "Supervisor" : role === "admin" ? "Admin" : "Student"} account`}
            </p>
          </div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: motionTokens.duration.ui }}
          className="mb-6"
        >
          <div className="grid grid-cols-2 gap-2 bg-white/5 border border-white/10 rounded-lg p-2 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`px-3 py-2 rounded-lg transition duration-150 ease-out ${role === "student" ? "bg-white text-slate-900 shadow" : "text-slate-200 hover:text-white"}`}
              aria-pressed={role === "student"}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("staff")}
              className={`px-3 py-2 rounded-lg transition duration-150 ease-out ${role === "staff" ? "bg-white text-slate-900 shadow" : "text-slate-200 hover:text-white"}`}
              aria-pressed={role === "staff"}
            >
              Hospital
            </button>
            <button
              type="button"
              onClick={() => setRole("supervisor")}
              className={`px-3 py-2 rounded-lg transition duration-150 ease-out ${role === "supervisor" ? "bg-white text-slate-900 shadow" : "text-slate-200 hover:text-white"}`}
              aria-pressed={role === "supervisor"}
            >
              Supervisor
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`px-3 py-2 rounded-lg transition duration-150 ease-out ${role === "admin" ? "bg-white text-slate-900 shadow" : "text-slate-200 hover:text-white"}`}
              aria-pressed={role === "admin"}
            >
              Admin
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">Choose your role to sign in or create an account.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: motionTokens.duration.ui }}
          className="mb-8 flex justify-center"
        >
          <DemoButton />
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-7">
          {!isLogin && (
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-white/15 bg-white/5 text-slate-100 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-white/15 bg-white/5 text-slate-100 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-white/15 bg-white/5 text-slate-100 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-500/10 border border-rose-300/30 text-rose-100 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={isSubmitting ? {} : { scale: 1.02 }}
            whileTap={isSubmitting ? {} : { scale: 0.98 }}
            transition={{ duration: motionTokens.duration.fast }}
            className="w-full bg-linear-to-r from-cyan-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-cyan-400 hover:to-indigo-500 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition duration-150 ease-out font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </motion.button>
        </form>

        {isLogin && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(false)}
              className="text-cyan-200 hover:text-cyan-100 text-sm"
            >
              Don&apos;t have an account? Sign up
            </button>
          </div>
        )}

        {!isLogin && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(true)}
              className="text-cyan-200 hover:text-cyan-100 text-sm"
            >
              Already have an account? Sign in
            </button>
          </div>
        )}

        <div className="mt-4 text-center">
          <Link href="/" className="text-slate-300 hover:text-slate-100 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
      </motion.div>

      <Toast open={toastOpen} message={toastMessage} />
    </div>
  );
}
