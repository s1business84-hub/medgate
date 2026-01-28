"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { AIFormBuilder } from "@/components/ai-form-builder";
import { createObservationForm, getApplications } from "@/lib/storage";
import { showToast } from "@/lib/toast";
import { ObservationForm } from "@/lib/types";

export default function AIFormCreatorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [programId, setProgramId] = useState("");
  const [programs, setPrograms] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "staff") {
      router.push("/login");
      return;
    }

    // Get programs/applications for this hospital
    const applications = getApplications();
    const hospitalApps = applications.filter((a) => a.hospitalId === user.id);
    const uniquePrograms = [...new Set(hospitalApps.map((a) => a.programId))];
    setPrograms(uniquePrograms);
    setLoading(false);
  }, [user, router]);

  const handleFormGenerated = (form: any) => {
    console.log("Form generated:", form);
  };

  const handleSaveForm = async (form: any) => {
    if (!user || !programId) {
      showToast("Please select a program");
      return;
    }

    setIsSaving(true);
    try {
      const newForm: Omit<ObservationForm, "id"> = {
        applicationId: "", // Will be assigned per application
        programId,
        hospitalId: user.id,
        title: form.title,
        description: form.description,
        fields: form.fields,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user.id,
        status: "active",
      };

      // Get all applications for this program and hospital
      const applications = getApplications();
      const relevantApps = applications.filter(
        (a) => a.programId === programId && a.hospitalId === user.id
      );

      // Create the form for each application
      relevantApps.forEach((app) => {
        createObservationForm({
          ...newForm,
          applicationId: app.id,
        });
      });

      showToast(`Form created and assigned to ${relevantApps.length} student(s)!`);
      setTimeout(() => router.push("/hospital/forms"), 2000);
    } catch (error) {
      console.error("Error saving form:", error);
      showToast("Failed to save form");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-purple-900/20 to-slate-950 flex items-center justify-center">
        <LiquidParallax depth={14} className="opacity-70" />
        <p className="text-slate-300 relative z-10">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-purple-900/20 to-slate-950">
      <LiquidParallax depth={14} className="opacity-70" />

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/hospital/forms"
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <ArrowLeft className="w-6 h-6 text-slate-300" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-purple-400" />
              AI Form Creator
            </h1>
            <p className="text-slate-300">Generate medical assessment forms using GPT-4o</p>
          </div>
        </div>

        {/* Program Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl"
        >
          <label className="block text-sm font-semibold text-slate-300 mb-3">
            Select Program to Assign Form
          </label>
          <select
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-purple-500 outline-none transition"
          >
            <option value="">Choose a program...</option>
            {programs.map((programId) => (
              <option key={programId} value={programId}>
                {programId}
              </option>
            ))}
          </select>
          {!programId && (
            <p className="text-xs text-yellow-400 mt-2">
              ⚠️ Select a program first to assign the generated form to all students in that program
            </p>
          )}
        </motion.div>

        {/* AI Form Builder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-2xl border border-purple-500/20 bg-white/5 backdrop-blur-xl"
        >
          <AIFormBuilder
            onFormGenerated={handleFormGenerated}
            onSaveForm={async (form) => {
              await handleSaveForm(form);
            }}
          />
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 p-6 rounded-lg border border-cyan-500/30 bg-cyan-500/10"
        >
          <h3 className="font-semibold text-cyan-300 mb-2">💡 How It Works</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• Describe the form you want to create (e.g., "Cardiology assessment form")</li>
            <li>• Choose form type: Assessment, Observation, Feedback, or Checklist</li>
            <li>• Set difficulty level and medical specialty</li>
            <li>• AI generates form fields automatically</li>
            <li>• Review, edit, and customize fields as needed</li>
            <li>• Save to automatically assign to all students in the selected program</li>
            <li>• Students receive form and can submit answers via voice or text</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
