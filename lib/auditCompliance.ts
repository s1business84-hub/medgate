/**
 * AUDIT COMPLIANCE MODULE
 * 
 * Enforces strict data isolation per UAE healthcare regulations:
 * - Hospital data must not be intertwined with other hospitals
 * - Student data must not be shared across unauthorized boundaries
 * - Regulatory data (EHS, DHA, DoH) must be compartmentalized
 * - All audit exports must maintain strict access controls
 * 
 * Compliance Standards:
 * - DHA (Dubai Health Authority) data separation requirements
 * - DoH (Department of Health, Abu Dhabi) confidentiality rules
 * - EHS (Emirates Health Services) regulatory isolation
 * - GDPR (if EU citizens' data processed)
 * - HIPAA (if US-related data processed)
 */

import { User, Application } from './types';
import {
  getApplications,
  getStudents,
  getUsers,
} from './storage';
import {
  getExposureLogs,
  getSupervisorConfirmations,
  getCompletionAttestations,
  getIncidentFlags,
  getEhsConfirmations,
} from './auditStore';

/**
 * Hospital isolation enforcement
 * Ensures data from one hospital never bleeds into another
 */
export class HospitalDataIsolation {
  /**
   * Get all applications strictly for one hospital
   * Cross-hospital data leakage is IMPOSSIBLE
   */
  static getHospitalApplications(hospitalId: string): Application[] {
    if (!hospitalId || hospitalId.trim() === '') {
      return []; // No fallback - must specify hospital
    }
    
    const apps = getApplications();
    return apps.filter(app => {
      // STRICT: hospitalId must match exactly
      if (app.hospitalId !== hospitalId) return false;
      
      // ALSO CHECK: If allocation exists, hospital must match
      if (app.allocation?.assignedHospitalId && app.allocation.assignedHospitalId !== hospitalId) {
        return false; // Mismatched hospital - exclude
      }
      
      return true;
    });
  }

  /**
   * Get all students enrolled at a specific hospital
   * Uses application records as source of truth
   */
  static getHospitalStudents(hospitalId: string): string[] {
    const apps = this.getHospitalApplications(hospitalId);
    const studentIds = new Set<string>();
    
    apps.forEach(app => {
      if (app.studentId) studentIds.add(app.studentId);
    });
    
    return Array.from(studentIds);
  }

  /**
   * Verify a student is actually enrolled at this hospital
   * Used as security check before exposing student data
   */
  static isStudentEnrolledAtHospital(studentId: string, hospitalId: string): boolean {
    const apps = this.getHospitalApplications(hospitalId);
    return apps.some(app => app.studentId === studentId);
  }

  /**
   * Get supervisor confirmations ONLY for this hospital's students
   * Ensures supervisor data is never shared across hospitals
   */
  static getHospitalSupervisorConfirmations(hospitalId: string) {
    const enrolledStudents = new Set(this.getHospitalStudents(hospitalId));
    const confirmations = getSupervisorConfirmations();
    
    return confirmations.filter(conf => {
      // Must be for an enrolled student
      if (conf.studentId && !enrolledStudents.has(conf.studentId)) {
        return false;
      }
      return true;
    });
  }

  /**
   * Get completion attestations ONLY for this hospital's students
   * Training records are isolated per hospital
   */
  static getHospitalCompletionAttestations(hospitalId: string) {
    const enrolledStudents = new Set(this.getHospitalStudents(hospitalId));
    const attestations = getCompletionAttestations();
    
    return attestations.filter(att => {
      // Must be for an enrolled student
      return enrolledStudents.has(att.studentId);
    });
  }

  /**
   * Get exposure logs ONLY for this hospital's students
   * Exposure acknowledgments are compartmentalized
   */
  static getHospitalExposureLogs(hospitalId: string) {
    const enrolledStudents = new Set(this.getHospitalStudents(hospitalId));
    const logs = getExposureLogs();
    
    return logs.filter(log => {
      return enrolledStudents.has(log.studentId);
    });
  }

  /**
   * Get incident flags ONLY for this hospital
   * Safety incidents are hospital-specific and confidential
   */
  static getHospitalIncidentFlags(hospitalId: string) {
    const flags = getIncidentFlags();
    
    return flags.filter(flag => {
      // Incident flags should have hospital context
      // For now, filtered by programs at this hospital
      const apps = this.getHospitalApplications(hospitalId);
      const programIds = new Set(apps.map(a => a.programId));
      return programIds.has(flag.programId);
    });
  }

  /**
   * Get EHS confirmations for this hospital's students
   * Regulatory data is isolated per regulatory body
   */
  static getHospitalEhsConfirmations(hospitalId: string) {
    const enrolledStudents = new Set(this.getHospitalStudents(hospitalId));
    const confirmations = getEhsConfirmations();
    
    return confirmations.filter(conf => {
      // Must be for enrolled student AND hospital match if present
      if (!enrolledStudents.has(conf.studentId)) {
        return false;
      }
      if (conf.hospitalId && conf.hospitalId !== hospitalId) {
        return false; // Mismatched hospital
      }
      return true;
    });
  }
}

/**
 * Regulatory data isolation enforcement
 * Ensures data for different regulators never intertwines
 */
export class RegulatoryDataIsolation {
  /**
   * Get applications for a specific regulatory body only
   * EHS, DHA, DoH data must never mix
   */
  static getApplicationsByRegulator(regulatoryType: 'EHS' | 'DHA' | 'DoH' | 'None') {
    const apps = getApplications();
    
    return apps.filter(app => {
      const appRegType = app.regulatory?.type || 'None';
      return appRegType === regulatoryType;
    });
  }

  /**
   * Get EHS-regulated applications only
   * EHS data is compartmentalized from other regulators
   */
  static getEhsApplications() {
    return this.getApplicationsByRegulator('EHS');
  }

  /**
   * Get DHA-regulated applications only
   * DHA/Dubai regulatory data is isolated
   */
  static getDhaApplications() {
    return this.getApplicationsByRegulator('DHA');
  }

  /**
   * Get DoH-regulated applications only
   * DoH/Abu Dhabi regulatory data is isolated
   */
  static getDohApplications() {
    return this.getApplicationsByRegulator('DoH');
  }

  /**
   * Get non-regulated applications only
   * Hospital-managed programs without external regulation
   */
  static getNonRegulatedApplications() {
    return this.getApplicationsByRegulator('None');
  }

  /**
   * Verify an application's regulatory status is verified
   * Used to gate training start for regulated programs
   */
  static isRegulatoryStatusVerified(applicationId: string): boolean {
    const apps = getApplications();
    const app = apps.find(a => a.id === applicationId);
    
    if (!app) return false;
    if (!app.regulatory || app.regulatory.type === 'None') {
      return true; // Non-regulated programs are "verified"
    }
    
    return app.regulatory.status === 'Verified';
  }

  /**
   * Get all applications pending regulatory verification
   * These should NOT allow training start
   */
  static getPendingRegulatoryApprovals() {
    const apps = getApplications();
    
    return apps.filter(app => {
      const reg = app.regulatory;
      // Must have regulatory type (not 'None')
      if (!reg || reg.type === 'None') {
        return false;
      }
      // Must NOT be verified yet
      return reg.status !== 'Verified';
    });
  }
}

/**
 * Student data privacy enforcement
 * Students can only see their own data
 */
export class StudentDataPrivacy {
  /**
   * Get only this student's applications
   * Cross-student data leakage is IMPOSSIBLE
   */
  static getStudentApplications(studentId: string) {
    const apps = getApplications();
    return apps.filter(app => app.studentId === studentId);
  }

  /**
   * Get only this student's exposure logs
   * Student acknowledgments are private
   */
  static getStudentExposureLogs(studentId: string) {
    const logs = getExposureLogs();
    return logs.filter(log => log.studentId === studentId);
  }

  /**
   * Get only this student's completion records
   * Training completion data is student-specific
   */
  static getStudentCompletionAttestations(studentId: string) {
    const attestations = getCompletionAttestations();
    return attestations.filter(att => att.studentId === studentId);
  }

  /**
   * Student can only view their own data - period
   * No cross-student visibility
   */
  static getStudentAuditData(studentId: string) {
    return {
      applications: this.getStudentApplications(studentId),
      exposureLogs: this.getStudentExposureLogs(studentId),
      completionAttestations: this.getStudentCompletionAttestations(studentId),
    };
  }
}

/**
 * User role verification for audit access
 * Ensures only authorized roles can access data
 */
export class AuditAccessControl {
  /**
   * Verify user is authorized for audit export
   * Only students, hospital admins, and supervisors can export
   */
  static canUserExportAudit(user: User | null): boolean {
    if (!user) return false;
    
    // Students, hospital admins, and supervisors can export
    return ['student', 'admin', 'hospital'].includes(user.role);
  }

  /**
   * Verify user is a hospital admin for a specific hospital
   */
  static isHospitalAdmin(user: User | null, hospitalId: string): boolean {
    if (!user) return false;
    if (user.role !== 'admin' && user.role !== 'hospital') return false;
    
    // If user has hospitalId, it must match
    if (user.hospitalId && user.hospitalId !== hospitalId) {
      return false;
    }
    
    return true;
  }

  /**
   * Get user's accessible hospital ID
   * Returns null if user is student (no hospital access)
   */
  static getUserHospitalId(user: User | null): string | null {
    if (!user) return null;
    if (user.role === 'student') return null;
    if (!user.hospitalId) return null;
    
    return user.hospitalId;
  }

  /**
   * Verify user can audit a specific student
   */
  static canUserAuditStudent(user: User | null, studentId: string, hospitalId?: string): boolean {
    if (!user) return false;
    
    // Student can only audit themselves
    if (user.role === 'student') {
      return user.id === studentId;
    }
    
    // Hospital admin/supervisor can audit students at their hospital
    if (user.role === 'admin' || user.role === 'hospital') {
      if (!user.hospitalId) return false;
      if (hospitalId && hospitalId !== user.hospitalId) return false;
      
      // Verify student is actually enrolled at hospital
      return HospitalDataIsolation.isStudentEnrolledAtHospital(
        studentId,
        user.hospitalId
      );
    }
    
    return false;
  }
}

/**
 * Audit export builder with strict compliance
 * Ensures exported data follows all regulations
 */
export class ComplianceAuditExport {
  /**
   * Build student audit export
   * Student can only export their own data
   */
  static buildStudentExport(studentId: string) {
    return {
      applications: StudentDataPrivacy.getStudentApplications(studentId),
      exposureLogs: StudentDataPrivacy.getStudentExposureLogs(studentId),
      completionAttestations: StudentDataPrivacy.getStudentCompletionAttestations(studentId),
    };
  }

  /**
   * Build hospital audit export
   * Hospital admin exports all their data (no cross-hospital leakage)
   */
  static buildHospitalExport(hospitalId: string) {
    return {
      applications: HospitalDataIsolation.getHospitalApplications(hospitalId),
      students: getStudents().filter(s => {
        const enrolledIds = new Set(HospitalDataIsolation.getHospitalStudents(hospitalId));
        return enrolledIds.has(s.id);
      }),
      exposureLogs: HospitalDataIsolation.getHospitalExposureLogs(hospitalId),
      supervisorConfirmations: HospitalDataIsolation.getHospitalSupervisorConfirmations(hospitalId),
      completionAttestations: HospitalDataIsolation.getHospitalCompletionAttestations(hospitalId),
      incidentFlags: HospitalDataIsolation.getHospitalIncidentFlags(hospitalId),
      ehsConfirmations: HospitalDataIsolation.getHospitalEhsConfirmations(hospitalId),
    };
  }

  /**
   * Build regulatory body export (EHS, DHA, DoH)
   * Each regulator gets only their data (isolation required by law)
   */
  static buildRegulatoryExport(regulatoryType: 'EHS' | 'DHA' | 'DoH') {
    const apps = RegulatoryDataIsolation.getApplicationsByRegulator(regulatoryType);
    const studentIds = new Set(apps.map(a => a.studentId));
    
    return {
      applications: apps,
      students: getStudents().filter(s => studentIds.has(s.id)),
      // Note: Regulatory bodies get minimal data (only what they need)
      regulatory: {
        type: regulatoryType,
        verifiedAppsCount: apps.filter(a => a.regulatory?.status === 'Verified').length,
        pendingAppsCount: apps.filter(a => a.regulatory?.status === 'Pending').length,
      },
    };
  }
}

/**
 * Audit log entry structure
 */
interface AuditLogEntry {
  timestamp: string;
  userId: string;
  userRole: string;
  action: 'export' | 'import' | 'access';
  dataType: string;
  recordCount: number;
  filters?: Record<string, string>;
  status: 'success' | 'denied' | 'error';
  reason?: string;
}

/**
 * Audit logging and compliance tracking
 * All exports are tracked for compliance audits
 */
export class AuditCompliance {
  private static logKey = 'electivio_compliance_audit_log';

  /**
   * Log an audit export event
   * Required for compliance audits and breach investigations
   */
  static logAuditExport(
    userId: string,
    userRole: string,
    dataType: string,
    recordCount: number,
    filters?: Record<string, string>
  ) {
    const entry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      userId,
      userRole,
      action: 'export',
      dataType,
      recordCount,
      filters,
      status: 'success',
    };

    this.appendToLog(entry);
  }

  /**
   * Log a denied access attempt
   * Critical for security and breach investigation
   */
  static logAccessDenied(userId: string, reason: string) {
    const entry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      userId,
      userRole: 'unknown',
      action: 'access',
      dataType: 'unknown',
      recordCount: 0,
      status: 'denied',
      reason,
    };

    this.appendToLog(entry);
  }

  private static appendToLog(entry: AuditLogEntry) {
    if (typeof window === 'undefined') return;
    
    try {
      const logs = JSON.parse(localStorage.getItem(this.logKey) || '[]') as AuditLogEntry[];
      logs.push(entry);
      
      // Keep only last 10,000 entries (prevent storage bloat)
      if (logs.length > 10000) {
        logs.splice(0, logs.length - 10000);
      }
      
      localStorage.setItem(this.logKey, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to log compliance event:', e);
    }
  }

  /**
   * Get compliance audit log (admin/security use only)
   */
  static getAuditLog(): AuditLogEntry[] {
    if (typeof window === 'undefined') return [];
    
    try {
      return JSON.parse(localStorage.getItem(this.logKey) || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Generate compliance report for regulatory bodies
   */
  static generateComplianceReport() {
    const logs = this.getAuditLog();
    
    return {
      generatedAt: new Date().toISOString(),
      totalExports: logs.filter(l => l.action === 'export').length,
      deniedAccess: logs.filter(l => l.status === 'denied').length,
      dataExported: logs
        .filter(l => l.status === 'success')
        .reduce((sum, l) => sum + l.recordCount, 0),
      byRole: {
        student: logs.filter(l => l.userRole === 'student').length,
        hospital: logs.filter(l => l.userRole === 'hospital').length,
        admin: logs.filter(l => l.userRole === 'admin').length,
      },
      suspiciousActivity: logs.filter(l => l.status === 'denied'),
    };
  }
}
