# PR: Pilot Lockdown — pilot/lockdown

## Summary
This pull request locks the application down for a controlled pilot. Changes are demo-only and intended to keep functionality local and auditable while removing or hiding non-pilot features.

Key goals:
- Enforce pilot rules in UI and storage (exposure acknowledgement, supervisor confirmations, start-training gating)
- Keep persistence demo-only (localStorage + in-memory audit store)
- Remove or hide exports and other non-essential pilot features
- Replace prompt-based supervisor identity capture with a dropdown selection
- Provide developer tickets, UI copy, and QA checklist for reviewers

## Files / Highlights
- lib/uiCopy.ts — centralized UI copy for pilot strings
- lib/toast.ts — non-blocking toast helper
- app/audit/exposure-log.tsx — wired UI copy, exposure acknowledgement
- app/supervisor/page.tsx — replaced prompt() flows with supervisor dropdown + submit forms
- app/admin/trainee-registry.tsx — Export CSV hidden behind `ALLOW_EXPORT = false`
- app/admin/page.tsx — program-level confirmation visibility, admin assignment text wired to UI copy
- app/programs/[id]/page.tsx — program-level confirmation badge + start-training messaging wired to UI copy
- QA_CHECKLIST.md, DEV_TICKETS.md, UI_COPY.md — documentation and developer tickets
- dev-issues/* — per-ticket markdown artifacts

## How to review
1. Pull the branch: `git fetch origin && git checkout pilot/lockdown`
2. Run `npm install` (if needed) and `npm run dev` or `npm run build`
3. Seed demo data in browser console as described in `QA_CHECKLIST.md`
4. Walk through flows: Supervisor Dashboard (confirmations/attest), Admin Dashboard (assign/confirm), Program page (exposure & Start Training), Trainee Registry (no Export visible)

## Testing/QA
See `QA_CHECKLIST.md` for step-by-step manual verification and localStorage seed data.

## Notes
- All changes are demo/local only. No external integrations or production services were added.
- CSV export code is preserved behind a feature flag for easy re-enabling after pilot.

---

Please open the PR on GitHub (branch: `pilot/lockdown`). The remote push was completed; you can open a PR at:
https://github.com/s1business84-hub/medgatefinal/pull/new/pilot/lockdown

If you want, I can also prepare the PR body text ready for pasting into GitHub or attempt to open the PR using `gh` if the CLI is available in your environment.
