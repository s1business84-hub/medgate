import { test, expect } from '@playwright/test';

test('export accreditation CSV returns content (unit)', async () => {
  // Require the auditStore module in Node test context and seed data via exported helpers
  // @ts-ignore
  delete require.cache[require.resolve('../lib/auditStore')];
  // @ts-ignore
  const fresh = require('../lib/auditStore');

  // Seed exposure log and supervisor confirmation and completion attestation
  fresh.addExposureLog({ studentId: 'stu_test', programId: 'prog_1', exposureType: 'Observation' });
  fresh.addSupervisorConfirmation({ supervisorId: 'sup_test', studentId: 'stu_test', programId: 'prog_1', dates: '', exposureBoundaries: '' });
  fresh.addCompletionAttestation({ supervisorId: 'sup_test', studentId: 'stu_test', programId: 'prog_1', dates: '', exposureType: 'Observation' });
  // Seed EHS confirmation
  fresh.addEhsConfirmation({ applicationId: 'app_test', studentId: 'stu_test', programId: 'prog_1', hospitalId: 'hosp_1', ehsReference: 'EHS-REF-1', verifiedBy: 'hospital_admin' });

  const csv = fresh.exportAccreditationCSV();
  expect(csv).toBeTruthy();
  expect(typeof csv).toBe('string');
  expect(csv.split('\n').length).toBeGreaterThan(0);
});
