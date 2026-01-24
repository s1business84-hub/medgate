/**
 * Document Verification Engine Tests
 * 
 * Comprehensive test suite for document validation, integrity checking,
 * and status management.
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  validateDocumentUpload,
  validateMagicBytes,
  generateDocumentHash,
  verifyDocumentIntegrity,
  createDocumentMetadata,
  updateDocumentStatus,
  isDocumentExpired,
  daysUntilExpiry,
  shouldFlagForRenewal,
  shouldDeleteDocument,
  getDocumentDeletionSchedule,
  rejectDocument,
  DOCUMENT_CONFIG,
  DOCUMENT_REJECTION_REASONS,
  type DocumentUploadValidation,
  type DocumentMetadata,
} from '../document-verification';

// ============================================================================
// TEST DATA
// ============================================================================

const validPdfBuffer = Buffer.from([
  0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, // %PDF-1.4
  0x0a, 0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a, 0x0d, // PDF header
]);

const validJpegBuffer = Buffer.from([
  0xff, 0xd8, 0xff, 0xe0, // JPEG SOI + APP0
  0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, // JFIF
]);

const validPngBuffer = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
]);

const mockDocumentMetadata: DocumentMetadata = {
  id: 'doc_123',
  studentId: 'stu_1',
  hospitalId: 'hosp_1',
  applicationId: 'app_1',
  documentType: 'student_id',
  status: 'pending_upload',
  storageKey: 'documents/hosp_1/stu_1/student_id/file.pdf',
  originalFilename: 'student_id.pdf',
  mimeType: 'application/pdf',
  sizeBytes: validPdfBuffer.length,
  contentHash: '',
  kmsKeyId: 'arn:aws:kms:us-east-1:123456789:key/12345678',
  wrappedDekKey: 'wrapped_dek_key',
  uploadedAt: new Date().toISOString(),
};

// ============================================================================
// VALIDATION TESTS
// ============================================================================

describe('Document Validation', () => {
  describe('validateDocumentUpload', () => {
    it('should accept valid PDF upload', () => {
      const validation: DocumentUploadValidation = {
        documentType: 'student_id',
        filename: 'student_id.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 5 * 1024 * 1024, // 5 MB
        fileBuffer: new Uint8Array(validPdfBuffer),
      };

      const result = validateDocumentUpload(validation);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.detectedMimeType).toBe('application/pdf');
    });

    it('should accept valid JPEG upload', () => {
      const validation: DocumentUploadValidation = {
        documentType: 'passport',
        filename: 'passport.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 2 * 1024 * 1024, // 2 MB
        fileBuffer: new Uint8Array(validJpegBuffer),
      };

      const result = validateDocumentUpload(validation);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept valid PNG upload', () => {
      const validation: DocumentUploadValidation = {
        documentType: 'medical_certificate',
        filename: 'cert.png',
        mimeType: 'image/png',
        sizeBytes: 1024 * 1024, // 1 MB
        fileBuffer: new Uint8Array(validPngBuffer),
      };

      const result = validateDocumentUpload(validation);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject missing required fields', () => {
      const validation: Partial<DocumentUploadValidation> = {
        documentType: 'student_id',
        // Missing filename, mimeType, sizeBytes
      };

      const result = validateDocumentUpload(validation as DocumentUploadValidation);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
        result.errors.some(e => e.code === 'MISSING_REQUIRED_FIELD')
      ).toBe(true);
    });

    it('should reject file too large', () => {
      const validation: DocumentUploadValidation = {
        documentType: 'student_id',
        filename: 'huge.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 30 * 1024 * 1024, // 30 MB (exceeds 25 MB limit)
      };

      const result = validateDocumentUpload(validation);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some(e => e.code === 'FILE_TOO_LARGE')
      ).toBe(true);
    });

    it('should reject file too small', () => {
      const validation: DocumentUploadValidation = {
        documentType: 'student_id',
        filename: 'tiny.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 100, // 100 bytes (below 1 KB minimum)
      };

      const result = validateDocumentUpload(validation);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some(e => e.code === 'FILE_TOO_SMALL')
      ).toBe(true);
    });

    it('should reject invalid file extension', () => {
      const validation: DocumentUploadValidation = {
        documentType: 'student_id',
        filename: 'document.exe',
        mimeType: 'application/octet-stream',
        sizeBytes: 5 * 1024 * 1024,
      };

      const result = validateDocumentUpload(validation);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some(e => e.code === 'INVALID_FILE_TYPE')
      ).toBe(true);
    });

    it('should reject invalid MIME type for document type', () => {
      const validation: DocumentUploadValidation = {
        documentType: 'enrollment_letter',
        filename: 'letter.png', // PNG not allowed for enrollment letter
        mimeType: 'image/png',
        sizeBytes: 1024 * 1024,
      };

      const result = validateDocumentUpload(validation);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some(e => e.code === 'INVALID_MIME_TYPE')
      ).toBe(true);
    });

    it('should reject invalid magic bytes', () => {
      const fakeBuffer = Buffer.from([0x00, 0x01, 0x02, 0x03]); // Invalid PDF signature

      const validation: DocumentUploadValidation = {
        documentType: 'student_id',
        filename: 'fake.pdf',
        mimeType: 'application/pdf',
        sizeBytes: fakeBuffer.length,
        fileBuffer: new Uint8Array(fakeBuffer),
      };

      const result = validateDocumentUpload(validation);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some(e => e.code === 'INVALID_MAGIC_BYTES')
      ).toBe(true);
    });
  });

  describe('validateMagicBytes', () => {
    it('should validate correct PDF magic bytes', () => {
      const result = validateMagicBytes(new Uint8Array(validPdfBuffer), 'test.pdf');

      expect(result.valid).toBe(true);
    });

    it('should validate correct JPEG magic bytes', () => {
      const result = validateMagicBytes(
        new Uint8Array(validJpegBuffer),
        'test.jpg'
      );

      expect(result.valid).toBe(true);
    });

    it('should validate correct PNG magic bytes', () => {
      const result = validateMagicBytes(
        new Uint8Array(validPngBuffer),
        'test.png'
      );

      expect(result.valid).toBe(true);
    });

    it('should reject PDF with wrong magic bytes', () => {
      const fakeBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0]); // JPEG header

      const result = validateMagicBytes(new Uint8Array(fakeBuffer), 'fake.pdf');

      expect(result.valid).toBe(false);
      expect(result.message).toContain('invalid magic bytes');
    });

    it('should reject file too small for magic byte check', () => {
      const tinyBuffer = Buffer.from([0x01, 0x02]);

      const result = validateMagicBytes(new Uint8Array(tinyBuffer), 'tiny.pdf');

      expect(result.valid).toBe(false);
    });
  });
});

// ============================================================================
// HASHING & INTEGRITY TESTS
// ============================================================================

describe('Document Hashing & Integrity', () => {
  describe('generateDocumentHash', () => {
    it('should generate consistent SHA-256 hash', async () => {
      const buffer = new Uint8Array(validPdfBuffer);

      const hash1 = await generateDocumentHash(buffer);
      const hash2 = await generateDocumentHash(buffer);

      expect(hash1.contentHash).toBe(hash2.contentHash);
      expect(hash1.algorithm).toBe('SHA-256');
      expect(hash1.size).toBe(buffer.length);
      expect(hash1.timestamp).toBeDefined();
    });

    it('should generate different hashes for different content', async () => {
      const buffer1 = new Uint8Array(validPdfBuffer);
      const buffer2 = new Uint8Array(validJpegBuffer);

      const hash1 = await generateDocumentHash(buffer1);
      const hash2 = await generateDocumentHash(buffer2);

      expect(hash1.contentHash).not.toBe(hash2.contentHash);
    });

    it('should detect content tampering', async () => {
      const original = new Uint8Array(validPdfBuffer);
      const hash1 = await generateDocumentHash(original);

      // Tamper with content
      const tampered = new Uint8Array(validPdfBuffer);
      tampered[5] = 0xff;
      const hash2 = await generateDocumentHash(tampered);

      expect(hash1.contentHash).not.toBe(hash2.contentHash);
    });
  });

  describe('verifyDocumentIntegrity', () => {
    it('should verify document with matching hash', async () => {
      const buffer = new Uint8Array(validPdfBuffer);
      const hash = await generateDocumentHash(buffer);

      const integrity = await verifyDocumentIntegrity(
        buffer,
        hash.contentHash,
        'doc_123'
      );

      expect(integrity.tampered).toBe(false);
      expect(integrity.storedHash).toBe(hash.contentHash);
      expect(integrity.computedHash).toBe(hash.contentHash);
    });

    it('should detect document tampering', async () => {
      const buffer = new Uint8Array(validPdfBuffer);
      const hash = await generateDocumentHash(buffer);

      // Tamper with document
      const tampered = new Uint8Array(validPdfBuffer);
      tampered[5] = 0xff;

      const integrity = await verifyDocumentIntegrity(
        tampered,
        hash.contentHash,
        'doc_123'
      );

      expect(integrity.tampered).toBe(true);
      expect(integrity.computedHash).not.toBe(integrity.storedHash);
    });
  });
});

// ============================================================================
// DOCUMENT STATUS MANAGEMENT TESTS
// ============================================================================

describe('Document Status Management', () => {
  describe('createDocumentMetadata', () => {
    it('should create document with correct initial status', () => {
      const metadata = createDocumentMetadata({
        studentId: 'stu_1',
        hospitalId: 'hosp_1',
        applicationId: 'app_1',
        documentType: 'student_id',
        storageKey: 'documents/hosp_1/stu_1/student_id/file.pdf',
        originalFilename: 'student_id.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 1024 * 1024,
        kmsKeyId: 'key_123',
        wrappedDekKey: 'wrapped_key',
      });

      expect(metadata.id).toBeDefined();
      expect(metadata.status).toBe('pending_upload');
      expect(metadata.uploadedAt).toBeDefined();
    });
  });

  describe('updateDocumentStatus', () => {
    it('should update document status to verified', () => {
      const updated = updateDocumentStatus(
        mockDocumentMetadata,
        'verified',
        {
          verifiedBy: 'admin_1',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        }
      );

      expect(updated.status).toBe('verified');
      expect(updated.verifiedBy).toBe('admin_1');
      expect(updated.verifiedAt).toBeDefined();
      expect(updated.expiresAt).toBeDefined();
    });

    it('should update document status to rejected', () => {
      const updated = updateDocumentStatus(
        mockDocumentMetadata,
        'rejected'
      );

      expect(updated.status).toBe('rejected');
    });
  });

  describe('Document Expiry', () => {
    it('should detect non-expired document', () => {
      const future = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      const metadata = {
        ...mockDocumentMetadata,
        expiresAt: future,
      };

      expect(isDocumentExpired(metadata)).toBe(false);
    });

    it('should detect expired document', () => {
      const past = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();
      const metadata = {
        ...mockDocumentMetadata,
        expiresAt: past,
      };

      expect(isDocumentExpired(metadata)).toBe(true);
    });

    it('should calculate days until expiry', () => {
      const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const metadata = {
        ...mockDocumentMetadata,
        expiresAt: future,
      };

      const daysRemaining = daysUntilExpiry(metadata);
      expect(daysRemaining).toBeCloseTo(30, 1); // Allow 1 day margin
    });

    it('should flag document near expiry (30 days)', () => {
      const future = new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString();
      const metadata = {
        ...mockDocumentMetadata,
        expiresAt: future,
      };

      expect(shouldFlagForRenewal(metadata)).toBe(true);
    });

    it('should not flag document far from expiry', () => {
      const future = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
      const metadata = {
        ...mockDocumentMetadata,
        expiresAt: future,
      };

      expect(shouldFlagForRenewal(metadata)).toBe(false);
    });
  });
});

// ============================================================================
// RETENTION & CLEANUP TESTS
// ============================================================================

describe('Data Retention & Cleanup', () => {
  describe('shouldDeleteDocument', () => {
    it('should not delete unverified document', () => {
      const metadata = {
        ...mockDocumentMetadata,
        verifiedAt: undefined,
      };

      expect(shouldDeleteDocument(metadata)).toBe(false);
    });

    it('should not delete document within 30-day retention', () => {
      const verifiedDate = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString();
      const metadata = {
        ...mockDocumentMetadata,
        verifiedAt: verifiedDate,
      };

      expect(shouldDeleteDocument(metadata)).toBe(false);
    });

    it('should delete document after 30-day retention period', () => {
      const verifiedDate = new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString();
      const metadata = {
        ...mockDocumentMetadata,
        verifiedAt: verifiedDate,
      };

      expect(shouldDeleteDocument(metadata)).toBe(true);
    });
  });

  describe('getDocumentDeletionSchedule', () => {
    it('should return null schedule for unverified document', () => {
      const metadata = {
        ...mockDocumentMetadata,
        verifiedAt: undefined,
      };

      const schedule = getDocumentDeletionSchedule(metadata);

      expect(schedule.scheduledAt).toBeNull();
      expect(schedule.daysUntilDeletion).toBeNull();
    });

    it('should return deletion schedule for verified document', () => {
      const verifiedDate = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString();
      const metadata = {
        ...mockDocumentMetadata,
        verifiedAt: verifiedDate,
      };

      const schedule = getDocumentDeletionSchedule(metadata);

      expect(schedule.scheduledAt).toBeDefined();
      expect(schedule.daysUntilDeletion).toBeCloseTo(10, 1); // ~10 days remaining
    });
  });
});

// ============================================================================
// REJECTION HANDLING TESTS
// ============================================================================

describe('Document Rejection', () => {
  it('should reject document with reason', () => {
    const rejected = rejectDocument(
      mockDocumentMetadata,
      DOCUMENT_REJECTION_REASONS.ILLEGIBLE,
      'Document text not clearly readable',
      'admin_1'
    );

    expect(rejected.status).toBe('rejected');
  });

  it('should have valid rejection reason codes', () => {
    const reasons = Object.values(DOCUMENT_REJECTION_REASONS);

    expect(reasons).toContain('illegible');
    expect(reasons).toContain('expired');
    expect(reasons).toContain('invalid_format');
    expect(reasons).toContain('insufficient_information');
  });
});

