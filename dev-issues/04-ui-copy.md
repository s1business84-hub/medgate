# Create UI Copy Document for Pilot Flows

**Description**
Produce exact UI copy strings for student, admin, and supervisor flows (exposure acknowledgement, supervisor confirmation, start-training gating, EHS allocation modal, regulatory status messages, toasts).

**Acceptance Criteria**
- `UI_COPY.md` exists with copy for student, supervisor and admin screens.
- Components use the document or strings can be easily wired in.

**Implementation Notes**
- The initial `UI_COPY.md` has been added to the repo. Consider centralizing copy into a small module if localization may be required later.

**Testing**
- Visual review of the copy across targeted flows.

**Priority**: Medium
