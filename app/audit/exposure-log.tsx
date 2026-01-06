"use client";
import { useState } from "react";

export default function ExposureAcknowledgementLog({ studentId, programId, onAcknowledged }: { studentId: string, programId: string, onAcknowledged?: () => void }) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAcknowledge = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/audit/exposure-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, programId })
      });
      if (!res.ok) throw new Error("Failed to record acknowledgement");
      setAcknowledged(true);
      if (onAcknowledged) onAcknowledged();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (acknowledged) {
    return <div className="p-4 bg-green-100 text-green-800 rounded">Acknowledgement recorded. Thank you.</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-2">Exposure Acknowledgement</h2>
      <ul className="list-disc ml-6 mb-4 text-sm text-gray-700">
        <li>You understand your exposure level and limitations for this program.</li>
        <li>No hands-on clinical activity is guaranteed.</li>
        <li>You agree to abide by all institutional rules and boundaries.</li>
        <li>This acknowledgement will be timestamped and stored permanently.</li>
      </ul>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleAcknowledge}
        disabled={loading}
      >
        {loading ? "Recording..." : "Acknowledge & Sign"}
      </button>
    </div>
  );
}
