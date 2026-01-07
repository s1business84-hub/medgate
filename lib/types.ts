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
  // Optional fields populated by admin/hospital after review
  supervisor?: string; // supervisor name or identifier
  department?: string;
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
