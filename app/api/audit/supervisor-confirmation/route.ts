import { NextResponse } from "next/server";
import { addSupervisorConfirmation, getSupervisorConfirmations } from "@/lib/auditStore";

export async function POST(req: Request) {
  try {
    const { supervisorId, programId, studentId, dates, exposureBoundaries } = await req.json();

    if (!supervisorId || !programId || !dates || !exposureBoundaries) {
      return NextResponse.json({ error: "supervisorId, programId, dates, and exposureBoundaries are required" }, { status: 400 });
    }

    // Immutable per program + (optional) student
    const existing = getSupervisorConfirmations().find(s => s.programId === programId && (s.studentId ? s.studentId === studentId : !studentId));
    if (existing) {
      return NextResponse.json({ error: "Supervisor confirmation already recorded" }, { status: 409 });
    }

    const payload = addSupervisorConfirmation({ supervisorId, programId, dates, exposureBoundaries, studentId });
    return NextResponse.json({ ok: true, entry: payload }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to record supervisor confirmation" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ entries: getSupervisorConfirmations() });
}
