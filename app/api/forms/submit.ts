import { NextRequest, NextResponse } from 'next/server';
import { FormResponse } from '@/lib/types';

/**
 * POST /api/forms/submit
 * Submit a post-session form response
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as FormResponse;

    // Validate required fields
    if (!body.formTemplateId || !body.observershipId || !body.applicationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate that all required questions have answers
    // This would be checked in the client, but validating again server-side
    const answers = body.answers || [];
    if (answers.length === 0) {
      return NextResponse.json(
        { error: 'No answers provided' },
        { status: 400 }
      );
    }

    // TODO: Fetch formTemplate from database to validate against questions
    // TODO: Store formResponse in database
    // TODO: If criteria.requiresSupervisorApproval is true, assign to supervisor
    // TODO: Otherwise, auto-pass and create tracking record

    // For now, return success response
    const response: FormResponse = {
      ...body,
      id: `response-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'submitted', // Will be updated to 'passed' or 'under_review' based on criteria
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/forms/submit?observershipId=xxx
 * Get form responses for an observership
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const observershipId = searchParams.get('observershipId');

    if (!observershipId) {
      return NextResponse.json(
        { error: 'observershipId is required' },
        { status: 400 }
      );
    }

    // TODO: Query database for form responses with matching observershipId

    return NextResponse.json(
      { responses: [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    );
  }
}
