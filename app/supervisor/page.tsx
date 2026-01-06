"use client";
import { useEffect, useState } from "react";
import { getApplications, getStudents, getUsers } from "@/lib/storage";
import UI_COPY from '@/lib/uiCopy';

export default function SupervisorDashboard() {
  const [apps, setApps] = useState([] as any[]);
  const [students, setStudents] = useState([] as any[]);

  useEffect(() => {
    setApps(getApplications());
    setStudents(getStudents());
    setUsers(getUsers());
  }, []);

  const [users, setUsers] = useState([] as any[]);
  const [confirmingAppId, setConfirmingAppId] = useState<string | null>(null);
  const [confirmSupervisorId, setConfirmSupervisorId] = useState<string | null>(null);
  const [confirmStudentId, setConfirmStudentId] = useState<string>('');
  const [attestingAppId, setAttestingAppId] = useState<string | null>(null);
  const [attestSupervisorId, setAttestSupervisorId] = useState<string | null>(null);

  const studentName = (id: string) => {
    const s = students.find(st => st.id === id);
    return s ? s.name : "Unknown";
  };

  function openConfirmForm(application: any) {
    setConfirmingAppId(application.id);
    setConfirmSupervisorId(null);
    setConfirmStudentId(application.studentId || '');
  }

  async function submitConfirmSupervision(appId: string) {
    if (!confirmSupervisorId) {
        (await import("@/lib/toast")).showToast(UI_COPY.supervisor.selectSupervisorBeforeConfirm);
      return;
    }
    const application = apps.find(a => a.id === appId);
    if (!application) return;
    const payload: any = {
      supervisorId: confirmSupervisorId,
      programId: application.programId,
      dates: application.submissionDate || new Date().toISOString(),
      exposureBoundaries: application.notes || "standard",
    };
    if (confirmStudentId) payload.studentId = confirmStudentId;

    try {
      const res = await fetch('/api/audit/supervisor-confirmation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const body = await res.json();
      if (res.ok) {
          (await import("@/lib/toast")).showToast(UI_COPY.supervisor.confirmationSuccessToast);
        setConfirmingAppId(null);
        setApps(getApplications());
      } else {
        (await import("@/lib/toast")).showToast('Error: ' + (body?.error || 'unknown'));
      }
    } catch (err) {
      (await import("@/lib/toast")).showToast('Network error');
    }
  }

  function openAttestForm(application: any) {
    setAttestingAppId(application.id);
    setAttestSupervisorId(null);
  }

  async function submitAttestCompletion(appId: string) {
    if (!attestSupervisorId) {
        (await import("@/lib/toast")).showToast(UI_COPY.supervisor.selectSupervisorBeforeAttest);
      return;
    }
    const application = apps.find(a => a.id === appId);
    if (!application) return;
    const payload = {
      supervisorId: attestSupervisorId,
      studentId: application.studentId,
      programId: application.programId,
      dates: application.submissionDate || new Date().toISOString(),
      exposureType: application.notes || 'observational',
      notes: 'Attested via supervisor dashboard',
    };

    try {
      const res = await fetch('/api/audit/completion-attestation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const body = await res.json();
      if (res.ok) {
          (await import("@/lib/toast")).showToast(UI_COPY.supervisor.attestSuccessToast);
        setAttestingAppId(null);
        setApps(getApplications());
      } else {
        (await import("@/lib/toast")).showToast('Error: ' + (body?.error || 'unknown'));
      }
    } catch (err) {
      (await import("@/lib/toast")).showToast('Network error');
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Supervisor Dashboard (Demo)</h1>
      <p className="mb-4 text-sm text-slate-600">List of submitted applications. Use the buttons to confirm supervision or attest completion (demo mode).</p>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-slate-100 text-slate-800">
            <th className="p-2 border">Student</th>
            <th className="p-2 border">Program</th>
            <th className="p-2 border">Submitted</th>
            <th className="p-2 border">Regulatory</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apps.map(app => (
            <tr key={app.id} className="border-b">
              <td className="p-2 border">{studentName(app.studentId)}</td>
              <td className="p-2 border">{app.programId}</td>
              <td className="p-2 border">{new Date(app.submissionDate).toLocaleString()}</td>
              <td className="p-2 border">{app.regulatory?.type || 'None'}</td>
              <td className="p-2 border">
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => openConfirmForm(app)}>Confirm Supervision</button>
                  <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => openAttestForm(app)}>Attest Completion</button>
                </div>
                {confirmingAppId === app.id && (
                  <div className="mt-2 p-2 border rounded bg-slate-50">
                    <div className="flex items-center gap-2">
                      <select value={confirmSupervisorId || ''} onChange={e => setConfirmSupervisorId(e.target.value || null)} className="border p-1 rounded">
                        <option value="">Select Supervisor</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.id})</option>)}
                      </select>
                      <input placeholder="Student ID (leave blank for program-level)" value={confirmStudentId} onChange={e => setConfirmStudentId(e.target.value)} className="border p-1 rounded" />
                      <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={() => submitConfirmSupervision(app.id)}>Submit</button>
                      <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => setConfirmingAppId(null)}>Cancel</button>
                    </div>
                  </div>
                )}
                {attestingAppId === app.id && (
                  <div className="mt-2 p-2 border rounded bg-slate-50">
                    <div className="flex items-center gap-2">
                      <select value={attestSupervisorId || ''} onChange={e => setAttestSupervisorId(e.target.value || null)} className="border p-1 rounded">
                        <option value="">Select Supervisor</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.id})</option>)}
                      </select>
                      <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={() => submitAttestCompletion(app.id)}>Submit</button>
                      <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => setAttestingAppId(null)}>Cancel</button>
                    </div>
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
