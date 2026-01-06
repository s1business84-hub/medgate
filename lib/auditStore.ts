type ExposureLog = { studentId: string; programId: string; exposureType?: string; acknowledgedAt: string; type: string };
type SupervisorConfirmation = { supervisorId: string; studentId?: string; programId: string; dates: string; exposureBoundaries: string; confirmedAt: string; type: string };
type CompletionAttestation = { supervisorId: string; studentId: string; programId: string; dates: string; exposureType: string; notes?: string; attestedAt: string; type: string };
type IncidentFlag = { adminId: string; programId: string; note: string; flaggedAt: string; severity?: string; type: string };

const exposureLogs: ExposureLog[] = [];
const supervisorConfirmations: SupervisorConfirmation[] = [];
const completionAttestations: CompletionAttestation[] = [];
const incidentFlags: IncidentFlag[] = [];

export function addExposureLog(entry: Omit<ExposureLog, 'acknowledgedAt' | 'type'>) {
  const item: ExposureLog = { ...entry, acknowledgedAt: new Date().toISOString(), type: 'exposure_acknowledgement' };
  exposureLogs.push(item);
  return item;
}

export function getExposureLogs() { return exposureLogs; }

export function addSupervisorConfirmation(entry: Omit<SupervisorConfirmation, 'confirmedAt' | 'type'>) {
  const item: SupervisorConfirmation = { ...entry, confirmedAt: new Date().toISOString(), type: 'supervisor_confirmation' };
  supervisorConfirmations.push(item);
  return item;
}

export function getSupervisorConfirmations() { return supervisorConfirmations; }

export function addCompletionAttestation(entry: Omit<CompletionAttestation, 'attestedAt' | 'type'>) {
  const item: CompletionAttestation = { ...entry, attestedAt: new Date().toISOString(), type: 'completion_attestation' };
  completionAttestations.push(item);
  return item;
}

export function getCompletionAttestations() { return completionAttestations; }

export function addIncidentFlag(entry: Omit<IncidentFlag, 'flaggedAt' | 'type'>) {
  const item: IncidentFlag = { ...entry, flaggedAt: new Date().toISOString(), type: 'incident_flag' };
  incidentFlags.push(item);
  return item;
}

export function getIncidentFlags() { return incidentFlags; }

export function exportAccreditationCSV() {
  // Simple CSV combining trainees, supervisors, exposure logs and application status
  const rows: string[] = [];
  rows.push('studentId,studentName,programId,applicationStatus,acknowledgedAt,supervisorId,supervisorConfirmedAt,completionAttestedAt,exposureType');

  // Build maps
  const supList = getSupervisorConfirmations();
  const compList = getCompletionAttestations();
  const apps = (() => {
    try {
      // lazy import to avoid cycles
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const storage = require('./storage');
      return storage.getApplications();
    } catch {
      return [] as any[];
    }
  })();

  const students = (() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const storage = require('./storage');
      return storage.getStudents();
    } catch {
      return [] as any[];
    }
  })();

  getExposureLogs().forEach(e => {
    const comp = compList.find(c => c.programId === e.programId && c.studentId === e.studentId);
    // Prefer student-scoped supervisor confirmation, fall back to program-level
    const sup = supList.find(s => s.programId === e.programId && (s.studentId === e.studentId || !s.studentId));
    const app = apps.find((a: any) => a.programId === e.programId && a.studentId === e.studentId);
    const student = students.find((s: any) => s.id === e.studentId);
    rows.push([
      e.studentId,
      (student?.name || '').replace(/\"/g, '""'),
      e.programId,
      app?.status || '',
      e.acknowledgedAt,
      sup?.supervisorId || '',
      sup?.confirmedAt || '',
      comp?.attestedAt || '',
      comp?.exposureType || ''
    ].join(','));
  });

  return rows.join('\n');
}
