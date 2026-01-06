# Replace Prompt-Based Supervisor Identity with Dropdown

**Description**
Replace `prompt()` supervisor confirmations with a dropdown selecting an existing supervisor user. Use `getUsers()` storage helper to populate the list. If supervisor auth isn't available, provide a required dropdown for the admin/supervisor action.

**Acceptance Criteria**
- No `prompt()` usages remain for supervisor identity.
- Supervisor actions persist with a `supervisorId` recorded on confirmation.
- UI shows a clear supervisor selector populated from `getUsers()`.

**Implementation Notes**
- Update `app/supervisor/page.tsx` and any other pages using `prompt()` (search repo for `prompt(`).
- Use existing `getUsers()` helper and preserve demo fallback users.

**Testing**
- Supervisor dashboard: use the dropdown to select supervisor and confirm.
- Verify audit store records `supervisorId` and `confirmedAt`.

**Priority**: High
