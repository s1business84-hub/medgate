"use client";
import { useState } from "react";

// Placeholder: In production, fetch from backend
const mockTrainees = [
  { id: "s1", name: "Ali Hassan", year: 2025, department: "Cardiology", supervisor: "Dr. F. Rahman", exposure: "Observational", start: "2025-01-10", end: "2025-02-10" },
  { id: "s2", name: "Sara Lee", year: 2026, department: "Radiology", supervisor: "Dr. S. Patel", exposure: "Observational", start: "2026-03-01", end: "2026-03-31" },
  { id: "s3", name: "Mohammed Al Mansoori", year: 2025, department: "Emergency Medicine", supervisor: "Dr. L. Smith", exposure: "Elective", start: "2025-04-15", end: "2025-05-15" },
];

export default function TraineeRegistry() {
  const [filters, setFilters] = useState({ year: "", department: "", supervisor: "", exposure: "" });

  const filtered = mockTrainees.filter(t =>
    (!filters.year || t.year.toString() === filters.year) &&
    (!filters.department || t.department === filters.department) &&
    (!filters.supervisor || t.supervisor === filters.supervisor) &&
    (!filters.exposure || t.exposure === filters.exposure)
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Trainee Registry (Audit View)</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <input placeholder="Year" className="border p-2 rounded" value={filters.year} onChange={e => setFilters(f => ({ ...f, year: e.target.value }))} />
        <input placeholder="Department" className="border p-2 rounded" value={filters.department} onChange={e => setFilters(f => ({ ...f, department: e.target.value }))} />
        <input placeholder="Supervisor" className="border p-2 rounded" value={filters.supervisor} onChange={e => setFilters(f => ({ ...f, supervisor: e.target.value }))} />
        <input placeholder="Exposure Type" className="border p-2 rounded" value={filters.exposure} onChange={e => setFilters(f => ({ ...f, exposure: e.target.value }))} />
        <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setFilters({ year: "", department: "", supervisor: "", exposure: "" })}>Clear</button>
      </div>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-slate-100 text-slate-800">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Year</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Supervisor</th>
            <th className="p-2 border">Exposure</th>
            <th className="p-2 border">Start</th>
            <th className="p-2 border">End</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t => (
            <tr key={t.id} className="border-b">
              <td className="p-2 border">{t.name}</td>
              <td className="p-2 border">{t.year}</td>
              <td className="p-2 border">{t.department}</td>
              <td className="p-2 border">{t.supervisor}</td>
              <td className="p-2 border">{t.exposure}</td>
              <td className="p-2 border">{t.start}</td>
              <td className="p-2 border">{t.end}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-6 px-6 py-2 bg-green-600 text-white rounded" onClick={() => window.alert("Exported (mock)")}>Export CSV</button>
    </div>
  );
}
