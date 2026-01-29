import { NextRequest, NextResponse } from "next/server";
import { validateDocumentUpload, type DocumentUploadValidation } from "@/lib/security/document-verification";
import { evaluateDocumentText, extractTextFromImageBuffer, extractTextFromPdfBuffer, type DocumentType } from "@/lib/ai/document-ai-server";
import { updateEligibilityRecord, buildEligibilitySummary } from "@/lib/eligibility/server-store";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const documentType = formData.get("documentType")?.toString() as DocumentType | undefined;
    const studentId = formData.get("studentId")?.toString();
    const file = formData.get("file") as File | null;

    if (!documentType || !studentId || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const validation: DocumentUploadValidation = {
      documentType,
      filename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      fileBuffer: buffer.slice(0, 8),
    };

    const validationResult = validateDocumentUpload(validation);
    if (!validationResult.valid) {
      return NextResponse.json({ error: "Invalid file", details: validationResult.errors }, { status: 400 });
    }

    let extractedText = "";
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      extractedText = await extractTextFromPdfBuffer(buffer);
    } else {
      extractedText = await extractTextFromImageBuffer(buffer);
    }

    const analysis = evaluateDocumentText(documentType, extractedText);
    const summaryByStatus = {
      verified: "Document matches the minimum eligibility indicators.",
      review: "Document needs a quick manual review before approval.",
      rejected: "Document does not meet the minimum criteria. Please re-upload.",
      processing: "Processing document with OCR...",
    } as const;

    const current = updateEligibilityRecord(studentId, {});
    const record = updateEligibilityRecord(studentId, {
      documentStatuses: {
        ...current.documentStatuses,
        [documentType]: { status: analysis.status, confidence: analysis.confidence },
      },
    });

    const summary = buildEligibilitySummary(record);

    return NextResponse.json({
      document: {
        documentType,
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      },
      analysis: {
        ...analysis,
        summary: summaryByStatus[analysis.status],
      },
      summary,
    });
  } catch (error) {
    console.error("Eligibility analysis failed", error);
    return NextResponse.json({ error: "Eligibility analysis failed" }, { status: 500 });
  }
}
