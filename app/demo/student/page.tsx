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

  const handleAnswer = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Redirect to appropriate demo based on answers
      redirectToDemo(newAnswers);
    }
  };

  const redirectToDemo = (allAnswers: Record<string, string>) => {
    // Simple mapping logic - you can expand this
    const specialty = allAnswers.specialty?.toLowerCase();
    
    // For demo purposes, we'll redirect based on specialty
    if (specialty?.includes("surgery")) {
      setTimeout(() => {
        router.push("/demo/hospital");
      }, 2000);
    } else if (specialty?.includes("cardiology") || specialty?.includes("emergency")) {
      setTimeout(() => {
        router.push("/demo/supervisor");
      }, 2000);
    } else {
      setTimeout(() => {
        router.push("/programs");
      }, 2000);
    }
  };

  const resetAI = () => {
    setCurrentStep(0);
    setAnswers({});
  };

  const closeAI = () => {
    setShowAI(false);
    setTimeout(resetAI, 300);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-950/50 to-black/70" />

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
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Student Portal Demo
          </h1>
          <p className="text-xl text-slate-300">
            Welcome to your medical education dashboard. Track your progress across multiple programs and institutions.
          </p>
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
              className={`rounded-xl border border-white/10 bg-gradient-to-br ${stat.color}/10 p-6 backdrop-blur-sm hover:border-white/20 transition-colors`}
            >
              <stat.icon className="w-6 h-6 mb-3 text-white" />
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Programs Section */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6">Your Programs</h2>
          <div className="space-y-4">
            {samplePrograms.map((program, idx) => (
              <motion.div
                key={program.id}
                variants={itemVariants}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-colors"
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
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
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

        {/* Call to Action */}
        <motion.div variants={itemVariants} className="mt-12 text-center space-y-6">
          <p className="text-slate-400 mb-4">This is a demo of the student portal. Start by creating an account or logging in.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowAI(true)}
              className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Find Your Perfect Program</span>
              </div>
            </button>
            
            <Link href="/login">
              <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
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
                  {currentStep === questions.length && Object.keys(answers).length === questions.length ? (
                    // Redirecting message
                    <div className="text-center py-12 space-y-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 mx-auto"
                      >
                        <Sparkles className="w-full h-full text-purple-400" />
                      </motion.div>
                      
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">Finding Your Perfect Match!</h3>
                        <p className="text-slate-400">
                          Based on your preferences, we're redirecting you to the most appropriate demo...
                        </p>
                        
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <div className="text-left text-sm text-slate-300">
                              <p className="font-semibold text-yellow-300 mb-2">Demo Disclaimer:</p>
                              <ul className="space-y-1 text-xs">
                                <li>• This is a demonstration with sample data</li>
                                <li>• Actual programs may vary in availability and requirements</li>
                                <li>• Create a real account to access live program listings</li>
                                <li>• All demo data is for illustrative purposes only</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
