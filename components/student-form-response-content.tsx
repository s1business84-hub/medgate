"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Send, CheckCircle, Mic } from "lucide-react";
import Link from "next/link";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import { VoiceAnswerRecorder } from "@/components/voice-answer-recorder";

interface FormQuestion {
  id: string;
  type: "text" | "textarea" | "multiple-choice" | "rating";
  question: string;
  description?: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  maxLength?: number;
}

interface FormResponse {
  [questionId: string]: {
    answer: string;
    voiceUrl?: string;
    transcript?: string;
  };
}

export function StudentFormResponseContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");
  const applicationId = searchParams.get("applicationId");

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(null);
  const [responses, setResponses] = useState<FormResponse>({});
  const [useVoiceMode, setUseVoiceMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login");
      return;
    }

    // Mock form data - in production, fetch from API
    const mockForm = {
      id: formId || "form-1",
      title: "Clinical Assessment Form",
      description:
        "Please complete this clinical assessment by providing detailed answers to each question. You can use voice or text input.",
      questions: [
        {
          id: "q1",
          type: "text" as const,
          question: "What is your name?",
          required: true,
          placeholder: "Enter your full name",
        },
        {
          id: "q2",
          type: "textarea" as const,
          question:
            "Describe your clinical findings from the patient examination",
          required: true,
          placeholder: "Please describe your observations...",
          maxLength: 500,
        },
        {
          id: "q3",
          type: "rating" as const,
          question: "Rate your confidence level in the diagnosis",
          required: true,
        },
        {
          id: "q4",
          type: "multiple-choice" as const,
          question: "What was the primary diagnosis?",
          required: true,
          options: [
            "Option A",
            "Option B",
            "Option C",
            "Option D",
            "Uncertain",
          ],
        },
        {
          id: "q5",
          type: "textarea" as const,
          question: "What management plan would you recommend?",
          required: true,
          placeholder: "Describe your recommended management...",
          maxLength: 500,
        },
      ],
    };

    setForm(mockForm);
    setLoading(false);
  }, [user, router, formId]);

  const handleAnswerChange = (
    questionId: string,
    value: string | number | boolean
  ) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer: String(value),
      },
    }));
  };

  const handleVoiceAnswer = (answer: {
    questionId: string;
    voiceUrl?: string;
    transcript?: string;
    duration: number;
  }) => {
    setResponses((prev) => ({
      ...prev,
      [answer.questionId]: {
        answer: answer.transcript || "[Voice recording]",
        voiceUrl: answer.voiceUrl,
        transcript: answer.transcript,
      },
    }));
  };

  const validateResponses = () => {
    if (!form) return false;

    for (const question of form.questions) {
      if (
        question.required &&
        (!responses[question.id] || !responses[question.id].answer.trim())
      ) {
        return false;
      }
    }
    return true;
  };

  const submitResponses = async () => {
    if (!validateResponses()) {
      alert("Please answer all required questions");
      return;
    }

    setSubmitting(true);

    try {
      // In production, send to API endpoint
      const submissionData = {
        formId: form.id,
        applicationId,
        studentId: user?.id,
        submittedAt: new Date().toISOString(),
        responses,
      };

      console.log("Submitting form responses:", submissionData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitted(true);
      setTimeout(() => {
        router.push("/student");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-purple-900/20 to-slate-950 flex items-center justify-center">
        <LiquidParallax depth={14} className="opacity-70" />
        <p className="text-slate-300 relative z-10">Loading form...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-purple-900/20 to-slate-950 flex items-center justify-center">
        <LiquidParallax depth={14} className="opacity-70" />
        <p className="text-slate-300 relative z-10">Form not found</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-purple-900/20 to-slate-950 flex items-center justify-center">
        <LiquidParallax depth={14} className="opacity-70" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center space-y-6"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6 }}
            className="text-6xl"
          >
            <CheckCircle className="w-24 h-24 text-green-400 mx-auto" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Form Submitted Successfully!
            </h2>
            <p className="text-slate-300">
              Your responses have been recorded. Redirecting...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-purple-900/20 to-slate-950">
      <LiquidParallax depth={14} className="opacity-70" />

      <div className="max-w-3xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/student"
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <ArrowLeft className="w-6 h-6 text-slate-300" />
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">
              {form.title}
            </h1>
            <p className="text-slate-300">{form.description}</p>
          </div>
        </div>

        {/* Input Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-lg border border-purple-500/30 bg-purple-500/10 flex items-center justify-between"
        >
          <span className="text-white font-semibold">Input Mode:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setUseVoiceMode(false)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                !useVoiceMode
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-slate-300 hover:bg-white/20"
              }`}
            >
              Text
            </button>
            <button
              onClick={() => setUseVoiceMode(true)}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                useVoiceMode
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-slate-300 hover:bg-white/20"
              }`}
            >
              <Mic className="w-4 h-4" />
              Voice
            </button>
          </div>
        </motion.div>

        {/* Form Questions */}
        <div className="space-y-6">
          {form.questions.map((question: FormQuestion, idx: number) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <label className="block mb-4">
                <span className="text-lg font-semibold text-white">
                  {question.question}
                  {question.required && (
                    <span className="text-red-400 ml-1">*</span>
                  )}
                </span>
                {question.description && (
                  <p className="text-sm text-slate-400 mt-1">
                    {question.description}
                  </p>
                )}
              </label>

              {/* Voice Input Mode */}
              {useVoiceMode ? (
                <VoiceAnswerRecorder
                  questionId={question.id}
                  question={question.question}
                  onAnswerSaved={handleVoiceAnswer}
                />
              ) : (
                // Text Input Mode
                <>
                  {question.type === "text" && (
                    <input
                      type="text"
                      value={responses[question.id]?.answer || ""}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      placeholder={question.placeholder}
                      maxLength={question.maxLength}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-purple-500/50 focus:outline-none transition"
                    />
                  )}

                  {question.type === "textarea" && (
                    <textarea
                      value={responses[question.id]?.answer || ""}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      placeholder={question.placeholder}
                      maxLength={question.maxLength}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-purple-500/50 focus:outline-none transition resize-none"
                    />
                  )}

                  {question.type === "multiple-choice" && (
                    <div className="space-y-2">
                      {question.options?.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition"
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={
                              responses[question.id]?.answer === option
                            }
                            onChange={(e) =>
                              handleAnswerChange(question.id, e.target.value)
                            }
                            className="w-4 h-4 rounded-full accent-purple-500"
                          />
                          <span className="text-slate-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === "rating" && (
                    <div className="flex gap-2">
                      {Array.from({ length: 5 }, (_, i) => i + 1).map((rating) => (
                        <button
                          key={rating}
                          onClick={() =>
                            handleAnswerChange(question.id, rating)
                          }
                          className={`px-4 py-2 rounded-lg transition ${
                            responses[question.id]?.answer === String(rating)
                              ? "bg-purple-600 text-white"
                              : "bg-white/10 text-slate-300 hover:bg-white/20"
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Submit Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (form.questions.length + 1) * 0.1 }}
          onClick={submitResponses}
          disabled={submitting}
          className="w-full mt-8 px-6 py-4 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition"
        >
          {submitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white"
              />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Form
            </>
          )}
        </motion.button>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (form.questions.length + 2) * 0.1 }}
          className="mt-8 p-6 rounded-lg border border-cyan-500/30 bg-cyan-500/10"
        >
          <h3 className="font-semibold text-cyan-300 mb-2">
            💡 Tips for Voice Responses
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• Speak clearly and at a normal pace</li>
            <li>• Voice answers are transcribed automatically</li>
            <li>• You can re-record if you make a mistake</li>
            <li>• Both voice and text responses are submitted together</li>
            <li>• Ensure your microphone is working before recording</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
