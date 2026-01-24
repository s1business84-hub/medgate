/**
 * MedGate Secure Document Service
 * 
 * Handles encrypted document upload, storage, verification, and deletion.
 * Implements the privacy-minimizing storage pattern:
 * - Store encrypted documents temporarily
 * - Create permanent verification attestations
 * - Delete raw documents after retention period
 */

import {
  DocumentMetadata,
  DocumentType,
  DocumentStatus,
  VerificationAttestation,
  PresignedUrlRequest,
  PresignedUrlResponse,
  EncryptedEnvelope,
  EncryptionContext,
  Role,
  SecurityError,
} from './types';
import { securityConfig, documentTypeConfig, validateDocumentUpload } from './config';
import { getEnvelopeEncryptionService } from './envelope';
import { sha256Prefixed, generateSecureId } from './crypto';

// ============================================================================
// DOCUMENT SERVICE
// ============================================================================

export class SecureDocumentService {
  /**
   * Generate a pre-signed URL for direct upload to S3
   * 
   * The document never passes through MedGate servers - it goes directly
   * from the client to S3, encrypted at rest via SSE-KMS.
   */
  async generateUploadUrl(request: PresignedUrlRequest): Promise<PresignedUrlResponse> {
    // Validate upload parameters
    const validation = validateDocumentUpload(
      request.documentType,
      request.mimeType,
      request.sizeBytes
    );
    
    if (!validation.valid) {
      throw new SecurityError(validation.error!, 'INVALID_UPLOAD', 400);
    }

    // Generate unique storage key
    const fileId = generateSecureId('doc');
    const storageKey = this.buildStorageKey(
      request.tenantId,
      request.studentId,
      request.documentType,
      fileId
    );

    // In production, this would call S3 to generate a pre-signed URL
    // For now, return a mock URL structure
    const expiresAt = new Date(
      Date.now() + securityConfig.s3.presignedUrlExpirySec * 1000
    ).toISOString();

    // Mock implementation - in production use AWS S3 SDK
    const uploadUrl = this.generateMockPresignedUrl(storageKey, request);

    return {
      uploadUrl,
      storageKey,
      expiresAt,
      fields: {
        'x-amz-server-side-encryption': 'aws:kms',
        'x-amz-server-side-encryption-aws-kms-key-id': 
          `arn:aws:kms:${securityConfig.kms.region}:*:key/tenant-${request.tenantId}`,
      },
    };
  }

  /**
   * Record document metadata after successful upload
   */
  async recordUpload(params: {
    storageKey: string;
    tenantId: string;
    studentId: string;
    applicationId: string;
    documentType: DocumentType;
    filename: string;
    mimeType: string;
    sizeBytes: number;
    contentHash: string;
  }): Promise<DocumentMetadata> {
    const now = new Date().toISOString();
    const config = documentTypeConfig[params.documentType];
    
    // Calculate retention-based expiry
    const expiresAt = new Date(
      Date.now() + config.retentionDays * 24 * 60 * 60 * 1000
    ).toISOString();

    const metadata: DocumentMetadata = {
      id: generateSecureId('doc'),
      studentId: params.studentId,
      hospitalId: params.tenantId, // tenantId is hospitalId in this context
      applicationId: params.applicationId,
      documentType: params.documentType,
      status: config.requiresVerification ? 'pending_verification' : 'uploaded',
      storageKey: params.storageKey,
      originalFilename: this.sanitizeFilename(params.filename),
      mimeType: params.mimeType,
      sizeBytes: params.sizeBytes,
      contentHash: params.contentHash,
      kmsKeyId: `tenant-${params.tenantId}-key`, // In production, get from KMS
      wrappedDekKey: `${params.storageKey}.dek`, // DEK stored alongside document
      uploadedAt: now,
      expiresAt,
    };

    // In production, save to database
    // await this.db.documents.create(metadata);

    return metadata;
  }

  /**
   * Encrypt and store a document (for server-side processing)
   * 
   * Use this when the document needs to be processed server-side
   * before storage (e.g., for verification workflows).
   */
  async encryptAndStore(
    content: Uint8Array,
    tenantId: string,
    documentType: DocumentType,
    applicationId: string
  ): Promise<{ metadata: DocumentMetadata; envelope: EncryptedEnvelope }> {
    const service = getEnvelopeEncryptionService();
    
    // Calculate content hash before encryption
    const contentHash = await sha256Prefixed(content);
    
    // Create encryption context
    const context: Partial<EncryptionContext> = {
      dataType: 'document',
      resourceId: applicationId,
    };
    
    // Encrypt the document
    const envelope = await service.encrypt(content, tenantId, context);
    
    // Generate storage key
    const fileId = generateSecureId('doc');
    const storageKey = this.buildStorageKey(
      tenantId,
      applicationId,
      documentType,
      fileId
    );

    // Create metadata
    const metadata: DocumentMetadata = {
      id: fileId,
      studentId: '', // To be filled by caller
      hospitalId: tenantId,
      applicationId,
      documentType,
      status: 'pending_verification',
      storageKey,
      originalFilename: `${documentType}-${fileId}`,
      mimeType: 'application/octet-stream',
      sizeBytes: content.length,
      contentHash,
      kmsKeyId: envelope.kmsKeyId,
      wrappedDekKey: `${storageKey}.dek`,
      uploadedAt: new Date().toISOString(),
      expiresAt: new Date(
        Date.now() + securityConfig.retention.verifiedDocumentsRetentionDays * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    return { metadata, envelope };
  }

  /**
   * Decrypt and retrieve a document for viewing/verification
   */
  async decryptAndRetrieve(
    metadata: DocumentMetadata,
    envelope: EncryptedEnvelope,
    tenantId: string
  ): Promise<Uint8Array> {
    // Verify tenant has access
    if (metadata.hospitalId !== tenantId) {
      throw new SecurityError('Access denied to document', 'DOCUMENT_ACCESS_DENIED', 403);
    }

    const service = getEnvelopeEncryptionService();
    
    const context: Partial<EncryptionContext> = {
      dataType: 'document',
      resourceId: metadata.applicationId,
    };

    return service.decrypt(envelope, tenantId, context);
  }

  /**
   * Create a verification attestation
   * 
   * This is the permanent "proof" that replaces the raw document.
   * It contains non-sensitive verification results.
   */
  async createVerificationAttestation(params: {
    documentId: string;
    applicationId: string;
    studentId: string;
    hospitalId: string;
    verified: boolean;
    method: VerificationAttestation['method'];
    verifierId?: string;
    verifierRole?: Role;
    contentHash: string;
    extractedData?: VerificationAttestation['extractedData'];
  }): Promise<VerificationAttestation> {
    const now = new Date().toISOString();
    
    const attestation: VerificationAttestation = {
      id: generateSecureId('vat'),
      documentId: params.documentId,
      applicationId: params.applicationId,
      studentId: params.studentId,
      hospitalId: params.hospitalId,
      verified: params.verified,
      method: params.method,
      verifierId: params.verifierId,
      verifierRole: params.verifierRole,
      extractedData: params.extractedData ?? {},
      contentHash: params.contentHash,
      attestationHash: '', // Will be calculated below
      verifiedAt: now,
      attestationCreatedAt: now,
    };

    // Calculate attestation hash for tamper detection
    const attestationData = JSON.stringify({
      ...attestation,
      attestationHash: undefined, // Exclude from hash
    });
    attestation.attestationHash = await sha256Prefixed(attestationData);

    // In production, save to database
    // await this.db.attestations.create(attestation);

    return attestation;
  }

  /**
   * Verify an attestation hasn't been tampered with
   */
  async verifyAttestation(attestation: VerificationAttestation): Promise<boolean> {
    const attestationData = JSON.stringify({
      ...attestation,
      attestationHash: undefined,
    });
    const calculatedHash = await sha256Prefixed(attestationData);
    
    return calculatedHash === attestation.attestationHash;
  }

  /**
   * Mark a document for deletion
   * 
   * In production, this would:
   * 1. Delete from S3
   * 2. Delete wrapped DEK
   * 3. Update metadata status
   */
  async markForDeletion(documentId: string, tenantId: string): Promise<void> {
    // In production:
    // 1. Verify caller has permission
    // 2. Delete S3 object
    // 3. Delete wrapped DEK
    // 4. Update database record

    console.log(`Document ${documentId} marked for deletion in tenant ${tenantId}`);
  }

  /**
   * Cleanup expired documents
   * 
   * This would typically run as a scheduled job.
   */
  async cleanupExpiredDocuments(): Promise<{ deleted: number; errors: number }> {
    // In production:
    // 1. Query for documents past expiry date
    // 2. Delete each one
    // 3. Log audit events

    return { deleted: 0, errors: 0 };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Build S3 storage key following the tenant/student/doctype structure
   */
  private buildStorageKey(
    tenantId: string,
    studentId: string,
    documentType: DocumentType,
    fileId: string
  ): string {
    return `${securityConfig.s3.keyPrefix}/${tenantId}/${studentId}/${documentType}/${fileId}.enc`;
  }

  /**
   * Sanitize filename to prevent path traversal attacks
   */
  private sanitizeFilename(filename: string): string {
    // Remove path components
    const basename = filename.split(/[/\\]/).pop() || filename;
    // Remove special characters
    return basename.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 255);
  }

  /**
   * Generate mock pre-signed URL (development only)
   */
  private generateMockPresignedUrl(storageKey: string, request: PresignedUrlRequest): string {
    const bucket = securityConfig.s3.bucket;
    const region = securityConfig.s3.region;
    
    // This is a mock URL structure - in production use S3.getSignedUrl()
    return `https://${bucket}.s3.${region}.amazonaws.com/${storageKey}?mock-signature=dev`;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let documentServiceInstance: SecureDocumentService | null = null;

export function getSecureDocumentService(): SecureDocumentService {
  if (!documentServiceInstance) {
    documentServiceInstance = new SecureDocumentService();
  }
  return documentServiceInstance;
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Generate a pre-signed upload URL
 */
export async function generateDocumentUploadUrl(
  request: PresignedUrlRequest
): Promise<PresignedUrlResponse> {
  return getSecureDocumentService().generateUploadUrl(request);
}

/**
 * Create a verification attestation
 */
export async function createVerificationAttestation(
  params: Parameters<SecureDocumentService['createVerificationAttestation']>[0]
): Promise<VerificationAttestation> {
  return getSecureDocumentService().createVerificationAttestation(params);
}
