"use client";
import { useEffect, useState } from "react";

export default function CompletionAttestation({ supervisorId, studentId, programId, dates, exposureType, onAttested }: { supervisorId: string, studentId: string, programId: string, dates: string, exposureType: string, onAttested?: () => void }) {
  const [attested, setAttested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/audit/completion-attestation");
        if (!res.ok) return;
        const data = await res.json();
        const match = (data.entries || []).find((e: any) => e.studentId === studentId && e.programId === programId);
        if (match && !cancelled) {
          setAttested(true);
        }
      } catch {
        // non-fatal
      }
    })();
    return () => { cancelled = true; };
  }, [studentId, programId]);

  const handleAttest = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/audit/completion-attestation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supervisorId, studentId, programId, dates, exposureType, notes })
      });
      if (!res.ok) throw new Error("Failed to record attestation");
      setAttested(true);
      if (onAttested) onAttested();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (attested) {
    return <div className="p-4 bg-green-100 text-green-800 rounded">Completion attestation recorded.</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-2">Completion Attestation</h2>
      <p className="text-sm text-gray-700 mb-2">Confirm that the trainee has completed the agreed exposure.</p>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes" className="w-full p-2 border rounded mb-2" />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleAttest}
        disabled={loading}
      >
        {loading ? "Recording..." : "Attest Completion"}
      </button>
    </div>
  );
}
