"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { VoiceRecorder } from "@/components/voice-recorder";
import { ArrowLeft, Sparkles, Mic } from "lucide-react";
import Link from "next/link";
import { ObservationForm } from "@/lib/types";
import { getObservationForms, createSessionFormSubmission, getApplications } from "@/lib/storage";
import { showToast } from "@/lib/toast";

interface FormResponse {
  fieldId: string;
  value: string;
  voiceData?: Blob;
}

export default function FormResponsePage({ params }: { params: { formId: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<ObservationForm | null>(null);
  const [responses, setResponses] = useState<Record<string, FormResponse>>({});
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [useVoice, setUseVoice] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formProgress, setFormProgress] = useState(0);

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login");
      return;
    }

    // Get the form
    const applications = getApplications();
    const studentApps = applications.filter((a) => a.studentId === user.id);

    let foundForm: ObservationForm | null = null;
    for (const app of studentApps) {
      const appForms = getObservationForms(app.id);
      const targetForm = appForms.find((f) => f.id === params.formId);
      if (targetForm) {
        foundForm = targetForm;
        break;
      }
    }

    if (!foundForm) {
      showToast("Form not found");
      router.push("/student");
      return;
    }

    setForm(foundForm);
    setLoading(false);
  }, [user, router, params.formId]);

  const handleFieldChange = (fieldId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [fieldId]: { fieldId, value },
    }));
    updateProgress();
  };

  const handleVoiceSubmit = (fieldId: string, audioData: Blob, transcript: string) => {
    setResponses((prev) => ({
      ...prev,
      [fieldId]: { fieldId, value: transcript, voiceData: audioData },
    }));
    setUseVoice((prev) => ({ ...prev, [fieldId]: true }));
    updateProgress();
  };

  const updateProgress = () => {
    if (!form) return;
    const filled = Object.keys(responses).filter((key) => responses[key].value).length;
    const progress = Math.round((filled / form.fields.length) * 100);
    setFormProgress(progress);
  };

  const handleSubmitForm = async () => {
    if (!form || !user) return;

    // Validate required fields
    const requiredFields = form.fields.filter((f) => f.required);
    const missingRequired = requiredFields.filter((f) => !responses[f.id]?.value);

    if (missingRequired.length > 0) {
      showToast(`Please fill in required fields: ${missingRequired.map((f) => f.label).join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert responses to submission format
      const submissionResponses = Object.values(responses).map((r) => ({
        fieldId: r.fieldId,
        value: r.value,
      }));

      createSessionFormSubmission({
        sessionId: `session_${Date.now()}`,
        applicationId: form.applicationId,
        studentId: user.id,
        formId: form.id,
        responses: submissionResponses,
        status: "submitted",
      });

      showToast("Form submitted successfully!");
      setTimeout(() => router.push("/student"), 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      showToast("Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-indigo-900/20 to-slate-950 flex items-center justify-center">
        <LiquidParallax depth={14} className="opacity-70" />
        <p className="text-slate-300 relative z-10">Loading form...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-indigo-900/20 to-slate-950 flex items-center justify-center">
        <LiquidParallax depth={14} className="opacity-70" />
        <p className="text-slate-300 relative z-10">Form not found</p>
      </div>
    );
  }

  const currentField = form.fields[currentFieldIndex];

  return (
    <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-indigo-900/20 to-slate-950">
      <LiquidParallax depth={14} className="opacity-70" />

      <div className="max-w-2xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/student" className="p-2 rounded-lg hover:bg-white/10 transition">
            <ArrowLeft className="w-6 h-6 text-slate-300" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{form.title}</h1>
            <p className="text-slate-400">{form.description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-300">
              Question {currentFieldIndex + 1} of {form.fields.length}
            </span>
            <span className="text-sm font-bold text-indigo-300">{formProgress}% Complete</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-indigo-500 to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${formProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Form Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFieldIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-8 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-xl mb-6 min-h-64"
          >
            <h2 className="text-2xl font-bold text-white mb-2">{currentField.label}</h2>
            {currentField.helpText && (
              <p className="text-sm text-slate-400 mb-6">{currentField.helpText}</p>
            )}

            <div className="space-y-4">
              {currentField.type === "text" && (
                <input
                  type="text"
                  value={responses[currentField.id]?.value || ""}
                  onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
                  placeholder={currentField.placeholder}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-indigo-500 outline-none transition"
                />
              )}

              {currentField.type === "textarea" && (
                <>
                  <textarea
                    value={responses[currentField.id]?.value || ""}
                    onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
                    placeholder={currentField.placeholder}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-indigo-500 outline-none transition resize-none h-32"
                  />
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useVoice[currentField.id] || false}
                        onChange={(e) => setUseVoice((prev) => ({ ...prev, [currentField.id]: e.target.checked }))}
                        className="rounded"
                      />
                      Or record voice answer
                    </label>
                  </div>
                  {useVoice[currentField.id] && (
                    <VoiceRecorder
                      fieldId={currentField.id}
                      fieldLabel="Record your answer"
                      onSubmit={(audio, transcript) => handleVoiceSubmit(currentField.id, audio, transcript)}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </>
              )}

              {currentField.type === "rating" && (
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleFieldChange(currentField.id, String(rating))}
                      className={`w-12 h-12 rounded-lg font-bold transition ${
                        responses[currentField.id]?.value === String(rating)
                          ? "bg-indigo-500 text-white"
                          : "bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20"
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              )}

              {currentField.type === "select" && (
                <select
                  value={responses[currentField.id]?.value || ""}
                  onChange={(e) => handleFieldChange(currentField.id, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-indigo-500 outline-none transition"
                >
                  <option value="">Select an option...</option>
                  {currentField.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {currentField.type === "checkbox" && (
                <div className="space-y-2">
                  {currentField.options?.map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          responses[currentField.id]?.value.includes?.(option) ||
                          responses[currentField.id]?.value === option
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleFieldChange(currentField.id, option);
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-white">{option}</span>
                    </label>
                  ))}
                </div>
              )}


            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentFieldIndex(Math.max(0, currentFieldIndex - 1))}
            disabled={currentFieldIndex === 0}
            className="px-6 py-3 rounded-lg bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-500 text-white font-semibold transition"
          >
            Previous
          </button>

          {currentFieldIndex < form.fields.length - 1 ? (
            <button
              onClick={() => setCurrentFieldIndex(Math.min(form.fields.length - 1, currentFieldIndex + 1))}
              className="flex-1 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmitForm}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition"
            >
              {isSubmitting ? "Submitting..." : "Submit Form"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
