# Document Export Code Feature-Flagging (Optional)

**Description**
Add small feature-flag mechanism (env or constant) protecting export endpoints/UI so exports can be re-enabled post-pilot with minimal code changes.

**Acceptance Criteria**
- Flags added to `app/admin/trainee-registry.tsx` or admin UI guard conditions.
- Document how to enable export for testing and re-enable after pilot.

**Implementation Notes**
- Use a file-level constant `ALLOW_EXPORT = false` for the pilot and document env var option for future.

**Testing**
- Toggle the flag locally and verify the Export button appears/disappears.

**Priority**: Low
