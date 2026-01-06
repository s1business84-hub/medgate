type ExposureLog = { studentId: string; programId: string; acknowledgedAt: string; type: string };
type SupervisorConfirmation = { supervisorId: string; programId: string; dates: string; exposureBoundaries: string; confirmedAt: string; type: string };
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
  // Simple CSV combining trainees, supervisors, and exposure logs
  const rows: string[] = [];
  rows.push('studentId,programId,acknowledgedAt,supervisorId,supervisorConfirmedAt,completionAttestedAt,exposureType');

  // Build map of supervisor confirmations and completion attestations by program+student
  const supMap = new Map<string, any>();
  getSupervisorConfirmations().forEach(s => { supMap.set(`${s.programId}::${s.supervisorId}`, s); });

  const compMap = new Map<string, any>();
  getCompletionAttestations().forEach(c => { compMap.set(`${c.programId}::${c.studentId}`, c); });

  getExposureLogs().forEach(e => {
    const comp = compMap.get(`${e.programId}::${e.studentId}`);
    // Find a supervisor confirmation for same program (best-effort)
    const sup = getSupervisorConfirmations().find(s => s.programId === e.programId);
    rows.push([e.studentId, e.programId, e.acknowledgedAt, sup?.supervisorId || '', sup?.confirmedAt || '', comp?.attestedAt || '', comp?.exposureType || ''].join(','));
  });

  return rows.join('\n');
}
