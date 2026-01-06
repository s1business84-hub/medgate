"use client";
import { useState } from "react";
import UI_COPY from '@/lib/uiCopy';

export default function ExposureAcknowledgementLog({ studentId, programId, onAcknowledged }: { studentId: string, programId: string, onAcknowledged?: () => void }) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exposureType, setExposureType] = useState<string>("Observation");
  const [confirmed, setConfirmed] = useState(false);

  const handleAcknowledge = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/audit/exposure-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, programId, exposureType, confirmed })
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
    return <div className="p-4 bg-green-100 text-green-800 rounded">{UI_COPY.student.acknowledgedMessage}</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-2">{UI_COPY.student.exposureTitle}</h2>
      <p className="mb-4 text-sm text-gray-700">{UI_COPY.student.exposureDescription}</p>
      <div className="mb-3">
        <label className="block text-sm text-gray-700 mb-1">Exposure level</label>
        <select className="w-full p-2 border rounded" value={exposureType} onChange={(e) => setExposureType(e.target.value)}>
          <option value="Observation">Observation</option>
          <option value="Limited participation">Limited participation</option>
        </select>
      </div>
      <div className="mb-3 flex items-start gap-2">
        <input id="confirm" type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
        <label htmlFor="confirm" className="text-sm text-gray-700">{UI_COPY.student.exposureCheckbox}</label>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleAcknowledge}
        disabled={loading}
      >
        {loading ? "Recording..." : UI_COPY.student.acknowledgeButton}
      </button>
    </div>
  );
}
