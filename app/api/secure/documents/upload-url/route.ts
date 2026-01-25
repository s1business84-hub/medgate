/**
 * Secure Document Upload API
 * 
 * Example of a protected API route with:
 * - JWT authentication
 * - Permission checking
 * - Pre-signed URL generation for direct-to-S3 upload
 * - Audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  withPermission,
  generateDocumentUploadUrl,
  auditDocumentAccess,
  validateDocumentUpload,
  DocumentType,
  AuthContext,
} from '@/lib/security';

/**
 * POST /api/secure/documents/upload-url
 * 
 * Generate a pre-signed URL for direct document upload to S3.
 * The document never passes through our servers.
 * 
 * Request body:
 * {
 *   documentType: "student_id" | "passport" | ...
 *   filename: "my-document.pdf"
 *   mimeType: "application/pdf"
 *   sizeBytes: 12345
 *   applicationId: "app_xxx"
 * }
 * 
 * Response:
 * {
 *   uploadUrl: "https://s3.amazonaws.com/...",
 *   storageKey: "documents/tenant/student/type/file.enc",
 *   expiresAt: "2026-01-22T12:00:00Z",
 *   fields: { ... } // Additional form fields for upload
 * }
 */
async function handler(request: NextRequest, context: AuthContext) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { documentType, filename, mimeType, sizeBytes, applicationId } = body;
    
    if (!documentType || !filename || !mimeType || !sizeBytes) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate document parameters
    const validation = validateDocumentUpload({
      documentType: documentType as DocumentType,
      filename,
      mimeType,
      sizeBytes,
    });
    
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.errors[0]?.message || 'Invalid document upload',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // Generate pre-signed URL
    const result = await generateDocumentUploadUrl({
      tenantId: context.user.tenantId || 'default',
      studentId: context.user.id,
      documentType: documentType as DocumentType,
      filename,
      mimeType,
      sizeBytes,
    });

    // Log the upload initiation
    await auditDocumentAccess(
      'document:upload_initiated' as never, // Type workaround for example
      result.storageKey,
      'success',
      context,
      {
        documentType,
        mimeType,
        sizeBytes,
        applicationId,
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload URL generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}

// Wrap with permission check - only students can upload documents
export const POST = withPermission('document:upload', handler);
