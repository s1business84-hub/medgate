# Ticket 2 — Supervisor Confirmation (supervisor-side)

Description
- Provide a one-click supervisor confirmation flow that supports both student-level confirmations (includes studentId) and program-level confirmations (no studentId).

Acceptance criteria
- Supervisor can confirm for a specific student (record includes `studentId`) or for an entire program (no `studentId`).
- Confirmation stores `supervisorId`, optional `studentId`, `programId`, `dates`, `exposureBoundaries`, and a `confirmedAt` timestamp.
- Confirmation appears in admin and hospital lists and is considered by gating logic (`Start Training`, `Include in Observership`).

Files to update
- `app/supervisor/page.tsx` (UI)
- `app/api/audit/supervisor-confirmation.ts` (API route)
- `lib/auditStore.ts` (store function `addSupervisorConfirmation`)
- `app/admin/page.tsx` and `app/programs/[id]/page.tsx` (display confirmation status)

Estimate
- ~1 developer day

Testing notes
- Use supervisor dropdown in the Supervisor Dashboard to submit both student-specific and program-level confirmations.
- Verify `lib/auditStore.getSupervisorConfirmations()` contains entries and that admin/program pages display them.
- Confirm gating logic treats either student-level OR program-level confirmation as satisfying the requirement.
