/**
 * MedGate Security Types
 * 
 * Core type definitions for the encryption and security system.
 */

// ============================================================================
// ROLES & PERMISSIONS
// ============================================================================

export enum Role {
  STUDENT = 'student',
  HOSPITAL_REVIEWER = 'hospital_reviewer',
  HOSPITAL_ADMIN = 'hospital_admin',
  MEDGATE_VERIFIER = 'medgate_verifier',
  MEDGATE_ADMIN = 'medgate_admin',
  SYSTEM = 'system'
}

export type Permission =
  // Document operations
  | 'document:upload'
  | 'document:view_own'
  | 'document:view_pending'
  | 'document:verify'
  | 'document:delete'
  // Application operations
  | 'application:create'
  | 'application:view_own'
  | 'application:view_hospital'
  | 'application:approve'
  | 'application:reject'
  // Verification results
  | 'verification:view'
  // Audit
  | 'audit:view_own'
  | 'audit:view_hospital'
  | 'audit:view_all'
  | 'audit:export'
  // Admin
  | 'admin:manage_users'
  | 'admin:manage_keys'
  | 'admin:view_metrics';

// ============================================================================
// ENCRYPTION TYPES
// ============================================================================

/**
 * Encrypted data envelope - contains ciphertext and metadata needed for decryption
 */
export interface EncryptedEnvelope {
  /** Base64 encoded ciphertext */
  ciphertext: string;
  /** Base64 encoded initialization vector (96 bits for AES-GCM) */
  iv: string;
  /** Base64 encoded authentication tag (128 bits for AES-GCM) */
  authTag: string;
  /** Base64 encoded KMS-wrapped DEK */
  wrappedDek: string;
  /** KMS key ARN/ID used to wrap the DEK */
  kmsKeyId: string;
  /** Algorithm identifier */
  algorithm: 'AES-256-GCM';
  /** ISO timestamp of encryption */
  encryptedAt: string;
  /** Version for forward compatibility */
  version: number;
}

/**
 * Field-level encrypted value for database storage
 */
export interface EncryptedField {
  /** Base64 encoded ciphertext */
  ciphertext: string;
  /** Base64 encoded IV */
  iv: string;
  /** Base64 encoded auth tag */
  authTag: string;
  /** Base64 encoded wrapped DEK */
  wrappedDek: string;
  /** KMS key ID */
  kmsKeyId: string;
  /** Encryption timestamp */
  encryptedAt: string;
}

/**
 * Data Encryption Key container
 */
export interface DataEncryptionKey {
  /** Raw key bytes (32 bytes for AES-256) */
  key: Uint8Array;
  /** KMS-encrypted (wrapped) version of the key */
  wrappedKey: string;
  /** KMS key ID used for wrapping */
  kmsKeyId: string;
  /** When the DEK was generated */
  generatedAt: string;
}

/**
 * Encryption context for authenticated encryption
 * This data is included in the encryption but not encrypted itself
 */
export interface EncryptionContext {
  /** Tenant/hospital ID */
  tenantId: string;
  /** Type of data being encrypted */
  dataType: 'document' | 'field' | 'application';
  /** Optional: resource ID */
  resourceId?: string;
  /** Optional: additional context */
  [key: string]: string | undefined;
}

// ============================================================================
// DOCUMENT TYPES
// ============================================================================

export type DocumentType =
  | 'student_id'
  | 'passport'
  | 'enrollment_letter'
  | 'medical_certificate'
  | 'immunization_record'
  | 'police_clearance'
  | 'emirates_id'
  | 'other';

export type DocumentStatus =
  | 'pending_upload'
  | 'uploaded'
  | 'pending_verification'
  | 'verified'
  | 'rejected'
  | 'expired'
  | 'deleted';

/**
 * Document metadata (stored in database)
 */
export interface DocumentMetadata {
  id: string;
  studentId: string;
  hospitalId: string;
  applicationId: string;
  documentType: DocumentType;
  status: DocumentStatus;
  
  /** S3 key for encrypted document */
  storageKey: string;
  /** Original filename (sanitized) */
  originalFilename: string;
  /** MIME type */
  mimeType: string;
  /** Size in bytes */
  sizeBytes: number;
  /** SHA-256 hash of original file (for integrity) */
  contentHash: string;
  
  /** KMS key used for this document */
  kmsKeyId: string;
  /** S3 key for the wrapped DEK */
  wrappedDekKey: string;
  
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  expiresAt?: string;
  deletedAt?: string;
}

/**
 * Verification attestation - the permanent proof that replaces raw documents
 */
export interface VerificationAttestation {
  id: string;
  documentId: string;
  applicationId: string;
  studentId: string;
  hospitalId: string;
  
  /** Verification outcome */
  verified: boolean;
  /** Verification method */
  method: 'manual_review' | 'automated' | 'university_api' | 'government_api';
  /** Verifier details */
  verifierId?: string;
  verifierRole?: Role;
  
  /** Non-sensitive extracted data */
  extractedData: {
    /** Last 4 characters of student ID */
    studentIdLast4?: string;
    /** University name (if verified) */
    universityName?: string;
    /** Document expiry date (if applicable) */
    documentExpiry?: string;
    /** Any other non-sensitive verification data */
    [key: string]: string | undefined;
  };
  
  /** Cryptographic proof */
  contentHash: string;       // SHA-256 of original document
  attestationHash: string;   // SHA-256 of this attestation record
  
  /** Timestamps */
  verifiedAt: string;
  attestationCreatedAt: string;
}

// ============================================================================
// PRE-SIGNED URL TYPES
// ============================================================================

export interface PresignedUrlRequest {
  tenantId: string;
  studentId: string;
  documentType: DocumentType;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  storageKey: string;
  expiresAt: string;
  fields?: Record<string, string>;  // For POST-based uploads
}

// ============================================================================
// AUDIT TYPES
// ============================================================================

export type AuditAction =
  // Auth
  | 'auth:login'
  | 'auth:logout'
  | 'auth:token_refresh'
  | 'auth:login_failed'
  | 'auth:mfa_challenged'
  | 'auth:mfa_verified'
  // Access
  | 'access:granted'
  | 'access:denied'
  // Document
  | 'document:upload_initiated'
  | 'document:upload_completed'
  | 'document:viewed'
  | 'document:decrypted'
  | 'document:verified'
  | 'document:rejected'
  | 'document:deleted'
  | 'document:downloaded'
  // Application
  | 'application:created'
  | 'application:updated'
  | 'application:submitted'
  | 'application:approved'
  | 'application:rejected'
  // Encryption
  | 'encryption:key_generated'
  | 'encryption:key_wrapped'
  | 'encryption:key_unwrapped'
  | 'encryption:data_encrypted'
  | 'encryption:data_decrypted'
  // Admin
  | 'admin:user_created'
  | 'admin:user_updated'
  | 'admin:role_changed'
  | 'admin:export_initiated'
  | 'admin:export_completed'
  | 'admin:key_rotated';

export type AuditOutcome = 'success' | 'failure' | 'denied';

export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Comprehensive audit log entry
 */
export interface AuditLogEntry {
  /** Unique log ID */
  id: string;
  /** ISO 8601 timestamp */
  timestamp: string;
  
  // Actor information
  /** User ID performing the action */
  actorId: string;
  /** Role at time of action */
  actorRole: Role;
  /** Hashed client IP for privacy */
  actorIpHash?: string;
  /** User agent string */
  actorUserAgent?: string;
  
  // Action details
  /** The action performed */
  action: AuditAction;
  /** Type of resource affected */
  resourceType: 'document' | 'application' | 'user' | 'key' | 'session' | 'system';
  /** ID of the resource */
  resourceId?: string;
  
  // Context
  /** Tenant (hospital) context */
  tenantId?: string;
  /** Subject of the action (e.g., student being processed) */
  subjectId?: string;
  /** Reason code for the action */
  reasonCode?: string;
  /** Additional context data */
  metadata?: Record<string, string | number | boolean>;
  
  // Outcome
  /** Result of the action */
  outcome: AuditOutcome;
  /** Error code if failed */
  errorCode?: string;
  /** Error message if failed */
  errorMessage?: string;
  
  // Tracing
  /** Session ID from JWT */
  sessionId?: string;
  /** Request correlation ID */
  requestId?: string;
  
  // Classification
  /** Severity level for alerting */
  severity: AuditSeverity;
}

/**
 * Audit alert configuration
 */
export interface AuditAlertRule {
  id: string;
  name: string;
  /** Actions that trigger this rule */
  actions: AuditAction[];
  /** Time window in seconds */
  windowSeconds: number;
  /** Threshold count to trigger */
  threshold: number;
  /** Additional conditions */
  conditions?: {
    outcome?: AuditOutcome;
    actorRole?: Role;
    tenantId?: string;
  };
  /** Alert severity */
  severity: AuditSeverity;
  /** Notification channels */
  notifyChannels: ('email' | 'slack' | 'pagerduty')[];
}

// ============================================================================
// SESSION & AUTH TYPES
// ============================================================================

export interface JwtPayload {
  /** Subject (user ID) */
  sub: string;
  /** User's role */
  role: Role;
  /** Tenant/hospital ID */
  tenantId?: string;
  /** Session ID for audit trail */
  sessionId: string;
  /** Token type */
  type: 'access' | 'refresh';
  /** Issued at */
  iat: number;
  /** Expires at */
  exp: number;
  /** Issuer */
  iss: string;
  /** Audience */
  aud: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
  tenantId?: string;
  sessionId: string;
  permissions: Permission[];
}

export interface AuthContext {
  user: AuthenticatedUser;
  requestId: string;
  ipAddress?: string;
  userAgent?: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class SecurityError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'SecurityError';
  }
}

export class EncryptionError extends SecurityError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'ENCRYPTION_ERROR', 500, details);
    this.name = 'EncryptionError';
  }
}

export class DecryptionError extends SecurityError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'DECRYPTION_ERROR', 500, details);
    this.name = 'DecryptionError';
  }
}

export class AuthenticationError extends SecurityError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'AUTHENTICATION_ERROR', 401, details);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends SecurityError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'AUTHORIZATION_ERROR', 403, details);
    this.name = 'AuthorizationError';
  }
}

export class KeyManagementError extends SecurityError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'KEY_MANAGEMENT_ERROR', 500, details);
    this.name = 'KeyManagementError';
  }
}
