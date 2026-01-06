# Ticket 7 — Supervisor Completion Attestation (light)

Description
- Allow supervisors to attestate completion for a student and record a light summary of dates/exposure.

Acceptance criteria
- Supervisor can attestate completion (studentId required) and the record stores `supervisorId`, `studentId`, `programId`, `dates`, `exposureType`, `notes`, and `attestedAt` timestamp.
- The completion attestation is visible in the trainee registry and persisted in the in-memory audit store.

Files to update
- `app/audit/completion-attestation.tsx` (UI)
- `app/api/audit/completion-attestation.ts` (API)
- `lib/auditStore.ts` (store function `addCompletionAttestation`)

Estimate
- ~0.5 day

Testing notes
- As a supervisor, submit a completion attestation; verify `lib/auditStore.getCompletionAttestations()` includes the entry and the trainee registry displays attestation info.
