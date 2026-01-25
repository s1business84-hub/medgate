import type { 
  Student, Application, Document, Payment, AuditLog, User, Notification, ProgramReminder,
   FormTemplate, FormResponse, Session, ObservationForm, SessionFormSubmission, StudentPerformanceMetrics,
   ChatMessage, Conversation, StudentProgress
} from "./types";

const KEYS = {
  students: "electivio_students",
  applications: "electivio_applications",
  documents: "electivio_documents",
  payments: "electivio_payments",
  audit: "electivio_audit",
  users: "electivio_users",
  currentUser: "electivio_current_user",
  notifications: "electivio_notifications",
  reminders: "electivio_reminders",
  programCriteria: "electivio_program_criteria",
  programMetadata: "electivio_program_metadata",
  formTemplates: "electivio_form_templates",
  formResponses: "electivio_form_responses",
  sessions: "electivio_sessions",
  observationForms: "electivio_observation_forms",
  sessionFormSubmissions: "electivio_session_form_submissions",
  performanceMetrics: "electivio_performance_metrics",
  chatMessages: "electivio_chat_messages",
  conversations: "electivio_conversations",
  studentProgress: "electivio_student_progress",
};

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function newId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/* STUDENTS */
export function createStudent(input: Omit<Student, "id" | "complianceStatus" | "createdAt">): Student {
  const students = readJSON<Student[]>(KEYS.students, []);
  const student: Student = {
    id: newId("stu"),
    complianceStatus: "Incomplete",
    createdAt: new Date().toISOString(),
    ...input,
  };
  students.push(student);
  writeJSON(KEYS.students, students);
  return student;
}

export function getStudents(): Student[] {
  return readJSON<Student[]>(KEYS.students, []);
}

/* APPLICATIONS */
export function createApplication(input: Omit<Application, "id" | "status" | "submissionDate">): Application {
  const applications = readJSON<Application[]>(KEYS.applications, []);

  const app: Application = {
    id: newId("app"),
    status: "Submitted",
    submissionDate: new Date().toISOString(),
    sessionCount: input.sessionCount || 1, // Default to 1 session if not specified
    ...input,
  };
  applications.push(app);
  writeJSON(KEYS.applications, applications);
  
  // Auto-create Session records for this observership
  const sessionCount = app.sessionCount || 1;
  for (let i = 1; i <= sessionCount; i++) {
    createSession(app.id, i);
  }
  
  return app;
}

export function getApplications(): Application[] {
  return readJSON<Application[]>(KEYS.applications, []);
}

export function updateApplicationStatus(applicationId: string, status: Application["status"], notes?: string): Application | null {
  const applications = readJSON<Application[]>(KEYS.applications, []);
  const appIndex = applications.findIndex(a => a.id === applicationId);
  
  if (appIndex === -1) return null;
  
  const updated = {
    ...applications[appIndex],
    status,
    notes: notes || applications[appIndex].notes,
  };
  
  applications[appIndex] = updated;
  writeJSON(KEYS.applications, applications);
  
  return updated;
}

export function setApplicationRegulatory(applicationId: string, regulatory: Application["regulatory"]): Application | null {
  const applications = readJSON<Application[]>(KEYS.applications, []);
  const appIndex = applications.findIndex(a => a.id === applicationId);
  if (appIndex === -1) return null;
  const updated: Application = {
    ...applications[appIndex],
    regulatory,
  };
  applications[appIndex] = updated;
  writeJSON(KEYS.applications, applications);
  return updated;
}

export function setApplicationAssignment(applicationId: string, assignment: { supervisor?: string; department?: string }): Application | null {
  const applications = readJSON<Application[]>(KEYS.applications, []);
  const appIndex = applications.findIndex(a => a.id === applicationId);
  if (appIndex === -1) return null;
  const updated: Application = {
    ...applications[appIndex],
    supervisor: assignment.supervisor ?? applications[appIndex].supervisor,
    department: assignment.department ?? applications[appIndex].department,
  };
  applications[appIndex] = updated;
  writeJSON(KEYS.applications, applications);
  return updated;
}

export function setApplicationAllocation(applicationId: string, allocation: { source: "Student" | "Hospital" | "EHS"; assignedHospitalId?: string; ehsReference?: string }): Application | null {
  const applications = readJSON<Application[]>(KEYS.applications, []);
  const appIndex = applications.findIndex(a => a.id === applicationId);
  if (appIndex === -1) return null;
  const now = new Date().toISOString();
  const updated: Application = {
    ...applications[appIndex],
    allocation: {
      source: allocation.source,
      assignedHospitalId: allocation.assignedHospitalId ?? applications[appIndex].allocation?.assignedHospitalId,
      ehsReference: allocation.ehsReference ?? applications[appIndex].allocation?.ehsReference,
      allocatedAt: now,
    },
    // If an assigned hospital id is provided, also set hospitalId on the application
    hospitalId: allocation.assignedHospitalId ?? applications[appIndex].hospitalId,
  };
  applications[appIndex] = updated;
  writeJSON(KEYS.applications, applications);
  return updated;
}

export function getApplicationsByEHSReference(ehsReference: string): Application[] {
  const applications = readJSON<Application[]>(KEYS.applications, []);
  return applications.filter(app => app.allocation?.ehsReference === ehsReference);
}

export function deleteApplication(applicationId: string): boolean {
  const applications = readJSON<Application[]>(KEYS.applications, []);
  const next = applications.filter(a => a.id !== applicationId);
  const removed = next.length !== applications.length;
  if (removed) {
    writeJSON(KEYS.applications, next);
  }
  return removed;
}

/* DOCUMENTS */
export function addDocument(input: Omit<Document, "id" | "uploadedAt" | "validationStatus">): Document {
  const docs = readJSON<Document[]>(KEYS.documents, []);
  const doc: Document = {
    id: newId("doc"),
    uploadedAt: new Date().toISOString(),
    validationStatus: "Pending",
    ...input,
  };
  docs.push(doc);
  writeJSON(KEYS.documents, docs);
  return doc;
}

export function getDocuments(): Document[] {
  return readJSON<Document[]>(KEYS.documents, []);
}

export function setDocumentValidation(documentId: string, validationStatus: Document["validationStatus"]) {
  const docs = readJSON<Document[]>(KEYS.documents, []);
  const next = docs.map((d) => (d.id === documentId ? { ...d, validationStatus } : d));
  writeJSON(KEYS.documents, next);
}

/* PAYMENTS (placeholder) */
export function createPayment(input: Omit<Payment, "id" | "paymentStatus" | "currency" | "createdAt">): Payment {
  const payments = readJSON<Payment[]>(KEYS.payments, []);
  const payment: Payment = {
    id: newId("pay"),
    currency: "AED",
    paymentStatus: "Unpaid",
    createdAt: new Date().toISOString(),
    ...input,
  };
  payments.push(payment);
  writeJSON(KEYS.payments, payments);
  return payment;
}

export function getPayments(): Payment[] {
  return readJSON<Payment[]>(KEYS.payments, []);
}

export function markPaymentPaid(paymentId: string) {
  const payments = readJSON<Payment[]>(KEYS.payments, []);
  const next = payments.map((p) => (p.id === paymentId ? { ...p, paymentStatus: "Paid" } : p));
  writeJSON(KEYS.payments, next);
}

/* AUDIT */
export function logAudit(entry: Omit<AuditLog, "id" | "timestamp">): AuditLog {
  const audit = readJSON<AuditLog[]>(KEYS.audit, []);
  const item: AuditLog = {
    id: newId("aud"),
    timestamp: new Date().toISOString(),
    ...entry,
  };
  audit.unshift(item);
  writeJSON(KEYS.audit, audit);
  return item;
}

export function getAudit(): AuditLog[] {
  return readJSON<AuditLog[]>(KEYS.audit, []);
}

/* HOSPITAL-SPECIFIC FUNCTIONS */
export function getApplicationsByHospital(hospitalId: string): Application[] {
  const applications = readJSON<Application[]>(KEYS.applications, []);
  return applications.filter(app => app.hospitalId === hospitalId);
}

/* USERS */
export function createUser(input: Omit<User, "id">): User {
  const users = readJSON<User[]>(KEYS.users, []);
  const user: User = {
    id: newId("usr"),
    ...input,
  };
  users.push(user);
  writeJSON(KEYS.users, users);
  return user;
}

export function getUsers(): User[] {
  return readJSON<User[]>(KEYS.users, []);
}

export function findUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find(user => user.email === email);
}

export function loginUser(email: string, password: string): User | null {
  // Simple password check - in real app, this would be hashed
  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) return null;

  // Prefer stored password; fall back to legacy "password" for seeded users without password
  const expectedPassword = user.password || "password";

  if (password === expectedPassword) {
    writeJSON(KEYS.currentUser, user);
    return user;
  }

  return null;
}

export function logoutUser() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(KEYS.currentUser);
  }
}

export function getCurrentUser(): User | null {
  return readJSON<User | null>(KEYS.currentUser, null);
}

/* NOTIFICATIONS */
export function createNotification(input: Omit<Notification, "id" | "isRead" | "createdAt">): Notification {
  const notifications = readJSON<Notification[]>(KEYS.notifications, []);
  const notification: Notification = {
    id: newId("notif"),
    isRead: false,
    createdAt: new Date().toISOString(),
    ...input,
  };
  notifications.push(notification);
  writeJSON(KEYS.notifications, notifications);
  return notification;
}

export function getNotifications(): Notification[] {
  return readJSON<Notification[]>(KEYS.notifications, []);
}

export function getUserNotifications(userId: string): Notification[] {
  const notifications = getNotifications();
  return notifications.filter(n => n.userId === userId);
}

export function markNotificationAsRead(notificationId: string): void {
  const notifications = getNotifications();
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
    writeJSON(KEYS.notifications, notifications);
  }
}

/* PROGRAM REMINDERS */
export function createReminder(input: Omit<ProgramReminder, "id" | "createdAt" | "isActive">): ProgramReminder {
  const reminders = readJSON<ProgramReminder[]>(KEYS.reminders, []);
  const reminder: ProgramReminder = {
    id: newId("rem"),
    createdAt: new Date().toISOString(),
    isActive: true,
    ...input,
  };
  reminders.push(reminder);
  writeJSON(KEYS.reminders, reminders);
  return reminder;
}

export function getReminders(): ProgramReminder[] {
  return readJSON<ProgramReminder[]>(KEYS.reminders, []);
}

export function getRemindersByProgram(programId: string): ProgramReminder[] {
  const reminders = getReminders();
  return reminders.filter(r => r.programId === programId && r.isActive);
}

export function removeReminder(reminderId: string): void {
  const reminders = getReminders();
  const reminder = reminders.find(r => r.id === reminderId);
  if (reminder) {
    reminder.isActive = false;
    writeJSON(KEYS.reminders, reminders);
  }
}

/* PROGRAM CRITERIA */
type ProgramCriteriaMap = Record<string, string[]>;

export function getProgramCriteria(programId: string): string[] {
  const map = readJSON<ProgramCriteriaMap>(KEYS.programCriteria, {});
  return map[programId] || [];
}

export function setProgramCriteria(programId: string, criteria: string[]): void {
  const map = readJSON<ProgramCriteriaMap>(KEYS.programCriteria, {});
  map[programId] = criteria;
  writeJSON(KEYS.programCriteria, map);
}

/* PROGRAM METADATA (pilot-friendly fields) */
type ProgramMetadata = {
  bestFor?: string;
  notRecommendedFor?: string;
  exposureLevel?: string;
  limitations?: string;
};

type ProgramMetadataMap = Record<string, ProgramMetadata>;

export function getProgramMetadata(programId: string): ProgramMetadata | null {
  const map = readJSON<ProgramMetadataMap>(KEYS.programMetadata, {});
  return map[programId] || null;
}

export function setProgramMetadata(programId: string, metadata: ProgramMetadata): void {
  const map = readJSON<ProgramMetadataMap>(KEYS.programMetadata, {});
  map[programId] = metadata;
  writeJSON(KEYS.programMetadata, map);
}

/* FORM TEMPLATES */
export function createFormTemplate(template: Omit<FormTemplate, 'id' | 'createdAt' | 'updatedAt'>): FormTemplate {
  const templates = readJSON<FormTemplate[]>(KEYS.formTemplates, []);
  const newTemplate: FormTemplate = {
    ...template,
    id: newId('form'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  templates.push(newTemplate);
  writeJSON(KEYS.formTemplates, templates);
  return newTemplate;
}

export function getFormTemplates(hospitalId?: string): FormTemplate[] {
  const templates = readJSON<FormTemplate[]>(KEYS.formTemplates, []);
  if (hospitalId) {
    return templates.filter((t) => t.hospitalId === hospitalId);
  }
  return templates;
}

export function getFormTemplate(id: string): FormTemplate | null {
  const templates = readJSON<FormTemplate[]>(KEYS.formTemplates, []);
  return templates.find((t) => t.id === id) || null;
}

export function updateFormTemplate(id: string, updates: Partial<FormTemplate>): FormTemplate | null {
  const templates = readJSON<FormTemplate[]>(KEYS.formTemplates, []);
  const index = templates.findIndex((t) => t.id === id);
  if (index === -1) return null;
  templates[index] = { ...templates[index], ...updates, updatedAt: new Date().toISOString() };
  writeJSON(KEYS.formTemplates, templates);
  return templates[index];
}

/* FORM RESPONSES */
export function submitFormResponse(response: Omit<FormResponse, 'id' | 'updatedAt'>): FormResponse {
  const responses = readJSON<FormResponse[]>(KEYS.formResponses, []);
  const newResponse: FormResponse = {
    ...response,
    id: newId('resp'),
    updatedAt: new Date().toISOString(),
  };
  responses.push(newResponse);
  writeJSON(KEYS.formResponses, responses);
  return newResponse;
}

export function getFormResponses(observershipId?: string, studentId?: string): FormResponse[] {
  const responses = readJSON<FormResponse[]>(KEYS.formResponses, []);
  return responses.filter((r) => {
    if (observershipId && r.observershipId !== observershipId) return false;
    if (studentId && r.studentId !== studentId) return false;
    return true;
  });
}

export function getFormResponse(id: string): FormResponse | null {
  const responses = readJSON<FormResponse[]>(KEYS.formResponses, []);
  return responses.find((r) => r.id === id) || null;
}

export function updateFormResponse(id: string, updates: Partial<FormResponse>): FormResponse | null {
  const responses = readJSON<FormResponse[]>(KEYS.formResponses, []);
  const index = responses.findIndex((r) => r.id === id);
  if (index === -1) return null;
  responses[index] = { ...responses[index], ...updates, updatedAt: new Date().toISOString() };
  writeJSON(KEYS.formResponses, responses);
  return responses[index];
}

/* SESSIONS */
export function createSession(applicationId: string, sessionNumber: number): Session {
  const sessions = readJSON<Session[]>(KEYS.sessions, []);
  const newSession: Session = {
    id: newId('sess'),
    applicationId,
    sessionNumber,
    status: 'not_started',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  sessions.push(newSession);
  writeJSON(KEYS.sessions, sessions);
  return newSession;
}

export function getSessions(applicationId?: string): Session[] {
  const sessions = readJSON<Session[]>(KEYS.sessions, []);
  if (applicationId) {
    return sessions
      .filter((s) => s.applicationId === applicationId)
      .sort((a, b) => a.sessionNumber - b.sessionNumber);
  }
  return sessions;
}

export function getSession(id: string): Session | null {
  const sessions = readJSON<Session[]>(KEYS.sessions, []);
  return sessions.find((s) => s.id === id) || null;
}

export function updateSession(id: string, updates: Partial<Session>): Session | null {
  const sessions = readJSON<Session[]>(KEYS.sessions, []);
  const index = sessions.findIndex((s) => s.id === id);
  if (index === -1) return null;
  sessions[index] = { ...sessions[index], ...updates, updatedAt: new Date().toISOString() };
  writeJSON(KEYS.sessions, sessions);
  return sessions[index];
}

export function startSession(id: string): Session | null {
  return updateSession(id, {
    status: 'in_progress',
    startedAt: new Date().toISOString(),
  });
}

export function completeSession(id: string): Session | null {
  return updateSession(id, {
    status: 'completed',
    completedAt: new Date().toISOString(),
  });
}

/* OBSERVATION FORMS - ADMIN FORM BUILDER */
export function createObservationForm(input: Omit<ObservationForm, "id" | "createdAt" | "updatedAt">): ObservationForm {
  const forms = readJSON<ObservationForm[]>(KEYS.observationForms, []);
  const form: ObservationForm = {
    id: newId("form"),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...input,
  };
  forms.push(form);
  writeJSON(KEYS.observationForms, forms);
  return form;
}

export function getObservationForms(applicationId?: string): ObservationForm[] {
  const forms = readJSON<ObservationForm[]>(KEYS.observationForms, []);
  if (applicationId) {
    return forms.filter(f => f.applicationId === applicationId);
  }
  return forms;
}

export function getObservationFormById(formId: string): ObservationForm | null {
  const forms = readJSON<ObservationForm[]>(KEYS.observationForms, []);
  return forms.find(f => f.id === formId) || null;
}

export function updateObservationForm(formId: string, updates: Partial<ObservationForm>): ObservationForm | null {
  const forms = readJSON<ObservationForm[]>(KEYS.observationForms, []);
  const form = forms.find(f => f.id === formId);
  if (!form) return null;
  
  const updated = {
    ...form,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  const index = forms.indexOf(form);
  forms[index] = updated;
  writeJSON(KEYS.observationForms, forms);
  return updated;
}

export function deleteObservationForm(formId: string): boolean {
  const forms = readJSON<ObservationForm[]>(KEYS.observationForms, []);
  const index = forms.findIndex(f => f.id === formId);
  if (index === -1) return false;
  forms.splice(index, 1);
  writeJSON(KEYS.observationForms, forms);
  return true;
}

/* SESSION FORM SUBMISSIONS - STUDENT SUBMISSIONS */
export function createSessionFormSubmission(input: Omit<SessionFormSubmission, "id" | "submittedAt">): SessionFormSubmission {
  const submissions = readJSON<SessionFormSubmission[]>(KEYS.sessionFormSubmissions, []);
  const submission: SessionFormSubmission = {
    id: newId("sub"),
    submittedAt: new Date().toISOString(),
    ...input,
  };
  submissions.push(submission);
  writeJSON(KEYS.sessionFormSubmissions, submissions);
  return submission;
}

export function getSessionFormSubmissions(sessionId?: string, studentId?: string): SessionFormSubmission[] {
  const submissions = readJSON<SessionFormSubmission[]>(KEYS.sessionFormSubmissions, []);
  let result = submissions;
  
  if (sessionId) {
    result = result.filter(s => s.sessionId === sessionId);
  }
  if (studentId) {
    result = result.filter(s => s.studentId === studentId);
  }
  
  return result;
}

export function getSessionFormSubmissionById(submissionId: string): SessionFormSubmission | null {
  const submissions = readJSON<SessionFormSubmission[]>(KEYS.sessionFormSubmissions, []);
  return submissions.find(s => s.id === submissionId) || null;
}

export function updateSessionFormSubmission(submissionId: string, updates: Partial<SessionFormSubmission>): SessionFormSubmission | null {
  const submissions = readJSON<SessionFormSubmission[]>(KEYS.sessionFormSubmissions, []);
  const submission = submissions.find(s => s.id === submissionId);
  if (!submission) return null;
  
  const updated = { ...submission, ...updates };
  const index = submissions.indexOf(submission);
  submissions[index] = updated;
  writeJSON(KEYS.sessionFormSubmissions, submissions);
  return updated;
}

export function reviewSessionFormSubmission(submissionId: string, notes: string, rating: number, reviewedBy: string): SessionFormSubmission | null {
  return updateSessionFormSubmission(submissionId, {
    status: 'reviewed',
    supervisorReview: {
      notes,
      rating,
      reviewedAt: new Date().toISOString(),
      reviewedBy,
    },
  });
}

/* PERFORMANCE METRICS */
export function calculatePerformanceMetrics(studentId: string, applicationId: string): StudentPerformanceMetrics | null {
  const submissions = readJSON<SessionFormSubmission[]>(KEYS.sessionFormSubmissions, [])
    .filter(s => s.studentId === studentId && s.applicationId === applicationId);
  
  if (submissions.length === 0) return null;

  const ratings = submissions
    .filter(s => s.supervisorReview?.rating)
    .map(s => s.supervisorReview!.rating!);
  
  const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  
  // Determine trend (mock for demo)
  const trend: "improving" | "stable" | "declining" = ratings.length >= 2
    ? ratings[ratings.length - 1] > ratings[0] ? "improving" : ratings[ratings.length - 1] < ratings[0] ? "declining" : "stable"
    : "stable";

  return {
    studentId,
    applicationId,
    sessionId: submissions[0]?.sessionId || "",
    averageRating,
    completedForms: submissions.length,
    pendingForms: submissions.filter(s => s.status === 'submitted').length,
    lastSubmissionDate: submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0]?.submittedAt,
    performanceTrend: trend,
    keyStrengths: ["Communication", "Professionalism", "Engagement"],
    areasForImprovement: ["Time Management", "Note Taking"],
  };
}

export function getPerformanceMetrics(applicationId?: string): StudentPerformanceMetrics[] {
  const submissions = readJSON<SessionFormSubmission[]>(KEYS.sessionFormSubmissions, []);
  const applications = getApplications();
  
  let relevantApps = applications;
  if (applicationId) {
    relevantApps = applications.filter(a => a.id === applicationId);
  }

  const metrics: StudentPerformanceMetrics[] = [];
  relevantApps.forEach(app => {
    const metric = calculatePerformanceMetrics(app.studentId, app.id);
    if (metric) metrics.push(metric);
  });

  return metrics;
}

  /* CHAT MESSAGES */
  export function createConversation(studentId: string, supervisorId: string, applicationId?: string): Conversation {
    const conversations = readJSON<Conversation[]>(KEYS.conversations, []);
  
    // Check if conversation already exists
    const existing = conversations.find(
      c => c.studentId === studentId && c.supervisorId === supervisorId
    );
  
    if (existing) return existing;
  
    const conversation: Conversation = {
      id: newId("conv"),
      studentId,
      supervisorId,
      applicationId,
      lastMessageAt: new Date().toISOString(),
      lastMessage: "Conversation started",
      unreadCount: {
        student: 0,
        supervisor: 0,
      },
      createdAt: new Date().toISOString(),
    };
  
    conversations.push(conversation);
    writeJSON(KEYS.conversations, conversations);
    return conversation;
  }

  export function getConversations(userId: string, role: "student" | "supervisor"): Conversation[] {
    const conversations = readJSON<Conversation[]>(KEYS.conversations, []);
  
    if (role === "student") {
      return conversations.filter(c => c.studentId === userId);
    } else {
      return conversations.filter(c => c.supervisorId === userId);
    }
  }

  export function getConversation(conversationId: string): Conversation | null {
    const conversations = readJSON<Conversation[]>(KEYS.conversations, []);
    return conversations.find(c => c.id === conversationId) || null;
  }

  export function sendMessage(input: Omit<ChatMessage, "id" | "timestamp" | "isRead">): ChatMessage {
    const messages = readJSON<ChatMessage[]>(KEYS.chatMessages, []);
    const conversations = readJSON<Conversation[]>(KEYS.conversations, []);
  
    const message: ChatMessage = {
      id: newId("msg"),
      timestamp: new Date().toISOString(),
      isRead: false,
      ...input,
    };
  
    messages.push(message);
    writeJSON(KEYS.chatMessages, messages);
  
    // Update conversation
    const convIndex = conversations.findIndex(c => c.id === input.conversationId);
    if (convIndex >= 0) {
      conversations[convIndex].lastMessageAt = message.timestamp;
      conversations[convIndex].lastMessage = message.message.slice(0, 100);
    
      // Increment unread count for recipient
      if (input.senderRole === "student") {
        conversations[convIndex].unreadCount.supervisor += 1;
      } else {
        conversations[convIndex].unreadCount.student += 1;
      }
    
      writeJSON(KEYS.conversations, conversations);
    }
  
    return message;
  }

  export function getMessages(conversationId: string): ChatMessage[] {
    const messages = readJSON<ChatMessage[]>(KEYS.chatMessages, []);
    return messages.filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  export function markMessagesAsRead(conversationId: string, userId: string): void {
    const messages = readJSON<ChatMessage[]>(KEYS.chatMessages, []);
    const conversations = readJSON<Conversation[]>(KEYS.conversations, []);
  
    // Mark messages as read
    const updatedMessages = messages.map(msg => {
      if (msg.conversationId === conversationId && msg.recipientId === userId && !msg.isRead) {
        return { ...msg, isRead: true };
      }
      return msg;
    });
  
    writeJSON(KEYS.chatMessages, updatedMessages);
  
    // Reset unread count
    const convIndex = conversations.findIndex(c => c.id === conversationId);
    if (convIndex >= 0) {
      const conv = conversations[convIndex];
      if (conv.studentId === userId) {
        conversations[convIndex].unreadCount.student = 0;
      } else if (conv.supervisorId === userId) {
        conversations[convIndex].unreadCount.supervisor = 0;
      }
      writeJSON(KEYS.conversations, conversations);
    }
  }

/* STUDENT PROGRESS & XP */
export function getOrCreateStudentProgress(studentId: string): StudentProgress {
  const allProgress = readJSON<StudentProgress[]>(KEYS.studentProgress, []);
  let progress = allProgress.find(p => p.studentId === studentId);
  
  if (!progress) {
    progress = {
      studentId,
      xpPoints: 0,
      reflectionsCompleted: 0,
      lastUpdated: new Date().toISOString(),
    };
    allProgress.push(progress);
    writeJSON(KEYS.studentProgress, allProgress);
  }
  
  return progress;
}

export function addXP(studentId: string, xpAmount: number): StudentProgress {
  const allProgress = readJSON<StudentProgress[]>(KEYS.studentProgress, []);
  let progress = allProgress.find(p => p.studentId === studentId);
  
  if (!progress) {
    progress = {
      studentId,
      xpPoints: xpAmount,
      reflectionsCompleted: 1,
      lastUpdated: new Date().toISOString(),
    };
  } else {
    progress.xpPoints += xpAmount;
    progress.reflectionsCompleted += 1;
    progress.lastUpdated = new Date().toISOString();
  }
  
  const idx = allProgress.findIndex(p => p.studentId === studentId);
  if (idx >= 0) {
    allProgress[idx] = progress;
  } else {
    allProgress.push(progress);
  }
  
  writeJSON(KEYS.studentProgress, allProgress);
  return progress;
}

export function getStudentProgress(studentId: string): StudentProgress | null {
  const allProgress = readJSON<StudentProgress[]>(KEYS.studentProgress, []);
  return allProgress.find(p => p.studentId === studentId) || null;
}

