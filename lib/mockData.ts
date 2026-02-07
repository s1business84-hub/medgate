import type { Student, Program, Application, Document, Payment, AuditLog, Hospital, StaffApplicationAlert } from "./types";

export const mockHospitals: Hospital[] = [
  {
    id: "h1",
    name: "Dubai Medical Center",
    emirate: "Dubai",
    city: "Al Barsha",
    type: "Hospital",
    accreditation: "DHA",
    departments: ["General Surgery", "Emergency Medicine", "Neurosurgery"],
    programTypes: ["Observership", "Elective"],
    maxStudentsPerPeriod: 10,
    approvalSlaDays: 7,
    status: "Active",
  },
  {
    id: "h2",
    name: "Sharjah Teaching Clinic",
    emirate: "Sharjah",
    city: "Al Majaz",
    type: "Clinic",
    accreditation: "MOH",
    departments: ["Internal Medicine", "Pediatrics"],
    programTypes: ["Observership"],
    maxStudentsPerPeriod: 4,
    approvalSlaDays: 10,
    status: "Active",
  },
  {
    id: "h3",
    name: "Abu Dhabi Medical Center",
    emirate: "Abu Dhabi",
    city: "Al Bateen",
    type: "Hospital",
    accreditation: "DOH",
    departments: ["Cardiology", "Orthopedics", "Oncology"],
    programTypes: ["Observership", "Elective"],
    maxStudentsPerPeriod: 15,
    approvalSlaDays: 5,
    status: "Active",
  },
  {
    id: "h4",
    name: "Dubai General Hospital",
    emirate: "Dubai",
    city: "Deira",
    type: "Hospital",
    accreditation: "DHA",
    departments: ["Emergency Medicine", "Radiology", "ICU"],
    programTypes: ["Observership", "Elective"],
    maxStudentsPerPeriod: 12,
    approvalSlaDays: 8,
    status: "Active",
  },
  {
    id: "h5",
    name: "Al Ain Speciality Hospital",
    emirate: "Abu Dhabi",
    city: "Al Ain",
    type: "Hospital",
    accreditation: "DOH",
    departments: ["Neurology", "Dermatology", "Endocrinology"],
    programTypes: ["Observership", "Elective"],
    maxStudentsPerPeriod: 8,
    approvalSlaDays: 12,
    status: "Active",
  },
  {
    id: "h6",
    name: "Fujairah Medical Institute",
    emirate: "Fujairah",
    city: "Fujairah City",
    type: "Clinic",
    accreditation: "MOH",
    departments: ["Family Medicine", "Pediatrics"],
    programTypes: ["Observership"],
    maxStudentsPerPeriod: 6,
    approvalSlaDays: 7,
    status: "Active",
  },
  {
    id: "h7",
    name: "Ras Al Khaimah Hospital",
    emirate: "RAK",
    city: "Ras Al Khaimah",
    type: "Hospital",
    accreditation: "MOH",
    departments: ["Surgery", "Internal Medicine", "Anesthesiology"],
    programTypes: ["Observership"],
    maxStudentsPerPeriod: 10,
    approvalSlaDays: 9,
    status: "Active",
  },
  {
    id: "h8",
    name: "Ajman Specialist Hospital",
    emirate: "Ajman",
    city: "Ajman",
    type: "Hospital",
    accreditation: "MOH",
    departments: ["Ophthalmology", "ENT", "Plastic Surgery"],
    programTypes: ["Observership", "Elective"],
    maxStudentsPerPeriod: 8,
    approvalSlaDays: 6,
    status: "Active",
  },
];

export const mockPrograms: Program[] = [
  {
    id: "prog_1",
    hospitalId: "h1",
    name: "General Surgery Observership (Example Listing - Demo Data)",
    description: "Observe surgical procedures, outpatient clinics, ward rounds, and day-to-day clinical workflows within a General Surgery department under an observership framework.",
    requirements: [
      "Must be currently enrolled in a recognized medical school.",
      "Valid government issued identification and appropriate residency or visit visa, as required by hospital policy.",
      "Ability to understand and communicate in English within a clinical environment.",
      "Passport copy",
      "Emirates ID copy (if applicable)",
      "Latest educational transcript",
      "Document from your base university requesting the elective (if applicable)",
      "Fitness to work certificate from a GP physician based on blood test (less than six months old) and vaccination reports"
    ],
    isActive: true,
    // Pilot-friendly metadata for Scenario 1 (no regulator)
    bestFor: "Senior medical students (Year 3+), observers interested in surgical workflows",
    notRecommendedFor: "Students seeking hands-on procedural experience or requiring independent operating privileges",
    exposureLevel: "Observation",
    limitations: "No hands-on procedures; access to operating theatre limited by hospital policy and supervisor discretion.",
  },
  {
    id: "prog_2",
    hospitalId: "h2",
    name: "Internal Medicine Observership (Example Listing - Demo Data)",
    description: "Clinical observation in internal medicine department focusing on patient care and diagnostics",
    requirements: ["Medical Student Status", "Government ID and residency/visa status (as applicable)", "English Proficiency", "Passport copy", "Emirates ID copy (if applicable)", "Latest educational transcript", "Document from your base university requesting the elective (if applicable)", "Fitness to work certificate from a GP physician based on blood test (less than six months old) and vaccination reports"],
    isActive: true,
  },
  {
    id: "prog_3",
    hospitalId: "h3",
    name: "Cardiology Observership (Example Listing - Demo Data)",
    description: "Advanced cardiology observation program focusing on cardiac diagnostics and interventional workflows",
    requirements: ["Medical Student Status", "Government ID and residency/visa status (as applicable)", "English Proficiency", "Passport copy", "Emirates ID copy (if applicable)", "Latest educational transcript", "Document from your base university requesting the elective (if applicable)", "Fitness to work certificate from a GP physician based on blood test (less than six months old) and vaccination reports"],
    isActive: true,
  },
  {
    id: "prog_4",
    hospitalId: "h3",
    name: "Orthopedic Surgery Elective (Example Listing - Demo Data)",
    description: "Elective rotation in orthopedic surgery focused on structured clinical observation and institution-defined supervised learning exposure.",
    requirements: ["Medical Student Status", "Government ID and residency/visa status (as applicable)", "English Proficiency", "Passport copy", "Emirates ID copy (if applicable)", "Latest educational transcript", "Document from your base university requesting the elective (if applicable)", "Fitness to work certificate from a GP physician based on blood test (less than six months old) and vaccination reports"],
    isActive: true,
    // Pilot-friendly elective metadata
    bestFor: "Students with prior clinical rotations interested in orthopedics",
    notRecommendedFor: "First-year students or those without prior clinical experience",
    exposureLevel: "Limited participation",
    limitations: "May include limited supervised hands-on exposure depending on hospital risk assessments; additional PPE/training may be required.",
  },
  {
    id: "prog_5",
    hospitalId: "h4",
    name: "Emergency Medicine Observership (Example Listing - Demo Data)",
    description: "Observe emergency medicine procedures and acute care management",
    requirements: ["Medical Student Status", "Government ID and residency/visa status (as applicable)", "English Proficiency", "Passport copy", "Emirates ID copy (if applicable)", "Latest educational transcript", "Document from your base university requesting the elective (if applicable)", "Fitness to work certificate from a GP physician based on blood test (less than six months old) and vaccination reports"],
    isActive: true,
  },
  {
    id: "prog_6",
    hospitalId: "h4",
    name: "Radiology Elective (Example Listing - Demo Data)",
    description: "Observe diagnostic imaging workflows and radiology reporting processes within a hospital radiology department.",
    requirements: ["Medical Student Status", "Government ID and residency/visa status (as applicable)", "English Proficiency", "Passport copy", "Emirates ID copy (if applicable)", "Latest educational transcript", "Document from your base university requesting the elective (if applicable)", "Fitness to work certificate from a GP physician based on blood test (less than six months old) and vaccination reports", "Radiation safety compliance may be required as per hospital policy"],
    isActive: true,
  },
  {
    id: "prog_7",
    hospitalId: "h5",
    name: "Neurology Observership (Example Listing - Demo Data)",
    description: "Observe clinical neurology workflows with a focus on neurological assessment and diagnostic processes.",
    requirements: ["Medical Student Status", "Government ID and residency/visa status (as applicable)", "English Proficiency", "Passport copy", "Emirates ID copy (if applicable)", "Latest educational transcript", "Document from your base university requesting the elective (if applicable)", "Fitness to work certificate from a GP physician based on blood test (less than six months old) and vaccination reports"],
    isActive: true,
  },
  {
    id: "prog_8",
    hospitalId: "h5",
    name: "Dermatology Elective (Example Listing - Demo Data)",
    description: "Observe dermatology outpatient clinics and dermatologic case management workflows within a hospital setting.",
    requirements: ["Medical Student Status", "Government ID and residency/visa status (as applicable)", "English Proficiency", "Passport copy", "Emirates ID copy (if applicable)", "Latest educational transcript", "Document from your base university requesting the elective (if applicable)", "Fitness to work certificate from a GP physician based on blood test (less than six months old) and vaccination reports"],
    isActive: true,
  },
];

export const mockStudents: Student[] = [
  {
    id: "stu_demo",
    name: "John Smith",
    email: "student@example.com",
    phone: "+971501234567",
    nationality: "United States",
    university: "Harvard Medical School",
    yearOfStudy: 4,
    complianceStatus: "Complete",
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "stu_1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+971501234567",
    nationality: "United Arab Emirates",
    university: "UAE University",
    yearOfStudy: 4,
    complianceStatus: "Complete",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "stu_2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+971507654321",
    nationality: "United Kingdom",
    university: "University of London",
    yearOfStudy: 3,
    complianceStatus: "Pending",
    createdAt: "2024-01-20T14:30:00Z",
  },
];

export const mockApplications: Application[] = [
  {
    id: "app_demo_1",
    studentId: "stu_demo",
    programId: "prog_1",
    hospitalId: "h1",
    status: "Under Review",
    submissionDate: "2024-02-10T14:30:00Z",
    sessionCount: 2,
  },
  {
    id: "app_demo_2",
    studentId: "stu_demo",
    programId: "prog_3",
    hospitalId: "h3",
    status: "Approved",
    submissionDate: "2024-01-25T10:15:00Z",
    sessionCount: 1,
  },
  {
    id: "app_demo_3",
    studentId: "stu_demo",
    programId: "prog_5",
    hospitalId: "h4",
    status: "Submitted",
    submissionDate: "2024-02-12T09:00:00Z",
    sessionCount: 3,
  },
  {
    id: "app_1",
    studentId: "stu_1",
    programId: "prog_1",
    status: "Approved",
    submissionDate: "2024-02-01T09:00:00Z",
  },
  {
    id: "app_2",
    studentId: "stu_2",
    programId: "prog_2",
    status: "Under Review",
    submissionDate: "2024-02-05T11:15:00Z",
  },
];

export const mockDocuments: Document[] = [
  {
    id: "doc_1",
    applicationId: "app_1",
    type: "Medical Certificate",
    fileName: "medical_cert.pdf",
    fileUrl: "/uploads/medical_cert.pdf",
    uploadedAt: "2024-02-01T09:30:00Z",
    validationStatus: "Validated",
  },
  {
    id: "doc_2",
    applicationId: "app_2",
    type: "Passport",
    fileName: "passport.jpg",
    fileUrl: "/uploads/passport.jpg",
    uploadedAt: "2024-02-05T11:45:00Z",
    validationStatus: "Pending",
  },
];

export const mockPayments: Payment[] = [
  {
    id: "pay_1",
    applicationId: "app_1",
    amount: 5000,
    currency: "AED",
    paymentStatus: "Paid",
    stripePaymentId: "pi_1234567890",
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "pay_2",
    applicationId: "app_2",
    amount: 3000,
    currency: "AED",
    paymentStatus: "Unpaid",
    createdAt: "2024-02-05T12:00:00Z",
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: "aud_1",
    userId: "stu_1",
    action: "Application Submitted",
    details: "Submitted application for General Surgery Observership",
    timestamp: "2024-02-01T09:00:00Z",
  },
  {
    id: "aud_2",
    userId: "admin_1",
    action: "Application Status Updated",
    details: "Updated application app_1 status to Approved",
    timestamp: "2024-02-02T14:00:00Z",
  },
];

export const mockStaffAlerts: StaffApplicationAlert[] = [
  {
    id: "alert_demo_1",
    hospitalId: "h1",
    applicationId: "app_demo_1",
    studentId: "stu_demo",
    studentName: "John Smith",
    studentEmail: "student@example.com",
    programId: "prog_1",
    submittedAt: "2024-02-10T14:30:00Z",
    readBy: [],
    status: "pending",
    alertCreatedAt: "2024-02-10T14:30:00Z",
  },
  {
    id: "alert_demo_3",
    hospitalId: "h4",
    applicationId: "app_demo_3",
    studentId: "stu_demo",
    studentName: "John Smith",
    studentEmail: "student@example.com",
    programId: "prog_5",
    submittedAt: "2024-02-12T09:00:00Z",
    readBy: [],
    status: "pending",
    alertCreatedAt: "2024-02-12T09:00:00Z",
  },
];

// For backward compatibility
export const hospitals = mockHospitals;
export const programs = mockPrograms.map(p => {
  // Determine program type based on name/content
  let programType: "Observership" | "Hands on" | "Internship" | "Residency" | "Elective" = "Observership";
  if (p.name.toLowerCase().includes('elective')) {
    programType = "Elective";
  }

  // Determine hands on level
  let handsOnLevel: "observe" | "Limited supervised exposure" | "supervised" | "independent" = "observe";
  if (p.name.toLowerCase().includes('elective')) {
    handsOnLevel = "Limited supervised exposure";
  }

  // Demo data - fees removed, replaced with TBD
  let feeAed = 0; // TBD by institution
  
  // Demo data - seats
  const hospital = mockHospitals.find(h => h.id === p.hospitalId);
  const maxStudents = hospital?.maxStudentsPerPeriod || 5;
  const seatsAvailable = Math.floor(Math.random() * maxStudents) + 1;

  // Demo data - duration
  let durationWeeksOptions = [4];
  if (programType === "Elective") durationWeeksOptions = [2, 4];

  // Demo data - daily hours
  let dailyHoursMax = programType === "Observership" ? 6 : 8;

  // Demo data - learning objectives
  const learningObjectives = [
    "Understand clinical workflows and patient care processes",
    "Observe diagnostic and therapeutic procedures",
    "Develop professional communication skills in healthcare settings",
    "Gain exposure to medical decision-making processes"
  ];

  // Demo data - key skills
  const keySkills = [
    "Clinical Observation",
    "Medical Documentation",
    "Patient Communication",
    "Professional Ethics"
  ];

  return {
    ...p,
    departmentName: p.name,
    programType,
    eligibility: { yearOfStudyMin: "Year 3 or above", language: "English" },
    requiredDocuments: [
      "Government ID: Passport or national ID for identity verification.",
      "Curriculum Vitae (CV): Updated CV outlining academic background.",
      "Medical Certificate: Proof of medical fitness or immunization status, if required."
    ] as const,
    durationWeeksOptions,
    dailyHoursMax,
    startDates: ["01 January 2024", "01 February 2024", "01 March 2024"],
    seatsAvailable,
    handsOnLevel,
    certificateProvided: true,
    feeAed,
    learningObjectives,
    keySkills,
  };
});

export const mockUsers = [
  {
    id: "u1",
    email: "student@example.com",
    role: "student" as const,
    name: "John Smith",
    password: "password",
  },
  {
    id: "u_admin",
    email: "admin@example.com",
    role: "admin" as const,
    name: "Dr. Admin User",
    password: "password",
  },
  {
    id: "u_supervisor",
    email: "supervisor@example.com",
    role: "supervisor" as const,
    name: "Dr. Sarah Johnson",
    password: "password",
  },
  {
    id: "u3",
    email: "student2@example.com",
    role: "student" as const,
    name: "Maria Garcia",
    password: "password",
  },
  {
    id: "h1_admin",
    email: "hospital1@electivio.com",
    role: "staff" as const,
    name: "Hospital Administrator",
    hospitalId: "h1",
    password: "password",
  },
  {
    id: "h2_admin",
    email: "hospital2@electivio.com",
    role: "staff" as const,
    name: "Clinic Manager",
    hospitalId: "h2",
    password: "password",
  },
  {
    id: "h3_admin",
    email: "hospital3@electivio.com",
    role: "staff" as const,
    name: "Medical Director",
    hospitalId: "h3",
    password: "password",
  },
];
