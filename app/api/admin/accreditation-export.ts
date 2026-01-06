import { NextResponse } from "next/server";
import { exportAccreditationCSV } from "@/lib/auditStore";

export async function GET() {
  const csv = exportAccreditationCSV();
  return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv' } });
}
