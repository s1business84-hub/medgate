"use client";
import { useState } from "react";

export default function IncidentFlagAdmin() {
  const [note, setNote] = useState("");
  const [severity, setSeverity] = useState("low");

  const handleFlag = async () => {
    if (!note) return alert('Please add a note');
    try {
      const res = await fetch('/api/admin/incident-flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: 'admin_1', programId: 'program_1', note, severity })
      });
      if (!res.ok) throw new Error('Failed to flag incident');
      alert('Flag recorded');
      setNote('');
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Incident / Escalation Flag (Internal)</h2>
      <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full p-2 border rounded mb-2" placeholder="Describe the concern (internal only)" />
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm">Severity:</label>
        <select value={severity} onChange={e => setSeverity(e.target.value)} className="border p-1 rounded">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button className="px-4 py-2 bg-amber-600 text-white rounded" onClick={handleFlag}>Flag Incident</button>
    </div>
  );
}
