"use client"

import { useEffect, useState } from "react";
import { getEhsConfirmations } from "@/lib/auditStore";

export default function EhsAuditPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(getEhsConfirmations());
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">EHS Confirmation Audit</h1>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No EHS confirmations recorded.</p>
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <div key={c.applicationId + c.verifiedAt} className="p-4 border rounded-md bg-white/5">
              <div className="text-sm">Application: <strong className="text-slate-100">{c.applicationId}</strong></div>
              <div className="text-xs text-slate-300">Student: {c.studentId} • Program: {c.programId} • Hospital: {c.hospitalId || '(none)'}</div>
              <div className="text-xs text-slate-300">EHS Ref: {c.ehsReference || '(none)'} • Verified At: {new Date(c.verifiedAt).toLocaleString()}</div>
              <div className="text-xs text-slate-300">Verified By: {c.verifiedBy || '—'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
