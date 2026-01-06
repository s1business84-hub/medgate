# Ticket 3 — Trainee Registry (read-only)

Description
- Hospital/admin-facing table listing students and their application metadata for audit and roster purposes.

Acceptance criteria
- Registry shows columns: Student Name, Department/Program, Supervisor (human-friendly name), Exposure type, Dates, Regulatory type & status, Application status.
- Searchable by student name and department/program.
- No exports or CSV buttons visible in pilot (Export disabled or hidden).

Files to update
- `app/admin/trainee-registry.tsx`

Estimate
- ~0.5 day (mostly implemented; confirm export is disabled)

Testing notes
- Verify the Export CSV button is not visible in the UI (or behind `ALLOW_EXPORT=false`).
- Search for a seeded student and confirm the row displays supervisor name (resolved via `getUsers()`), exposure, and regulatory information.
