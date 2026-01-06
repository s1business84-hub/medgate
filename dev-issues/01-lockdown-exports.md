# Lockdown CSV/Export Features

**Description**
Remove or hide all CSV and accreditation pack export buttons from admin UI and API surfaces for the pilot. Keep export code in repo behind a feature-flag or comment for future use.

**Acceptance Criteria**
- No visible export buttons in `app/admin/trainee-registry.tsx` and related pages.
- Export code remains but is not reachable via UI routes.
- Feature flag exists to re-enable export later (e.g., `ALLOW_EXPORT` in `app/admin/trainee-registry.tsx`).

**Implementation Notes**
- Hide the CSV export button behind a constant `ALLOW_EXPORT = false`.
- Add a comment referencing the pilot ticket and instructions to enable for testing.

**Testing**
- Manually verify no Export button appears in the UI.
- Confirm export code still compiles and tests (if any) pass.

**Priority**: High
