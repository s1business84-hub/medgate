"use client";
import { useState } from "react";
import type { Application, Student } from "@/lib/types";
import { getApplications, getStudents, setApplicationRegulatory } from "@/lib/storage";

export default function RegulatoryApproval() {
  // Initialize from storage directly to avoid an extra effect and satisfy hooks lint rules
  const [apps, setApps] = useState<Application[]>(() => getApplications());
  const [students, setStudents] = useState<Student[]>(() => getStudents());
  const [newReg, setNewReg] = useState<Record<string, { type: string; reference: string }>>({});

  const toggleVerify = (appId: string) => {
    const appsRaw = getApplications();
    const idx = appsRaw.findIndex(a => a.id === appId);
    if (idx === -1) return;
    const app = appsRaw[idx];
    if (!app.regulatory) return;

    const nextStatus = app.regulatory.status === 'Verified' ? 'Pending' : 'Verified';
    // Use storage helper to persist change
    const updated = setApplicationRegulatory(appId, { ...app.regulatory, status: nextStatus });
    if (updated) {
      setApps(getApplications());
    }
  }

  const findStudent = (id: string) => students.find(s => s.id === id)?.name || id;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Regulatory Approvals</h2>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-slate-100 text-slate-800">
            <th className="p-2 border">Student</th>
            <th className="p-2 border">Program</th>
            <th className="p-2 border">Regulatory</th>
            <th className="p-2 border">Reference</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {apps.map(a => (
            <tr key={a.id} className="border-b">
              <td className="p-2 border">{findStudent(a.studentId)}</td>
              <td className="p-2 border">{a.programId}</td>
              <td className="p-2 border">{a.regulatory?.type || 'None'}</td>
              <td className="p-2 border">{a.regulatory?.reference || ''}</td>
              <td className="p-2 border">{a.regulatory?.status || '-'}</td>
              <td className="p-2 border">
                {a.regulatory ? (
                  <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => toggleVerify(a.id)}>
                    {a.regulatory.status === 'Verified' ? 'Mark Pending' : 'Mark Verified'}
                  </button>
                ) : (
                  <div className="flex gap-2 items-center">
                    <select value={newReg[a.id]?.type || 'DHA'} onChange={(e) => setNewReg({ ...newReg, [a.id]: { ...(newReg[a.id] || { reference: '' }), type: e.target.value } })} className="p-1 border rounded">
                      <option value="DHA">DHA</option>
                      <option value="DoH">DoH</option>
                      <option value="EHS">EHS</option>
                    </select>
                    <input value={newReg[a.id]?.reference || ''} onChange={(e) => setNewReg({ ...newReg, [a.id]: { ...(newReg[a.id] || { type: 'DHA' }), reference: e.target.value } })} placeholder="Reference" className="p-1 border rounded" />
                    <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={() => {
                      const entry = newReg[a.id];
                      if (!entry) return;
                      setApplicationRegulatory(a.id, { type: entry.type as any, reference: entry.reference, status: 'Pending' });
                      setApps(getApplications());
                      setNewReg({ ...newReg, [a.id]: undefined as any });
                    }}>Add</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
