export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  university?: string;
  yearOfStudy?: number;
  complianceStatus: "Incomplete" | "Pending" | "Complete";
  createdAt: string;
}

export interface Program {
  id: string;
  hospitalId?: string;
  name: string;
  description: string;
  requirements: string[];
  isActive: boolean;
  // Optional pilot-friendly fields
  bestFor?: string;
  notRecommendedFor?: string;
  exposureLevel?: "Observation" | "Limited participation" | string;
  limitations?: string;
}

export interface Application {
  id: string;
  studentId: string;
  programId: string;
  hospitalId?: string;
  status: "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected" | "Waitlisted" | "Accepted" | "Deferred" | "Declined" | "In Training";
  submissionDate: string;
  notes?: string;
  regulatory?: {
    type: "None" | "EHS" | "DHA" | "DoH";
    reference?: string;
    status?: "Pending" | "Verified";
  };
  // Allocation metadata records how this applicant was allocated to a hospital/program
  allocation?: {
    source: "Student" | "Hospital" | "EHS"; // who initiated/assigned the allocation
    assignedHospitalId?: string; // hospital id provided by the allocator (EHS/hospital)
    ehsReference?: string; // optional EHS allocation reference/code
    allocatedAt?: string; // ISO timestamp when allocation was recorded
  };
  // Optional fields populated by admin/hospital after review
  supervisor?: string; // supervisor name or identifier
  department?: string;
  // Session management (added for multi-session observerships)
  sessionCount?: number; // Number of sessions for this observership (default: 1)
}

export interface Document {
  id: string;
  applicationId: string;
  type: "Passport" | "Medical Certificate" | "Academic Transcript" | "Emirates ID" | "Medical Fitness Certificate" | "Police Clearance Certificate" | "Immunization Records" | "Nursing License" | "Specialty Certification" | "Other";
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  validationStatus: "Pending" | "Validated" | "Rejected";
}

export interface Payment {
  id: string;
  applicationId: string;
  amount: number;
  currency: string;
  paymentStatus: "Unpaid" | "Paid" | "Failed";
  stripePaymentId?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  role: "student" | "admin" | "hospital";
  name: string;
  hospitalId?: string;
  password?: string; // Stored locally for demo auth
}

export type Hospital = {
  id: string;
  name: string;
  emirate: "Dubai" | "Abu Dhabi" | "Sharjah" | "Ajman" | "RAK" | "Fujairah" | "UAQ";
  city: string;
  type: "Hospital" | "Clinic";
  accreditation: "DHA" | "DOH" | "MOH";
  departments: string[];
  programTypes: Array<"Observership" | "Hands on" | "Internship" | "Residency" | "Elective">;
  maxStudentsPerPeriod: number;
  approvalSlaDays: number;
  status: "Active" | "Paused";
};


export interface Notification {
  id: string;
  userId: string;
  type: "approval" | "rejection" | "submission" | "update";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedApplicationId?: string;
}


export interface ProgramReminder {
  id: string;
  programId: string;
  email: string;
  notificationChannels: ("email" | "sms" | "whatsapp")[];
  createdAt: string;
  isActive: boolean;
}

// Post-Session Form System
export type FormQuestionType = "text" | "textarea" | "dropdown" | "rating" | "checkbox" | "multiselect";

export interface FormQuestion {
  id: string;
  text: string;
  type: FormQuestionType;
  required: boolean;
  options?: string[]; // For dropdown/multiselect
  placeholder?: string;
  helpText?: string;
  order: number;
}

export interface SkillTemplate {
  id: string;
  name: string; // e.g., "Patient Communication", "Technical Proficiency", "Team Collaboration"
  department?: string; // Optional: specific to department
}

export interface FormTemplate {
  id: string;
  hospitalId: string;
  name: string; // e.g., "Post-Session Assessment - Cardiology"
  observershipId?: string; // Link to specific observership if department-specific
  department: string; // e.g., "Cardiology", "Emergency Medicine"
  description: string;
  questions: FormQuestion[];
  skills: SkillTemplate[];
  criteria?: {
    passingScore?: number; // e.g., 70% for auto-pass
    requiresSupervisorApproval: boolean; // If true, must be reviewed
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface FormResponse {
  id: string;
  formTemplateId: string;
  observershipId: string; // Link to observership
  applicationId: string; // Student's application
  studentId: string;
  supervisorId?: string;
  answers: {
    questionId: string;
    answer: string | string[] | number; // Supports text, multiselect, rating
  }[];
  skillsLearned: string[]; // Selected skill IDs
  submittedAt: string;
  status: "draft" | "submitted" | "under_review" | "passed" | "needs_revision" | "rejected";
  supervisorNotes?: string; // Notes added by supervisor during review
  supervisorDecision?: {
    status: "approved" | "needs_revision" | "rejected";
    feedback: string;
    decidedAt: string;
    decidedBy: string; // Supervisor ID
  };
  score?: number; // Calculated or manual score
  updatedAt: string;
}

export interface FormTracking {
  id: string;
  hospitalId: string;
  formTemplateId: string;
  totalSubmissions: number;
  passedCount: number;
  needsRevisionCount: number;
  rejectedCount: number;
  averageScore?: number;
  commonSkillsLearned?: { skillId: string; count: number }[];
  departmentTrends?: {
    department: string;
    completionRate: number;
    averageScore: number;
  }[];
  lastUpdated: string;
}

/* OBSERVERSHIP SESSIONS */
export interface Session {
  id: string;
  applicationId: string; // Links to observership application
  sessionNumber: number; // 1, 2, 3 per observership
  status: "not_started" | "in_progress" | "completed";
  startedAt?: string; // ISO timestamp when student started session
  completedAt?: string; // ISO timestamp when student completed session
  formTemplateId?: string; // Form assigned to this session
  formResponseId?: string; // Form response after student completes session
  createdAt: string;
  updatedAt: string;
}

