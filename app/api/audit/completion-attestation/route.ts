import { NextResponse } from "next/server";
import { addCompletionAttestation, getCompletionAttestations } from "@/lib/auditStore";

export async function POST(req: Request) {
  try {
    const { supervisorId, studentId, programId, dates, exposureType, notes } = await req.json();

    if (!supervisorId || !studentId || !programId || !dates || !exposureType) {
      return NextResponse.json({ error: "supervisorId, studentId, programId, dates, and exposureType are required" }, { status: 400 });
    }

    // Allow one attestation per student+program to keep records clean
    const existing = getCompletionAttestations().find(c => c.studentId === studentId && c.programId === programId);
    if (existing) {
      return NextResponse.json({ error: "Completion already attested for this student and program" }, { status: 409 });
    }

    const payload = addCompletionAttestation({ supervisorId, studentId, programId, dates, exposureType, notes });
    return NextResponse.json({ ok: true, entry: payload }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to record completion attestation" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ entries: getCompletionAttestations() });
}
