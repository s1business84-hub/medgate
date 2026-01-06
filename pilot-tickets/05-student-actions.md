# Ticket 5 — Student Actions (apply / enter allocation / start training)

Description
- Implement student flows to submit applications, claim EHS allocations (if present), and start training when gating conditions are met.

Acceptance criteria
- Student can submit an application via modal (`ApplicationModal`).
- If an EHS allocation exists, student can claim it by entering reference/hospital and MedGate records it against their application.
- "Start Training" button is enabled only when all gating conditions are satisfied:
  - Application status is `Approved` or `Accepted`.
  - Exposure acknowledged is recorded.
  - Supervisor confirmation exists (student-level or program-level).
  - Regulatory Verified when required.

Files to update
- `components/application-modal.tsx`
- `app/programs/[id]/page.tsx` (start training gating and action)
- `lib/storage.ts` (createApplication, update allocation status)

Estimate
- 1–2 developer days

Testing notes
- Submit a new application and confirm it appears in `applications` localStorage.
- Simulate an EHS allocation and verify the student can claim it.
- Verify `Start Training` behaves per acceptance criteria.
