Title: Pilot: Lockdown pilot scope

Body:
This PR locks the application down for a controlled pilot. Changes are demo-only and intended to keep functionality local and auditable while removing or hiding non-pilot features.

Summary of changes
- Hide CSV/Export UI (feature-flagged)
- Replace `prompt()` supervisor flows with dropdowns and structured submissions
- Add program-level confirmation visibility (admin + program pages)
- Add `lib/uiCopy.ts` and wire key UI copy strings
- Replace blocking alerts with non-blocking toasts
- Add developer tickets and QA checklist (`DEV_TICKETS.md`, `dev-issues/`, `QA_CHECKLIST.md`)

Files changed (high level)
- `lib/uiCopy.ts`, `lib/toast.ts`
- `app/supervisor/page.tsx`, `app/admin/page.tsx`, `app/admin/trainee-registry.tsx`, `app/programs/[id]/page.tsx`, `app/audit/exposure-log.tsx`
- Documentation: `DEV_TICKETS.md`, `UI_COPY.md`, `QA_CHECKLIST.md`, `dev-issues/*`, `PR_DESCRIPTION.md`

Why
- Enforce pilot rules in UI and storage while avoiding production integrations or scope creep.

Testing
- See `QA_CHECKLIST.md` for seeding steps and manual verification flows.

Notes for reviewers
- All changes are demo/local only and reversible.
- CSV/export code is preserved behind feature-flag `ALLOW_EXPORT`.
- Auth remains demo/local; supervisor selection uses `getUsers()`.

Suggested reviewers: @team-lead, @frontend, @admin
Labels: pilot, chore, no-prod-integration

---

PR Link (create on GitHub):
https://github.com/s1business84-hub/medgatefinal/pull/new/pilot/lockdown
