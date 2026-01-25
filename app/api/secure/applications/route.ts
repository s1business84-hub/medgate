/**
 * Secure Application API
 * 
 * Example of field-level encryption for application data.
 * Sensitive fields are encrypted at rest while non-sensitive
 * fields remain queryable.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  withAuth,
  withPermission,
  checkTenantAccess,
  AuthContext,
  encryptApplicationFields,
  decryptApplicationFields,
  audit,
} from '@/lib/security';

// Mock application data type
interface ApplicationData extends Record<string, unknown> {
  id: string;
  studentId: string;
  hospitalId: string;
  programId: string;
  status: string;
  // Sensitive fields (will be encrypted)
  studentIdNumber: string;
  dateOfBirth: string;
  phoneNumber: string;
  // Non-sensitive fields
  preferredStartDate: string;
  specialRequests?: string;
}

/**
 * POST /api/secure/applications
 * 
 * Create a new application with encrypted sensitive fields
 */
async function createHandler(request: NextRequest, context: AuthContext) {
  try {
    const body = await request.json() as ApplicationData;

    // Encrypt sensitive fields before storing
    const encryptedApplication = await encryptApplicationFields(
      body,
      context.user.tenantId || 'default'
    );

    // In production, save to database
    // await db.applications.create(encryptedApplication);

    // Log the creation
    await audit({
      action: 'application:created',
      outcome: 'success',
      resourceType: 'application',
      resourceId: body.id,
      context,
      metadata: {
        programId: body.programId,
        hospitalId: body.hospitalId,
      },
    });

    // Return sanitized response (no sensitive data)
    return NextResponse.json({
      success: true,
      applicationId: body.id,
      status: 'submitted',
    });
  } catch (error) {
    console.error('Application creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/secure/applications/[id]
 * 
 * Get application with decrypted sensitive fields (if authorized)
 */
async function getHandler(request: NextRequest, context: AuthContext) {
  const url = new URL(request.url);
  const applicationId = url.pathname.split('/').pop();

  // Mock: In production, fetch from database
  const mockEncryptedApplication = {
    id: applicationId,
    studentId: context.user.id,
    hospitalId: context.user.tenantId || 'default',
    programId: 'prog_001',
    status: 'pending',
    // These would be EncryptedField objects in real implementation
    studentIdNumber: 'encrypted_xxx',
    dateOfBirth: 'encrypted_xxx',
    phoneNumber: 'encrypted_xxx',
    preferredStartDate: '2026-03-01',
  };

  // Check tenant access
  if (!checkTenantAccess(context.user, mockEncryptedApplication.hospitalId)) {
    return NextResponse.json(
      { error: 'Access denied' },
      { status: 403 }
    );
  }

  // For students viewing their own application, decrypt sensitive fields
  // For hospital reviewers, show verification status only (not raw data)
  
  if (context.user.id === mockEncryptedApplication.studentId) {
    // Student viewing own application - decrypt
    const decryptedApplication = await decryptApplicationFields(
      mockEncryptedApplication,
      context.user.tenantId || 'default'
    );

    await audit({
      action: 'application:viewed' as never,
      outcome: 'success',
      resourceType: 'application',
      resourceId: applicationId,
      context,
      metadata: { decrypted: true },
    });

    return NextResponse.json(decryptedApplication);
  } else {
    // Hospital reviewer - return without sensitive data
    await audit({
      action: 'application:viewed' as never,
      outcome: 'success',
      resourceType: 'application',
      resourceId: applicationId,
      context,
      metadata: { decrypted: false },
    });

    return NextResponse.json({
      id: mockEncryptedApplication.id,
      programId: mockEncryptedApplication.programId,
      status: mockEncryptedApplication.status,
      preferredStartDate: mockEncryptedApplication.preferredStartDate,
      // Sensitive fields masked or omitted
      hasStudentId: true,
      hasDateOfBirth: true,
      hasPhoneNumber: true,
    });
  }
}

export const POST = withPermission('application:create', createHandler);
export const GET = withAuth(getHandler);
