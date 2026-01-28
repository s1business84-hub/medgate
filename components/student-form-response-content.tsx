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
  const [suggestedCourses, setSuggestedCourses] = useState<any[]>([]);

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

      // AI-generated course suggestions based on responses
      const aiSuggestedCourses = [
        {
          id: "course-1",
          title: "Advanced Clinical Diagnosis",
          description: "Master the art of patient examination and clinical reasoning",
          duration: "4 weeks",
          level: "Intermediate",
          modules: [
            "Patient History Taking",
            "Physical Examination Techniques",
            "Diagnostic Reasoning",
            "Case Studies Analysis"
          ],
          instructor: "Dr. Sarah Mitchell",
          rating: 4.8,
          students: 2341,
          objectives: [
            "Develop comprehensive diagnostic skills",
            "Learn evidence-based clinical decision-making",
            "Practice with real patient scenarios",
            "Build confidence in patient interactions"
          ]
        },
        {
          id: "course-2",
          title: "Patient Management Strategies",
          description: "Comprehensive approach to developing effective treatment plans",
          duration: "6 weeks",
          level: "Advanced",
          modules: [
            "Treatment Planning",
            "Patient Communication",
            "Medication Management",
            "Follow-up Care Protocols"
          ],
          instructor: "Dr. James Chen",
          rating: 4.7,
          students: 1856,
          objectives: [
            "Create individualized management plans",
            "Communicate effectively with patients",
            "Monitor treatment progress",
            "Adapt strategies based on outcomes"
          ]
        },
        {
          id: "course-3",
          title: "Medical Observation Excellence",
          description: "Maximize learning from clinical observations and rotations",
          duration: "3 weeks",
          level: "Beginner",
          modules: [
            "Observation Best Practices",
            "Documentation Skills",
            "Clinical Note Writing",
            "Reflection and Learning"
          ],
          instructor: "Dr. Amira Al-Mansouri",
          rating: 4.9,
          students: 3102,
          objectives: [
            "Observe effectively during clinical rotations",
            "Document findings accurately",
            "Reflect on learning experiences",
            "Build clinical knowledge systematically"
          ]
        },
        {
          id: "course-4",
          title: "Emergency Medicine Essentials",
          description: "Critical skills for managing acute and emergency situations",
          duration: "5 weeks",
          level: "Advanced",
          modules: [
            "Triage Principles",
            "Life Support Techniques",
            "Emergency Procedures",
            "Crisis Management"
          ],
          instructor: "Dr. Mohammed Al-Kaabi",
          rating: 4.6,
          students: 1542,
          objectives: [
            "Respond effectively in emergencies",
            "Prioritize patient care",
            "Perform emergency procedures",
            "Work under pressure efficiently"
          ]
        }
      ];

      setSuggestedCourses(aiSuggestedCourses);
      setSubmitted(true);
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
      <div className="relative min-h-screen overflow-visible bg-linear-to-b from-slate-950 via-purple-900/20 to-slate-950">
        <LiquidParallax depth={14} className="opacity-70" />
        <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-4"
            >
              <CheckCircle className="w-24 h-24 text-green-400" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-2">
              Form Submitted Successfully!
            </h2>
            <p className="text-slate-300 text-lg">
              Your responses have been recorded. Here are AI-recommended courses to enhance your learning.
            </p>
          </motion.div>

          {/* Suggested Courses */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white mb-8">
              ✨ AI-Recommended Learning Paths
            </h3>
            
            {suggestedCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl border border-purple-500/30 bg-white/5 backdrop-blur-xl hover:border-purple-500/50 transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-2">{course.title}</h4>
                    <p className="text-slate-300 mb-3">{course.description}</p>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300">
                        {course.level}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300">
                        {course.duration}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300">
                        ⭐ {course.rating} ({course.students.toLocaleString()} students)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instructor */}
                <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-slate-400">Instructor</p>
                  <p className="text-white font-semibold">{course.instructor}</p>
                </div>

                {/* Learning Objectives */}
                <div className="mb-4">
                  <h5 className="text-white font-semibold mb-3">Learning Objectives</h5>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {course.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Course Modules */}
                <div className="mb-4">
                  <h5 className="text-white font-semibold mb-3">Course Modules</h5>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {course.modules.map((module, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-sm text-slate-300">{module}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => alert(`Enrolled in ${course.title}`)}
                    className="flex-1 px-4 py-3 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition"
                  >
                    Enroll Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => alert(`Added ${course.title} to wishlist`)}
                    className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 font-semibold transition"
                  >
                    Wishlist
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => router.push("/student")}
            className="mt-8 w-full px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition"
          >
            Back to Dashboard
          </motion.button>
        </div>
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
