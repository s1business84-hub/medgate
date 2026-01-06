import { NextRequest, NextResponse } from "next/server";
import { addExposureLog } from "@/lib/auditStore";

export async function POST(req: NextRequest) {
  const { studentId, programId } = await req.json();
  if (!studentId || !programId) {
    return NextResponse.json({ error: "Missing student or program ID" }, { status: 400 });
  }
  const log = addExposureLog({ studentId, programId });
  return NextResponse.json({ success: true, log });
}
