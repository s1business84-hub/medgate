import type { Student, Application, Document, Payment, AuditLog, User, Notification, ProgramReminder } from "./types";
import { programs, hospitals } from "./mockData";

const KEYS = {
  students: "medgate_students",
  applications: "medgate_applications",
  documents: "medgate_documents",
  payments: "medgate_payments",
  audit: "medgate_audit",
  users: "medgate_users",
  currentUser: "medgate_current_user",
  notifications: "medgate_notifications",
  reminders: "medgate_reminders",
  programCriteria: "medgate_program_criteria",
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
  // Capacity guard: block if hospital department exceeds declared maxStudentsPerPeriod
  const applications = readJSON<Application[]>(KEYS.applications, []);

  const program = programs.find(p => p.id === input.programId);
  const hospitalId = program?.hospitalId || input.hospitalId;
  const hospital = hospitals.find(h => h.id === hospitalId);
  const maxAllowed = hospital?.maxStudentsPerPeriod ?? 5;

  const activeCount = applications.filter(a => {
    // count all applications for same hospital that are not Rejected
    const p = programs.find(pp => pp.id === a.programId);
    return p?.hospitalId === hospitalId && a.status !== 'Rejected';
  }).length;

  if (activeCount >= maxAllowed) {
    throw new Error('Department capacity reached');
  }

  const app: Application = {
    id: newId("app"),
    status: "Submitted",
    submissionDate: new Date().toISOString(),
    ...input,
  };
  applications.push(app);
  writeJSON(KEYS.applications, applications);
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
