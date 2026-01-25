/**
 * MedGate Security Module
 * 
 * Comprehensive encryption and security system for handling sensitive
 * medical/educational data with proper encryption, key management,
 * access control, and audit logging.
 * 
 * Architecture Overview:
 * 1. Encryption in Transit - TLS/HTTPS for all data movement
 * 2. Encryption at Rest - Envelope encryption with AES-256-GCM
 * 3. Key Management - KMS-backed keys with per-tenant isolation
 * 4. Access Control - RBAC with audit logging
 * 
 * See SECURITY_ARCHITECTURE.md for complete documentation.
 */

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export {
  // Enums
  Role,
  
  // Permission types
  type Permission,
  
  // Encryption types
  type EncryptedEnvelope,
  type EncryptedField,
  type DataEncryptionKey,
  type EncryptionContext,
  
  // Document types
  type DocumentType,
  type DocumentStatus,
  type DocumentMetadata,
  type VerificationAttestation,
  type PresignedUrlRequest,
  type PresignedUrlResponse,
  
  // Audit types
  type AuditAction,
  type AuditOutcome,
  type AuditSeverity,
  type AuditLogEntry,
  type AuditAlertRule,
  
  // Auth types
  type JwtPayload,
  type AuthenticatedUser,
  type AuthContext,
  
  // Errors
  SecurityError,
  EncryptionError,
  DecryptionError,
  AuthenticationError,
  AuthorizationError,
  KeyManagementError,
} from './types';

// ============================================================================
// CONFIGURATION EXPORTS
// ============================================================================

export {
  securityConfig,
  rolePermissions,
  defaultAuditAlertRules,
  sensitiveFields,
  documentTypeConfig,
  hasPermission,
  getPermissions,
  isSensitiveField,
  validateDocumentUploadConfig,
  validateEnvironment,
  isDevelopment,
  isProduction,
} from './config';

// ============================================================================
// CRYPTOGRAPHIC UTILITIES
// ============================================================================

export {
  // Encoding utilities
  uint8ArrayToBase64,
  base64ToUint8Array,
  stringToUint8Array,
  uint8ArrayToString,
  uint8ArrayToHex,
  hexToUint8Array,
  concatUint8Arrays,
  secureCompare,
  
  // Random generation
  generateRandomBytes,
  generateDEK,
  generateIV,
  generateSecureId,
  
  // Encryption/Decryption
  encryptAESGCM,
  decryptAESGCM,
  encryptAESGCMNode,
  decryptAESGCMNode,
  
  // Hashing
  sha256,
  sha256Hex,
  sha256Prefixed,
  hmacSha256,
  
  // Key derivation
  deriveKey,
  
  // Privacy utilities
  hashIpAddress,
  
  // Memory security
  zeroMemory,
  withSecureKey,
} from './crypto';

// ============================================================================
// KMS CLIENT
// ============================================================================

export {
  type KMSClient,
  AWSKMSClient,
  MockKMSClient,
  getKMSClient,
  resetKMSClient,
  setKMSClient,
} from './kms';

// ============================================================================
// ENVELOPE ENCRYPTION
// ============================================================================

export {
  EnvelopeEncryptionService,
  getEnvelopeEncryptionService,
  envelopeEncrypt,
  envelopeDecrypt,
  envelopeDecryptToString,
} from './envelope';

// ============================================================================
// FIELD-LEVEL ENCRYPTION
// ============================================================================

export {
  FieldEncryptionService,
  getFieldEncryptionService,
  encryptField,
  decryptField,
  isEncryptedField,
  
  // Type helpers
  type WithEncryptedFields,
  type WithDecryptedFields,
  
  // Application-specific
  applicationSensitiveFields,
  type ApplicationSensitiveField,
  encryptApplicationFields,
  decryptApplicationFields,
  
  // Student-specific
  studentSensitiveFields,
  type StudentSensitiveField,
  encryptStudentFields,
  decryptStudentFields,
} from './field-encryption';

// ============================================================================
// SECURE DOCUMENT SERVICE
// ============================================================================

export {
  SecureDocumentService,
  getSecureDocumentService,
  generateDocumentUploadUrl,
  createVerificationAttestation,
} from './document-service';

// ============================================================================
// DOCUMENT VERIFICATION ENGINE
// ============================================================================

export {
  // Constants
  DOCUMENT_CONFIG,
  DOCUMENT_REJECTION_REASONS,
  
  // Types
  type DocumentValidationError,
  type DocumentValidationResult,
  type DocumentUploadValidation,
  type DocumentHashResult,
  type DocumentIntegrityCheck,
  type DocumentRejection,
  type DocumentRejectionReason,
  
  // Validation
  validateDocumentUpload,
  validateMagicBytes,
  
  // Hashing & Integrity
  generateDocumentHash,
  verifyDocumentIntegrity,
  
  // Document Status Management
  createDocumentMetadata,
  updateDocumentStatus,
  isDocumentExpired,
  daysUntilExpiry,
  shouldFlagForRenewal,
  
  // Rejection Handling
  rejectDocument,
  
  // Retention & Cleanup
  shouldDeleteDocument,
  getDocumentDeletionSchedule,
} from './document-verification';

// ============================================================================
// AUDIT LOGGING
// ============================================================================

export {
  AuditLogger,
  getAuditLogger,
  audit,
  auditAuth,
  auditDocumentAccess,
  auditEncryption,
  auditAccessControl,
  auditAdminAction,
} from './audit';

// ============================================================================
// RBAC & MIDDLEWARE
// ============================================================================

export {
  // JWT utilities
  createJwt,
  
  // Authentication
  authenticateRequest,
  checkPermission,
  checkTenantAccess,
  
  // Middleware wrappers
  withAuth,
  withPermission,
  withRole,
  withTenantAccess,
  withRateLimit,
  
  // Security headers
  securityHeaders,
  applySecurityHeaders,
  
  // Rate limiting
  checkRateLimit,
  
  // Development helpers
  createMockAuthContext,
} from './rbac';
