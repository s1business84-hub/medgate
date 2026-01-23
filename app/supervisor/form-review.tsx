'use client';

import React, { useState } from 'react';
import { FormResponse, FormTemplate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Check, X, AlertCircle, Save } from 'lucide-react';

interface SupervisorFormReviewProps {
  formResponse: FormResponse;
  formTemplate: FormTemplate;
  onApprove: (response: FormResponse, notes: string) => Promise<void>;
  onReject: (response: FormResponse, feedback: string) => Promise<void>;
  onNeedsRevision: (response: FormResponse, feedback: string) => Promise<void>;
}

export default function SupervisorFormReview({
  formResponse,
  formTemplate,
  onApprove,
  onReject,
  onNeedsRevision,
}: SupervisorFormReviewProps) {
  const [reviewNotes, setReviewNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'responses' | 'skills' | 'decision'>('responses');

  const getAnswerText = (questionId: string): string | string[] | number => {
    const answer = formResponse.answers.find((a) => a.questionId === questionId);
    return answer?.answer || 'Not answered';
  };

  const getQuestionText = (questionId: string): string => {
    const question = formTemplate.questions.find((q) => q.id === questionId);
    return question?.text || 'Question not found';
  };

  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      await onApprove(formResponse, reviewNotes);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!reviewNotes.trim()) {
      alert('Please provide feedback for rejection');
      return;
    }
    try {
      setIsProcessing(true);
      await onReject(formResponse, reviewNotes);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNeedsRevision = async () => {
    if (!reviewNotes.trim()) {
      alert('Please provide feedback for revision');
      return;
    }
    try {
      setIsProcessing(true);
      await onNeedsRevision(formResponse, reviewNotes);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-indigo-800/50 border-b border-white/10 p-6">
        <h3 className="text-xl font-bold text-slate-100">Form Review</h3>
        <p className="text-sm text-slate-400 mt-2">{formTemplate.name}</p>
        <div className="flex gap-4 mt-4 text-sm">
          <span className={`px-3 py-1 rounded-full ${
            formResponse.status === 'submitted' ? 'bg-amber-500/20 text-amber-300' :
            formResponse.status === 'passed' ? 'bg-emerald-500/20 text-emerald-300' :
            formResponse.status === 'needs_revision' ? 'bg-yellow-500/20 text-yellow-300' :
            'bg-red-500/20 text-red-300'
          }`}>
            {formResponse.status.replace('_', ' ').toUpperCase()}
          </span>
          <span className="text-slate-400">
            Submitted: {new Date(formResponse.submittedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {['responses', 'skills', 'decision'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === tab
                ? 'text-indigo-300 border-b-2 border-indigo-500 bg-white/5'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
        {activeTab === 'responses' && (
          <div className="space-y-6">
            <h4 className="font-semibold text-slate-100">Student Responses</h4>
            {formTemplate.questions.map((question, index) => (
              <div key={question.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-slate-100">
                      {index + 1}. {question.text}
                    </p>
                    {question.helpText && (
                      <p className="text-xs text-slate-400 mt-1">{question.helpText}</p>
                    )}
                  </div>
                </div>
                <div className="bg-white/10 rounded p-3 text-slate-200">
                  {Array.isArray(getAnswerText(question.id)) ? (
                    <ul className="list-disc list-inside space-y-1">
                      {(getAnswerText(question.id) as string[]).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{getAnswerText(question.id) as string}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-100">Skills Reported as Learned</h4>
            {formResponse.skillsLearned.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {formResponse.skillsLearned.map((skillId) => {
                  const skill = formTemplate.skills.find((s) => s.id === skillId);
                  return (
                    <div
                      key={skillId}
                      className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-200">{skill?.name || 'Unknown Skill'}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-400">No skills selected by student</p>
            )}
          </div>
        )}

        {activeTab === 'decision' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-100">Supervisor Decision</h4>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Review Notes & Feedback
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Provide constructive feedback on the student's session performance..."
                rows={4}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {formResponse.supervisorDecision && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
                <p className="text-sm text-slate-400">Previous Decision:</p>
                <p className="font-medium text-slate-100">
                  {formResponse.supervisorDecision.status.toUpperCase()}
                </p>
                {formResponse.supervisorDecision.feedback && (
                  <p className="text-sm text-slate-300">{formResponse.supervisorDecision.feedback}</p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  {new Date(formResponse.supervisorDecision.decidedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {activeTab === 'decision' && (
        <div className="border-t border-white/10 p-6 flex gap-3 justify-end">
          <Button
            onClick={handleNeedsRevision}
            disabled={isProcessing}
            className="bg-yellow-600 hover:bg-yellow-700 text-white disabled:opacity-50"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Needs Revision
          </Button>
          <Button
            onClick={handleReject}
            disabled={isProcessing}
            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            <X className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isProcessing}
            className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
          >
            <Check className="w-4 h-4 mr-2" />
            Approve
          </Button>
        </div>
      )}
    </div>
  );
}
