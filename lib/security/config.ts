/**
 * MedGate Security Configuration
 * 
 * Centralized security settings and environment configuration.
 */

import { Role, Permission, AuditAlertRule, AuditSeverity } from './types';

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

/**
 * Security environment configuration
 * All sensitive values should come from environment variables
 */
export const securityConfig = {
  // AWS KMS Configuration
  kms: {
    region: process.env.AWS_REGION || 'us-east-1',
    rootKeyArn: process.env.KMS_ROOT_KEY_ARN || '',
    keyRotationDays: 90,
    // Per-tenant keys are looked up dynamically
  },

  // S3 Document Storage
  s3: {
    region: process.env.AWS_REGION || 'us-east-1',
    bucket: process.env.S3_DOCUMENTS_BUCKET || 'medgate-documents-dev',
    presignedUrlExpirySec: parseInt(process.env.S3_PRESIGNED_URL_EXPIRY || '3600', 10),
    // S3 key structure: documents/{tenantId}/{studentId}/{docType}/{uuid}.enc
    keyPrefix: 'documents',
  },

  // Encryption Settings
  encryption: {
    algorithm: 'AES-256-GCM' as const,
    keyLengthBytes: 32,       // 256 bits
    ivLengthBytes: 12,        // 96 bits (recommended for GCM)
    authTagLengthBytes: 16,   // 128 bits
    version: 1,               // Envelope version for migrations
  },

  // JWT Configuration
  jwt: {
    issuer: process.env.JWT_ISSUER || 'medgate',
    audience: process.env.JWT_AUDIENCE || 'medgate-api',
    accessTokenExpirySec: parseInt(process.env.JWT_ACCESS_EXPIRY || '900', 10),      // 15 minutes
    refreshTokenExpirySec: parseInt(process.env.JWT_REFRESH_EXPIRY || '604800', 10), // 7 days
    algorithm: 'RS256' as const,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10),  // 1 minute
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    // Per-endpoint overrides
    endpoints: {
      '/api/auth/login': { windowMs: 60000, maxRequests: 5 },
      '/api/documents/upload': { windowMs: 60000, maxRequests: 10 },
      '/api/documents/download': { windowMs: 60000, maxRequests: 20 },
    },
  },

  // Document Retention
  retention: {
    /** Days to keep raw documents after verification */
    verifiedDocumentsRetentionDays: 30,
    /** Days to keep pending documents before auto-expiry */
    pendingDocumentsExpiryDays: 90,
    /** Years to keep audit logs */
    auditLogRetentionYears: 7,
    /** Years to keep verification attestations */
    attestationRetentionYears: 10,
  },

  // Audit Configuration
  audit: {
    logLevel: (process.env.AUDIT_LOG_LEVEL || 'info') as 'debug' | 'info' | 'warning' | 'error',
    batchSize: 100,           // Batch writes to improve performance
    flushIntervalMs: 5000,    // Max time before flushing batch
  },

  // Security Headers
  headers: {
    hsts: 'max-age=31536000; includeSubDomains; preload',
    contentSecurityPolicy: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Adjust based on needs
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.medgate.com",
      "frame-ancestors 'none'",
    ].join('; '),
    xContentTypeOptions: 'nosniff',
    xFrameOptions: 'DENY',
    xXssProtection: '1; mode=block',
    referrerPolicy: 'strict-origin-when-cross-origin',
  },
};

// ============================================================================
// RBAC PERMISSION MATRIX
// ============================================================================

/**
 * Maps roles to their allowed permissions
 */
export const rolePermissions: Record<Role, Permission[]> = {
  [Role.STUDENT]: [
    'document:upload',
    'document:view_own',
    'application:create',
    'application:view_own',
    'audit:view_own',
  ],

  [Role.HOSPITAL_REVIEWER]: [
    'application:view_hospital',
    'verification:view',
  ],

  [Role.HOSPITAL_ADMIN]: [
    'application:view_hospital',
    'application:approve',
    'application:reject',
    'verification:view',
    'audit:view_hospital',
    'admin:manage_users',
    'admin:view_metrics',
  ],

  [Role.MEDGATE_VERIFIER]: [
    'document:view_pending',
    'document:verify',
    'verification:view',
    'audit:view_hospital',
  ],

  [Role.MEDGATE_ADMIN]: [
    'document:view_pending',
    'document:verify',
    'document:delete',
    'application:view_hospital',
    'application:approve',
    'application:reject',
    'verification:view',
    'audit:view_all',
    'audit:export',
    'admin:manage_users',
    'admin:manage_keys',
    'admin:view_metrics',
  ],

  [Role.SYSTEM]: [
    'document:delete',
    'audit:view_all',
    'audit:export',
    'admin:manage_keys',
  ],
};

// ============================================================================
// AUDIT ALERT RULES
// ============================================================================

/**
 * Default audit alert rules for security monitoring
 */
export const defaultAuditAlertRules: AuditAlertRule[] = [
  {
    id: 'excessive-decrypts',
    name: 'Excessive Document Decrypts',
    actions: ['document:decrypted', 'encryption:data_decrypted'],
    windowSeconds: 300,  // 5 minutes
    threshold: 10,
    severity: 'warning' as AuditSeverity,
    notifyChannels: ['email', 'slack'],
  },
  {
    id: 'bulk-downloads',
    name: 'Bulk Document Downloads',
    actions: ['document:downloaded'],
    windowSeconds: 3600,  // 1 hour
    threshold: 50,
    severity: 'critical' as AuditSeverity,
    notifyChannels: ['email', 'slack', 'pagerduty'],
  },
  {
    id: 'repeated-access-denied',
    name: 'Repeated Access Denied',
    actions: ['access:denied'],
    windowSeconds: 60,  // 1 minute
    threshold: 5,
    severity: 'warning' as AuditSeverity,
    notifyChannels: ['email', 'slack'],
  },
  {
    id: 'failed-logins',
    name: 'Multiple Failed Login Attempts',
    actions: ['auth:login_failed'],
    windowSeconds: 300,  // 5 minutes
    threshold: 5,
    severity: 'warning' as AuditSeverity,
    notifyChannels: ['email'],
  },
  {
    id: 'export-initiated',
    name: 'Data Export Initiated',
    actions: ['admin:export_initiated'],
    windowSeconds: 1,    // Immediate alert
    threshold: 1,
    severity: 'info' as AuditSeverity,
    notifyChannels: ['email', 'slack'],
  },
  {
    id: 'key-rotation',
    name: 'Encryption Key Rotated',
    actions: ['admin:key_rotated'],
    windowSeconds: 1,
    threshold: 1,
    severity: 'info' as AuditSeverity,
    notifyChannels: ['email'],
  },
];

// ============================================================================
// SENSITIVE FIELD DEFINITIONS
// ============================================================================

/**
 * Fields that require encryption in database records
 */
export const sensitiveFields = {
  application: [
    'studentIdNumber',
    'dateOfBirth',
    'passportNumber',
    'phoneNumber',
    'emergencyContactPhone',
  ],
  student: [
    'studentIdNumber',
    'dateOfBirth',
    'passportNumber',
    'phoneNumber',
    'address',
  ],
  user: [
    'phoneNumber',
  ],
} as const;

// ============================================================================
// DOCUMENT TYPE CONFIGURATION
// ============================================================================

/**
 * Configuration for each document type
 */
export const documentTypeConfig = {
  student_id: {
    maxSizeBytes: 5 * 1024 * 1024,  // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    retentionDays: 30,
    requiresVerification: true,
  },
  passport: {
    maxSizeBytes: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    retentionDays: 30,
    requiresVerification: true,
  },
  enrollment_letter: {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    retentionDays: 30,
    requiresVerification: true,
  },
  medical_certificate: {
    maxSizeBytes: 10 * 1024 * 1024,
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    retentionDays: 30,
    requiresVerification: true,
  },
  immunization_record: {
    maxSizeBytes: 10 * 1024 * 1024,
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    retentionDays: 30,
    requiresVerification: true,
  },
  police_clearance: {
    maxSizeBytes: 10 * 1024 * 1024,
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    retentionDays: 30,
    requiresVerification: true,
  },
  emirates_id: {
    maxSizeBytes: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    retentionDays: 30,
    requiresVerification: true,
  },
  other: {
    maxSizeBytes: 10 * 1024 * 1024,
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    retentionDays: 30,
    requiresVerification: false,
  },
} as const;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

/**
 * Get all permissions for a role
 */
export function getPermissions(role: Role): Permission[] {
  return rolePermissions[role] ?? [];
}

/**
 * Check if a field is sensitive and should be encrypted
 */
export function isSensitiveField(
  entityType: keyof typeof sensitiveFields,
  fieldName: string
): boolean {
  const fields = sensitiveFields[entityType];
  return (fields as readonly string[]).includes(fieldName);
}

/**
 * Validate document upload parameters
 */
export function validateDocumentUploadConfig(
  documentType: keyof typeof documentTypeConfig,
  mimeType: string,
  sizeBytes: number
): { valid: boolean; error?: string } {
  const config = documentTypeConfig[documentType];
  
  if (!config) {
    return { valid: false, error: `Unknown document type: ${documentType}` };
  }
  
  if (!config.allowedMimeTypes.includes(mimeType as never)) {
    return { 
      valid: false, 
      error: `Invalid file type. Allowed: ${config.allowedMimeTypes.join(', ')}` 
    };
  }
  
  if (sizeBytes > config.maxSizeBytes) {
    const maxMB = config.maxSizeBytes / (1024 * 1024);
    return { valid: false, error: `File too large. Maximum: ${maxMB}MB` };
  }
  
  return { valid: true };
}

// ============================================================================
// ENVIRONMENT VALIDATION
// ============================================================================

/**
 * Validate that all required environment variables are set
 */
export function validateEnvironment(): { valid: boolean; missing: string[] } {
  const required = [
    'AWS_REGION',
    'KMS_ROOT_KEY_ARN',
    'S3_DOCUMENTS_BUCKET',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}
