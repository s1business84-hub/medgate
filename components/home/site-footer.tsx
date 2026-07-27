"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const LINKS = [
  { href: "/programs", label: "Programmes" },
  { href: "/student", label: "Students" },
  { href: "/for-hospitals", label: "Hospitals" },
  { href: "/#about", label: "About" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setState("error");
      setMsg("Enter a valid email address.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/subscribe-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setState("ok");
        setMsg(data.message || "You're on the list.");
        setEmail("");
      } else {
        setState("error");
        setMsg(data.error || "Something went wrong.");
      }
    } catch {
      setState("error");
      setMsg("Failed to subscribe. Please try again.");
    }
  };

  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-[1.2fr_1fr_1.4fr]">
          {/* brand + contact */}
          <div>
            <span className="text-lg font-bold text-white">Electivio</span>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-300">
              Structured observership and elective programmes with UAE healthcare
              institutions.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-slate-500" />
                <a
                  href="mailto:electivio.app@gmail.com"
                  className="-my-2 inline-flex min-h-[44px] items-center py-2 hover:text-teal-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded"
                >
                  electivio.app@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-slate-500" />
                <a
                  href="tel:+971544530209"
                  className="-my-2 inline-flex min-h-[44px] items-center py-2 hover:text-teal-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded"
                >
                  +971 54 453 0209
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
                Dubai, UAE
              </li>
            </ul>
          </div>

          {/* links */}
          <nav aria-label="Footer">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Explore
            </h2>
            <ul className="mt-3 space-y-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="-mx-2 inline-flex min-h-[44px] items-center px-2 text-sm text-slate-300 transition-colors hover:text-teal-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* newsletter */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Stay updated
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Occasional updates on pilot programmes and platform availability.
            </p>
            <form onSubmit={submit} className="mt-3 flex flex-col sm:flex-row gap-2">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                disabled={state === "loading" || state === "ok"}
                className="h-11 min-w-0 flex-1 rounded-lg border border-white/15 bg-slate-950 px-3 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={state === "loading" || state === "ok"}
                className="h-11 shrink-0 rounded-lg bg-teal-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-60"
              >
                {state === "loading" ? "Sending…" : state === "ok" ? "Subscribed" : "Subscribe"}
              </button>
            </form>
            {msg && (
              <p
                role="status"
                className={`mt-2 text-xs ${state === "ok" ? "text-teal-300" : "text-red-400"}`}
              >
                {msg}
              </p>
            )}
          </div>
        </div>

        <div className="mt-9 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/10 pt-6">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Electivio. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Not a placement or recruitment service.
          </p>
        </div>
      </div>
    </footer>
  );
}
