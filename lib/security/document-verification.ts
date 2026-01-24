/**
 * Document Verification Engine
 * 
 * Comprehensive document validation, integrity checking, and status management.
 * Implements file type restrictions, size limits, hashing, and metadata extraction.
 */

import { DocumentType, DocumentStatus, DocumentMetadata } from './types';
import { hashSHA256, generateRandomString } from './crypto';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

export const DOCUMENT_CONFIG = {
  allowedMimeTypes: {
    PDF: 'application/pdf',
    JPG: 'image/jpeg',
    PNG: 'image/png',
  } as const,

  allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'] as const,

  // Magic bytes for file type verification
  magicBytes: {
    PDF: Buffer.from([0x25, 0x50, 0x44, 0x46]), // %PDF
    JPG: Buffer.from([0xFF, 0xD8, 0xFF]), // JPEG SOI marker
    PNG: Buffer.from([0x89, 0x50, 0x4E, 0x47]), // PNG signature
  } as const,

  maxFileSizeBytes: 25 * 1024 * 1024, // 25 MB
  minFileSizeBytes: 1024, // 1 KB

  // Document type to accepted mime types mapping
  typeToMimeTypes: {
    student_id: ['application/pdf', 'image/jpeg', 'image/png'],
    passport: ['application/pdf', 'image/jpeg', 'image/png'],
    enrollment_letter: ['application/pdf'],
    medical_certificate: ['application/pdf', 'image/jpeg', 'image/png'],
    immunization_record: ['application/pdf', 'image/jpeg', 'image/png'],
    police_clearance: ['application/pdf', 'image/jpeg', 'image/png'],
    emirates_id: ['application/pdf', 'image/jpeg', 'image/png'],
    other: ['application/pdf', 'image/jpeg', 'image/png'],
  } as const,
} as const;

// ============================================================================
// TYPES
// ============================================================================

export interface DocumentValidationError {
  field: string;
  code:
    | 'INVALID_FILE_TYPE'
    | 'FILE_TOO_LARGE'
    | 'FILE_TOO_SMALL'
    | 'INVALID_MAGIC_BYTES'
    | 'INVALID_MIME_TYPE'
    | 'MISSING_REQUIRED_FIELD'
    | 'INVALID_FILENAME'
    | 'MALWARE_DETECTED';
  message: string;
}

export interface DocumentValidationResult {
  valid: boolean;
  errors: DocumentValidationError[];
  metadata?: {
    detectedMimeType: string;
    fileExtension: string;
    fileSizeBytes: number;
  };
}

export interface DocumentUploadValidation {
  documentType: DocumentType;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  fileBuffer?: Uint8Array; // Optional: for magic byte verification
}

export interface DocumentHashResult {
  contentHash: string; // SHA-256 hex
  algorithm: 'SHA-256';
  size: number;
  timestamp: string;
}

export interface DocumentIntegrityCheck {
  documentId: string;
  storedHash: string;
  computedHash: string;
  tampered: boolean;
  timestamp: string;
}

// ============================================================================
// VALIDATION SERVICE
// ============================================================================

/**
 * Validate document upload parameters before S3 upload
 */
export function validateDocumentUpload(
  validation: DocumentUploadValidation
): DocumentValidationResult {
  const errors: DocumentValidationError[] = [];

  // Validate required fields
  if (!validation.documentType) {
    errors.push({
      field: 'documentType',
      code: 'MISSING_REQUIRED_FIELD',
      message: 'Document type is required',
    });
  }

  if (!validation.filename) {
    errors.push({
      field: 'filename',
      code: 'MISSING_REQUIRED_FIELD',
      message: 'Filename is required',
    });
  }

  if (!validation.mimeType) {
    errors.push({
      field: 'mimeType',
      code: 'MISSING_REQUIRED_FIELD',
      message: 'MIME type is required',
    });
  }

  if (validation.sizeBytes === undefined) {
    errors.push({
      field: 'sizeBytes',
      code: 'MISSING_REQUIRED_FIELD',
      message: 'File size is required',
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Validate filename
  const filenameTrimmed = validation.filename.trim();
  if (filenameTrimmed.length === 0) {
    errors.push({
      field: 'filename',
      code: 'INVALID_FILENAME',
      message: 'Filename cannot be empty',
    });
  }

  // Validate file extension
  const fileExtension = getFileExtension(validation.filename);
  if (!DOCUMENT_CONFIG.allowedExtensions.includes(fileExtension.toLowerCase() as any)) {
    errors.push({
      field: 'filename',
      code: 'INVALID_FILE_TYPE',
      message: `File extension ${fileExtension} not allowed. Allowed: ${DOCUMENT_CONFIG.allowedExtensions.join(', ')}`,
    });
  }

  // Validate MIME type
  const allowedMimes = getDocumentTypeMimeTypes(validation.documentType);
  if (!allowedMimes.includes(validation.mimeType)) {
    errors.push({
      field: 'mimeType',
      code: 'INVALID_MIME_TYPE',
      message: `MIME type ${validation.mimeType} not allowed for ${validation.documentType}. Allowed: ${allowedMimes.join(', ')}`,
    });
  }

  // Validate file size
  if (validation.sizeBytes < DOCUMENT_CONFIG.minFileSizeBytes) {
    errors.push({
      field: 'sizeBytes',
      code: 'FILE_TOO_SMALL',
      message: `File size ${validation.sizeBytes} bytes is below minimum ${DOCUMENT_CONFIG.minFileSizeBytes} bytes`,
    });
  }

  if (validation.sizeBytes > DOCUMENT_CONFIG.maxFileSizeBytes) {
    errors.push({
      field: 'sizeBytes',
      code: 'FILE_TOO_LARGE',
      message: `File size ${validation.sizeBytes} bytes exceeds maximum ${DOCUMENT_CONFIG.maxFileSizeBytes} bytes`,
    });
  }

  // Validate magic bytes if provided
  if (validation.fileBuffer && validation.fileBuffer.length > 0) {
    const magicCheckResult = validateMagicBytes(
      validation.fileBuffer,
      validation.filename
    );
    if (!magicCheckResult.valid) {
      errors.push({
        field: 'fileBuffer',
        code: 'INVALID_MAGIC_BYTES',
        message: magicCheckResult.message,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    metadata: {
      detectedMimeType: validation.mimeType,
      fileExtension,
      fileSizeBytes: validation.sizeBytes,
    },
  };
}

/**
 * Validate magic bytes to ensure file type matches extension
 */
export function validateMagicBytes(
  fileBuffer: Uint8Array,
  filename: string
): { valid: boolean; message: string } {
  if (fileBuffer.length < 4) {
    return {
      valid: false,
      message: 'File is too small to verify magic bytes',
    };
  }

  const extension = getFileExtension(filename).toLowerCase();

  if (extension === '.pdf') {
    const pdfMagic = fileBuffer.slice(0, 4);
    const matches = arrayBufferEquals(
      pdfMagic,
      DOCUMENT_CONFIG.magicBytes.PDF
    );
    if (!matches) {
      return {
        valid: false,
        message: 'File does not appear to be a valid PDF (invalid magic bytes)',
      };
    }
  }

  if (extension === '.jpg' || extension === '.jpeg') {
    const jpgMagic = fileBuffer.slice(0, 3);
    const matches = arrayBufferEquals(
      jpgMagic,
      DOCUMENT_CONFIG.magicBytes.JPG
    );
    if (!matches) {
      return {
        valid: false,
        message:
          'File does not appear to be a valid JPEG (invalid magic bytes)',
      };
    }
  }

  if (extension === '.png') {
    const pngMagic = fileBuffer.slice(0, 4);
    const matches = arrayBufferEquals(
      pngMagic,
      DOCUMENT_CONFIG.magicBytes.PNG
    );
    if (!matches) {
      return {
        valid: false,
        message: 'File does not appear to be a valid PNG (invalid magic bytes)',
      };
    }
  }

  return { valid: true, message: 'Magic bytes validated' };
}

// ============================================================================
// HASHING & INTEGRITY SERVICE
// ============================================================================

/**
 * Generate SHA-256 hash for document content
 * Used for tamper detection and integrity verification
 */
export async function generateDocumentHash(
  fileBuffer: Uint8Array | Buffer
): Promise<DocumentHashResult> {
  const contentHash = await hashSHA256(
    fileBuffer instanceof Buffer ? new Uint8Array(fileBuffer) : fileBuffer
  );

  return {
    contentHash,
    algorithm: 'SHA-256',
    size: fileBuffer.length,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Verify document integrity by comparing stored hash with computed hash
 */
export async function verifyDocumentIntegrity(
  fileBuffer: Uint8Array,
  storedHash: string,
  documentId: string
): Promise<DocumentIntegrityCheck> {
  const hashResult = await generateDocumentHash(fileBuffer);

  return {
    documentId,
    storedHash,
    computedHash: hashResult.contentHash,
    tampered: hashResult.contentHash !== storedHash,
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// DOCUMENT STATUS MANAGEMENT
// ============================================================================

/**
 * Generate initial document metadata
 */
export function createDocumentMetadata(
  input: Omit<DocumentMetadata, 'id' | 'status' | 'uploadedAt' | 'contentHash'>
): DocumentMetadata {
  return {
    ...input,
    id: `doc_${Date.now()}_${generateRandomString(8)}`,
    status: 'pending_upload' as DocumentStatus,
    uploadedAt: new Date().toISOString(),
    contentHash: '', // Will be filled after upload
  };
}

/**
 * Update document status with validation
 */
export function updateDocumentStatus(
  metadata: DocumentMetadata,
  newStatus: DocumentStatus,
  additionalData?: {
    rejectionReason?: string;
    verifiedBy?: string;
    expiresAt?: string;
  }
): DocumentMetadata {
  const updated = { ...metadata, status: newStatus };

  if (additionalData?.rejectionReason && newStatus === 'rejected') {
    // Document rejected - store reason
  }

  if (additionalData?.verifiedBy && newStatus === 'verified') {
    updated.verifiedBy = additionalData.verifiedBy;
    updated.verifiedAt = new Date().toISOString();
  }

  if (additionalData?.expiresAt && newStatus === 'verified') {
    updated.expiresAt = additionalData.expiresAt;
  }

  return updated;
}

/**
 * Check if document is expired
 */
export function isDocumentExpired(metadata: DocumentMetadata): boolean {
  if (!metadata.expiresAt) {
    return false;
  }

  const expiryDate = new Date(metadata.expiresAt);
  return expiryDate < new Date();
}

/**
 * Get days until document expiry
 */
export function daysUntilExpiry(metadata: DocumentMetadata): number | null {
  if (!metadata.expiresAt) {
    return null;
  }

  const expiryDate = new Date(metadata.expiresAt);
  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(diffDays, 0);
}

/**
 * Check if document should be flagged for renewal (30 days before expiry)
 */
export function shouldFlagForRenewal(metadata: DocumentMetadata): boolean {
  const daysRemaining = daysUntilExpiry(metadata);
  if (daysRemaining === null) {
    return false;
  }

  return daysRemaining <= 30 && daysRemaining > 0;
}

// ============================================================================
// DOCUMENT REJECTION HANDLING
// ============================================================================

export const DOCUMENT_REJECTION_REASONS = {
  INVALID_FORMAT: 'invalid_format',
  FILE_CORRUPTED: 'file_corrupted',
  ILLEGIBLE: 'illegible',
  EXPIRED: 'expired',
  INSUFFICIENT_INFORMATION: 'insufficient_information',
  INFORMATION_MISMATCH: 'information_mismatch',
  FRAUDULENT: 'fraudulent',
  MALWARE_DETECTED: 'malware_detected',
  OTHER: 'other',
} as const;

export type DocumentRejectionReason =
  typeof DOCUMENT_REJECTION_REASONS[keyof typeof DOCUMENT_REJECTION_REASONS];

export interface DocumentRejection {
  reason: DocumentRejectionReason;
  message: string;
  timestamp: string;
  rejectedBy?: string;
}

/**
 * Create document rejection record
 */
export function rejectDocument(
  metadata: DocumentMetadata,
  reason: DocumentRejectionReason,
  message: string,
  rejectedBy?: string
): DocumentMetadata {
  const updated = updateDocumentStatus(metadata, 'rejected');
  // In production, store rejection details in database
  return updated;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) {
    return '';
  }
  return filename.substring(lastDot);
}

function getDocumentTypeMimeTypes(
  docType: DocumentType
): readonly string[] {
  return DOCUMENT_CONFIG.typeToMimeTypes[docType] || [];
}

function arrayBufferEquals(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

// ============================================================================
// CLEANUP & RETENTION
// ============================================================================

/**
 * Check if document should be deleted based on retention policy
 * - Auto-delete raw documents 30 days after verification
 * - Retain verification outcomes indefinitely
 */
export function shouldDeleteDocument(
  metadata: DocumentMetadata,
  currentDate: Date = new Date()
): boolean {
  if (!metadata.verifiedAt) {
    return false; // Not verified yet
  }

  const verifiedDate = new Date(metadata.verifiedAt);
  const retentionDays = 30;
  const deleteDate = new Date(
    verifiedDate.getTime() + retentionDays * 24 * 60 * 60 * 1000
  );

  return currentDate >= deleteDate;
}

/**
 * Get deletion schedule for a document
 */
export function getDocumentDeletionSchedule(
  metadata: DocumentMetadata
): { scheduledAt: string | null; daysUntilDeletion: number | null } {
  if (!metadata.verifiedAt) {
    return { scheduledAt: null, daysUntilDeletion: null };
  }

  const retentionDays = 30;
  const verifiedDate = new Date(metadata.verifiedAt);
  const scheduledDeleteDate = new Date(
    verifiedDate.getTime() + retentionDays * 24 * 60 * 60 * 1000
  );

  const now = new Date();
  const daysRemaining = Math.ceil(
    (scheduledDeleteDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    scheduledAt: scheduledDeleteDate.toISOString(),
    daysUntilDeletion: Math.max(daysRemaining, 0),
  };
}

