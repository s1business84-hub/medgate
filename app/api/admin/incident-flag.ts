import { NextRequest, NextResponse } from "next/server";
import { addIncidentFlag } from "@/lib/auditStore";

export async function POST(req: NextRequest) {
  const { adminId, programId, note, severity } = await req.json();
  if (!adminId || !programId || !note) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const flag = addIncidentFlag({ adminId, programId, note, severity });
  return NextResponse.json({ success: true, flag });
}
