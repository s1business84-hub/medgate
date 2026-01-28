"use client";

import { useState } from "react";
import { motion, cubicBezier, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Award, Brain, TrendingUp, Sparkles, ChevronRight, AlertCircle, X } from "lucide-react";
import { LiquidParallax } from "@/components/ui/liquid-parallax";

export default function StudentDemoPage() {
  const router = useRouter();
  const [showAI, setShowAI] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [xpPoints] = useState(65); // Demo XP value
  const [selectedProgramData, setSelectedProgramData] = useState<any>(null);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: cubicBezier(0.16, 1, 0.3, 1) },
    },
  };

  const samplePrograms = [
    {
      id: 1,
      name: "Clinical Research Fellowship",
      institution: "Medical University of Vienna",
      status: "In Progress",
      progress: 65,
      icon: "🔬",
    },
    {
      id: 2,
      name: "Advanced Surgery Certification",
      institution: "ETH Zurich",
      status: "Completed",
      progress: 100,
      icon: "🏥",
    },
    {
      id: 3,
      name: "Healthcare Management Program",
      institution: "University of Bern",
      status: "Not Started",
      progress: 0,
      icon: "📊",
    },
  ];

  const questions = [
    {
      id: "specialty",
      text: "What medical specialty interests you most?",
      options: ["Cardiology", "Emergency Medicine", "General Surgery", "Neurology", "Pediatrics", "Radiology", "Internal Medicine"],
    },
    {
      id: "location",
      text: "Where would you prefer to train?",
      options: ["Abu Dhabi", "Dubai", "Sharjah", "Other Emirates"],
    },
    {
      id: "duration",
      text: "How long can you commit?",
      options: ["1-2 weeks", "3-4 weeks", "1-2 months", "3-6 months"],
    },
  ];

  const demoPrograms = [
    {
      id: "cardio-001",
      name: "Advanced Cardiac Imaging Fellowship",
      institution: "Cleveland Clinic Abu Dhabi",
      specialty: "Cardiology",
      location: "Abu Dhabi",
      duration: "3-6 months",
      description: "Intensive fellowship focusing on advanced cardiac imaging techniques including echocardiography, CT, and MRI protocols.",
      requirements: ["USMLE/PLAB certification", "Cardiology experience preferred", "English proficiency"],
      startDate: "March 2026",
      applicationDeadline: "February 15, 2026",
    },
    {
      id: "em-002",
      name: "Emergency Medicine Rotation",
      institution: "Dubai Hospital",
      specialty: "Emergency Medicine",
      location: "Dubai",
      duration: "1-2 months",
      description: "Comprehensive EM rotation covering trauma, critical cases, and emergency procedures.",
      requirements: ["Medical degree or equivalent", "Current vaccination records", "Travel arrangements"],
      startDate: "February 2026",
      applicationDeadline: "January 31, 2026",
    },
    {
      id: "surg-003",
      name: "General Surgery Observership",
      institution: "Sheikh Khalifa Medical City",
      specialty: "General Surgery",
      location: "Abu Dhabi",
      duration: "1-2 weeks",
      description: "Observership program for clinical students to observe diverse surgical procedures and OR protocols.",
      requirements: ["Current medical student status", "Proof of enrollment", "Liability insurance"],
      startDate: "Monthly intake",
      applicationDeadline: "2 weeks before start date",
    },
  ];

  const handleAnswer = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Show matching program based on answers
      const specialty = newAnswers.specialty?.toLowerCase();
      let matchedProgram = demoPrograms[0]; // Default
      
      if (specialty?.includes("surgery")) {
        matchedProgram = demoPrograms[2];
      } else if (specialty?.includes("cardiology")) {
        matchedProgram = demoPrograms[0];
      } else if (specialty?.includes("emergency")) {
        matchedProgram = demoPrograms[1];
      }
      
      setSelectedProgram(matchedProgram);
    }
  };

  const handleViewProgram = () => {
    if (selectedProgram) {
      router.push("/programs");
    }
  };

  const resetAI = () => {
    setCurrentStep(0);
    setAnswers({});
    setSelectedProgram(null);
  };

  const closeAI = () => {
    setShowAI(false);
    setTimeout(resetAI, 300);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-950/50 to-black/70" />

      <motion.div
        className="relative max-w-6xl mx-auto px-4 py-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-8">
          <Link href="/login">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Student Portal Demo
              </h1>
              <p className="text-xl text-slate-300">
                Welcome to your medical education dashboard. Track your progress across multiple programs and institutions.
              </p>
            </div>
            {/* Level & XP Display */}
            <div className="flex items-center gap-3 bg-linear-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-lg">
              <div>
                <p className="text-xs text-purple-100">Level {Math.ceil(xpPoints / 100) + 1}</p>
                <p className="font-bold text-white">{xpPoints} XP</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-purple-100">{100 - (xpPoints % 100)} XP to next level</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: BookOpen, label: "Active Programs", value: "3", color: "from-blue-500 to-cyan-500" },
            { icon: Award, label: "Certifications", value: "2", color: "from-purple-500 to-pink-500" },
            { icon: Brain, label: "Learning Hours", value: "245", color: "from-green-500 to-emerald-500" },
            { icon: TrendingUp, label: "Avg. Progress", value: "55%", color: "from-orange-500 to-red-500" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`rounded-xl border border-white/10 bg-linear-to-br ${stat.color}/10 p-6 backdrop-blur-sm hover:border-white/20 transition-colors`}
            >
              <stat.icon className="w-6 h-6 mb-3 text-white" />
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Programs Section */}
        <motion.div variants={itemVariants}>
          {/* XP System Disclaimer */}
          <div className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm mb-6">
            <p className="text-sm text-yellow-200 flex items-start gap-2">
              <span className="text-lg">💡</span>
              <span>
                <strong>How XP increases:</strong> Earn +10 XP per form completion, +5 XP per application submission, +15 XP per program completion, +20 XP per certification earned, and +3 XP per reflection logged. Reach 100 XP to advance to the next level!
              </span>
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-6">Your Programs</h2>
          <div className="space-y-4">
            {samplePrograms.map((program, idx) => (
              <motion.div
                key={program.id}
                onClick={() => setSelectedProgramData(program)}
                variants={itemVariants}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{program.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{program.name}</h3>
                      <p className="text-slate-400 text-sm">{program.institution}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      program.status === "Completed"
                        ? "bg-green-500/20 text-green-300"
                        : program.status === "In Progress"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-slate-500/20 text-slate-300"
                    }`}
                  >
                    {program.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="bg-slate-700/50 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-linear-to-r from-cyan-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${program.progress}%` }}
                    transition={{ duration: 1, delay: idx * 0.2 }}
                  />
                </div>
                <p className="text-slate-400 text-sm mt-2">{program.progress}% Complete</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Program Details Modal when clicked */}
        {selectedProgramData && (
          <motion.div 
            variants={itemVariants}
            className="mt-12 p-8 rounded-2xl border border-purple-500/30 bg-purple-500/10 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedProgramData.name}</h2>
              <button
                onClick={() => setSelectedProgramData(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Progress Section */}
            <div className="space-y-4 mb-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-300">Overall Progress</span>
                  <span className="text-sm font-bold text-purple-300">{selectedProgramData.progress}%</span>
                </div>
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-linear-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedProgramData.progress}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              {/* Form Completion */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-300">Form Completion</span>
                  <span className="text-sm font-bold text-blue-300">{Math.round(selectedProgramData.progress * 0.8)}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-linear-to-r from-blue-500 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(selectedProgramData.progress * 0.8)}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>

              {/* Module Completion */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-300">Module Completion</span>
                  <span className="text-sm font-bold text-emerald-300">{Math.round(selectedProgramData.progress * 1.1)}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-linear-to-r from-emerald-500 to-teal-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(Math.min(selectedProgramData.progress * 1.1, 100))}%` }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-slate-400 mb-1">Status</p>
                <p className="text-white font-semibold">{selectedProgramData.status}</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-slate-400 mb-1">Institution</p>
                <p className="text-white font-semibold text-sm">{selectedProgramData.institution}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedProgramData(null)}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
            >
              Close Details
            </button>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div variants={itemVariants} className="mt-12 text-center space-y-6">
          <p className="text-slate-400 mb-4">This is a demo of the student portal. Start by creating an account or logging in.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowAI(true)}
              className="group relative px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Find Your Perfect Program</span>
              </div>
            </button>
            
            <Link href="/login">
              <button className="px-8 py-3 rounded-lg bg-linear-to-r from-cyan-500 to-blue-500 font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                Go Back to Login
              </button>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* AI Dialog */}
      <AnimatePresence>
        {showAI && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={closeAI}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={closeAI}
            >
              <div
                className="relative w-full max-w-2xl bg-linear-to-br from-slate-900 to-slate-950 border border-white/20 rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">AI Program Finder</h2>
                      <p className="text-sm text-slate-400">Answer a few questions to find your ideal program</p>
                    </div>
                  </div>
                  <button
                    onClick={closeAI}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
                  {selectedProgram ? (
                    // Program Details View
                    <div className="space-y-6">
                      <button
                        onClick={() => {
                          setSelectedProgram(null);
                          setCurrentStep(0);
                          setAnswers({});
                        }}
                        className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                      >
                        ← Try another program
                      </button>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{selectedProgram.name}</h3>
                          <p className="text-lg text-slate-300 mb-4">{selectedProgram.institution}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-xs text-slate-400 mb-1">Specialty</p>
                            <p className="text-white font-semibold">{selectedProgram.specialty}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-xs text-slate-400 mb-1">Location</p>
                            <p className="text-white font-semibold">{selectedProgram.location}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-xs text-slate-400 mb-1">Duration</p>
                            <p className="text-white font-semibold">{selectedProgram.duration}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-xs text-slate-400 mb-1">Type</p>
                            <p className="text-white font-semibold">Observership</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">About the Program</h4>
                          <p className="text-slate-300 leading-relaxed">{selectedProgram.description}</p>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Requirements</h4>
                          <ul className="space-y-2">
                            {selectedProgram.requirements?.map((req: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-3 text-slate-300">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 text-xs mt-0.5 shrink-0">✓</span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <p className="text-xs text-slate-400 mb-1">Start Date</p>
                            <p className="text-blue-300 font-semibold">{selectedProgram.startDate}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <p className="text-xs text-slate-400 mb-1">Application Deadline</p>
                            <p className="text-orange-300 font-semibold">{selectedProgram.applicationDeadline}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                            <div className="text-left text-sm text-slate-300">
                              <p className="font-semibold text-yellow-300 mb-2">Demo Disclaimer:</p>
                              <p className="text-xs">This is a sample program for demonstration purposes. Create an account to browse real programs and submit applications.</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={() => {
                              setShowAI(false);
                              setTimeout(resetAI, 300);
                              router.push("/programs");
                            }}
                            className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all"
                          >
                            Browse Real Programs
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : currentStep === questions.length && Object.keys(answers).length === questions.length ? (
                    // This condition shouldn't be reached now since we set selectedProgram instead
                    <div></div>
                  ) : (
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
                            className="h-full bg-linear-to-r from-purple-500 to-pink-500"
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
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
