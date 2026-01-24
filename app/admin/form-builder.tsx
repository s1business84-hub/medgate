'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Eye, EyeOff } from 'lucide-react';
import { FormTemplate, FormQuestion, SkillTemplate, FormQuestionType } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function FormBuilder() {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingForm, setEditingForm] = useState<FormTemplate | null>(null);
  const [formName, setFormName] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [skills, setSkills] = useState<SkillTemplate[]>([]);
  const [newQuestion, setNewQuestion] = useState<Partial<FormQuestion>>({
    type: 'text',
    required: true,
    order: 0,
  });
  const [newSkill, setNewSkill] = useState('');
  const [passingScore, setPassingScore] = useState<number>(70);
  const [requiresApproval, setRequiresApproval] = useState(true);

  const departments = [
    'Cardiology',
    'Emergency Medicine',
    'Orthopedics',
    'Pediatrics',
    'Neurology',
    'Oncology',
    'Radiology',
    'General Surgery',
    'Internal Medicine',
    'Obstetrics & Gynecology',
    'Other',
  ];

  const questionTypes: { value: FormQuestionType; label: string }[] = [
    { value: 'text', label: 'Short Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'dropdown', label: 'Dropdown (Single Select)' },
    { value: 'rating', label: 'Rating (1-5)' },
    { value: 'checkbox', label: 'Single Checkbox' },
    { value: 'multiselect', label: 'Multi-Select' },
  ];

  const handleAddQuestion = () => {
    if (!newQuestion.text) {
      alert('Please enter question text');
      return;
    }

    const question: FormQuestion = {
      id: `q-${Date.now()}`,
      text: newQuestion.text,
      type: newQuestion.type || 'text',
      required: newQuestion.required || true,
      options: newQuestion.options || [],
      placeholder: newQuestion.placeholder,
      helpText: newQuestion.helpText,
      order: questions.length,
    };

    setQuestions([...questions, question]);
    setNewQuestion({ type: 'text', required: true, order: 0 });
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id).map((q, i) => ({ ...q, order: i })));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    const skill: SkillTemplate = {
      id: `skill-${Date.now()}`,
      name: newSkill,
      department: department || undefined,
    };

    setSkills([...skills, skill]);
    setNewSkill('');
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  const handleSaveTemplate = () => {
    if (!formName.trim() || !department) {
      alert('Please fill in form name and department');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    const template: FormTemplate = {
      id: editingForm?.id || `template-${Date.now()}`,
      hospitalId: 'hospital-1', // TODO: Get from auth context
      name: formName,
      department,
      description,
      questions,
      skills,
      criteria: {
        passingScore,
        requiresSupervisorApproval: requiresApproval,
      },
      createdAt: editingForm?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    if (editingForm) {
      setTemplates(templates.map((t) => (t.id === editingForm.id ? template : t)));
      setEditingForm(null);
    } else {
      setTemplates([...templates, template]);
    }

    // Reset form
    setFormName('');
    setDepartment('');
    setDescription('');
    setQuestions([]);
    setSkills([]);
    setShowNewForm(false);
  };

  const handleEditTemplate = (template: FormTemplate) => {
    setEditingForm(template);
    setFormName(template.name);
    setDepartment(template.department);
    setDescription(template.description);
    setQuestions(template.questions);
    setSkills(template.skills);
    setPassingScore(template.criteria?.passingScore || 70);
    setRequiresApproval(template.criteria?.requiresSupervisorApproval || true);
    setShowNewForm(true);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Are you sure you want to delete this form template?')) {
      setTemplates(templates.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Post-Session Form Builder</h2>
        <Button
          onClick={() => {
            setShowNewForm(!showNewForm);
            setEditingForm(null);
            setFormName('');
            setDepartment('');
            setDescription('');
            setQuestions([]);
            setSkills([]);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Form Template
        </Button>
      </div>

      {showNewForm && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-slate-100">
              {editingForm ? 'Edit Form Template' : 'Create New Form Template'}
            </h3>
            <button
              onClick={() => {
                setShowNewForm(false);
                setEditingForm(null);
              }}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Form Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Post-Session Assessment"
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this form..."
              rows={2}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Questions Section */}
          <div className="space-y-4 border-t border-white/10 pt-6">
            <h4 className="text-lg font-semibold text-slate-100">Questions</h4>

            {questions.length > 0 && (
              <div className="space-y-3 mb-4">
                {questions.map((q, i) => (
                  <div key={q.id} className="bg-white/10 border border-white/20 rounded-lg p-4 flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-slate-100">
                        {i + 1}. {q.text}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Type: {questionTypes.find((t) => t.value === q.type)?.label} • Required: {q.required ? 'Yes' : 'No'}
                      </p>
                      {q.options && q.options.length > 0 && (
                        <p className="text-xs text-slate-400 mt-1">Options: {q.options.join(', ')}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="text-red-400 hover:text-red-300 ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white/5 border border-white/20 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Question Text</label>
                <input
                  type="text"
                  value={newQuestion.text || ''}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  placeholder="e.g., What procedures did you observe today?"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Question Type</label>
                  <select
                    value={newQuestion.type || 'text'}
                    onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as FormQuestionType })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {questionTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center text-slate-300 mb-2">
                    <input
                      type="checkbox"
                      checked={newQuestion.required || false}
                      onChange={(e) => setNewQuestion({ ...newQuestion, required: e.target.checked })}
                      className="mr-2 w-4 h-4"
                    />
                    <span className="text-sm font-medium">Required</span>
                  </label>
                </div>
              </div>

              {(newQuestion.type === 'dropdown' || newQuestion.type === 'multiselect') && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Options (comma-separated)</label>
                  <input
                    type="text"
                    value={(newQuestion.options || []).join(', ')}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        options: e.target.value.split(',').map((o) => o.trim()),
                      })
                    }
                    placeholder="e.g., Option 1, Option 2, Option 3"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Help Text (Optional)</label>
                <input
                  type="text"
                  value={newQuestion.helpText || ''}
                  onChange={(e) => setNewQuestion({ ...newQuestion, helpText: e.target.value })}
                  placeholder="Additional guidance for this question"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <Button
                onClick={handleAddQuestion}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-4 border-t border-white/10 pt-6">
            <h4 className="text-lg font-semibold text-slate-100">Skills to Track</h4>

            {skills.length > 0 && (
              <div className="space-y-2 mb-4">
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white/10 border border-white/20 rounded-lg p-3 flex justify-between items-center"
                  >
                    <p className="text-slate-100">{s.name}</p>
                    <button
                      onClick={() => handleRemoveSkill(s.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g., Patient Communication, Technical Proficiency"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button onClick={handleAddSkill} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Criteria Section */}
          <div className="space-y-4 border-t border-white/10 pt-6">
            <h4 className="text-lg font-semibold text-slate-100">Evaluation Criteria</h4>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Passing Score (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={passingScore}
                onChange={(e) => setPassingScore(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <label className="flex items-center text-slate-300">
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className="mr-2 w-4 h-4"
              />
              <span className="text-sm font-medium">Requires Supervisor Approval</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 border-t border-white/10 pt-6">
            <Button
              onClick={handleSaveTemplate}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingForm ? 'Update Template' : 'Save Template'}
            </Button>
            <Button
              onClick={() => {
                setShowNewForm(false);
                setEditingForm(null);
              }}
              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Templates List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Active Form Templates ({templates.length})</h3>

        {templates.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center text-slate-400">
            <p>No form templates created yet. Click "New Form Template" to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-100">{template.name}</h4>
                    <p className="text-sm text-slate-400 mt-1">{template.department}</p>
                    {template.description && (
                      <p className="text-sm text-slate-300 mt-2">{template.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditTemplate(template)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteTemplate(template.id)}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-slate-400">Questions</p>
                    <p className="text-lg font-semibold text-slate-100">{template.questions.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Skills Tracked</p>
                    <p className="text-lg font-semibold text-slate-100">{template.skills.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Pass Score</p>
                    <p className="text-lg font-semibold text-slate-100">{template.criteria?.passingScore}%</p>
                  </div>
                </div>

                {template.criteria?.requiresSupervisorApproval && (
                  <div className="mt-4 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-300 flex items-center">
                    <Eye className="w-3 h-3 mr-2" />
                    Requires supervisor approval
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
