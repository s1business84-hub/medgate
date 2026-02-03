import type { EligibilitySummary } from "@/lib/eligibility/storage";
import type { DocumentType } from "@/lib/ai/document-ai-server";

type EligibilityRecord = {
  documentStatuses: Record<DocumentType, { status: EligibilitySummary["documentStatuses"][DocumentType]["status"]; confidence: number }>;
  complianceComplete: boolean;
  updatedAt: string;
};

declare global {
  var __eligibilityStore: Map<string, EligibilityRecord> | undefined;
}

const store = globalThis.__eligibilityStore ?? new Map<string, EligibilityRecord>();
if (!globalThis.__eligibilityStore) {
  globalThis.__eligibilityStore = store;
}

export function getEligibilityRecord(studentId: string): EligibilityRecord | null {
  return store.get(studentId) ?? null;
}

export function updateEligibilityRecord(
  studentId: string,
  update: Partial<EligibilityRecord> & { documentStatuses?: EligibilityRecord["documentStatuses"] }
) {
  const existing = store.get(studentId) ?? {
    documentStatuses: {
      student_id: { status: "processing", confidence: 0 },
      passport: { status: "processing", confidence: 0 },
      enrollment_letter: { status: "processing", confidence: 0 },
    },
    complianceComplete: false,
    updatedAt: new Date().toISOString(),
  };

  const next: EligibilityRecord = {
    ...existing,
    ...update,
    documentStatuses: update.documentStatuses ?? existing.documentStatuses,
    updatedAt: new Date().toISOString(),
  };

  store.set(studentId, next);
  return next;
}

export function buildEligibilitySummary(record: EligibilityRecord): EligibilitySummary {
  const statuses = Object.values(record.documentStatuses);
  const documentsComplete = statuses.every(
    (doc) => doc.status !== "rejected" && doc.status !== "processing"
  );
  const hasReview = statuses.some((doc) => doc.status === "review");
  const eligibilityStatus: EligibilitySummary["eligibilityStatus"] = documentsComplete && record.complianceComplete
    ? "ELIGIBLE"
    : hasReview
    ? "REVIEW"
    : "INCOMPLETE";

  return {
    eligibilityStatus,
    documentsComplete,
    complianceComplete: record.complianceComplete,
    documentStatuses: record.documentStatuses,
    updatedAt: record.updatedAt,
  };
}
