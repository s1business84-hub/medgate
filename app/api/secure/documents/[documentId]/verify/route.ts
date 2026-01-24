/**
 * Document Verification API
 * 
 * Example of a protected API route for MedGate verifiers to:
 * - View pending documents
 * - Decrypt and review documents
 * - Create verification attestations
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  withPermission,
  withRole,
  Role,
  AuthContext,
  auditDocumentAccess,
  createVerificationAttestation,
  getSecureDocumentService,
} from '@/lib/security';

/**
 * GET /api/secure/documents/[documentId]/verify
 * 
 * Get document details for verification (MedGate verifiers only)
 */
async function getHandler(
  request: NextRequest, 
  context: AuthContext
) {
  const url = new URL(request.url);
  const documentId = url.pathname.split('/').slice(-2)[0];

  // Log document access
  await auditDocumentAccess(
    'document:viewed',
    documentId,
    'success',
    context,
    { purpose: 'verification' }
  );

  // In production, fetch document metadata from database
  // For example, return mock data
  return NextResponse.json({
    documentId,
    status: 'pending_verification',
    documentType: 'student_id',
    uploadedAt: new Date().toISOString(),
    // Don't include decrypted content in this response
    // Verifier must explicitly request decryption
  });
}

/**
 * POST /api/secure/documents/[documentId]/verify
 * 
 * Submit verification result for a document
 * 
 * Request body:
 * {
 *   verified: true/false,
 *   extractedData: {
 *     studentIdLast4: "3456",
 *     universityName: "..."
 *   },
 *   notes: "Verification notes"
 * }
 */
async function postHandler(
  request: NextRequest,
  context: AuthContext
) {
  const url = new URL(request.url);
  const documentId = url.pathname.split('/').slice(-2)[0];
  
  try {
    const body = await request.json();
    const { verified, extractedData, notes } = body;

    if (typeof verified !== 'boolean') {
      return NextResponse.json(
        { error: 'verified field must be boolean' },
        { status: 400 }
      );
    }

    // Create verification attestation
    const attestation = await createVerificationAttestation({
      documentId,
      applicationId: 'app_xxx', // Would come from document metadata
      studentId: 'student_xxx', // Would come from document metadata
      hospitalId: context.user.tenantId || 'default',
      verified,
      method: 'manual_review',
      verifierId: context.user.id,
      verifierRole: context.user.role,
      contentHash: 'sha256:xxx', // Would come from document metadata
      extractedData: extractedData || {},
    });

    // Log the verification action
    await auditDocumentAccess(
      verified ? 'document:verified' : 'document:rejected',
      documentId,
      'success',
      context,
      {
        attestationId: attestation.id,
        verified,
        notes,
      }
    );

    return NextResponse.json({
      success: true,
      attestation: {
        id: attestation.id,
        verified: attestation.verified,
        verifiedAt: attestation.verifiedAt,
        attestationHash: attestation.attestationHash,
      },
    });
  } catch (error) {
    console.error('Verification failed:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}

// Only MedGate verifiers and admins can verify documents
export const GET = withPermission('document:view_pending', getHandler);
export const POST = withPermission('document:verify', postHandler);
