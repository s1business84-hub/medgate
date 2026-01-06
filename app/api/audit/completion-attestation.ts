import { NextRequest, NextResponse } from "next/server";
import { addCompletionAttestation } from "@/lib/auditStore";

export async function POST(req: NextRequest) {
  const { supervisorId, studentId, programId, dates, exposureType, notes } = await req.json();
  if (!supervisorId || !studentId || !programId || !dates || !exposureType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const attestation = addCompletionAttestation({ supervisorId, studentId, programId, dates, exposureType, notes });
  return NextResponse.json({ success: true, attestation });
}
