"use client";

import { Suspense } from "react";
import { StudentFormResponseContent } from "@/components/student-form-response-content";

export default function StudentFormResponsePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-slate-300">Loading form...</div></div>}>
      <StudentFormResponseContent />
    </Suspense>
  );
}

