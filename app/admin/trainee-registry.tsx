"use client";
import { useState } from "react";
import { getStudents, getApplications, getUsers } from "@/lib/storage";

// Feature flag: hide exports for locked pilot. Set to true only when exports are allowed.
const ALLOW_EXPORT = false;

export default function TraineeRegistry() {
  const [query, setQuery] = useState("");

  const students = getStudents();
  const applications = getApplications();

  // Build a simple read-only registry view by joining applications to students
  const users = getUsers();

  const rows = applications.map(a => {
    const student = students.find(s => s.id === a.studentId) || { name: 'Unknown' };
    const appAny = a as any;
    const supervisorName = appAny.supervisor ? (users.find(u => u.id === appAny.supervisor)?.name || appAny.supervisor) : '-';
    return {
      id: a.id,
      name: student.name,
      department: a.programId || 'Unknown',
      supervisor: supervisorName,
      exposure: appAny.notes || 'Observational',
      dates: appAny.submissionDate ? new Date(appAny.submissionDate).toLocaleString() : '-',
      regulatory: appAny.regulatory?.type || 'None',
      regulatoryStatus: appAny.regulatory?.status || '-',
      status: a.status,
    };
  }).filter(r => r.name.toLowerCase().includes(query.toLowerCase()) || r.department.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Trainee Registry (Audit View)</h1>
      <div className="flex items-center gap-4 mb-6">
        <input placeholder="Search by student or department" className="border p-2 rounded flex-1" value={query} onChange={e => setQuery(e.target.value)} />
        {ALLOW_EXPORT && (
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => {
              // Build CSV from rows
              const headers = ['Name','Department','Supervisor','Exposure','Dates','Regulatory','Regulatory Status','Status'];
                const csv = [headers.join(',')].concat(rows.map(r => [r.name, r.department, r.supervisor, r.exposure, r.dates, r.regulatory, r.regulatoryStatus, r.status].map(v => `"${(v||'').toString().replace(/"/g,'""')}"`).join(','))).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `trainee-registry-${new Date().toISOString().slice(0,10)}.csv`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}
          >
            Export CSV
          </button>
        )}
      </div>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-slate-100 text-slate-800">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Supervisor</th>
            <th className="p-2 border">Exposure</th>
            <th className="p-2 border">Dates</th>
            <th className="p-2 border">Regulatory</th>
            <th className="p-2 border">Regulatory Status</th>
            
          </tr>
        </thead>
        <tbody>
          {rows.map(t => (
            <tr key={t.id} className="border-b">
              <td className="p-2 border">{t.name}</td>
              <td className="p-2 border">{t.department}</td>
              <td className="p-2 border">{t.supervisor}</td>
              <td className="p-2 border">{t.exposure}</td>
              <td className="p-2 border">{t.dates}</td>
              <td className="p-2 border">{t.regulatory}</td>
              <td className="p-2 border">{t.regulatoryStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
