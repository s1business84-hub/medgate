type ExposureLog = { studentId: string; programId: string; exposureType?: string; confirmed?: boolean; acknowledgedAt: string; type: string };
type SupervisorConfirmation = { supervisorId: string; studentId?: string; programId: string; dates: string; exposureBoundaries: string; confirmedAt: string; type: string };
type CompletionAttestation = { supervisorId: string; studentId: string; programId: string; dates: string; exposureType: string; notes?: string; attestedAt: string; type: string };
type IncidentFlag = { adminId: string; programId: string; note: string; flaggedAt: string; severity?: string; type: string };
type EhsConfirmation = { applicationId: string; studentId: string; programId: string; hospitalId?: string; ehsReference?: string; verifiedBy?: string; verifiedAt: string; type: string };

const exposureLogs: ExposureLog[] = [];
const supervisorConfirmations: SupervisorConfirmation[] = [];
const completionAttestations: CompletionAttestation[] = [];
const incidentFlags: IncidentFlag[] = [];
const ehsConfirmations: EhsConfirmation[] = [];

const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
const persist = (key: string, value: any) => {
  if (!isBrowser) return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* ignore */ }
};
const readList = <T,>(key: string, fallback: T[]) => {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : fallback;
  } catch {
    return fallback;
  }
};

export function addExposureLog(entry: Omit<ExposureLog, 'acknowledgedAt' | 'type'>) {
  const item: ExposureLog = { ...entry, acknowledgedAt: new Date().toISOString(), type: 'exposure_acknowledgement' };
  exposureLogs.push(item);
  persist('electivio_exposureLogs', [...readList('electivio_exposureLogs', exposureLogs), item]);
  return item;
}

export function getExposureLogs() { return readList('electivio_exposureLogs', exposureLogs); }

export function addSupervisorConfirmation(entry: Omit<SupervisorConfirmation, 'confirmedAt' | 'type'>) {
  const item: SupervisorConfirmation = { ...entry, confirmedAt: new Date().toISOString(), type: 'supervisor_confirmation' };
  supervisorConfirmations.push(item);
  persist('electivio_supervisorConfirmations', [...readList('electivio_supervisorConfirmations', supervisorConfirmations), item]);
  return item;
}

export function getSupervisorConfirmations() { return readList('electivio_supervisorConfirmations', supervisorConfirmations); }

export function addCompletionAttestation(entry: Omit<CompletionAttestation, 'attestedAt' | 'type'>) {
  const item: CompletionAttestation = { ...entry, attestedAt: new Date().toISOString(), type: 'completion_attestation' };
  completionAttestations.push(item);
  persist('electivio_completionAttestations', [...readList('electivio_completionAttestations', completionAttestations), item]);
  return item;
}

export function getCompletionAttestations() { return readList('electivio_completionAttestations', completionAttestations); }

export function addIncidentFlag(entry: Omit<IncidentFlag, 'flaggedAt' | 'type'>) {
  const item: IncidentFlag = { ...entry, flaggedAt: new Date().toISOString(), type: 'incident_flag' };
  incidentFlags.push(item);
  persist('electivio_incidentFlags', [...readList('electivio_incidentFlags', incidentFlags), item]);
  return item;
}

export function getIncidentFlags() { return readList('electivio_incidentFlags', incidentFlags); }

export function addEhsConfirmation(entry: Omit<EhsConfirmation, 'verifiedAt' | 'type'>) {
  const item: EhsConfirmation = { ...entry, verifiedAt: new Date().toISOString(), type: 'ehs_confirmation' };
  ehsConfirmations.push(item);
  persist('electivio_ehsConfirmations', [...readList('electivio_ehsConfirmations', ehsConfirmations), item]);
  return item;
}

export function getEhsConfirmations() { return readList('electivio_ehsConfirmations', ehsConfirmations); }

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
      const storage = require('./storage');
      return storage.getApplications();
    } catch {
      return [] as any[];
    }
  })();

  const students = (() => {
    try {
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

  // Append EHS confirmations as a separate section
  if (ehsConfirmations.length > 0) {
    // Blank line + header
    rows.push('');
    rows.push('EHS Confirmation:applicationId,studentId,programId,hospitalId,ehsReference,verifiedBy,verifiedAt');
    ehsConfirmations.forEach(c => {
      rows.push([
        c.applicationId,
        c.studentId,
        c.programId,
        c.hospitalId || '',
        c.ehsReference || '',
        c.verifiedBy || '',
        c.verifiedAt
      ].join(','));
    });
  }

  return rows.join('\n');
}
