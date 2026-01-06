# Ticket 1 — Implement Exposure Acknowledgement (student)

Description
- Add the exposure acknowledgement UI and backend record as specified in the pilot checklist.

Acceptance criteria
- Student sees Exposure level dropdown ("Observation" / "Limited participation"), a short disclaimer, and a required checkbox.
- Student cannot proceed to apply unless checkbox is checked and an exposure selection is made.
- POST to `/api/audit/exposure-log` records an immutable entry containing `studentId`, `programId`, `exposureType`, and timestamp.
- Recorded exposure logs are visible (read-only) to hospital and supervisor UIs (admin/hospital lists and supervisor dashboard).

Files to update
- `app/audit/exposure-log.tsx` (UI)
- `app/api/audit/exposure-log.ts` (API route)
- `lib/auditStore.ts` (in-memory audit record)
- `app/programs/[id]/page.tsx` (apply / start-training gating)

Estimate
- 1–2 developer days

Testing notes
- Seed a demo student and application; verify the acknowledgement UI renders; attempt to submit without checking box (must be prevented); submit with checkbox and verify `/api/audit/exposure-log` returns OK and that `lib/auditStore.getExposureLogs()` contains the new record with `acknowledgedAt`.
- Verify hospital/admin views surface the exposure log (read-only) and gating logic in `page.tsx` denies start/apply when missing.
