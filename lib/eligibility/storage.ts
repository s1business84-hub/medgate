"use client";

import type { DocumentType, AiExtraction } from "@/lib/ai/document-ai-server";

export type EligibilitySummary = {
  eligibilityStatus: "ELIGIBLE" | "INCOMPLETE" | "REVIEW";
  documentsComplete: boolean;
  complianceComplete: boolean;
  documentStatuses: Record<DocumentType, { status: AiExtraction["status"]; confidence: number }>;
  updatedAt: string;
};

export const fetchEligibilitySummary = async (studentId: string): Promise<EligibilitySummary | null> => {
  if (!studentId) return null;
  const response = await fetch(`/api/eligibility/summary?studentId=${encodeURIComponent(studentId)}`);
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data?.summary ?? null;
};

export const updateComplianceSummary = async (
  studentId: string,
  complianceComplete: boolean
): Promise<EligibilitySummary | null> => {
  if (!studentId) return null;
  const response = await fetch("/api/eligibility/summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, complianceComplete }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data?.summary ?? null;
};

export const notifyEligibilityUpdated = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("eligibility-updated"));
};
