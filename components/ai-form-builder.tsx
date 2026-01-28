"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader, Plus, X, Mic, Volume2, Copy, Check } from "lucide-react";

interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "rating" | "checkbox" | "select" | "number" | "date";
  required: boolean;
  options?: string[];
  placeholder?: string;
  hint?: string;
}

interface GeneratedForm {
  title: string;
  description: string;
  fields: FormField[];
}

interface AIFormBuilderProps {
  onFormGenerated?: (form: GeneratedForm) => void;
  onSaveForm?: (form: GeneratedForm) => Promise<void>;
}

export function AIFormBuilder({ onFormGenerated, onSaveForm }: AIFormBuilderProps) {
  const [step, setStep] = useState<"prompt" | "review" | "success">("prompt");
  const [prompt, setPrompt] = useState("");
  const [formType, setFormType] = useState<"assessment" | "observation" | "feedback" | "checklist">("assessment");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [specialty, setSpecialty] = useState("General Medicine");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedForm, setGeneratedForm] = useState<GeneratedForm | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<FormField>>({});
  const micRef = useRef<HTMLButtonElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onstart = () => setIsRecording(true);
        recognitionRef.current.onend = () => setIsRecording(false);
        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              setPrompt((prev) => prev + (prev ? " " : "") + transcript);
            } else {
              interimTranscript += transcript;
            }
          }
        };
      }
    }
  }, []);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition not supported in your browser");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const generateForm = async () => {
    if (!prompt.trim()) {
      setError("Please describe the form you want to create");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/ai/generate-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          formType,
          specialty,
          difficulty,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate form");
      }

      const data = await response.json();
      setGeneratedForm(data.form);
      setStep("review");
      onFormGenerated?.(data.form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate form");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    if (!generatedForm) return;
    setGeneratedForm({
      ...generatedForm,
      fields: generatedForm.fields.map((f) =>
        f.id === fieldId ? { ...f, ...updates } : f
      ),
    });
  };

  const addField = () => {
    if (!generatedForm) return;
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: "New field",
      type: "text",
      required: false,
    };
    setGeneratedForm({
      ...generatedForm,
      fields: [...generatedForm.fields, newField],
    });
  };

  const removeField = (fieldId: string) => {
    if (!generatedForm) return;
    setGeneratedForm({
      ...generatedForm,
      fields: generatedForm.fields.filter((f) => f.id !== fieldId),
    });
  };

  const saveForm = async () => {
    if (!generatedForm) return;
    try {
      await onSaveForm?.(generatedForm);
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save form");
    }
  };

  const copyFormJSON = () => {
    if (!generatedForm) return;
    navigator.clipboard.writeText(JSON.stringify(generatedForm, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {/* Step 1: Prompt Input */}
        {step === "prompt" && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl border border-purple-500/30 bg-purple-500/10 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                AI Form Builder
              </h2>
              <p className="text-slate-300">
                Describe the form you'd like to create and our AI will generate it for you.
              </p>
            </div>

            {/* Form Type & Difficulty Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Form Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-purple-500 outline-none transition"
                >
                  <option value="assessment">Assessment</option>
                  <option value="observation">Observation</option>
                  <option value="feedback">Feedback</option>
                  <option value="checklist">Checklist</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-purple-500 outline-none transition"
                >
                  <option value="beginner">Beginner (5-7 fields)</option>
                  <option value="intermediate">Intermediate (8-12 fields)</option>
                  <option value="advanced">Advanced (12-15 fields)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Medical Specialty</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g., Cardiology, Emergency Medicine, Pediatrics"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-purple-500 outline-none transition"
              />
            </div>

            {/* Prompt Input with Voice */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Describe Your Form</label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Create a form to assess a student's clinical examination skills during cardiology rotation. Include questions about patient history, physical examination findings, and clinical reasoning..."
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-purple-500 outline-none transition resize-none h-32"
                />
                <button
                  ref={micRef}
                  onClick={handleVoiceInput}
                  className={`absolute bottom-3 right-3 p-2 rounded-lg transition ${
                    isRecording
                      ? "bg-red-500/30 border border-red-500 text-red-400"
                      : "bg-white/10 border border-white/20 text-slate-400 hover:text-purple-400"
                  }`}
                  title="Voice input"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isRecording ? "Listening... Click mic to stop" : "Click the microphone icon to use voice input"}
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200">
                {error}
              </div>
            )}

            <button
              onClick={generateForm}
              disabled={isGenerating || !prompt.trim()}
              className="w-full px-6 py-3 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating Form...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Form
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Step 2: Review & Edit */}
        {step === "review" && generatedForm && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{generatedForm.title}</h2>
                  <p className="text-slate-300">{generatedForm.description}</p>
                </div>
                <button
                  onClick={copyFormJSON}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                  title="Copy JSON"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Fields Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Form Fields ({generatedForm.fields.length})</h3>
              {generatedForm.fields.map((field, idx) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
                >
                  {editingField === field.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editValues.label || field.label}
                        onChange={(e) => setEditValues({ ...editValues, label: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white text-sm"
                      />
                      <select
                        value={editValues.type || field.type}
                        onChange={(e) => setEditValues({ ...editValues, type: e.target.value as any })}
                        className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white text-sm"
                      >
                        <option value="text">Text</option>
                        <option value="textarea">Text Area</option>
                        <option value="rating">Rating</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="select">Select</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            updateField(field.id, editValues);
                            setEditingField(null);
                          }}
                          className="px-3 py-1 rounded bg-green-500/30 text-green-300 hover:bg-green-500/50 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="px-3 py-1 rounded bg-slate-500/30 text-slate-300 hover:bg-slate-500/50 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{field.label}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Type: <span className="text-slate-300">{field.type}</span>
                          {field.hint && ` • ${field.hint}`}
                        </p>
                        {field.options && (
                          <p className="text-xs text-slate-400 mt-1">
                            Options: {field.options.join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingField(field.id);
                            setEditValues(field);
                          }}
                          className="px-3 py-1 rounded bg-blue-500/30 text-blue-300 hover:bg-blue-500/50 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeField(field.id)}
                          className="px-3 py-1 rounded bg-red-500/30 text-red-300 hover:bg-red-500/50 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={addField}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold flex items-center justify-center gap-2 transition"
              >
                <Plus className="w-5 h-5" />
                Add Field
              </button>
              <button
                onClick={() => setStep("prompt")}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white font-semibold transition"
              >
                Back
              </button>
              <button
                onClick={saveForm}
                className="flex-1 px-4 py-2 rounded-lg bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold transition"
              >
                Save Form
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Success */}
        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="text-6xl">✨</div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Form Created Successfully!</h2>
              <p className="text-slate-300">{generatedForm?.title}</p>
            </div>
            <button
              onClick={() => {
                setStep("prompt");
                setPrompt("");
                setGeneratedForm(null);
              }}
              className="px-6 py-3 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition"
            >
              Create Another Form
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
