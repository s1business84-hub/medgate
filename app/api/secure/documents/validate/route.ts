/**
 * Document Validation API
 * 
 * POST /api/secure/documents/validate
 * 
 * Validates document upload before S3 transfer.
 * Checks file type, size, and magic bytes.
 * Returns validation result and storage metadata.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  withPermission,
  AuthContext,
  auditDocumentAccess,
} from '@/lib/security';
import {
  validateDocumentUpload,
  validateMagicBytes,
  createDocumentMetadata,
  generateDocumentHash,
  DOCUMENT_CONFIG,
  type DocumentUploadValidation,
} from '@/lib/security/document-verification';

/**
 * POST /api/secure/documents/validate
 * 
 * Validate document before upload to S3
 * 
 * Request body:
 * {
 *   documentType: "student_id" | "passport" | ...
 *   filename: "document.pdf"
 *   mimeType: "application/pdf"
 *   sizeBytes: 5242880
 *   fileBuffer?: Uint8Array (base64 for HTTP) - optional first chunk for magic byte check
 *   applicationId: "app_xxx"
 * }
 * 
 * Response:
 * {
 *   valid: true/false,
 *   errors: [{ field, code, message }],
 *   metadata: {
 *     detectedMimeType: "application/pdf",
 *     fileExtension: ".pdf",
 *     fileSizeBytes: 5242880
 *   }
 * }
 */
async function handler(
  request: NextRequest,
  context: AuthContext
) {
  try {
    const body = await request.json();
    const {
      documentType,
      filename,
      mimeType,
      sizeBytes,
      fileBuffer,
      applicationId,
    } = body;

    // Validate required fields
    if (!documentType || !filename || !mimeType || !sizeBytes === undefined) {
      return NextResponse.json(
        {
          valid: false,
          errors: [
            {
              field: 'body',
              code: 'MISSING_REQUIRED_FIELD',
              message:
                'Missing required fields: documentType, filename, mimeType, sizeBytes',
            },
          ],
        },
        { status: 400 }
      );
    }

    // Decode fileBuffer if provided (base64 from HTTP)
    let decodedBuffer: Uint8Array | undefined;
    if (fileBuffer) {
      try {
        const binaryString = Buffer.from(fileBuffer, 'base64').toString(
          'binary'
        );
        decodedBuffer = new Uint8Array(
          Array.from(binaryString).map(c => c.charCodeAt(0))
        );
      } catch (e) {
        return NextResponse.json(
          {
            valid: false,
            errors: [
              {
                field: 'fileBuffer',
                code: 'INVALID_FILE_FORMAT',
                message: 'Invalid base64 encoding for fileBuffer',
              },
            ],
          },
          { status: 400 }
        );
      }
    }

    // Run validation
    const validation: DocumentUploadValidation = {
      documentType,
      filename,
      mimeType,
      sizeBytes,
      fileBuffer: decodedBuffer,
    };

    const validationResult = validateDocumentUpload(validation);

    // Log validation attempt
    await auditDocumentAccess(
      'document:upload_initiated',
      `validation_${Date.now()}`,
      validationResult.valid ? 'success' : 'failure',
      context,
      {
        documentType,
        filename,
        sizeBytes,
        errorCount: validationResult.errors.length,
      }
    );

    // If validation passed, create metadata for next steps
    if (validationResult.valid) {
      const metadata = createDocumentMetadata({
        studentId: context.user.id,
        hospitalId: context.user.tenantId || 'default',
        applicationId: applicationId || 'unknown',
        documentType,
        storageKey: `documents/${context.user.tenantId}/${context.user.id}/${documentType}/${Date.now()}_${filename}`,
        originalFilename: filename,
        mimeType,
        sizeBytes,
        kmsKeyId: process.env.KMS_ROOT_KEY_ARN || 'default',
        wrappedDekKey: '', // Will be filled during actual upload
      });

      return NextResponse.json(
        {
          valid: true,
          errors: [],
          metadata: validationResult.metadata,
          document: {
            id: metadata.id,
            status: metadata.status,
            storageKey: metadata.storageKey,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      validationResult,
      { status: 400 }
    );
  } catch (error) {
    console.error('[Document Validation] Error:', error);

    await auditDocumentAccess(
      'document:upload_initiated',
      'unknown',
      'failure',
      context,
      { error: String(error) }
    );

    return NextResponse.json(
      {
        valid: false,
        errors: [
          {
            field: 'server',
            code: 'INTERNAL_ERROR',
            message: 'Document validation failed',
          },
        ],
      },
      { status: 500 }
    );
  }
}

export const POST = withPermission('document:upload', handler);

