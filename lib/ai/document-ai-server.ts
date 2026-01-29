export type DocumentType = "student_id" | "passport" | "enrollment_letter";

export type AiExtraction = {
  status: "verified" | "review" | "rejected" | "processing";
  confidence: number;
  indicators: string[];
  fields: {
    nameDetected: boolean;
    universityDetected: boolean;
    dateDetected: boolean;
  };
};

const normalizeText = (text: string) => text.replace(/\s+/g, " ").trim().toLowerCase();

const KEYWORDS: Record<DocumentType, string[]> = {
  student_id: ["student id", "student card", "university", "college", "faculty", "student"],
  passport: ["passport", "nationality", "date of birth", "surname", "given name"],
  enrollment_letter: ["enrollment", "enrolled", "university", "student", "admission", "academic"],
};

const DATE_PATTERNS = [
  /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/,
  /\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b/,
  /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b/i,
];

export const evaluateDocumentText = (documentType: DocumentType, text: string): AiExtraction => {
  const normalized = normalizeText(text);
  const keywords = KEYWORDS[documentType] || [];
  const matched = keywords.filter((keyword) => normalized.includes(keyword));
  const dateDetected = DATE_PATTERNS.some((pattern) => pattern.test(text));
  const nameDetected = normalized.includes("name") || normalized.includes("surname") || normalized.includes("given name");
  const universityDetected = normalized.includes("university") || normalized.includes("college") || normalized.includes("faculty");

  const confidenceBase = 0.4;
  const confidence = Math.min(confidenceBase + matched.length * 0.15 + (dateDetected ? 0.1 : 0), 0.95);
  const status = confidence >= 0.75 ? "verified" : confidence >= 0.55 ? "review" : "rejected";

  return {
    status,
    confidence,
    indicators: matched.length > 0 ? matched : ["No strong keyword matches"],
    fields: {
      nameDetected,
      universityDetected,
      dateDetected,
    },
  };
};

export const extractTextFromPdfBuffer = async (buffer: Uint8Array) => {
  const pdfjsLib: any = await import("pdfjs-dist");
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const page = await pdf.getPage(1);
  const textContent = await page.getTextContent();
  return textContent.items.map((item: any) => item.str || "").join(" ");
};

export const extractTextFromImageBuffer = async (buffer: Uint8Array) => {
  const tesseract: any = await import("tesseract.js");
  const result = await tesseract.recognize(buffer, "eng", { logger: () => undefined });
  return result?.data?.text || "";
};
