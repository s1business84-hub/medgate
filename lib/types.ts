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

export interface StudentProgress {
  studentId: string;
  xpPoints: number; // Total XP accumulated
  reflectionsCompleted: number; // Total reflections answered
  lastUpdated: string;
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
  status: "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected" | "Waitlisted" | "Accepted" | "Stage 2 Accepted" | "Deferred" | "Declined" | "In Training" | "Completed";
  submissionDate: string;
  acceptedAt?: string; // When moved to Stage 2 Accepted
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
  role: "student" | "supervisor" | "staff";
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

/* CAREER PATH STRATEGIZER */
export type CareerStage = 
  | "medical_school" 
  | "observership" 
  | "internship" 
  | "residency" 
  | "fellowship" 
  | "consultant";

export interface CareerMilestone {
  id: string;
  stage: CareerStage;
  title: string;
  description: string;
  typicalDuration: string; // e.g., "4-6 weeks", "1-3 years"
  requirements: string[];
  status: "not_started" | "in_progress" | "completed";
  completedAt?: string;
  relatedApplicationIds?: string[]; // Link to actual applications/sessions
  order: number;
}

export interface MedicalSpecialty {
  id: string;
  name: string;
  category: "Surgery" | "Internal Medicine" | "Pediatrics" | "Emergency" | "Diagnostics" | "Primary Care" | "Other";
  description: string;
  averageTrainingYears: number;
  commonSubspecialties: string[];
  typicalCareerPath: CareerStage[];
  requiredCertifications: string[];
  growthOutlook: "High" | "Moderate" | "Stable";
  averageSalaryRange?: string; // e.g., "250k-400k AED"
  workLifeBalance: "Excellent" | "Good" | "Moderate" | "Challenging";
  relatedDepartments: string[]; // Maps to hospital departments
}

export interface CareerPathway {
  id: string;
  studentId: string;
  targetSpecialty: MedicalSpecialty;
  currentStage: CareerStage;
  milestones: CareerMilestone[];
  completedMilestones: number;
  totalMilestones: number;
  progressPercentage: number;
  estimatedCompletionDate?: string;
  recommendedPrograms: string[]; // Program IDs student should consider
  skills: {
    acquired: string[]; // Skills from completed sessions
    recommended: string[]; // Skills they should develop
  };
  createdAt: string;
  updatedAt: string;
}

export interface CareerRecommendation {
  id: string;
  studentId: string;
  recommendedSpecialties: {
    specialty: MedicalSpecialty;
    matchScore: number; // 0-100
    reasons: string[];
    nextSteps: string[];
  }[];
  basedOn: {
    completedSessions: number;
    departments: string[];
    skillsAcquired: string[];
    yearOfStudy?: number;
  };
  generatedAt: string;
}

/* OBSERVERSHIP PERFORMANCE TRACKING */
export type FormFieldType = "text" | "rating" | "checkbox" | "textarea" | "select";

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[]; // For select fields
  helpText?: string;
  order: number;
}

export interface ObservationForm {
  id: string;
  applicationId: string;
  programId: string;
  hospitalId: string;
  sessionId?: string; // optional: allow assigning form to a specific session
  sessionNumber?: number; // human-friendly session label
  title: string; // e.g., "Daily Observership Assessment"
  description: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
  createdBy: string; // Admin ID
  status: "active" | "archived";
}

export interface SessionFormSubmission {
  id: string;
  sessionId: string;
  applicationId: string;
  studentId: string;
  formId: string;
  responses: {
    fieldId: string;
    value: string | number | boolean | string[]; // text, rating, checkbox, textarea, select
  }[];
  submittedAt: string;
  completedAt?: string;
  status: "draft" | "submitted" | "reviewed";
  supervisorReview?: {
    notes: string;
    rating?: number;
    reviewedAt: string;
    reviewedBy: string; // Admin/Supervisor ID
  };
}

export interface StudentPerformanceMetrics {
  studentId: string;
  applicationId: string;
  sessionId: string;
  averageRating: number; // 1-5 scale
  completedForms: number;
  pendingForms: number;
  lastSubmissionDate?: string;
  performanceTrend: "improving" | "stable" | "declining";
  keyStrengths: string[];
  areasForImprovement: string[];
}

  export interface ChatMessage {
    id: string;
    conversationId: string; // Unique ID for each student-supervisor conversation
    senderId: string; // User ID of sender
    senderRole: "student" | "supervisor" | "staff";
    recipientId: string; // User ID of recipient
    message: string;
    timestamp: string; // ISO date string
    isRead: boolean;
    attachments?: {
      name: string;
      url: string;
      type: string;
    }[];
  }

  export interface Conversation {
    id: string;
    studentId: string;
    supervisorId: string;
    applicationId?: string; // Optional link to specific application
    lastMessageAt: string;
    lastMessage: string;
    unreadCount: {
      student: number;
      supervisor: number;
    };
    createdAt: string;
  }

