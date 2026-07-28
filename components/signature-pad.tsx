"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SignaturePad({ onSigned }: { onSigned?: (signed: boolean) => void }) {
  const [signed, setSigned] = useState(false);

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-slate-200">Signature Pad</p>
      <p className="text-xs text-slate-400 mt-1">
        This is a placeholder. Replace with a real signature capture widget if needed.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <Button
          size="sm"
          className="bg-linear-to-r from-blue-500 to-indigo-600 text-white"
          onClick={() => {
            setSigned(true);
            onSigned?.(true);
          }}
        >
          Mark as Signed
        </Button>
        {signed && <span className="text-xs text-emerald-300">Signed</span>}
      </div>
    </div>
  );
}

export function SignatureModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-xl border border-white/10 bg-slate-950 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Signature</h3>
          <button className="text-slate-400 hover:text-white" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="mt-4">
          <SignaturePad />
        </div>
      </div>
    </div>
  );
}
