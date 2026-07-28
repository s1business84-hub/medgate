"use client";

import { useEffect, useState, useMemo, startTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LiquidParallax } from "@/components/ui/liquid-parallax";
import {
  getFormTemplates,
  getSessionFormSubmissions,
  getApplications,
  getStudents,
  getApplicationsByHospital,
  createFormTemplate,
} from "@/lib/storage";
import { FormTemplate, SessionFormSubmission, Application, Student } from "@/lib/types";
import { motion } from "framer-motion";
import {
  FileText,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowLeft,
  TrendingUp,
  Search,
  Sparkles,
} from "lucide-react";
import { FormBuilderModern } from "@/components/form-builder-modern";

interface FormWithStudents {
  form: FormTemplate;
  submissions: Array<{
    submission: SessionFormSubmission;
    student: Student | undefined;
    application: Application | undefined;
  }>;
  stats: {
    total: number;
    completed: number;
    pending: number;
    underReview: number;
  };
}

export default function HospitalFormsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [submissions, setSubmissions] = useState<SessionFormSubmission[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "staff") {
      router.push("/hospital-login");
      return;
    }

    try {
      const hospitalForms = getFormTemplates(user.hospitalId);
      const allSubmissions = getSessionFormSubmissions();
      const hospitalApps = getApplicationsByHospital(user.hospitalId || "");
      const allStudents = getStudents();

      startTransition(() => {
        setForms(hospitalForms);
        setSubmissions(allSubmissions);
        setApplications(hospitalApps);
        setStudents(allStudents);
        setLoading(false);
      });
    } catch (error) {
      console.error("Failed to load forms:", error);
      startTransition(() => {
        setLoading(false);
      });
    }
  }, [user, router]);

  const formsWithStudents = useMemo(() => {
    return forms.map(form => {
      const formSubmissions = submissions.filter(s => s.formId === form.id);
      const submissionsWithData = formSubmissions.map(sub => ({
        submission: sub,
        student: students.find(s => s.id === sub.studentId),
        application: applications.find(a => a.id === sub.applicationId),
      }));

      return {
        form,
        submissions: submissionsWithData,
        stats: {
          total: submissionsWithData.length,
          completed: submissionsWithData.filter(x => x.submission.status === "submitted" || x.submission.status === "reviewed").length,
          pending: submissionsWithData.filter(x => x.submission.status === "draft").length,
          underReview: submissionsWithData.filter(x => x.submission.status === "reviewed").length,
        },
      };
    });
  }, [forms, submissions, students, applications]);

  const filteredForms = useMemo(() => {
    if (!searchTerm) return formsWithStudents;
    const lower = searchTerm.toLowerCase();
    return formsWithStudents.filter(
      x =>
        x.form.name.toLowerCase().includes(lower) ||
        x.form.department.toLowerCase().includes(lower)
    );
  }, [formsWithStudents, searchTerm]);

  const handleSaveForm = (template: Partial<FormTemplate>) => {
    try {
      const newTemplate = createFormTemplate({
        ...template,
        hospitalId: user?.hospitalId || "",
        name: template.name || "",
        department: template.department || "",
        description: template.description || "",
        questions: template.questions || [],
        skills: template.skills || [],
        criteria: template.criteria,
        isActive: true,
      } as any);
      setForms([...forms, newTemplate]);
      setShowFormBuilder(false);
    } catch (error) {
      console.error("Failed to save form:", error);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100 flex items-center justify-center">
        <LiquidParallax />
        <div className="relative text-center">
          <div className="w-12 h-12 border-4 border-blue-400/40 border-t-blue-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading forms...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "staff") return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100">
      <LiquidParallax />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-950/50 to-black/70" />

      <div className="relative max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold text-white">Form Tracking</h1>
            </div>
            <p className="text-slate-400 text-lg">Manage and track student form submissions by assessment.</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push("/hospital")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 text-blue-300 hover:text-blue-200 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push("/hospital/forms/ai-create")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-medium transition-all"
            >
              <Sparkles className="w-4 h-4" />
              AI Form Generator
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowFormBuilder(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Form
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search forms by name or department..."
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Forms List */}
        {filteredForms.length === 0 ? (
          <div className="p-12 rounded-xl border border-white/10 bg-slate-800/30 text-center">
            <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Forms Found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm ? "No forms match your search." : "Create your first form to start tracking student submissions."}
            </p>
            {!searchTerm && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowFormBuilder(true)}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-500 text-white font-medium hover:from-blue-600 hover:to-blue-600 transition-all"
              >
                Create Your First Form
              </motion.button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filteredForms.map((item, idx) => (
              <motion.div
                key={item.form.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border border-white/10 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm overflow-hidden hover:border-blue-500/30 transition-colors"
              >
                {/* Form Header */}
                <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-500/5 to-blue-500/5">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{item.form.name}</h3>
                      <p className="text-slate-400">{item.form.department}</p>
                      {item.form.description && (
                        <p className="text-sm text-slate-500 mt-2">{item.form.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">{item.stats.total}</div>
                      <div className="text-xs text-slate-400">Submissions</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-lg font-bold text-emerald-400">{item.stats.completed}</div>
                      <div className="text-xs text-slate-400">Completed</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-lg font-bold text-blue-400">{item.stats.pending}</div>
                      <div className="text-xs text-slate-400">Pending</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-lg font-bold text-amber-400">{item.stats.underReview}</div>
                      <div className="text-xs text-slate-400">Under Review</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-lg font-bold text-slate-300">
                        {item.stats.total > 0
                          ? Math.round((item.stats.completed / item.stats.total) * 100)
                          : 0}
                        %
                      </div>
                      <div className="text-xs text-slate-400">Completion</div>
                    </div>
                  </div>
                </div>

                {/* Students List */}
                <div className="p-8 space-y-4 max-h-96 overflow-y-auto">
                  {item.submissions.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No submissions yet</p>
                    </div>
                  ) : (
                    item.submissions.map((sub, subIdx) => {
                      const statusConfig = {
                        draft: { icon: Clock, color: "text-blue-400", bg: "bg-blue-500/20", label: "Draft" },
                        submitted: {
                          icon: CheckCircle2,
                          color: "text-emerald-400",
                          bg: "bg-emerald-500/20",
                          label: "Submitted",
                        },
                        reviewed: {
                          icon: CheckCircle2,
                          color: "text-amber-400",
                          bg: "bg-amber-500/20",
                          label: "Under Review",
                        },
                      };
                      const config =
                        statusConfig[sub.submission.status as keyof typeof statusConfig] ||
                        statusConfig.draft;
                      const StatusIcon = config.icon;

                      return (
                        <motion.div
                          key={sub.submission.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: subIdx * 0.05 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-sm font-semibold text-white truncate">
                                {sub.student?.name || "Unknown"}
                              </div>
                              <span className="text-xs text-slate-500">
                                #{sub.student?.id?.slice(0, 8)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              Session {new Date(sub.submission.submittedAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 ml-4">
                            {sub.submission.supervisorReview?.rating && (
                              <div className="text-right">
                                <div className="text-sm font-bold text-yellow-400">
                                  {sub.submission.supervisorReview.rating}/5
                                </div>
                              </div>
                            )}
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.bg} ${config.color}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {config.label}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Form Builder Modal */}
      {showFormBuilder && (
        <FormBuilderModern
          onSave={handleSaveForm}
          onCancel={() => setShowFormBuilder(false)}
        />
      )}
    </div>
  );
}
