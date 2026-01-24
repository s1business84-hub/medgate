"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Settings,
  ChevronDown,
  Type,
  MessageSquare,
  CheckSquare,
  Star,
  ListCheck,
  Save,
  X,
  ArrowRight,
} from "lucide-react";
import { FormTemplate, FormQuestion, FormQuestionType } from "@/lib/types";

interface FormBuilderModernProps {
  onSave: (template: Partial<FormTemplate>) => void;
  onCancel: () => void;
  initialTemplate?: FormTemplate | null;
}

const questionTypeConfig: Record<
  FormQuestionType,
  { icon: React.ReactNode; label: string; color: string }
> = {
  text: { icon: <Type className="w-4 h-4" />, label: "Short Text", color: "from-blue-500 to-blue-600" },
  textarea: { icon: <MessageSquare className="w-4 h-4" />, label: "Long Text", color: "from-purple-500 to-purple-600" },
  rating: { icon: <Star className="w-4 h-4" />, label: "Rating (1-5)", color: "from-yellow-500 to-yellow-600" },
  checkbox: { icon: <CheckSquare className="w-4 h-4" />, label: "Checkbox", color: "from-green-500 to-green-600" },
  dropdown: { icon: <ListCheck className="w-4 h-4" />, label: "Dropdown", color: "from-orange-500 to-orange-600" },
  multiselect: { icon: <ListCheck className="w-4 h-4" />, label: "Multi-Select", color: "from-pink-500 to-pink-600" },
};

export function FormBuilderModern({ onSave, onCancel, initialTemplate }: FormBuilderModernProps) {
  const [name, setName] = useState(initialTemplate?.name || "");
  const [department, setDepartment] = useState(initialTemplate?.department || "");
  const [description, setDescription] = useState(initialTemplate?.description || "");
  const [questions, setQuestions] = useState<FormQuestion[]>(initialTemplate?.questions || []);
  const [previewMode, setPreviewMode] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [passingScore, setPassingScore] = useState(initialTemplate?.criteria?.passingScore || 70);
  const [requiresApproval, setRequiresApproval] = useState(
    initialTemplate?.criteria?.requiresSupervisorApproval ?? true
  );

  const departments = [
    "Cardiology",
    "Emergency Medicine",
    "Orthopedics",
    "Pediatrics",
    "Neurology",
    "Oncology",
    "Radiology",
    "General Surgery",
    "Internal Medicine",
    "Obstetrics & Gynecology",
  ];

  const addQuestion = useCallback((type: FormQuestionType) => {
    const newQuestion: FormQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text: "New Question",
      type,
      required: true,
      order: questions.length,
      options: type === "dropdown" || type === "multiselect" ? ["Option 1", "Option 2"] : [],
    };
    setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
    setExpandedQuestion(newQuestion.id);
  }, [questions.length]);

  const updateQuestion = (id: string, updates: Partial<FormQuestion>) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, ...updates } : q)));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id).map((q, i) => ({ ...q, order: i })));
    setExpandedQuestion(null);
  };

  const duplicateQuestion = useCallback((id: string) => {
    setQuestions(prevQuestions => {
      const q = prevQuestions.find(x => x.id === id);
      if (q) {
        const newQ = { ...q, id: `q-${Date.now()}-${Math.random().toString(36).slice(2)}`, order: prevQuestions.length };
        return [...prevQuestions, newQ];
      }
      return prevQuestions;
    });
  }, []);

  const moveQuestion = (id: string, direction: "up" | "down") => {
    const idx = questions.findIndex(q => q.id === id);
    if ((direction === "up" && idx > 0) || (direction === "down" && idx < questions.length - 1)) {
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      const newQuestions = [...questions];
      [newQuestions[idx], newQuestions[newIdx]] = [newQuestions[newIdx], newQuestions[idx]];
      setQuestions(newQuestions.map((q, i) => ({ ...q, order: i })));
    }
  };

  const handleSave = () => {
    if (!name.trim() || !department) {
      alert("Please fill in form name and department");
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }
    onSave({
      id: initialTemplate?.id || `template-${Date.now()}`,
      name,
      department,
      description,
      questions,
      skills: initialTemplate?.skills || [],
      criteria: {
        passingScore,
        requiresSupervisorApproval: requiresApproval,
      },
      isActive: true,
    });
  };

  const completionPercent = useMemo(() => {
    let complete = 0;
    if (name.trim()) complete += 25;
    if (department) complete += 25;
    if (description.trim()) complete += 25;
    if (questions.length > 0) complete += 25;
    return complete;
  }, [name, department, description, questions]);

  if (previewMode) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center overflow-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 rounded-2xl max-w-2xl w-full m-4 max-h-[90vh] overflow-auto border border-white/10"
        >
          <div className="sticky top-0 flex items-center justify-between p-6 bg-slate-800/50 border-b border-white/10 backdrop-blur">
            <h2 className="text-xl font-bold text-white">{name || "Form Preview"}</h2>
            <button
              onClick={() => setPreviewMode(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-300" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {description && <p className="text-slate-300">{description}</p>}

            {questions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">No questions added yet</p>
              </div>
            ) : (
              questions.map((q, idx) => (
                <div key={q.id} className="space-y-2">
                  <label className="block font-medium text-white">
                    {idx + 1}. {q.text}
                    {q.required && <span className="text-rose-400 ml-1">*</span>}
                  </label>
                  <div className="text-sm text-slate-400">
                    {questionTypeConfig[q.type]?.label}
                  </div>
                  {q.type === "rating" && (
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(i => (
                        <button
                          key={i}
                          disabled
                          className="w-10 h-10 rounded-lg bg-slate-800 border border-white/10 text-sm"
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  )}
                  {(q.type === "dropdown" || q.type === "multiselect") && (
                    <select disabled className="w-full p-2 rounded-lg bg-slate-800 border border-white/10 text-slate-300">
                      {q.options?.map((opt, i) => (
                        <option key={i}>{opt}</option>
                      ))}
                    </select>
                  )}
                  {q.type === "text" && (
                    <input
                      disabled
                      type="text"
                      placeholder={q.placeholder || "Enter answer..."}
                      className="w-full p-2 rounded-lg bg-slate-800 border border-white/10 text-slate-300"
                    />
                  )}
                  {q.type === "textarea" && (
                    <textarea
                      disabled
                      placeholder={q.placeholder || "Enter answer..."}
                      className="w-full p-2 rounded-lg bg-slate-800 border border-white/10 text-slate-300 h-24"
                    />
                  )}
                  {q.type === "checkbox" && (
                    <label className="flex items-center gap-2">
                      <input type="checkbox" disabled className="w-4 h-4" />
                      <span className="text-slate-300">{q.text}</span>
                    </label>
                  )}
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex overflow-auto">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-2/3 bg-slate-900 border-r border-white/10 p-6 overflow-auto max-h-screen"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Form Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Cardiology Session Assessment"
              className="w-full p-3 rounded-lg bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Department *</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 border border-white/10 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Passing Score</label>
              <input
                type="number"
                min="0"
                max="100"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="w-full p-3 rounded-lg bg-slate-800 border border-white/10 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this form assesses..."
              className="w-full p-3 rounded-lg bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none h-24"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="approval"
              checked={requiresApproval}
              onChange={(e) => setRequiresApproval(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="approval" className="text-sm text-slate-300">
              Requires supervisor approval before publishing
            </label>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Questions</h3>
              <div className="flex gap-2">
                {["text", "textarea", "rating", "checkbox", "dropdown", "multiselect"].map(type => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => addQuestion(type as FormQuestionType)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                      type === "text"
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30"
                        : type === "textarea"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30"
                          : type === "rating"
                            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30"
                            : type === "checkbox"
                              ? "bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30"
                              : "bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30"
                    }`}
                  >
                    {questionTypeConfig[type as FormQuestionType]?.icon}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {questions.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  Click a question type above to get started
                </div>
              ) : (
                questions.map((q, idx) => (
                  <motion.div
                    key={q.id}
                    layout
                    className="border border-white/10 rounded-lg bg-slate-800/50 overflow-hidden"
                  >
                    <motion.button
                      onClick={() =>
                        setExpandedQuestion(expandedQuestion === q.id ? null : q.id)
                      }
                      className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors"
                    >
                      <GripVertical className="w-4 h-4 text-slate-500" />
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${
                          questionTypeConfig[q.type]?.color
                        } flex items-center justify-center text-white`}
                      >
                        {questionTypeConfig[q.type]?.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-white line-clamp-1">{q.text}</p>
                        <p className="text-xs text-slate-400">
                          {idx + 1}. {questionTypeConfig[q.type]?.label}
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-500 transition-transform ${
                          expandedQuestion === q.id ? "rotate-180" : ""
                        }`}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {expandedQuestion === q.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/10 p-4 space-y-4 bg-slate-900/50"
                        >
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-2">
                              Question Text
                            </label>
                            <input
                              value={q.text}
                              onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                              className="w-full p-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm"
                            />
                          </div>

                          {(q.type === "text" || q.type === "textarea") && (
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-2">
                                Placeholder Text
                              </label>
                              <input
                                value={q.placeholder || ""}
                                onChange={(e) =>
                                  updateQuestion(q.id, { placeholder: e.target.value })
                                }
                                className="w-full p-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm"
                              />
                            </div>
                          )}

                          {(q.type === "dropdown" || q.type === "multiselect") && (
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-2">
                                Options (one per line)
                              </label>
                              <textarea
                                value={q.options?.join("\n") || ""}
                                onChange={(e) =>
                                  updateQuestion(q.id, {
                                    options: e.target.value.split("\n").filter(Boolean),
                                  })
                                }
                                className="w-full p-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm h-20"
                              />
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                            <input
                              type="checkbox"
                              id={`required-${q.id}`}
                              checked={q.required}
                              onChange={(e) =>
                                updateQuestion(q.id, { required: e.target.checked })
                              }
                              className="w-4 h-4"
                            />
                            <label htmlFor={`required-${q.id}`} className="text-sm text-slate-300">
                              Required field
                            </label>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-white/10">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              onClick={() => duplicateQuestion(q.id)}
                              className="flex-1 p-2 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-medium hover:bg-blue-500/30 flex items-center justify-center gap-1 transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                              Duplicate
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              onClick={() => deleteQuestion(q.id)}
                              className="flex-1 p-2 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-medium hover:bg-rose-500/30 flex items-center justify-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex md:w-1/3 bg-slate-800/50 border-l border-white/10 flex-col p-6 max-h-screen overflow-auto"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Form Progress</h3>
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercent}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">{completionPercent}% Complete</p>
          </div>

          <div className="space-y-3">
            <div className={`p-3 rounded-lg ${name.trim() ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-white/5 border border-white/10"}`}>
              <p className="text-xs font-medium text-slate-300">
                {name.trim() ? "✓" : "○"} Form name
              </p>
            </div>
            <div className={`p-3 rounded-lg ${department ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-white/5 border border-white/10"}`}>
              <p className="text-xs font-medium text-slate-300">
                {department ? "✓" : "○"} Department
              </p>
            </div>
            <div className={`p-3 rounded-lg ${description.trim() ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-white/5 border border-white/10"}`}>
              <p className="text-xs font-medium text-slate-300">
                {description.trim() ? "✓" : "○"} Description
              </p>
            </div>
            <div className={`p-3 rounded-lg ${questions.length > 0 ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-white/5 border border-white/10"}`}>
              <p className="text-xs font-medium text-slate-300">
                {questions.length > 0 ? "✓" : "○"} At least 1 question ({questions.length})
              </p>
            </div>
          </div>

          <button
            onClick={() => setPreviewMode(true)}
            className="w-full p-3 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview Form
          </button>

          <div className="border-t border-white/10 pt-6 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={onCancel}
              className="flex-1 p-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleSave}
              disabled={completionPercent < 100}
              className="flex-1 p-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Form
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
