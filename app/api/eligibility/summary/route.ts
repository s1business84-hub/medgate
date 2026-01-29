import { NextRequest, NextResponse } from "next/server";
import { updateEligibilityRecord, getEligibilityRecord, buildEligibilitySummary } from "@/lib/eligibility/server-store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");
  if (!studentId) {
    return NextResponse.json({ error: "Missing studentId" }, { status: 400 });
  }

  const record = getEligibilityRecord(studentId);
  if (!record) {
    return NextResponse.json({ summary: null }, { status: 200 });
  }

  return NextResponse.json({ summary: buildEligibilitySummary(record) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const studentId = body?.studentId as string | undefined;
    const complianceComplete = body?.complianceComplete as boolean | undefined;

    if (!studentId || typeof complianceComplete !== "boolean") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const record = updateEligibilityRecord(studentId, { complianceComplete });
    return NextResponse.json({ summary: buildEligibilitySummary(record) });
  } catch (error) {
    console.error("Eligibility summary update failed", error);
    return NextResponse.json({ error: "Eligibility summary update failed" }, { status: 500 });
  }
}
