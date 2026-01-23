"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getApplications, updateApplicationStatus, getStudents, createNotification, deleteApplication, addDocument, setApplicationAssignment, getUsers, createObservationForm, getObservationForms } from "@/lib/storage";
import { getSupervisorConfirmations, addSupervisorConfirmation } from "@/lib/auditStore";
import { showToast } from "@/lib/toast";
import UI_COPY from '@/lib/uiCopy';
import { mockPrograms, mockHospitals } from "@/lib/mockData";
import { useAuth } from "@/lib/auth-context";
import type { Application } from "@/lib/types";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { AdminFormAssignment } from "@/components/admin-form-assignment";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login");
    }
  }, [user, router]);

  const [applications, setApplications] = useState(getApplications());
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState<"Passport" | "Medical Certificate" | "Emirates ID" | "Medical Fitness Certificate" | "Police Clearance Certificate" | "Immunization Records" | "Nursing License" | "Specialty Certification" | "Other">("Other");
  const [showObsForm, setShowObsForm] = useState(false);
  const [showEHSForm, setShowEHSForm] = useState(false);
  const [ehsStudentId, setEhsStudentId] = useState("");
  const [ehsProgramId, setEhsProgramId] = useState("");
  const [ehsReference, setEhsReference] = useState("");
  const [selectedSupervisorId, setSelectedSupervisorId] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [showFormAssignment, setShowFormAssignment] = useState(false);
  const [formAssignmentLoading, setFormAssignmentLoading] = useState(false);
  const [obsForm, setObsForm] = useState({
    name: "",
    description: "",
    requirements: "",
    length: "",
    instructor: "",
    timeline: "",
    location: "",
    price: "",
  });

  const getStudentName = (studentId: string): string => {
    const students = getStudents();
    const student = students.find(s => s.id === studentId);
    return student?.name || "Unknown Student";
  };

  const getSupervisorName = (supervisorId?: string) => {
    if (!supervisorId) return '—';
    const users = getUsers();
    const u = users.find(x => x.id === supervisorId);
    return u ? `${u.name} (${u.email})` : supervisorId;
  };

  const getStudentEmail = (studentId: string): string => {
    const students = getStudents();
    const student = students.find(s => s.id === studentId);
    return student?.email || "Unknown";
  };

  const handleIncludeInObservership = (appId: string) => {
    setActionInProgress(true);
    const app = applications.find(a => a.id === appId);
    // Enforcement: require supervisor confirmation for the program and regulatory Verified when applicable (DHA/DoH)
    const supConfirmed = app ? getSupervisorConfirmations().some(s => s.programId === app.programId && (s.studentId === app.studentId || !s.studentId)) : false;
    const regulatoryType = app?.regulatory?.type || "None";
    const regulatoryVerified = regulatoryType === "None" || app?.regulatory?.status === "Verified";

    if (!supConfirmed) {
      showToast("Cannot include in observership: no supervisor confirmation found for this application.");
      setActionInProgress(false);
      return;
    }

    if (!regulatoryVerified && (regulatoryType === "DHA" || regulatoryType === "DoH")) {
      showToast("Cannot include in observership: regulatory requirement not verified for this application.");
      setActionInProgress(false);
      return;
    }

    const updated = updateApplicationStatus(appId, "Approved", "Included in observership program");

    if (updated) {
      createNotification({
        userId: updated.studentId,
        type: "approval",
        title: "Observership Confirmed",
        message: `Congratulations! You have been included in the observership program. Please complete your onboarding to begin.`,
        relatedApplicationId: appId,
      });

      setApplications(applications.map(app => app.id === appId ? updated : app));
      setSelectedApp(updated);
    }
    setActionInProgress(false);
  };

  const handleAccept = (appId: string) => {
    setActionInProgress(true);
    const updated = updateApplicationStatus(appId, "Stage 2 Accepted", "Accepted by admin - awaiting form assignment");
    if (updated) {
      createNotification({
        userId: updated.studentId,
        type: "approval",
        title: "Application Accepted",
        message: `Your application has been accepted. Admin will assign observation forms for your sessions.`,
        relatedApplicationId: appId,
      });
      setApplications(applications.map(app => app.id === appId ? updated : app));
      setSelectedApp(updated);
      setShowFormAssignment(true);
    }
    setActionInProgress(false);
  };

  const handleDefer = (appId: string) => {
    setActionInProgress(true);
    const updated = updateApplicationStatus(appId, "Deferred", "Deferred for later review");
    if (updated) {
      createNotification({
        userId: updated.studentId,
        type: "update",
        title: "Application Deferred",
        message: `Your application has been deferred for further review. We will contact you with updates.`,
        relatedApplicationId: appId,
      });
      setApplications(applications.map(app => app.id === appId ? updated : app));
      setSelectedApp(updated);
    }
    setActionInProgress(false);
  };

  const handleDecline = (appId: string) => {
    setActionInProgress(true);
    const updated = updateApplicationStatus(appId, "Declined", "Declined by admin");
    if (updated) {
      createNotification({
        userId: updated.studentId,
        type: "rejection",
        title: "Application Declined",
        message: `We appreciate your interest. Unfortunately, your application was declined.`,
        relatedApplicationId: appId,
      });
      setApplications(applications.map(app => app.id === appId ? updated : app));
      setSelectedApp(updated);
    }
    setActionInProgress(false);
  };

  const handleWaitlist = (appId: string) => {
    setActionInProgress(true);
    const updated = updateApplicationStatus(appId, "Waitlisted", "Added to waitlist");
    
    if (updated) {
      createNotification({
        userId: updated.studentId,
        type: "update",
        title: "Waitlist Status",
        message: `Your application has been added to the waitlist. We will notify you if a spot becomes available.`,
        relatedApplicationId: appId,
      });

      setApplications(applications.map(app => app.id === appId ? updated : app));
      setSelectedApp(updated);
    }
    setActionInProgress(false);
  };

  const handleAssignForm = async (formData: { title: string; description: string; fields: any[] }) => {
    if (!selectedApp) return;

    try {
      setFormAssignmentLoading(true);
      
      // Create the observation form
      const newForm = createObservationForm({
        applicationId: selectedApp.id,
        programId: selectedApp.programId,
        hospitalId: selectedApp.hospitalId,
        title: formData.title,
        description: formData.description,
        fields: formData.fields,
        createdBy: user?.id || "admin",
        status: "active",
      });

      // Update application to include form reference
      const updated = updateApplicationStatus(selectedApp.id, "Stage 2 Accepted", `Form assigned: ${newForm.id}`);
      
      if (updated) {
        setApplications(applications.map(app => app.id === selectedApp.id ? updated : app));
        setSelectedApp(updated);
        setShowFormAssignment(false);
        showToast("Form assigned successfully. Student will see it in their next session.");
        
        createNotification({
          userId: selectedApp.studentId,
          type: "update",
          title: "Observation Form Ready",
          message: `Your observation form "${formData.title}" is ready. You'll fill it after each session.`,
          relatedApplicationId: selectedApp.id,
        });
      }
    } catch (error) {
      console.error("Error assigning form:", error);
      showToast("Failed to assign form");
    } finally {
      setFormAssignmentLoading(false);
    }
  };

  const handleReject = (appId: string) => {
    setActionInProgress(true);
    const updated = updateApplicationStatus(appId, "Rejected", rejectReason || "Application not accepted");
    
    if (updated) {
      createNotification({
        userId: updated.studentId,
        type: "rejection",
        title: "Application Status Update",
        message: `We appreciate your interest. Unfortunately, we were unable to accept your application at this time. ${rejectReason ? `Reason: ${rejectReason}` : ""}`,
        relatedApplicationId: appId,
      });

      setApplications(applications.map(app => app.id === appId ? updated : app));
      setSelectedApp(updated);
      setShowRejectModal(false);
      setRejectReason("");
    }
    setActionInProgress(false);
  };

  const handleRemoveApplication = (appId: string) => {
    const ok = deleteApplication(appId);
    if (ok) {
      setApplications(applications.filter(a => a.id !== appId));
      setSelectedApp(null);
    }
  };

  const handleUploadDocument = () => {
    if (!selectedApp || !docName) return;
    addDocument({
      applicationId: selectedApp.id,
      type: docType,
      fileName: docName,
      fileUrl: "#",
    });
    setDocName("");
  };

  const handleCreateObservership = () => {
    // Placeholder: save observership to storage
    console.log("Creating observership:", obsForm);
    // Reset form and close
    setObsForm({
      name: "",
      description: "",
      requirements: "",
      length: "",
      instructor: "",
      timeline: "",
      location: "",
      price: "",
    });
    setShowObsForm(false);
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  const panelClass = "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.5)]";
  const badge = (state: string) =>
    state === "Approved"
      ? "bg-emerald-500/15 text-emerald-100 border-emerald-400/30"
      : state === "Rejected"
        ? "bg-rose-500/15 text-rose-100 border-rose-400/30"
        : state === "Waitlisted"
          ? "bg-amber-500/15 text-amber-100 border-amber-400/30"
          : state === "Accepted"
            ? "bg-emerald-500/10 text-emerald-100 border-emerald-400/20"
            : state === "Deferred"
              ? "bg-yellow-500/10 text-amber-100 border-amber-400/20"
              : state === "Declined"
                ? "bg-rose-600/10 text-rose-100 border-rose-400/20"
                : "bg-cyan-500/15 text-cyan-100 border-cyan-400/30";

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* EHS Allocations quick links */}
        <div className="mb-6 flex gap-3">
          <Link href="/admin/hospital-confirmations" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-semibold shadow transition-all">
            <span>🔗</span> EHS Hospital Confirmations
          </Link>
          <Link href="/admin/ehs-audit" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-semibold shadow transition-all">
            <span>📜</span> EHS Audit
                    <Link href="/admin/form-tracking" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow transition-all">
                      <span>📋</span> Form Tracking
                    </Link>
          </Link>
          {process.env.NODE_ENV !== 'production' && (
            <button
              data-testid="run-scenario2-button"
              onClick={async () => {
                try {
                  showToast('Seeding demo data for Scenario 2...');
                  const base = window.location.origin;
                  const resp = await fetch(`${base}/api/test/seed`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ programId: mockPrograms?.[0]?.id || 'demo', hospitalId: mockHospitals?.[0]?.id || 'h1', seedExposure: true, seedSupervisor: true }),
                  });
                  const payload = await resp.json();
                  // Persist to localStorage to mimic test setup
                  if (payload.users) localStorage.setItem('electivio_users', JSON.stringify(payload.users));
                  if (payload.students) localStorage.setItem('electivio_students', JSON.stringify(payload.students));
                  if (payload.applications) localStorage.setItem('electivio_applications', JSON.stringify(payload.applications));
                  // set current user to student
                  const stu = payload.users?.find((u: any) => u.role === 'student') || payload.users?.[0];
                  if (stu) localStorage.setItem('electivio_current_user', JSON.stringify(stu));
                  showToast('Scenario 2 seeded — opening program page');
                  const programId = payload.programs?.[0]?.id || mockPrograms?.[0]?.id || 'demo';
                  router.push(`/programs/${programId}`);
                } catch (err) {
                  console.error('Scenario 2 seed failed', err);
                  showToast('Failed to seed Scenario 2 — check console');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow transition-all"
            >
              🚀 Run Scenario 2
            </button>
          )}
          <button
            onClick={async () => {
              try {
                const { exportAccreditationCSV } = await import('@/lib/auditStore');
                const csv = exportAccreditationCSV();
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `electivio_accreditation_${new Date().toISOString().slice(0,10)}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                try { (await import('@/lib/toast')).showToast('Export ready — download should begin shortly'); } catch {}
              } catch (err) {
                console.error('Export failed', err);
                try { (await import('@/lib/toast')).showToast('Export failed'); } catch {}
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow transition-all"
          >
            <span>⬇️</span> Export Accreditation CSV
          </button>
        </div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Admin Dashboard</h1>
            <p className="text-slate-300">Review and manage observership applications</p>
          </div>
          <div className="flex gap-4 flex-wrap justify-end">
            <button
              onClick={() => setShowObsForm(true)}
              className="px-6 py-2 rounded-lg bg-linear-to-r from-cyan-500 to-indigo-600 text-white font-semibold shadow-lg hover:from-cyan-400 hover:to-indigo-500 transition-all"
            >
              + Add Observership
            </button>
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="px-6 py-2 rounded-lg border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10 transition-colors font-semibold"
            >
              Logout
            </button>
            <Link
              href="/"
              className="px-6 py-2 rounded-lg border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10 transition-colors font-semibold"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className={`${panelClass}`}>
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-slate-100">Applications</h2>
              </div>
              {applications.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <p>No applications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className={`p-4 cursor-pointer transition-colors ${selectedApp?.id === app.id ? "bg-white/10" : "hover:bg-white/5"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-100">{getStudentName(app.studentId)}</p>
                          <p className="text-sm text-slate-300">{getStudentEmail(app.studentId)}</p>
                          <p className="text-xs text-slate-400 mt-1">{new Date(app.submissionDate).toLocaleDateString()}</p>
                          <div className="flex gap-2 mt-2">
                            {!app.regulatory || app.regulatory.type === 'None' ? (
                              <span className="text-amber-300 text-xs">No regulatory</span>
                            ) : app.regulatory.status !== 'Verified' ? (
                              <span className="text-yellow-300 text-xs">Regulatory: {app.regulatory.status || 'Pending'}</span>
                            ) : null}
                            {(!getSupervisorConfirmations().some(s => s.programId === app.programId && (s.studentId === app.studentId || !s.studentId))) && (
                              <span className="text-rose-300 text-xs">No supervisor confirmation</span>
                            )}
                            {getSupervisorConfirmations().some(s => s.programId === app.programId && !s.studentId) && (() => {
                              const prog = getSupervisorConfirmations().find(s => s.programId === app.programId && !s.studentId);
                              return (
                                <span className="text-cyan-300 text-xs">Program confirmed by {getSupervisorName(prog?.supervisorId)} on {prog ? new Date(prog.confirmedAt).toLocaleDateString() : ''}</span>
                              );
                            })()}
                            {app.supervisor && (
                              <span className="text-slate-300 text-xs">Supervisor: {getSupervisorName(app.supervisor)}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${badge(app.status)}`}>
                            {app.status === "Approved" ? "Included" : app.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            {selectedApp ? (
              <div className={`${panelClass} sticky top-8`}>
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-bold text-slate-100">Application Details</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Student Name</p>
                    <p className="font-semibold text-slate-100">{getStudentName(selectedApp.studentId)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Supervisor</p>
                    <p className="font-semibold text-slate-100">{getSupervisorName(selectedApp.supervisor)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Department</p>
                    <p className="font-semibold text-slate-100">{selectedApp.department || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100">Assign Supervisor & Department</p>
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      <div>
                        <label className="text-xs text-slate-300">Supervisor</label>
                        <select value={selectedSupervisorId} onChange={(e) => setSelectedSupervisorId(e.target.value)} className="w-full px-3 py-2 mt-1 border border-white/15 rounded-lg bg-white/5 text-slate-100">
                          <option value="">-- Select supervisor --</option>
                          {getUsers().filter(u => u.role === 'hospital' && u.hospitalId === selectedApp?.hospitalId).map(u => (
                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-300">Department</label>
                        <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full px-3 py-2 mt-1 border border-white/15 rounded-lg bg-white/5 text-slate-100">
                          <option value="">-- Select department --</option>
                          {(mockHospitals.find(h => h.id === selectedApp?.hospitalId)?.departments || []).map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button data-testid="confirm-program-button" onClick={() => {
                          if (!selectedApp) return;
                          if (!selectedSupervisorId && !selectedDepartment) {
                            showToast("Please select a supervisor or department before saving.");
                            return;
                          }
                          const supervisorValue = selectedSupervisorId || undefined;
                          const departmentValue = selectedDepartment || undefined;
                          const updated = setApplicationAssignment(selectedApp.id, { supervisor: supervisorValue, department: departmentValue });
                          if (updated) {
                            setApplications(applications.map(a => a.id === updated.id ? updated : a));
                            setSelectedApp(updated);
                            setSelectedSupervisorId("");
                            setSelectedDepartment("");
                            showToast(UI_COPY.admin.assignmentSaved);
                            try {
                              // Log audit and notify student
                              const { logAudit, createNotification, getStudents } = require('@/lib/storage');
                              const student = getStudents().find((s: any) => s.id === updated.studentId);
                              logAudit({ userId: updated.studentId, action: 'Assignment Updated', details: `Assigned supervisor ${supervisorValue || '-'} and department ${departmentValue || '-'} by admin` });
                              if (student) {
                                createNotification({ userId: student.id, type: 'update', title: 'Assignment Updated', message: `Your application for ${updated.programId} was assigned to ${supervisorValue || 'TBD'} in ${departmentValue || 'TBD'}`, relatedApplicationId: updated.id });
                              }
                            } catch (err) {
                              // ignore in demo
                            }
                          }
                        }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg" aria-label="Save assignment" title="Save selected supervisor and department">Save</button>

                        <button onClick={() => {
                          if (!selectedApp) return;
                          if (!selectedSupervisorId) {
                            showToast('Select a supervisor before confirming program-level supervision');
                            return;
                          }
                          try {
                            addSupervisorConfirmation({ supervisorId: selectedSupervisorId, programId: selectedApp.programId, dates: selectedApp.submissionDate || new Date().toISOString(), exposureBoundaries: selectedApp.notes || 'standard' });
                            showToast(UI_COPY.admin.programConfirmed);
                            try {
                              const { logAudit, createNotification, getUsers } = require('@/lib/storage');
                              logAudit({ userId: selectedApp.studentId, action: 'Program-level Confirmation', details: `Supervisor ${selectedSupervisorId} confirmed program ${selectedApp.programId}` });
                              const hospUsers = getUsers().filter((u: any) => u.role === 'hospital' && u.hospitalId === selectedApp.hospitalId);
                              hospUsers.forEach((hu: any) => createNotification({ userId: hu.id, type: 'update', title: 'Program Confirmed', message: `Program ${selectedApp.programId} has a supervisor confirmation`, relatedApplicationId: selectedApp.id }));
                            } catch (err) {
                              // ignore
                            }
                            setApplications(getApplications());
                          } catch (err) {
                            showToast('Error recording confirmation');
                          }
                        }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg" aria-label="Confirm program-level supervision" title="Record program-level supervisor confirmation">Confirm Program</button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex gap-2 items-center">
                      <button onClick={() => setShowEHSForm(true)} className="px-3 py-2 bg-indigo-600 text-white rounded" aria-label="Create EHS allocation" title="Create an EHS allocation for a student">{UI_COPY.admin.ehsAllocationButton}</button>
                      <div className="ml-2">
                        <label className="text-xs text-slate-300">Regulatory requirement</label>
                        <div className="flex gap-2 mt-1">
                          <select id="admin-regulatory-type" defaultValue={selectedApp?.regulatory?.type || 'None'} className="px-2 py-1 rounded bg-white/5 text-slate-100" onChange={(e) => {
                            const val = e.target.value as any;
                            try { (document.getElementById('admin-regulatory-type') as HTMLSelectElement).dataset.selected = val; } catch {}
                          }}>
                            <option value="None">None</option>
                            <option value="DHA">DHA</option>
                            <option value="DoH">DoH</option>
                          </select>
                          <button data-testid="require-regulatory-button" onClick={() => {
                            if (!selectedApp) return;
                            const sel = (document.getElementById('admin-regulatory-type') as HTMLSelectElement)?.value || 'None';
                            if (sel === 'None') {
                              showToast('Select a regulator to require');
                              return;
                            }
                            try {
                              const { setApplicationRegulatory, getApplications } = require('@/lib/storage');
                              const updated = setApplicationRegulatory(selectedApp.id, { type: sel, reference: undefined, status: 'Pending' });
                              if (updated) {
                                setApplications(getApplications());
                                setSelectedApp(updated);
                                showToast(`Marked ${sel} required — student will be prompted to provide reference`);
                              }
                            } catch (err) {
                              console.error(err);
                              showToast('Failed to mark regulatory requirement');
                            }
                          }} className="px-3 py-2 bg-amber-600 text-white rounded">Require Clearance</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Email</p>
                    <p className="font-semibold text-slate-100 break-all">{getStudentEmail(selectedApp.studentId)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Program</p>
                    <p className="font-semibold text-slate-100">{mockPrograms.find(p => p.id === selectedApp.programId)?.name || "Unknown Program"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${badge(selectedApp.status)}`}>
                      {selectedApp.status === "Approved" ? "Included" : selectedApp.status}
                    </span>
                  </div>
                  {selectedApp.notes && (
                    <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                      <p className="text-sm text-yellow-300 font-semibold mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Notes
                      </p>
                      <p className="text-yellow-100 text-sm leading-relaxed">{selectedApp.notes}</p>
                    </div>
                  )}
                  {selectedApp.status === "Submitted" && (
                    <div className="pt-4 border-t border-white/10 space-y-2">
                      <button data-testid="accept-application-button" onClick={() => handleAccept(selectedApp.id)} disabled={actionInProgress} className="w-full bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept Application
                      </button>
                      <button onClick={() => handleIncludeInObservership(selectedApp.id)} disabled={actionInProgress} className="w-full bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Include in Observership
                      </button>
                      <button onClick={() => handleDefer(selectedApp.id)} disabled={actionInProgress} className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center shadow-lg">
                        <Clock className="w-4 h-4 mr-2" />
                        Defer Application
                      </button>
                      <button onClick={() => handleDecline(selectedApp.id)} disabled={actionInProgress} className="w-full bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center shadow-lg">
                        <XCircle className="w-4 h-4 mr-2" />
                        Decline Application
                      </button>
                      <button onClick={() => handleRemoveApplication(selectedApp.id)} className="w-full border border-white/15 bg-white/5 hover:bg-white/10 text-slate-100 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center">
                        Remove Application
                      </button>
                    </div>
                  )}
                  {selectedApp.status === "Stage 2 Accepted" && (
                    <div className="pt-4 border-t border-white/10">
                      {!showFormAssignment ? (
                        <button
                          onClick={() => setShowFormAssignment(true)}
                          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Assign Observation Form
                        </button>
                      ) : (
                        <AdminFormAssignment
                          application={selectedApp}
                          onAssignForm={handleAssignForm}
                          loading={formAssignmentLoading}
                          existingForms={getObservationForms(selectedApp.id)}
                        />
                      )}
                    </div>
                  )}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <p className="text-sm font-semibold text-slate-100">Upload Document (admin)</p>
                    <div className="flex items-center gap-2">
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as typeof docType)}
                        className="border border-white/15 rounded-lg px-2 py-2 text-sm bg-white/5 text-slate-100"
                      >
                        {[
                          "Passport",
                          "Medical Certificate",
                          "Emirates ID",
                          "Medical Fitness Certificate",
                          "Police Clearance Certificate",
                          "Immunization Records",
                          "Nursing License",
                          "Specialty Certification",
                          "Other",
                        ].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <input value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="Document name" className="flex-1 border border-white/15 bg-white/5 text-slate-100 rounded-lg px-3 py-2 text-sm" />
                      <button onClick={handleUploadDocument} className="px-3 py-2 bg-linear-to-r from-cyan-500 to-indigo-600 text-white rounded-lg text-sm shadow-lg">Upload</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${panelClass} p-6 text-center text-slate-400`}>
                <p>Select an application to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Observership Modal */}
      {showObsForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900/95 border border-white/10 rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] max-w-2xl w-full p-6 my-8 text-slate-100">
            <h3 className="text-2xl font-bold mb-6">Add New Observership</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observership Name</label>
                <input
                  value={obsForm.name}
                  onChange={(e) => setObsForm({ ...obsForm, name: e.target.value })}
                  placeholder="e.g., Cardiology Observership"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={obsForm.description}
                  onChange={(e) => setObsForm({ ...obsForm, description: e.target.value })}
                  placeholder="Brief description of the observership program"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements (comma-separated)</label>
                <textarea
                  value={obsForm.requirements}
                  onChange={(e) => setObsForm({ ...obsForm, requirements: e.target.value })}
                  placeholder="e.g., Medical Degree, IELTS 7.0, Emirates ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                  <input
                    value={obsForm.length}
                    onChange={(e) => setObsForm({ ...obsForm, length: e.target.value })}
                    placeholder="e.g., 4 weeks"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
                  <input
                    value={obsForm.instructor}
                    onChange={(e) => setObsForm({ ...obsForm, instructor: e.target.value })}
                    placeholder="e.g., Dr. Ahmed Hassan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                  <input
                    value={obsForm.timeline}
                    onChange={(e) => setObsForm({ ...obsForm, timeline: e.target.value })}
                    placeholder="e.g., Jan 2026 - Feb 2026"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    value={obsForm.location}
                    onChange={(e) => setObsForm({ ...obsForm, location: e.target.value })}
                    placeholder="e.g., Dubai Healthcare City"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (AED)</label>
                <input
                  value={obsForm.price}
                  onChange={(e) => setObsForm({ ...obsForm, price: e.target.value })}
                  placeholder="e.g., 5000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowObsForm(false)}
                className="flex-1 px-4 py-2 border border-white/15 text-slate-100 rounded-lg hover:bg-white/10 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateObservership}
                className="flex-1 px-4 py-2 bg-linear-to-r from-cyan-500 to-indigo-600 text-white rounded-lg hover:from-cyan-400 hover:to-indigo-500 font-medium transition-colors shadow-lg"
              >
                Create Observership
              </button>
            </div>
          </div>
        </div>
      )}

      {showEHSForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900/95 border border-white/10 rounded-2xl shadow max-w-md w-full p-6 text-slate-100">
            <h3 className="text-2xl font-bold mb-4">Create EHS Allocation</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Student</label>
                <select value={ehsStudentId} onChange={(e) => setEhsStudentId(e.target.value)} className="w-full p-2 rounded bg-white/5 border border-white/10">
                  <option value="">-- Select student --</option>
                  {getStudents().map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Program</label>
                <select value={ehsProgramId} onChange={(e) => setEhsProgramId(e.target.value)} className="w-full p-2 rounded bg-white/5 border border-white/10">
                  <option value="">-- Select program --</option>
                  {mockPrograms.map(p => <option key={p.id} value={p.id}>{p.name} — {p.hospitalId}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">EHS Reference (optional)</label>
                <input value={ehsReference} onChange={(e) => setEhsReference(e.target.value)} className="w-full p-2 rounded bg-white/5 border border-white/10" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowEHSForm(false)} className="px-4 py-2 border border-white/15 rounded">Cancel</button>
              <button data-testid="create-ehs-allocation-button" onClick={() => {
                if (!ehsStudentId || !ehsProgramId) {
                  showToast('Select student and program');
                  return;
                }
                // create application with regulatory EHS and mark Verified as per scenario record
                const { createApplication } = require('@/lib/storage');
                const programAny = mockPrograms.find(p => p.id === ehsProgramId);
                const hospitalId = programAny?.hospitalId || '';
                const app = createApplication({ studentId: ehsStudentId, programId: ehsProgramId, hospitalId, regulatory: { type: 'EHS', reference: ehsReference || undefined, status: 'Verified' }, sessionCount: 1 });
                try {
                  const { createNotification, logAudit } = require('@/lib/storage');
                  createNotification({ userId: ehsStudentId, type: 'update', title: 'EHS Allocation Recorded', message: `Your allocation via EHS has been recorded for ${programAny?.name || ehsProgramId}`, relatedApplicationId: app.id });
                  logAudit({ userId: ehsStudentId, action: 'EHS Allocation', details: `Admin created EHS allocation for program ${ehsProgramId}` });
                } catch (err) {}
                setShowEHSForm(false);
                setEhsStudentId(''); setEhsProgramId(''); setEhsReference('');
                setApplications(getApplications());
                showToast('EHS allocation created');
              }} className="px-4 py-2 bg-green-600 text-white rounded">Create Allocation</button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900/95 border border-white/10 rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] max-w-md w-full p-6 text-slate-100">
            <h3 className="text-xl font-bold mb-4">Reject Application</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Reason for Rejection (Optional)</label>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Enter reason..." className="w-full px-3 py-2 border border-white/15 rounded-lg bg-white/5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-100" rows={4} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowRejectModal(false); setRejectReason(""); }} className="flex-1 px-4 py-2 border border-white/15 text-slate-100 rounded-lg hover:bg-white/10 font-medium transition-colors">
                Cancel
              </button>
              <button onClick={() => selectedApp && handleReject(selectedApp.id)} disabled={actionInProgress} className="flex-1 px-4 py-2 bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 shadow-lg">
                {actionInProgress ? "Processing..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
