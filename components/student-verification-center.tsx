"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AiExtraction, DocumentType } from "@/lib/ai/document-ai-server";
import { notifyEligibilityUpdated, updateComplianceSummary } from "@/lib/eligibility/storage";

const DOCUMENT_DEFS = [
  {
    type: "student_id",
    label: "Student ID",
    description: "Proof of active student status",
    required: true,
    mimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    type: "passport",
    label: "Passport",
    description: "Government-issued ID",
    required: true,
    mimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    type: "enrollment_letter",
    label: "Enrollment Letter",
    description: "University confirmation of enrollment",
    required: true,
    mimeTypes: ["application/pdf"],
    accept: ".pdf",
  },
] as const;

const POLICY_ACKS = [
  "Observership scope (no hands-on care)",
  "Confidentiality / NDA",
  "Hospital policies acknowledgement",
  "Patient data handling acknowledgement",
  "Code of conduct",
] as const;

type UploadedDoc = {
  id: string;
  documentType: DocumentType;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  ai: AiExtraction & {
    summary: string;
  };
};

const formatBytes = (value: number) => {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

const validateFile = (documentType: DocumentType, file: File) => {
  const def = DOCUMENT_DEFS.find((doc) => doc.type === documentType);
  const errors: string[] = [];
  if (!def) return ["Unsupported document type."];

  if (!def.mimeTypes.some((mime) => mime === file.type)) {
    errors.push(`Invalid file type. Allowed: ${def.mimeTypes.join(", ")}`);
  }

  if (file.size < 1024) {
    errors.push("File is too small. Minimum size is 1 KB.");
  }

  if (file.size > 25 * 1024 * 1024) {
    errors.push("File is too large. Maximum size is 25 MB.");
  }

  return errors;
};

type VerificationCenterProps = {
  studentName?: string | null;
  studentEmail?: string | null;
  studentId?: string | null;
};

export function StudentVerificationCenter({ studentName, studentEmail, studentId }: VerificationCenterProps) {
  const [uploads, setUploads] = useState<Record<DocumentType, UploadedDoc | null>>({
    student_id: null,
    passport: null,
    enrollment_letter: null,
  });
  const [errors, setErrors] = useState<Record<DocumentType, string | null>>({
    student_id: null,
    passport: null,
    enrollment_letter: null,
  });
  const [processing, setProcessing] = useState<Record<DocumentType, boolean>>({
    student_id: false,
    passport: false,
    enrollment_letter: false,
  });
  const [acknowledgements, setAcknowledgements] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"before-start" | "verification">("before-start");

  useEffect(() => {
    setUploads({ student_id: null, passport: null, enrollment_letter: null });
    setAcknowledgements({});
  }, [studentId]);

  const completedDocuments = useMemo(() => {
    return Object.values(uploads).filter((doc) => doc && doc.ai.status !== "rejected" && doc.ai.status !== "processing").length;
  }, [uploads]);

  const hasDoc = (type: DocumentType) => Boolean(uploads[type] && uploads[type]?.ai.status !== "rejected" && uploads[type]?.ai.status !== "processing");

  const identityStatus = hasDoc("passport") ? "VERIFIED" : completedDocuments > 0 ? "REVIEW" : "PENDING";
  const studentStatus = hasDoc("student_id") || hasDoc("enrollment_letter") ? "VERIFIED" : completedDocuments > 0 ? "REVIEW" : "PENDING";
  const complianceComplete = POLICY_ACKS.every((policy) => acknowledgements[policy]);
  const documentsComplete = DOCUMENT_DEFS.every((doc) => hasDoc(doc.type));
  const hasProcessing = Object.values(processing).some(Boolean);
  const eligibilityStatus = documentsComplete && complianceComplete ? "ELIGIBLE" : hasProcessing ? "REVIEW" : "INCOMPLETE";

  useEffect(() => {
    if (!studentId) return;
    updateComplianceSummary(studentId, complianceComplete).then(() => {
      notifyEligibilityUpdated();
    });
  }, [studentId, complianceComplete]);

  const handleFileSelected = async (documentType: DocumentType, file: File | null) => {
    if (!file) return;
    if (!studentId) {
      setErrors((prev) => ({ ...prev, [documentType]: "Student session not found." }));
      return;
    }
    const validationErrors = validateFile(documentType, file);

    if (validationErrors.length > 0) {
      setErrors((prev) => ({ ...prev, [documentType]: validationErrors.join(" ") }));
      return;
    }

    setProcessing((prev) => ({ ...prev, [documentType]: true }));

    const optimisticDoc: UploadedDoc = {
      id: `${documentType}-${Date.now()}`,
      documentType,
      filename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      uploadedAt: new Date().toISOString(),
      ai: {
        status: "processing",
        confidence: 0,
        indicators: ["Processing document with OCR"],
        fields: {
          nameDetected: false,
          universityDetected: false,
          dateDetected: false,
        },
        summary: "Processing document with OCR...",
      },
    };

    setErrors((prev) => ({ ...prev, [documentType]: null }));
    setUploads((prev) => ({ ...prev, [documentType]: optimisticDoc }));

    try {
      const formData = new FormData();
      formData.append("documentType", documentType);
      formData.append("studentId", studentId);
      formData.append("file", file);

      const response = await fetch("/api/eligibility/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorPayload = await response.json();
        throw new Error(errorPayload?.error || "Upload failed");
      }

      const payload = await response.json();
      const analysis = payload?.analysis as UploadedDoc["ai"] | undefined;
      if (!analysis) {
        throw new Error("AI analysis missing");
      }

      const updatedDoc: UploadedDoc = {
        ...optimisticDoc,
        ai: analysis,
      };
      setUploads((prev) => ({ ...prev, [documentType]: updatedDoc }));
      notifyEligibilityUpdated();
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [documentType]: error instanceof Error ? error.message : "Document processing failed. Please try again.",
      }));
      setUploads((prev) => ({
        ...prev,
        [documentType]: {
          ...optimisticDoc,
          ai: {
            status: "review",
            confidence: 0.45,
            indicators: ["Server processing failed"],
            fields: {
              nameDetected: false,
              universityDetected: false,
              dateDetected: false,
            },
            summary: "AI could not extract text. Manual review required.",
          },
        },
      }));
    } finally {
      setProcessing((prev) => ({ ...prev, [documentType]: false }));
    }
  };

  const clearDocument = (documentType: DocumentType) => {
    setUploads((prev) => ({ ...prev, [documentType]: null }));
  };

  const toggleAcknowledgement = (policy: string) => {
    setAcknowledgements((prev) => ({ ...prev, [policy]: !prev[policy] }));
  };

  const statusBadge = (status: string) => {
    const styles = {
      VERIFIED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      REVIEW: "bg-amber-500/20 text-amber-200 border-amber-500/40",
      PENDING: "bg-slate-500/20 text-slate-300 border-slate-500/30",
      ELIGIBLE: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      INCOMPLETE: "bg-red-500/20 text-red-300 border-red-500/40",
      REJECTED: "bg-red-500/15 text-red-200 border-red-500/30",
      PROCESSING: "bg-indigo-500/15 text-indigo-200 border-indigo-500/30",
    } as const;

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles] || styles.PENDING}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-cyan-200 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Verification Checklist (Minimal Eligibility)
          </div>
          <h3 className="text-xl font-bold text-white mt-2">Upload documents and let AI pre-check your eligibility</h3>
          <p className="text-sm text-slate-300 mt-2">
            Documents are processed server-side for OCR and AI extraction. Only minimal eligibility metadata is stored.
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs text-slate-400">Student</p>
          <p className="text-sm font-semibold text-slate-100">{studentName || "Student"}</p>
          <p className="text-xs text-slate-400">{studentEmail || "student@medgate.com"}</p>
        </div>
      </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("before-start")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === "before-start"
                ? "bg-linear-to-r from-cyan-500 to-indigo-600 text-white shadow-lg"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            Before you get started
          </button>
          <button
            onClick={() => setActiveTab("verification")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === "verification"
                ? "bg-linear-to-r from-cyan-500 to-indigo-600 text-white shadow-lg"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            Verification
          </button>
        </div>

        {activeTab === "before-start" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-slate-100">Required policies</p>
              <p className="text-xs text-slate-400 mt-1">Please acknowledge each policy before moving forward.</p>
              <div className="mt-3 space-y-2">
                {POLICY_ACKS.map((policy) => (
                  <label key={policy} className="flex items-start gap-3 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 text-cyan-400"
                      checked={!!acknowledgements[policy]}
                      onChange={() => toggleAcknowledgement(policy)}
                    />
                    <span>{policy}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "verification" && (
          <>
            <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <FileCheck2 className="w-4 h-4 text-cyan-300" />
              Documents Uploaded
            </div>
            <span className="text-sm font-semibold text-slate-100">{completedDocuments} / {DOCUMENT_DEFS.length}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Required documents are needed to auto-match eligibility.</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <Sparkles className="w-4 h-4 text-purple-300" />
              AI Eligibility Status
            </div>
            {statusBadge(eligibilityStatus)}
          </div>
          <p className="text-xs text-slate-400 mt-2">Based on document completeness + policy acknowledgements.</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <Clock3 className="w-4 h-4 text-amber-300" />
              Last Update
            </div>
            <span className="text-xs text-slate-300">{new Date().toLocaleDateString()}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Files are processed on the server; only minimal eligibility metadata is stored.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-200">Upload required documents</h4>
          {DOCUMENT_DEFS.map((doc) => {
            const uploaded = uploads[doc.type];
            return (
              <div key={doc.type} className="rounded-lg border border-white/10 bg-slate-900/40 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{doc.label}</p>
                    <p className="text-xs text-slate-400 mt-1">{doc.description}</p>
                  </div>
                  <div>{uploaded ? statusBadge(uploaded.ai.status.toUpperCase()) : statusBadge("PENDING")}</div>
                </div>

                {uploaded ? (
                  <div className="mt-3 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium text-slate-200">{uploaded.filename}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-400">
                      <span>{uploaded.mimeType}</span>
                      <span>{formatBytes(uploaded.sizeBytes)}</span>
                      <span>Uploaded {new Date(uploaded.uploadedAt).toLocaleString()}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-white/20 text-slate-100" onClick={() => clearDocument(doc.type)}>
                        Replace
                      </Button>
                      <Button size="sm" variant="ghost" className="text-slate-400" onClick={() => clearDocument(doc.type)}>
                        Remove
                      </Button>
                    </div>
                    {processing[doc.type] && (
                      <div className="mt-2 text-[11px] text-indigo-200">Processing OCR…</div>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <UploadCloud className="w-4 h-4" />
                      <span className="font-medium">Select file</span>
                      <input
                        type="file"
                        accept={doc.accept}
                        className="hidden"
                        onChange={(event) => handleFileSelected(doc.type, event.target.files?.[0] ?? null)}
                      />
                    </label>
                    <span className="text-[11px] text-slate-500">Allowed: {doc.accept}</span>
                  </div>
                )}

                {errors[doc.type] && (
                  <div className="mt-3 flex items-start gap-2 text-xs text-red-300">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{errors[doc.type]}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-200">AI document preview</h4>
          <div className="space-y-3">
            {DOCUMENT_DEFS.map((doc) => {
              const uploaded = uploads[doc.type];
              return (
                <div key={`ai-${doc.type}`} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-100">{doc.label}</p>
                    {uploaded ? (
                      <span className="text-xs text-slate-400">Confidence {(uploaded.ai.confidence * 100).toFixed(0)}%</span>
                    ) : (
                      <span className="text-xs text-slate-500">Awaiting upload</span>
                    )}
                  </div>
                  {uploaded ? (
                    <div className="mt-2 text-xs text-slate-300 space-y-2">
                      <p className="text-slate-200">{uploaded.ai.summary}</p>
                      <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
                        <li>Detected fields: {uploaded.ai.fields.nameDetected ? "name" : ""}{uploaded.ai.fields.nameDetected && uploaded.ai.fields.universityDetected ? ", " : ""}{uploaded.ai.fields.universityDetected ? "university" : ""}{(uploaded.ai.fields.nameDetected || uploaded.ai.fields.universityDetected) && uploaded.ai.fields.dateDetected ? ", " : ""}{uploaded.ai.fields.dateDetected ? "dates" : ""}{!uploaded.ai.fields.nameDetected && !uploaded.ai.fields.universityDetected && !uploaded.ai.fields.dateDetected ? "none" : ""}</li>
                        <li>Indicators: {uploaded.ai.indicators.join(" • ")}</li>
                      </ul>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        {uploaded.ai.status === "verified" && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
                        {uploaded.ai.status === "review" && <Clock3 className="w-4 h-4 text-amber-300" />}
                        {uploaded.ai.status === "rejected" && <XCircle className="w-4 h-4 text-red-300" />}
                        <span>Status: {uploaded.ai.status}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">Upload this document to receive a preview.</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-white/10 bg-slate-900/40 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-100">Eligibility auto-match</p>
              {statusBadge(eligibilityStatus)}
            </div>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                {identityStatus === "VERIFIED" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                ) : (
                  <Clock3 className="w-4 h-4 text-amber-300" />
                )}
                Government ID uploaded (passport)
              </li>
              <li className="flex items-center gap-2">
                {studentStatus === "VERIFIED" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                ) : (
                  <Clock3 className="w-4 h-4 text-amber-300" />
                )}
                Student status proof (student ID or enrollment letter)
              </li>
              <li className="flex items-center gap-2">
                {documentsComplete ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                ) : (
                  <Clock3 className="w-4 h-4 text-amber-300" />
                )}
                Required documents complete
              </li>
              <li className="flex items-center gap-2">
                {complianceComplete ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                ) : (
                  <Clock3 className="w-4 h-4 text-amber-300" />
                )}
                Compliance acknowledgements signed
              </li>
            </ul>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
