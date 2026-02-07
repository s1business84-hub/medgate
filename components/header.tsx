"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { Menu } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <svg className="h-8 w-8 sm:h-10 sm:w-10" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Medical Cross */}
              <rect x="85" y="15" width="30" height="30" fill="url(#grad1)" rx="4"/>
              <rect x="95" y="20" width="10" height="20" fill="white"/>
              <rect x="80" y="30" width="40" height="10" fill="white"/>
              
              {/* Gate Arc */}
              <path d="M 40 50 Q 40 25 65 25" stroke="url(#grad1)" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M 130 50 Q 130 25 155 25" stroke="url(#grad1)" strokeWidth="3" fill="none" strokeLinecap="round"/>
              
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: "#06B6D4", stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: "#6366F1", stopOpacity: 1}} />
                </linearGradient>
              </defs>
            </svg>
            <div>
              <span className="text-lg sm:text-xl font-bold bg-linear-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Electivio</span>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">Your Gateway</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            <Link href="/about" className="text-slate-300 hover:text-cyan-300 transition-colors font-medium text-sm px-3 py-2 rounded hover:bg-white/5">
              About
            </Link>
            <Link href="/faq" className="text-slate-300 hover:text-cyan-300 transition-colors font-medium text-sm px-3 py-2 rounded hover:bg-white/5">
              FAQ
            </Link>
            <Link href="/student" className="text-slate-300 hover:text-cyan-300 transition-colors font-medium text-sm px-3 py-2 rounded hover:bg-white/5">
              Student Portal
            </Link>
            <Link href="/for-hospitals" className="text-slate-300 hover:text-cyan-300 transition-colors font-medium text-sm px-3 py-2 rounded hover:bg-white/5">
              For Hospitals
            </Link>
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden sm:flex items-center space-x-2">
            {user ? (
              <>
                <span className="text-slate-300 font-medium text-sm">
                  {user.name}
                </span>
                <Link
                  href={
                    user.role === "supervisor"
                      ? "/supervisor"
                      : user.role === "staff"
                        ? "/hospital"
                        : "/student"
                  }
                >
                  <Button size="sm" className="bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white">
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button size="sm" className="bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            {!user && (
              <Link href="/login">
                <Button size="sm" className="bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white">
                  Login
                </Button>
              </Link>
            )}
            {user && (
              <Link
                href={
                  user.role === "supervisor"
                    ? "/supervisor"
                    : user.role === "staff"
                      ? "/hospital"
                      : "/student"
                }
              >
                <Button size="sm" className="bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white">
                  Dashboard
                </Button>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-cyan-300 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 space-y-2 border-t border-white/10 pt-4">
            <Link href="/" className="block text-slate-300 hover:text-cyan-300 transition-colors font-medium px-3 py-2 rounded hover:bg-white/5">
              Home
            </Link>
            <Link href="/about" className="block text-slate-300 hover:text-cyan-300 transition-colors font-medium px-3 py-2 rounded hover:bg-white/5">
              About
            </Link>
            <Link href="/faq" className="block text-slate-300 hover:text-cyan-300 transition-colors font-medium px-3 py-2 rounded hover:bg-white/5">
              FAQ
            </Link>
            <Link href="/student" className="block text-slate-300 hover:text-cyan-300 transition-colors font-medium px-3 py-2 rounded hover:bg-white/5">
              Student Portal
            </Link>
            <Link href="/for-hospitals" className="block text-slate-300 hover:text-cyan-300 transition-colors font-medium px-3 py-2 rounded hover:bg-white/5">
              For Hospitals
            </Link>
            {user && (
              <div className="pt-2 border-t border-white/10 text-slate-300">
                Logged in as: {user.name}
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
