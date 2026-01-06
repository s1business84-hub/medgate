"use client";
import { useState } from "react";

export default function SupervisorConfirmation({ supervisorId, programId, dates, exposureBoundaries, onConfirmed }: { supervisorId: string, programId: string, dates: string, exposureBoundaries: string, onConfirmed?: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/audit/supervisor-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supervisorId, programId, dates, exposureBoundaries })
      });
      if (!res.ok) throw new Error("Failed to record confirmation");
      setConfirmed(true);
      if (onConfirmed) onConfirmed();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (confirmed) {
    return <div className="p-4 bg-green-100 text-green-800 rounded">Supervisor confirmation recorded. Thank you.</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-2">Supervisor Responsibility Confirmation</h2>
      <ul className="list-disc ml-6 mb-4 text-sm text-gray-700">
        <li>You accept responsibility for supervising this trainee.</li>
        <li>Dates: <span className="font-semibold">{dates}</span></li>
        <li>Exposure boundaries: <span className="font-semibold">{exposureBoundaries}</span></li>
        <li>This confirmation will be timestamped and stored permanently.</li>
      </ul>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleConfirm}
        disabled={loading}
      >
        {loading ? "Recording..." : "Confirm Supervision"}
      </button>
    </div>
  );
}
