# Developer Tickets — Pilot Lockdown (Prioritized)

This file contains developer-ready issue descriptions to implement and harden the pilot scope. Create one GitHub issue per ticket and assign priority labels accordingly.

1. Ticket: Lockdown CSV/Export Features
- Description: Remove or hide all CSV and accreditation pack export buttons from admin UI and API surfaces for the pilot. Keep export code in repo behind feature-flag or comment for future use.
- Acceptance:
  - No visible export buttons in `app/admin/trainee-registry.tsx` and related pages.
  - Export code remains but is not reachable via UI routes.

2. Ticket: Replace Prompt-Based Supervisor Identity with Dropdown
- Description: Replace `prompt()` supervisor confirmations with a dropdown selecting an existing supervisor user. Use `getUsers()` storage helper to populate the list. If supervisor auth isn't available, provide a required dropdown for the admin/supervisor action.
- Acceptance:
  - No `prompt()` usages remain for supervisor identity.
  - Supervisor actions persist with a `supervisorId` recorded on confirmation.

3. Ticket: Improve Program-Level Confirmation Visibility
- Description: Display program-level confirmations in program and admin lists with a clear badge and timestamp. Add filtering to trainee registry to show program-confirmed programs.
- Acceptance:
  - Program-level confirmations show a badge in program list views.
  - Filtering works in `app/admin/trainee-registry.tsx`.

4. Ticket: Create UI Copy Document for Pilot Flows
- Description: Produce exact UI copy strings for student, admin, and supervisor flows (exposure acknowledgement, supervisor confirmation, start-training gating, EHS allocation modal, regulatory status messages, toasts).
- Acceptance:
  - `UI_COPY.md` added to repo with copy for each UI element and variant texts for verified/unverified regulatory states.

5. Ticket: QA Checklist + Local Build Verification
- Description: Add a QA checklist (steps to validate pilot flows) and run `npm run build` to ensure no regression. Add steps for manual verification and test data setup.
- Acceptance:
  - `QA_CHECKLIST.md` added.
  - Build passes locally.

6. Ticket: Document Export Code Feature-Flagging (Optional)
- Description: Add small feature-flag mechanism (env or constant) protecting export endpoints/UI so exports can be re-enabled post-pilot with minimal code changes.
- Acceptance:
  - Flags added to `lib/storage.ts` or admin UI guard conditions.

---

Next steps:
- Work on Ticket 1 by hiding CSV/export buttons in `app/admin/trainee-registry.tsx`. Then mark Ticket 1 done and proceed.
