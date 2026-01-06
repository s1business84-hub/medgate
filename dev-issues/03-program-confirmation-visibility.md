# Improve Program-Level Confirmation Visibility

**Description**
Display program-level confirmations in program and admin lists with a clear badge and timestamp. Add filtering to trainee registry to show program-confirmed programs.

**Acceptance Criteria**
- Program-level confirmations show a badge in program list views (`app/programs/[id]/page.tsx`).
- Admin application list shows "Program confirmed by <supervisor> on <date>" when applicable.
- Trainee registry can filter or indicate program-confirmed programs.

**Implementation Notes**
- Use `getSupervisorConfirmations()` to locate confirmations where `studentId` is undefined.
- Resolve `supervisorId` to user name using `getUsers()`.

**Testing**
- Record a program-level confirmation and verify badges appear in Admin and Program pages.

**Priority**: Medium
