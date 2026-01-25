"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Question {
  id: string;
  text: string;
  options: string[];
}

interface Recommendation {
  programId: string;
  programName: string;
  hospitalName: string;
  matchScore: number;
  reason: string;
}

export function AIListingSuggestions() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const questions: Question[] = [
    {
      id: "specialty",
      text: "What medical specialty interests you most?",
      options: [
        "Cardiology",
        "Emergency Medicine",
        "General Surgery",
        "Neurology",
        "Pediatrics",
        "Radiology",
        "Internal Medicine",
        "Other",
      ],
    },
    {
      id: "location",
      text: "Where would you prefer to train?",
      options: [
        "Abu Dhabi",
        "Dubai",
        "Sharjah",
        "Other Emirates",
        "No preference",
      ],
    },
    {
      id: "duration",
      text: "How long can you commit?",
      options: [
        "1-2 weeks",
        "3-4 weeks",
        "1-2 months",
        "3-6 months",
        "6+ months",
      ],
    },
    {
      id: "experience",
      text: "What's your current level?",
      options: [
        "Pre-clinical (Years 1-2)",
        "Clinical (Years 3-4)",
        "Intern",
        "Resident",
        "Recent Graduate",
      ],
    },
  ];

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate recommendations based on answers
      generateRecommendations({ ...answers, [questionId]: answer });
    }
  };

  const generateRecommendations = (allAnswers: Record<string, string>) => {
    // Mock recommendation engine - in production, this would call an AI API
    const mockPrograms = [
      {
        programId: "cardio-001",
        programName: "Advanced Cardiac Imaging Fellowship",
        hospitalName: "Cleveland Clinic Abu Dhabi",
        specialty: "Cardiology",
        location: "Abu Dhabi",
        duration: "3-6 months",
        level: "Resident",
      },
      {
        programId: "em-002",
        programName: "Emergency Medicine Rotation",
        hospitalName: "Dubai Hospital",
        specialty: "Emergency Medicine",
        location: "Dubai",
        duration: "1-2 months",
        level: "Clinical (Years 3-4)",
      },
      {
        programId: "surg-003",
        programName: "General Surgery Observership",
        hospitalName: "Sheikh Khalifa Medical City",
        specialty: "General Surgery",
        location: "Abu Dhabi",
        duration: "1-2 weeks",
        level: "Clinical (Years 3-4)",
      },
      {
        programId: "neuro-004",
        programName: "Neurology Clinical Elective",
        hospitalName: "American Hospital Dubai",
        specialty: "Neurology",
        location: "Dubai",
        duration: "3-4 weeks",
        level: "Pre-clinical (Years 1-2)",
      },
      {
        programId: "peds-005",
        programName: "Pediatric Intensive Care Training",
        hospitalName: "Al Jalila Children's Hospital",
        specialty: "Pediatrics",
        location: "Dubai",
        duration: "1-2 months",
        level: "Intern",
      },
    ];

    // Calculate match scores
    const scored = mockPrograms.map((program) => {
      let score = 0;
      let reasons: string[] = [];

      if (program.specialty === allAnswers.specialty) {
        score += 40;
        reasons.push(`Matches your ${allAnswers.specialty} interest`);
      }

      if (program.location === allAnswers.location || allAnswers.location === "No preference") {
        score += 25;
        if (allAnswers.location !== "No preference") {
          reasons.push(`Located in ${allAnswers.location}`);
        }
      }

      if (program.duration === allAnswers.duration) {
        score += 20;
        reasons.push(`Fits your ${allAnswers.duration} timeframe`);
      }

      if (program.level === allAnswers.experience) {
        score += 15;
        reasons.push(`Suitable for ${allAnswers.experience} level`);
      }

      return {
        ...program,
        matchScore: score,
        reason: reasons.join(" • "),
      };
    });

    // Sort by match score and take top 3
    const topMatches = scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3)
      .map(({ programId, programName, hospitalName, matchScore, reason }) => ({
        programId,
        programName,
        hospitalName,
        matchScore,
        reason,
      }));

    setRecommendations(topMatches);
  };

  const resetChat = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendations([]);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setTimeout(resetChat, 300); // Reset after animation
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span>Get AI Program Suggestions</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />
      </motion.button>

      {/* Dialog */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={closeDialog}
            />

            {/* Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={closeDialog}
            >
              <div
                className="relative w-full max-w-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/20 rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">AI Program Finder</h2>
                      <p className="text-sm text-slate-400">Answer a few questions to get personalized recommendations</p>
                    </div>
                  </div>
                  <button
                    onClick={closeDialog}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
                  {recommendations.length === 0 ? (
                    // Questions Flow
                    <div className="space-y-6">
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-slate-400">
                          <span>Question {currentStep + 1} of {questions.length}</span>
                          <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>

                      {/* Current Question */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentStep}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <h3 className="text-xl font-semibold text-white mb-4">
                            {questions[currentStep].text}
                          </h3>
                          <div className="grid grid-cols-1 gap-3">
                            {questions[currentStep].options.map((option) => (
                              <motion.button
                                key={option}
                                onClick={() => handleAnswer(questions[currentStep].id, option)}
                                className="text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-200 group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-white font-medium">{option}</span>
                                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      {/* Back Button */}
                      {currentStep > 0 && (
                        <button
                          onClick={() => setCurrentStep(currentStep - 1)}
                          className="text-slate-400 hover:text-white transition-colors text-sm"
                        >
                          ← Back to previous question
                        </button>
                      )}
                    </div>
                  ) : (
                    // Recommendations
                    <div className="space-y-6">
                      <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div className="text-sm text-slate-300">
                          <p className="font-semibold text-blue-300 mb-1">Based on your preferences:</p>
                          <ul className="space-y-1 text-xs">
                            <li>• Specialty: {answers.specialty}</li>
                            <li>• Location: {answers.location}</li>
                            <li>• Duration: {answers.duration}</li>
                            <li>• Level: {answers.experience}</li>
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Top Matches for You</h3>
                        {recommendations.map((rec, idx) => (
                          <motion.div
                            key={rec.programId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-4 rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:border-purple-500/50 transition-all"
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-2xl font-bold text-purple-400">#{idx + 1}</span>
                                  <div className="px-2 py-1 bg-purple-500/20 rounded text-xs font-semibold text-purple-300">
                                    {rec.matchScore}% Match
                                  </div>
                                </div>
                                <h4 className="text-lg font-semibold text-white mb-1">{rec.programName}</h4>
                                <p className="text-sm text-slate-400 mb-2">{rec.hospitalName}</p>
                                {rec.reason && (
                                  <p className="text-xs text-slate-500">{rec.reason}</p>
                                )}
                              </div>
                            </div>
                            <Link
                              href={`/programs/${rec.programId}`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-semibold rounded-lg transition-all"
                            >
                              View Program Details
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </motion.div>
                        ))}
                      </div>

                      <button
                        onClick={resetChat}
                        className="w-full py-3 border border-white/20 hover:bg-white/5 text-white rounded-lg transition-colors"
                      >
                        Start Over
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
