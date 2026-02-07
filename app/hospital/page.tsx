"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import {
  getApplicationsByHospital,
  getStudents,
  updateApplicationStatus,
  createNotification,
  createObservationForm,
  getObservationForms,
  getStaffAlertsByHospital,
  createStaffAlert,
  markStaffAlertAsRead,
  getPendingApplicationAlerts,
} from "@/lib/storage";
import { getSupervisorConfirmations } from "@/lib/auditStore";
import { Application, StaffApplicationAlert, Student } from "@/lib/types";
import { CheckCircle, XCircle, FileText, Users, Clock, Plus, Bell } from "lucide-react";
import { showToast } from "@/lib/toast";
import { AuditExcelButton } from "@/components/audit-excel-button";
import { HospitalFormModal } from "@/components/hospital-form-modal";
import { StaffApplicationAlerts } from "@/components/staff-application-alerts";
import { ApplicationDecisionModal } from "@/components/application-decision-modal";
import { processApplicationDecision } from "@/lib/application-decision-service";

export default function HospitalPortal() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [staffAlerts, setStaffAlerts] = useState<StaffApplicationAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<StaffApplicationAlert | null>(null);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showObsForm, setShowObsForm] = useState(false);
  const [showAlerts, setShowAlerts] = useState(true);
  const [appFilter, setAppFilter] = useState<"all" | "approved" | "rejected" | "pending">("all");
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

  useEffect(() => {
    if (!user || user.role !== "staff") {
      router.push("/hospital-login");
      return;
    }
    queueMicrotask(() => setIsCheckingAuth(false));

    // Load applications and alerts for this hospital
    const hospitalApps = getApplicationsByHospital(user.hospitalId || "");
    const hospitalAlerts = getStaffAlertsByHospital(user.hospitalId || "");

    queueMicrotask(() => {
      setApplications(hospitalApps);
      setStaffAlerts(hospitalAlerts);
      setLoading(false);
    });
  }, [user, router]);

  const getStudentName = (studentId: string): string => {
    const students = getStudents();
    const student = students.find(s => s.id === studentId);
    return student?.name || "Unknown Student";
  };

  const getStudentEmail = (studentId: string): string => {
    const students = getStudents();
    const student = students.find(s => s.id === studentId);
    return student?.email || "Unknown";
  };

  const getStudentData = (studentId: string): Student | null => {
    const students = getStudents();
    return students.find(s => s.id === studentId) || null;
  };

  const handleDecisionModalOpen = (alert: StaffApplicationAlert) => {
    setSelectedAlert(alert);
    const app = applications.find(a => a.id === alert.applicationId);
    if (app) {
      setSelectedApp(app);
    }
    setShowDecisionModal(true);
  };

  const handleApplicationDecision = async (alertId: string, alert: StaffApplicationAlert) => {
    startTransition(async () => {
      try {
        // Mark alert as read
        markStaffAlertAsRead(alertId, user?.id || "");

        // Reload alerts
        const updatedAlerts = getStaffAlertsByHospital(user?.hospitalId || "");
        setStaffAlerts(updatedAlerts);

        showToast("Decision recorded. Student has been notified via email and app.");
      } catch (error) {
        console.error("Error processing decision:", error);
        showToast("Error processing decision");
      }
    });
  };

  const handleApproval = (appId: string) => {
    setActionInProgress(true);
    const app = applications.find(a => a.id === appId);
    // Enforcement: require supervisor confirmation and regulatory verification for DHA/DoH
    const supConfirmed = app ? getSupervisorConfirmations().some(s => s.programId === app.programId && (s.studentId === app.studentId || !s.studentId)) : false;
    const regulatoryType = app?.regulatory?.type || "None";
    const regulatoryVerified = regulatoryType === "None" || app?.regulatory?.status === "Verified";

    if (!supConfirmed) {
      showToast("Cannot approve application: no supervisor confirmation found for this application.");
      setActionInProgress(false);
      return;
    }

    if (!regulatoryVerified && (regulatoryType === "DHA" || regulatoryType === "DoH")) {
      showToast("Cannot approve application: regulatory requirement not verified for this application.");
      setActionInProgress(false);
      return;
    }

    const updated = updateApplicationStatus(appId, "Approved", "Application approved by hospital");

    if (updated) {
      // Create notification for student
      createNotification({
        userId: updated.studentId,
        type: "approval",
        title: "Application Approved",
        message: `Your observership application has been approved. Please complete your documentation and payment to confirm your participation.`,
        relatedApplicationId: appId,
      });

      // Update local state
      setApplications(applications.map(app => app.id === appId ? updated : app));
      setSelectedApp(updated);
    }
    setActionInProgress(false);
  };

  const handleRejection = (appId: string) => {
    if (!rejectionReason.trim()) {
      showToast("Please provide a reason for rejection");
      return;
    }

    setActionInProgress(true);
    const updated = updateApplicationStatus(appId, "Rejected", rejectionReason);

    if (updated) {
      // Create notification for student
      createNotification({
        userId: updated.studentId,
        type: "rejection",
        title: "Application Update",
        message: `Your application has been reviewed. Reason: ${rejectionReason}`,
        relatedApplicationId: appId,
      });

      // Update local state
      setApplications(applications.map(app => app.id === appId ? updated : app));
      setSelectedApp(updated);
      setShowRejectModal(false);
      setRejectionReason("");
    }
    setActionInProgress(false);
  };

  const handleCreateForm = async (formData: {
    title: string
    description: string
    fields: any[]
    sessionId: string
    sessionNumber: number
  }) => {
    if (!selectedApp) return

    try {
      const newForm = createObservationForm({
        applicationId: selectedApp.id,
        programId: selectedApp.programId,
        hospitalId: selectedApp.hospitalId || user?.hospitalId || "",
        sessionId: formData.sessionId,
        sessionNumber: formData.sessionNumber,
        title: formData.title,
        description: formData.description,
        fields: formData.fields,
        createdBy: user?.id || "hospital",
        status: 'active',
      })

      showToast(`Form "${formData.title}" created and assigned to Session ${formData.sessionNumber}`)
      setShowFormModal(false)

      // Create notification for student
      createNotification({
        userId: selectedApp.studentId,
        type: "update",
        title: "New Observation Form",
        message: `A new observation form "${formData.title}" has been assigned to your Session ${formData.sessionNumber}.`,
        relatedApplicationId: selectedApp.id,
      })
    } catch (error: any) {
      showToast(error.message || "Failed to create form")
      throw error
    }
  }

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

  if (!user || user.role !== "staff") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center">
        <LiquidParallax />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-950/50 to-black/70" />
        <div className="relative text-center">
          <div className="w-12 h-12 border-4 border-indigo-400/40 border-t-indigo-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (isCheckingAuth || loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center">
        <LiquidParallax />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-950/50 to-black/70" />
        <div className="relative text-center">
          <div className="w-12 h-12 border-4 border-indigo-400/40 border-t-indigo-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-950/50 to-black/70" />
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-20 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <AnimatedGradientText className="text-3xl font-bold">Hospital Portal</AnimatedGradientText>
            </h1>
            <p className="text-slate-300">Manage observership applications</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/hospital/forms"
              className="px-6 py-2 rounded-lg bg-cyan-600/90 hover:bg-cyan-600 text-white transition-colors font-medium shadow-sm flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Form Tracking
            </Link>
            <button
              onClick={() => setShowObsForm(true)}
              className="px-6 py-2 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white transition-colors font-medium shadow-sm"
            >
              + Add Observership
            </button>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-100 transition-colors font-medium border border-white/15"
            >
              Logout
            </button>
            <Link href="/" className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-100 transition-colors font-medium border border-white/15">
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Left Sidebar - Audit Card & Alerts Toggle */}
          <div className="lg:col-span-1 space-y-8">
            {/* Alerts Toggle Card */}
            {staffAlerts.length > 0 && (
              <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-xl shadow-lg p-6 sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <h3 className="font-semibold text-cyan-300">New Applications</h3>
                  </div>
                  <span className="text-cyan-400 font-bold">{getPendingApplicationAlerts(user?.hospitalId || "").length}</span>
                </div>
                <p className="text-xs text-cyan-200/70 mb-4">Click below to review and make decisions</p>
                <button
                  onClick={() => setShowAlerts(!showAlerts)}
                  className="w-full px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  {showAlerts ? "Hide Alerts" : "Show Alerts"}
                </button>
              </div>
            )}

            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg p-6 sticky top-32">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-2xl">📊</div>
                <h3 className="text-lg font-semibold text-white">Audit & Export</h3>
              </div>
              <p className="text-xs text-slate-300 mb-6">Download all training records, applications, and confirmations for compliance reporting and accreditation.</p>
              <div className="space-y-2">
                <AuditExcelButton
                  dataTypes={["all"]}
                  filterApplications={(apps) => apps.filter((a) => a.hospitalId === user.hospitalId)}
                  className="w-full border-white/15 bg-white/10 text-slate-100 hover:bg-white/20"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-14">
            {/* Application Alerts Section */}
            {showAlerts && staffAlerts.length > 0 && (
              <div className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border border-cyan-400/20 rounded-xl p-8">
                <StaffApplicationAlerts
                  alerts={staffAlerts}
                  staffId={user?.id || ""}
                  onApprove={(alertId) => {
                    const alert = staffAlerts.find(a => a.id === alertId);
                    if (alert) {
                      handleDecisionModalOpen(alert);
                    }
                  }}
                  onDecline={(alertId) => {
                    const alert = staffAlerts.find(a => a.id === alertId);
                    if (alert) {
                      handleDecisionModalOpen(alert);
                    }
                  }}
                  onWaitlist={(alertId) => {
                    const alert = staffAlerts.find(a => a.id === alertId);
                    if (alert) {
                      handleDecisionModalOpen(alert);
                    }
                  }}
                  onMarkAsRead={(alertId, staffId) => {
                    markStaffAlertAsRead(alertId, staffId);
                    const updatedAlerts = getStaffAlertsByHospital(user?.hospitalId || "");
                    setStaffAlerts(updatedAlerts);
                  }}
                  loading={loading}
                />
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stats */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg shadow p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm mb-2">Total Applications</p>
                    <p className="text-3xl font-bold text-slate-100">{applications.length}</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-400 opacity-30" />
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg shadow p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm mb-2">Pending Review</p>
                    <p className="text-3xl font-bold text-amber-400">
                      {applications.filter(a => a.status === "Submitted").length}
                    </p>
                  </div>
                  <Clock className="w-12 h-12 text-amber-400 opacity-30" />
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg shadow p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm mb-2">Approved</p>
                    <p className="text-3xl font-bold text-emerald-400">
                      {applications.filter(a => a.status === "Approved").length}
                    </p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-emerald-400 opacity-30" />
                </div>
              </div>

              <div 
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg shadow p-8 cursor-pointer hover:bg-white/10 transition-all duration-300 hover:border-cyan-400/30"
                onClick={() => setShowAlerts(!showAlerts)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm mb-2">New Alerts</p>
                    <p className="text-3xl font-bold text-cyan-400">
                      {staffAlerts.length}
                    </p>
                  </div>
                  <Bell className="w-12 h-12 text-cyan-400 opacity-30" />
                </div>
              </div>
            </div>

            {/* Applications and Details Grid */}
            <div className="grid md:grid-cols-3 gap-10">
              {/* Applications List */}
              <div className="md:col-span-2">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg shadow">
                  <div className="p-8 border-b border-white/10">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-xl font-bold text-slate-100">Applications</h2>
                    </div>
                    {/* Filter Tabs */}
                    <div className="flex gap-4 flex-wrap">
                      {[
                        { id: "all", label: "All", count: applications.length },
                        { id: "approved", label: "Approved", count: applications.filter(a => a.status === "Approved").length },
                        { id: "pending", label: "Pending", count: applications.filter(a => a.status === "Submitted").length },
                        { id: "rejected", label: "Rejected", count: applications.filter(a => a.status === "Rejected").length },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setAppFilter(tab.id as any)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            appFilter === tab.id
                              ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/50"
                              : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20"
                          }`}
                        >
                          {tab.label} ({tab.count})
                        </button>
                      ))}
                    </div>
                  </div>

                  {applications.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-40" />
                      <p>No applications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/10">
                      {applications
                        .filter((app) => {
                          if (appFilter === "all") return true;
                          if (appFilter === "approved") return app.status === "Approved";
                          if (appFilter === "pending") return app.status === "Submitted";
                          if (appFilter === "rejected") return app.status === "Rejected";
                          return true;
                        })
                        .map((app) => (
                        <div
                          key={app.id}
                          onClick={() => setSelectedApp(app)}
                          className={`p-6 cursor-pointer transition-colors border-b border-white/5 ${
                            selectedApp?.id === app.id ? "bg-indigo-950/40" : "hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-100">{getStudentName(app.studentId)}</p>
                              <p className="text-sm text-slate-300">{getStudentEmail(app.studentId)}</p>
                              <p className="text-xs text-slate-400 mt-1">
                                {new Date(app.submissionDate).toLocaleDateString()}
                              </p>
                              <div className="flex gap-2 mt-2">
                                {!app.regulatory || app.regulatory.type === 'None' ? (
                                  <span className="text-amber-300 text-xs">No regulatory</span>
                                ) : app.regulatory.status !== 'Verified' ? (
                                  <span className="text-yellow-300 text-xs">Regulatory: {app.regulatory.status || 'Pending'}</span>
                                ) : null}
                                {(!getSupervisorConfirmations().some(s => s.programId === app.programId && (s.studentId === app.studentId || !s.studentId))) && (
                                  <span className="text-rose-300 text-xs">No supervisor confirmation</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${
                                  app.status === "Approved"
                                    ? "bg-emerald-900/30 text-emerald-300 border-emerald-700/40"
                                    : app.status === "Rejected"
                                    ? "bg-red-900/30 text-red-300 border-red-700/40"
                                    : "bg-amber-900/30 text-amber-300 border-amber-700/40"
                                }`}
                              >
                                {app.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

          {/* Details Panel */}
          <div>
            {selectedApp ? (
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg shadow sticky top-8">
                <div className="p-8 border-b border-white/10">
                  <h3 className="text-lg font-bold text-slate-100">Application Details</h3>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">Student Name</p>
                    <p className="font-semibold text-slate-100 text-lg">{getStudentName(selectedApp.studentId)}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">Email</p>
                    <p className="font-semibold text-slate-100 break-all text-sm">{getStudentEmail(selectedApp.studentId)}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">Submission Date</p>
                    <p className="font-semibold text-slate-100">
                      {new Date(selectedApp.submissionDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${
                        selectedApp.status === "Approved"
                          ? "bg-emerald-900/30 text-emerald-300 border-emerald-700/40"
                          : selectedApp.status === "Rejected"
                          ? "bg-red-900/30 text-red-300 border-red-700/40"
                          : "bg-amber-900/30 text-amber-300 border-amber-700/40"
                      }`}
                    >
                      {selectedApp.status}
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

                  {/* Action Buttons */}
                  {selectedApp.status === "Submitted" && (
                    <div className="pt-8 border-t border-white/10 space-y-3">
                      <Button
                        onClick={() => handleApproval(selectedApp.id)}
                        disabled={actionInProgress}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2 inline" />
                        Approve Application
                      </Button>

                      <Button
                        onClick={() => setShowRejectModal(true)}
                        disabled={actionInProgress}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-2 inline" />
                        Reject Application
                      </Button>
                    </div>
                  )}

                  {/* Create Form Button - Available for Approved/In Training */}
                  {(selectedApp.status === "Approved" || selectedApp.status === "In Training" || selectedApp.status === "Stage 2 Accepted") && (
                    <div className="pt-8 border-t border-white/10">
                      <Button
                        onClick={() => setShowFormModal(true)}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2 inline" />
                        Create Observation Form
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg shadow p-6 text-center text-slate-400">
                <p>Select an application to view details</p>
              </div>
            )}
          </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Creation Modal */}
      {selectedApp && (
        <HospitalFormModal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          application={selectedApp}
          onSubmit={handleCreateForm}
          existingForms={getObservationForms(selectedApp.id)}
        />
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-xl bg-white/10 border border-white/15 rounded-lg shadow-lg max-w-md w-full p-6 text-slate-100">
            <h3 className="text-xl font-bold mb-4">Reject Application</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Reason for Rejection
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason (optional)"
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-100 placeholder-slate-400"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                className="flex-1 px-4 py-2 border border-white/20 text-slate-200 rounded-lg hover:bg-white/10 font-medium transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedApp && handleRejection(selectedApp.id)}
                disabled={actionInProgress}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                {actionInProgress ? "Processing..." : "Confirm Rejection"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Observership Modal */}
      {showObsForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="backdrop-blur-xl bg-white/10 border border-white/15 rounded-lg shadow-lg max-w-2xl w-full p-6 my-8 text-slate-100">
            <h3 className="text-2xl font-bold mb-6">Add New Observership</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Observership Name</label>
                <input
                  value={obsForm.name}
                  onChange={(e) => setObsForm({ ...obsForm, name: e.target.value })}
                  placeholder="e.g., Cardiology Observership"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
                <textarea
                  value={obsForm.description}
                  onChange={(e) => setObsForm({ ...obsForm, description: e.target.value })}
                  placeholder="Brief description of the observership program"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-400"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Requirements (comma-separated)</label>
                <textarea
                  value={obsForm.requirements}
                  onChange={(e) => setObsForm({ ...obsForm, requirements: e.target.value })}
                  placeholder="e.g., Medical Degree, IELTS 7.0, Emirates ID"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-400"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Length</label>
                  <input
                    value={obsForm.length}
                    onChange={(e) => setObsForm({ ...obsForm, length: e.target.value })}
                    placeholder="e.g., 4 weeks"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Instructor</label>
                  <input
                    value={obsForm.instructor}
                    onChange={(e) => setObsForm({ ...obsForm, instructor: e.target.value })}
                    placeholder="e.g., Dr. Ahmed Hassan"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Timeline</label>
                  <input
                    value={obsForm.timeline}
                    onChange={(e) => setObsForm({ ...obsForm, timeline: e.target.value })}
                    placeholder="e.g., Jan 2026 - Feb 2026"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Location</label>
                  <input
                    value={obsForm.location}
                    onChange={(e) => setObsForm({ ...obsForm, location: e.target.value })}
                    placeholder="e.g., Dubai Healthcare City"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Price (AED)</label>
                <input
                  value={obsForm.price}
                  onChange={(e) => setObsForm({ ...obsForm, price: e.target.value })}
                  placeholder="e.g., 5000"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-400"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowObsForm(false)}
                className="flex-1 px-4 py-2 border border-white/20 text-slate-200 rounded-lg hover:bg-white/10 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateObservership}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
              >
                Create Observership
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Decision Modal */}
      <ApplicationDecisionModal
        isOpen={showDecisionModal}
        onClose={() => {
          setShowDecisionModal(false);
          setSelectedAlert(null);
          setSelectedApp(null);
        }}
        alert={selectedAlert}
        application={selectedApp}
        student={selectedApp ? getStudentData(selectedApp.studentId) : null}
        staffId={user?.id || ""}
        onDecisionMade={() => {
          // Reload alerts and applications
          const updatedAlerts = getStaffAlertsByHospital(user?.hospitalId || "");
          const updatedApps = getApplicationsByHospital(user?.hospitalId || "");
          setStaffAlerts(updatedAlerts);
          setApplications(updatedApps);
          handleApplicationDecision(selectedAlert?.id || "", selectedAlert!);
        }}
        loading={isPending}
      />
    </div>
  );
}