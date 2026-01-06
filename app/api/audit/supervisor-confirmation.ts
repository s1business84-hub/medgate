import { NextRequest, NextResponse } from "next/server";
import { addSupervisorConfirmation } from "@/lib/auditStore";

export async function POST(req: NextRequest) {
  const { supervisorId, studentId, programId, dates, exposureBoundaries } = await req.json();
  if (!supervisorId || !programId || !dates || !exposureBoundaries) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const confirmation = addSupervisorConfirmation({ supervisorId, studentId, programId, dates, exposureBoundaries });
  return NextResponse.json({ success: true, confirmation });
}
