import { NextRequest, NextResponse } from 'next/server';
import { addExposureLog, addSupervisorConfirmation, addEhsConfirmation } from '@/lib/auditStore';

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { programId, hospitalId } = body || {};

    // Prepare simple demo payload for client localStorage
    const users = [
      { id: 'admin_demo', name: 'Admin User', email: 'admin@demo', role: 'admin' },
      { id: 'hospital_admin_demo', name: 'Hospital Admin', email: 'hadmin@demo', role: 'hospital', hospitalId: hospitalId || '' },
      { id: 'stu_demo', name: 'Demo Student', email: 'stu@demo', role: 'student' }
    ];

    const students = [
      { id: 'stu_demo', name: 'Demo Student', email: 'stu@demo', phone: '', nationality: '', complianceStatus: 'Incomplete', createdAt: new Date().toISOString() }
    ];

    const applications = [] as any[];

    // Optionally seed a referee EHS confirmation in server-side auditStore (none initially)
    // Return payload so client can write into localStorage

    // Also create a server-side exposure log and supervisor confirmation placeholders if requested
    if (body.seedExposure) {
      addExposureLog({ studentId: 'stu_demo', programId: programId || '' , exposureType: 'Observation' });
    }
    if (body.seedSupervisor) {
      addSupervisorConfirmation({ supervisorId: 'hospital_admin_demo', studentId: 'stu_demo', programId: programId || '', dates: '', exposureBoundaries: '' });
    }
    if (body.seedEhsConfirmation) {
      addEhsConfirmation({ applicationId: body.applicationId || 'seed_app', studentId: 'stu_demo', programId: programId || '', hospitalId: hospitalId || '', ehsReference: body.ehsReference || 'EHS-REF-API' });
    }

    return NextResponse.json({ success: true, users, students, applications });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
