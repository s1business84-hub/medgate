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
  /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/, // 12/04/2026
  /\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b/, // 2026-04-12
  /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b/i,
];

let tesseractWorkerPromise: Promise<any> | null = null;

const getTesseractWorker = async () => {
  if (!tesseractWorkerPromise) {
    tesseractWorkerPromise = (async () => {
      const tesseract = await import("tesseract.js");
      const createWorker = (tesseract as any).createWorker;
      const worker: any = await createWorker({ logger: () => undefined });
      if (worker.loadLanguage) {
        await worker.loadLanguage("eng");
      }
      if (worker.initialize) {
        await worker.initialize("eng");
      } else if (worker.reinitialize) {
        await worker.reinitialize("eng");
      }
      return worker;
    })();
  }
  return tesseractWorkerPromise;
};

const runOcr = async (image: Blob | string) => {
  const worker = await getTesseractWorker();
  const { data } = await worker.recognize(image);
  return data.text || "";
};

const extractTextFromPdf = async (file: File) => {
  const pdfjsLib: any = await import("pdfjs-dist");
  const workerVersion = pdfjsLib?.version || "3.11.174";
  if (pdfjsLib?.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${workerVersion}/build/pdf.worker.min.js`;
  }

  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const page = await pdf.getPage(1);
  const textContent = await page.getTextContent();
  const text = textContent.items.map((item: any) => item.str || "").join(" ");
  const normalized = normalizeText(text);

  if (normalized.length > 40) {
    return text;
  }

  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return text;
  }
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: context, viewport }).promise;
  const imageDataUrl = canvas.toDataURL("image/png");
  return await runOcr(imageDataUrl);
};

export const extractTextFromFile = async (file: File) => {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return await extractTextFromPdf(file);
  }
  return await runOcr(file);
};

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
