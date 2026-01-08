"use client";
import { useState } from "react";
import { ALLOW_EXPORT } from "@/lib/featureFlags";

export default function AccreditationPack() {
  const [csv, setCsv] = useState("");

  if (!ALLOW_EXPORT) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Accreditation Evidence Pack</h2>
        <p className="text-sm text-slate-500 mb-4">This export feature is disabled in the pilot build.</p>
      </div>
    );
  }

  const fetchPack = async () => {
    const res = await fetch('/api/admin/accreditation-export');
    if (!res.ok) {
      (await import('@/lib/toast')).showToast('Failed to fetch pack');
      return;
    }
    const text = await res.text();
    setCsv(text);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Accreditation Evidence Pack</h2>
      <p className="text-sm text-slate-500 mb-4">One-click export of trainee list, supervisors, and exposure acknowledgements.</p>
      <div className="flex gap-4 mb-4">
        <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={fetchPack}>Generate Pack</button>
        {csv && (
          <a className="px-4 py-2 bg-blue-600 text-white rounded" href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`} download={`accreditation-pack-${Date.now()}.csv`}>Download CSV</a>
        )}
      </div>
      {csv && <pre className="whitespace-pre-wrap bg-slate-50 p-4 rounded text-xs">{csv}</pre>}
    </div>
  );
}
