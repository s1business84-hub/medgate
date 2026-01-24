'use client';

import React, { useState } from 'react';
import { FormTemplate, FormResponse, FormQuestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface SessionFormProps {
  observershipId: string;
  applicationId: string;
  formTemplate: FormTemplate;
  onSubmit: (response: FormResponse) => Promise<void>;
  onClose: () => void;
}

export default function SessionForm({
  observershipId,
  applicationId,
  formTemplate,
  onSubmit,
  onClose,
}: SessionFormProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [skillsSelected, setSkillsSelected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (questionId: string, value: string | string[] | number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSkillToggle = (skillId: string) => {
    setSkillsSelected((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate required questions
      const unansweredRequired = formTemplate.questions
        .filter((q) => q.required)
        .filter((q) => {
          const answer = answers[q.id];
          if (!answer) return true;
          if (Array.isArray(answer)) return answer.length === 0;
          return false;
        });

      if (unansweredRequired.length > 0) {
        setError(`Please answer all required questions (${unansweredRequired.length} remaining)`);
        return;
      }

      const response: FormResponse = {
        id: `response-${Date.now()}`,
        formTemplateId: formTemplate.id,
        observershipId,
        applicationId,
        studentId: 'student-1', // TODO: Get from auth context
        answers: formTemplate.questions.map((q) => ({
          questionId: q.id,
          answer: answers[q.id] || '',
        })),
        skillsLearned: skillsSelected,
        submittedAt: new Date().toISOString(),
        status: formTemplate.criteria?.requiresSupervisorApproval ? 'submitted' : 'passed',
        updatedAt: new Date().toISOString(),
      };

      await onSubmit(response);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: FormQuestion) => {
    const value = answers[question.id];

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={(value as string) || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        );

      case 'dropdown':
        return (
          <select
            value={(value as string) || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select an option...</option>
            {question.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'rating':
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleAnswerChange(question.id, rating)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  value === rating
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={((value as string) === 'Yes') || false}
              onChange={(e) => handleAnswerChange(question.id, e.target.checked ? 'Yes' : 'No')}
              className="w-4 h-4"
            />
            <span className="text-slate-300">{question.placeholder || 'Check if applicable'}</span>
          </label>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {question.options?.map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    Array.isArray(value) ? value.includes(opt) : false
                  }
                  onChange={(e) => {
                    const current = Array.isArray(value) ? value : [];
                    const updated = e.target.checked
                      ? [...current, opt]
                      : current.filter((item) => item !== opt);
                    handleAnswerChange(question.id, updated);
                  }}
                  className="w-4 h-4"
                />
                <span className="text-slate-300">{opt}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const answeredCount = formTemplate.questions.filter((q) => answers[q.id]).length;
  const progress = Math.round((answeredCount / formTemplate.questions.length) * 100);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white/10 border border-white/15 rounded-lg shadow-lg max-w-2xl w-full my-8 backdrop-blur-xl">
        {/* Header */}
        <div className="border-b border-white/10 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">{formTemplate.name}</h2>
            <p className="text-sm text-slate-400 mt-2">{formTemplate.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-300">Progress</span>
            <span className="text-sm font-medium text-indigo-400">{progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Form Content */}
        <div className="p-6 space-y-8 max-h-96 overflow-y-auto">
          {/* Questions */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-100">Questions</h3>
            {formTemplate.questions.map((question, index) => (
              <div key={question.id} className="space-y-2">
                <label className="block font-medium text-slate-200">
                  {index + 1}. {question.text}
                  {question.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                {question.helpText && (
                  <p className="text-xs text-slate-400">{question.helpText}</p>
                )}
                <div className="mt-3">{renderQuestion(question)}</div>
              </div>
            ))}
          </div>

          {/* Skills */}
          {formTemplate.skills.length > 0 && (
            <div className="space-y-4 border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-slate-100">Skills Learned</h3>
              <p className="text-sm text-slate-400">
                Select all skills you developed during this session:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {formTemplate.skills.map((skill) => (
                  <label
                    key={skill.id}
                    className="flex items-center gap-3 p-3 bg-white/10 border border-white/20 rounded-lg cursor-pointer hover:bg-white/15 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={skillsSelected.includes(skill.id)}
                      onChange={() => handleSkillToggle(skill.id)}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-300">{skill.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-6 flex gap-3 justify-end">
          <Button
            onClick={onClose}
            className="bg-slate-600 hover:bg-slate-700 text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
          </Button>
        </div>
      </div>
    </div>
  );
}
