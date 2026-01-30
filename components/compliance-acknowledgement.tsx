"use client";

import { useState } from "react";

const DEFAULT_POLICIES = [
  "Observership scope (no hands-on care)",
  "Confidentiality / NDA",
  "Hospital policies acknowledgement",
  "Patient data handling acknowledgement",
  "Code of conduct",
];

export function ComplianceAcknowledgement({
  policies = DEFAULT_POLICIES,
  onChange,
}: {
  policies?: string[];
  onChange?: (complete: boolean) => void;
}) {
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});

  const toggle = (policy: string) => {
    const next = { ...accepted, [policy]: !accepted[policy] };
    setAccepted(next);
    const complete = policies.every((item) => next[item]);
    onChange?.(complete);
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-semibold text-slate-100">Compliance Acknowledgement</p>
      <p className="text-xs text-slate-400 mt-1">Confirm required policies before proceeding.</p>
      <div className="mt-3 space-y-2">
        {policies.map((policy) => (
          <label key={policy} className="flex items-start gap-3 text-xs text-slate-300">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 text-cyan-400"
              checked={!!accepted[policy]}
              onChange={() => toggle(policy)}
            />
            <span>{policy}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
