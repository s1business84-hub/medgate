import { NextResponse } from "next/server";
import { addExposureLog, getExposureLogs } from "@/lib/auditStore";

export async function POST(req: Request) {
  try {
    const { studentId, programId, exposureType, confirmed } = await req.json();

    if (!studentId || !programId) {
      return NextResponse.json({ error: "studentId and programId are required" }, { status: 400 });
    }

    // Pilot rule: exposure acknowledgement must be explicit and immutable per student+program
    const existing = getExposureLogs().find(e => e.studentId === studentId && e.programId === programId);
    if (existing) {
      return NextResponse.json({ error: "Exposure acknowledgement already recorded" }, { status: 409 });
    }

    const payload = addExposureLog({ studentId, programId, exposureType: exposureType || "Observation", confirmed: !!confirmed });
    return NextResponse.json({ ok: true, entry: payload }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to record exposure acknowledgement" }, { status: 500 });
  }
}

export async function GET() {
  // Lightweight read for debugging/audit view
  return NextResponse.json({ entries: getExposureLogs() });
}
