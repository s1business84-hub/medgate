"use client"

import { useState } from "react";
import { programs, hospitals } from "@/lib/mockData";
import { getProgramMetadata, setProgramMetadata } from "@/lib/storage";
import Link from "next/link";

export default function AdminProgramsPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ bestFor: "", notRecommendedFor: "", exposureLevel: "", limitations: "" });

  // when opening the editor, preload metadata synchronously from local storage
  const openEditor = (programId: string) => {
    const meta = getProgramMetadata(programId);
    setForm({
      bestFor: meta?.bestFor || "",
      notRecommendedFor: meta?.notRecommendedFor || "",
      exposureLevel: meta?.exposureLevel || "",
      limitations: meta?.limitations || "",
    });
    setEditingId(programId);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin — Program Metadata</h1>
          <Link href="/admin" className="text-sm text-slate-300 hover:underline">← Back</Link>
        </div>

        <div className="space-y-4">
          {programs.map((p) => (
            <div key={p.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.departmentName}</div>
                <div className="text-sm text-slate-400">{p.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-2 rounded-lg bg-cyan-600 text-white text-sm"
                  onClick={() => openEditor(p.id)}
                >
                  Edit Metadata
                </button>
              </div>
            </div>
          ))}
        </div>

        {editingId && (
          <div className="mt-8 p-6 rounded-lg bg-white/5 border border-white/10">
            <h2 className="font-semibold mb-4">Edit Program Metadata</h2>
            <label className="block text-sm text-slate-300">Best For</label>
            <input value={form.bestFor} onChange={(e) => setForm({...form, bestFor: e.target.value})} className="w-full mt-1 mb-3 p-2 rounded bg-slate-900 border border-white/10" />

            <label className="block text-sm text-slate-300">Not Recommended For</label>
            <input value={form.notRecommendedFor} onChange={(e) => setForm({...form, notRecommendedFor: e.target.value})} className="w-full mt-1 mb-3 p-2 rounded bg-slate-900 border border-white/10" />

            <label className="block text-sm text-slate-300">Exposure Level</label>
            <input value={form.exposureLevel} onChange={(e) => setForm({...form, exposureLevel: e.target.value})} className="w-full mt-1 mb-3 p-2 rounded bg-slate-900 border border-white/10" />

            <label className="block text-sm text-slate-300">Limitations</label>
            <textarea value={form.limitations} onChange={(e) => setForm({...form, limitations: e.target.value})} className="w-full mt-1 mb-3 p-2 rounded bg-slate-900 border border-white/10" />

            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded bg-emerald-600 text-white"
                onClick={() => {
                  setProgramMetadata(editingId, form);
                  setEditingId(null);
                }}
              >
                Save
              </button>
              <button className="px-4 py-2 rounded bg-white/5" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
