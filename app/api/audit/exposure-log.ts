import { NextRequest, NextResponse } from "next/server";
import { addExposureLog } from "@/lib/auditStore";

export async function POST(req: NextRequest) {
  const { studentId, programId, exposureType, confirmed } = await req.json();
  if (!studentId || !programId) {
    return NextResponse.json({ error: "Missing student or program ID" }, { status: 400 });
  }
  if (!exposureType) {
    return NextResponse.json({ error: "Missing exposure type" }, { status: 400 });
  }
  if (!confirmed) {
    return NextResponse.json({ error: "Acknowledgement checkbox not confirmed" }, { status: 400 });
  }
  const log = addExposureLog({ studentId, programId, exposureType });
  return NextResponse.json({ success: true, log });
}
