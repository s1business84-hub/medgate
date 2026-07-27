"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth-context";
import { Menu, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// About and FAQ live on the homepage itself, so they stay out of the top nav.
const NAV_LINKS = [
  { href: "/programs", label: "Programmes" },
  { href: "/student", label: "Student Portal" },
  { href: "/for-hospitals", label: "For Hospitals" },
];

function dashboardHref(role?: string) {
  if (role === "supervisor") return "/supervisor";
  if (role === "staff") return "/hospital";
  if (role === "admin") return "/admin";
  return "/student";
}

function BrandMark() {
  return (
    <svg
      className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="85" y="15" width="30" height="30" fill="url(#grad1)" rx="4" />
      <rect x="95" y="20" width="10" height="20" fill="white" />
      <rect x="80" y="30" width="40" height="10" fill="white" />
      <path d="M 40 50 Q 40 25 65 25" stroke="url(#grad1)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 130 50 Q 130 25 155 25" stroke="url(#grad1)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#06B6D4", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#6366F1", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-3">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <BrandMark />
            <span className="flex flex-col leading-none">
              <span className="text-base sm:text-lg font-bold bg-linear-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Electivio
              </span>
              <span className="hidden sm:block text-[11px] text-slate-400 font-medium mt-0.5">
                Your Gateway
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                  isActive(link.href)
                    ? "text-white"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-linear-to-r from-cyan-400 to-indigo-500" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-slate-300 font-medium max-w-[12rem] truncate">
                  {user.name}
                </span>
                <Link href={dashboardHref(user.role)}>
                  <Button size="sm" className="bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white">
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile trigger — single control, no duplicated CTA */}
          <div className="flex lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="grid h-10 w-10 place-items-center rounded-lg text-slate-200 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[85vw] max-w-sm border-l border-white/10 bg-slate-950 p-0 text-slate-100"
              >
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>

                <div className="flex h-full flex-col">
                  <div className="flex items-center gap-2 border-b border-white/10 px-5 h-14">
                    <BrandMark />
                    <span className="text-base font-bold bg-linear-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                      Electivio
                    </span>
                  </div>

                  {user && (
                    <div className="border-b border-white/10 px-5 py-4">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Signed in as
                      </p>
                      <p className="mt-1 font-semibold text-white truncate">{user.name}</p>
                    </div>
                  )}

                  {/* Generous 48px+ tap targets */}
                  <nav className="flex-1 overflow-y-auto px-3 py-4">
                    {NAV_LINKS.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          aria-current={isActive(link.href) ? "page" : undefined}
                          className={cn(
                            "flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                            isActive(link.href)
                              ? "bg-linear-to-r from-cyan-500/15 to-indigo-500/10 text-white"
                              : "text-slate-300 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          {link.label}
                          <ArrowRight
                            className={cn(
                              "h-4 w-4 transition-opacity",
                              isActive(link.href) ? "opacity-70" : "opacity-0"
                            )}
                          />
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  <div className="border-t border-white/10 p-4">
                    <SheetClose asChild>
                      <Link href={user ? dashboardHref(user.role) : "/login"} className="block">
                        <Button className="h-12 w-full bg-linear-to-r from-cyan-500 to-indigo-600 text-base font-semibold text-white hover:from-cyan-400 hover:to-indigo-500">
                          {user ? "Go to Dashboard" : "Login"}
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
