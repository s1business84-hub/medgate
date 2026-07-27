"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

const NAV = [
  { href: "/programs", label: "Programmes" },
  { href: "/student", label: "For students" },
  { href: "/for-hospitals", label: "For hospitals" },
  { href: "/#about", label: "About" },
  { href: "/#faq", label: "FAQ" },
];

function dashboardHref(role?: string) {
  if (role === "supervisor") return "/supervisor";
  if (role === "staff") return "/hospital";
  if (role === "admin") return "/admin";
  return "/student";
}

function Wordmark() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-700 text-sm font-bold text-white">
        E
      </span>
      <span className="text-lg font-bold tracking-tight text-slate-900">Electivio</span>
    </span>
  );
}

export function MarketingHeader() {
  const { user } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href.startsWith("/#") ? false : href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            <Wordmark />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2",
                  isActive(l.href)
                    ? "text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {l.label}
                {isActive(l.href) && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-teal-600" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              href={user ? dashboardHref(user.role) : "/login"}
              className="inline-flex h-10 items-center rounded-lg px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              {user ? "Dashboard" : "Log in"}
            </Link>
            <Link
              href="/student"
              className="inline-flex h-10 items-center rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              Early access
            </Link>
          </div>

          {/* Mobile: one control only */}
          <div className="flex lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  aria-label="Open menu"
                  className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[86vw] max-w-sm border-l border-slate-200 bg-white p-0 text-slate-900"
              >
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>

                <div className="flex h-full flex-col">
                  <div className="flex h-14 items-center border-b border-slate-200 px-5">
                    <Wordmark />
                  </div>

                  {user && (
                    <div className="border-b border-slate-200 px-5 py-4">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Signed in as
                      </p>
                      <p className="mt-1 truncate font-semibold text-slate-900">{user.name}</p>
                    </div>
                  )}

                  <nav className="flex-1 overflow-y-auto p-3">
                    {NAV.map((l) => (
                      <SheetClose asChild key={l.href}>
                        <Link
                          href={l.href}
                          aria-current={isActive(l.href) ? "page" : undefined}
                          className={cn(
                            "flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                            isActive(l.href)
                              ? "bg-teal-50 text-teal-900"
                              : "text-slate-700 hover:bg-slate-50"
                          )}
                        >
                          {l.label}
                          <ArrowRight
                            className={cn(
                              "h-4 w-4",
                              isActive(l.href) ? "opacity-60" : "opacity-0"
                            )}
                          />
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  <div className="space-y-2 border-t border-slate-200 p-4">
                    <SheetClose asChild>
                      <Link
                        href="/student"
                        className="flex h-12 w-full items-center justify-center rounded-xl bg-teal-700 text-base font-semibold text-white transition-colors hover:bg-teal-800"
                      >
                        Early access
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href={user ? dashboardHref(user.role) : "/login"}
                        className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-300 text-base font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                      >
                        {user ? "Dashboard" : "Log in"}
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
