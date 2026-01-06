# Ticket 6 — Admin Actions (Accept / Defer / Decline / Assign)

Description
- Implement admin/hospital actions required for pilot operations: Accept, Defer, Decline, Assign supervisor & department.

Acceptance criteria
- Admin can Accept / Defer / Decline applications and the action persists.
- Admin can assign `supervisor` and `department` to an application; assignment persists and triggers a light audit entry plus a local notification to the student.
- Admin can add regulatory info to applications that are missing it (e.g., post EHS allocation or when a DHA/DoH flag is later raised).

Files to update
- `app/admin/page.tsx` (actions, assignment UI)
- `lib/storage.ts` (persist assignment and createNotification, logAudit)

Estimate
- ~1 developer day

Testing notes
- As admin, perform Accept/Defer/Decline workflows and verify application status updates and notifications in `localStorage`.
- Assign a supervisor and department, confirm audit entry and notification created.
