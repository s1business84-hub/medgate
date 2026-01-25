"use client"

import React, { useEffect, useState } from "react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50">
      <div
        className={[
          "transition-all duration-300",
          scrolled
            ? "backdrop-blur-md bg-white/70 dark:bg-black/40 shadow-sm border-b border-black/5"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="font-semibold tracking-tight">Electivio</div>
          <nav className="flex gap-5 text-sm">
            <a className="opacity-80 hover:opacity-100 transition" href="#features">
              Features
            </a>
            <a className="opacity-80 hover:opacity-100 transition" href="#faq">
              FAQ
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
