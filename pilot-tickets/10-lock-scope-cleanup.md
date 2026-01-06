# Ticket 10 — Lock Scope & Cleanup

Description
- Remove or hide non-pilot features (exports, advanced reports, payments, capacity restrictions, incident reporting) to keep the pilot focused and reduce surface area.

Acceptance criteria
- Exports disabled or removed (trainee registry Export button hidden behind `ALLOW_EXPORT=false`).
- Any admin-only export or accreditation functionality hidden behind feature flags or removed from UI flows.
- No payment or external integrations introduced for pilot.

Files to update
- `app/admin/trainee-registry.tsx`, `app/admin/accreditation-pack.tsx`, and any other export points.

Estimate
- ~0.5–1 day

Testing notes
- Run the app and confirm no export buttons or accreditation pack flows are visible to pilot users.
- Confirm no changes to production integrations were made.
