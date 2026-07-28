"use client";

import { useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getEhsConfirmations } from "@/lib/auditStore";

export default function EhsAuditPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    startTransition(() => setItems(getEhsConfirmations()));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to admin
        </Link>

        <div className="mt-4 flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/25">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-white">EHS confirmation audit</h1>
            <p className="text-sm text-slate-400">
              Environmental Health & Safety sign-offs recorded against applications.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center">
            <p className="text-sm text-slate-400">No EHS confirmations recorded yet.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {items.map((c) => (
              <div
                key={c.applicationId + c.verifiedAt}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4"
              >
                <p className="text-sm font-semibold text-white">
                  Application: {c.applicationId}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Student: {c.studentId} · Program: {c.programId} · Hospital:{" "}
                  {c.hospitalId || "(none)"}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  EHS ref: {c.ehsReference || "(none)"} · Verified{" "}
                  {new Date(c.verifiedAt).toLocaleString()}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Verified by: {c.verifiedBy || "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
