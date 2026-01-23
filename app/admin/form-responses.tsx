'use client';

import React, { useState } from 'react';
import { FormResponse, FormTemplate, FormTracking } from '@/lib/types';
import { TrendingUp, FileText, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface FormTrackingCardsProps {
  formResponses: FormResponse[];
  formTemplates: FormTemplate[];
  tracking?: FormTracking;
}

export default function FormTrackingCards({
  formResponses,
  formTemplates,
  tracking,
}: FormTrackingCardsProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Calculate stats
  const totalSubmissions = formResponses.length;
  const passedCount = formResponses.filter((r) => r.status === 'passed').length;
  const needsRevisionCount = formResponses.filter((r) => r.status === 'needs_revision').length;
  const rejectedCount = formResponses.filter((r) => r.status === 'rejected').length;
  const averageScore =
    formResponses.length > 0
      ? Math.round(
          formResponses.reduce((sum, r) => sum + (r.score || 0), 0) / formResponses.length
        )
      : 0;

  // Skills analytics
  const skillCounts: Record<string, number> = {};
  formResponses.forEach((response) => {
    response.skillsLearned.forEach((skillId) => {
      skillCounts[skillId] = (skillCounts[skillId] || 0) + 1;
    });
  });

  const topSkills = Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([skillId, count]) => {
      const template = formTemplates.find((t) =>
        t.skills.some((s) => s.id === skillId)
      );
      const skill = template?.skills.find((s) => s.id === skillId);
      return {
        skill: skill?.name || 'Unknown',
        count,
      };
    });

  // Department analytics
  const departmentStats: Record<string, { total: number; passed: number }> = {};
  formTemplates.forEach((template) => {
    const responses = formResponses.filter(
      (r) => formTemplates.find((t) => t.id === r.formTemplateId)?.department === template.department
    );
    if (responses.length > 0) {
      departmentStats[template.department] = {
        total: responses.length,
        passed: responses.filter((r) => r.status === 'passed').length,
      };
    }
  });

  // Filter responses
  let filteredResponses = formResponses;
  if (selectedDepartment) {
    const template = formTemplates.find((t) => t.department === selectedDepartment);
    if (template) {
      filteredResponses = filteredResponses.filter((r) => r.formTemplateId === template.id);
    }
  }
  if (selectedStatus) {
    filteredResponses = filteredResponses.filter((r) => r.status === selectedStatus);
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Submissions</p>
              <p className="text-3xl font-bold text-slate-100 mt-2">{totalSubmissions}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-400 opacity-30" />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Passed</p>
              <p className="text-3xl font-bold text-emerald-400 mt-2">{passedCount}</p>
              <p className="text-xs text-slate-500 mt-1">
                {totalSubmissions > 0 ? Math.round((passedCount / totalSubmissions) * 100) : 0}%
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-emerald-400 opacity-30" />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Needs Revision</p>
              <p className="text-3xl font-bold text-amber-400 mt-2">{needsRevisionCount}</p>
              <p className="text-xs text-slate-500 mt-1">
                {totalSubmissions > 0 ? Math.round((needsRevisionCount / totalSubmissions) * 100) : 0}%
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-amber-400 opacity-30" />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Rejected</p>
              <p className="text-3xl font-bold text-red-400 mt-2">{rejectedCount}</p>
              <p className="text-xs text-slate-500 mt-1">
                {totalSubmissions > 0 ? Math.round((rejectedCount / totalSubmissions) * 100) : 0}%
              </p>
            </div>
            <XCircle className="w-10 h-10 text-red-400 opacity-30" />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Avg Score</p>
              <p className="text-3xl font-bold text-indigo-400 mt-2">{averageScore}%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-indigo-400 opacity-30" />
          </div>
        </div>
      </div>

      {/* Top Skills */}
      {topSkills.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Top Skills Learned</h3>
          <div className="space-y-3">
            {topSkills.map(({ skill, count }, i) => (
              <div key={skill} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-semibold">
                    {i + 1}
                  </div>
                  <span className="text-slate-100">{skill}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((count / Math.max(...topSkills.map((s) => s.count))) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-slate-400 text-sm font-medium min-w-fit">{count} students</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Department Analytics */}
      {Object.keys(departmentStats).length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Department Performance</h3>
          <div className="space-y-3">
            {Object.entries(departmentStats).map(([dept, stats]) => (
              <div key={dept} className="flex items-center justify-between p-3 bg-white/10 border border-white/10 rounded-lg">
                <span className="text-slate-100 font-medium">{dept}</span>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-400">{stats.total} submissions</p>
                    <p className="text-lg font-semibold text-emerald-400">
                      {Math.round((stats.passed / stats.total) * 100)}% passed
                    </p>
                  </div>
                  <div className="w-24 bg-white/10 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{
                        width: `${Math.round((stats.passed / stats.total) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Response List */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Response History</h3>

        <div className="flex gap-4 mb-4 flex-wrap">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
            <select
              value={selectedDepartment || ''}
              onChange={(e) => setSelectedDepartment(e.target.value || null)}
              className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Departments</option>
              {Object.keys(departmentStats).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
            <select
              value={selectedStatus || ''}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="passed">Passed</option>
              <option value="needs_revision">Needs Revision</option>
              <option value="rejected">Rejected</option>
              <option value="submitted">Submitted</option>
            </select>
          </div>
        </div>

        {/* Response Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-slate-400 font-semibold">Student ID</th>
                <th className="px-4 py-3 text-left text-slate-400 font-semibold">Form</th>
                <th className="px-4 py-3 text-left text-slate-400 font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-slate-400 font-semibold">Score</th>
                <th className="px-4 py-3 text-left text-slate-400 font-semibold">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filteredResponses.map((response) => {
                const template = formTemplates.find((t) => t.id === response.formTemplateId);
                return (
                  <tr key={response.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-slate-300">{response.studentId}</td>
                    <td className="px-4 py-3 text-slate-300">{template?.name || 'Unknown'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          response.status === 'passed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : response.status === 'needs_revision'
                            ? 'bg-amber-500/20 text-amber-300'
                            : response.status === 'rejected'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {response.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{response.score || '-'}%</td>
                    <td className="px-4 py-3 text-slate-300">
                      {new Date(response.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredResponses.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              No responses found with the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
