# Ticket 8 — Light Audit & Notifications (manual)

Description
- Add audit log entries for key actions (assignment, EHS allocation creation, start training, program-level confirmation) and create simple notifications stored in localStorage.

Acceptance criteria
- Audit entries are created for assignment, EHS allocation creation, start training, and program-level confirmations and are visible in localStorage audit list.
- Notifications are created for affected users (student/hospital) and stored in localStorage `notifications`. No external delivery/integration.

Files to update
- `lib/storage.ts` (logAudit, createNotification)
- `app/admin/page.tsx`, `app/programs/[id]/page.tsx` (callers to write audit + notifications)

Estimate
- ~0.5–1 day

Testing notes
- Perform assignment and start training actions; inspect `localStorage.auditLogs` and `localStorage.notifications` for entries.
- Verify created notifications contain `userId`, `type`, `title`, `message`, and `relatedApplicationId`.
