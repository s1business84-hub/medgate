# UI Copy — Pilot Locked Flows

This document contains exact UI copy for the pilot. Use these strings in components and toasts.

## Student / Applicant

### Exposure Acknowledgement
- **Title:** "Exposure Acknowledgement"
- **Description:** "I confirm I have read and understand the exposure guidance and accept responsibility for completing required precautions."
- **Checkbox Label:** "I confirm this exposure and accept responsibility"
- **Success Toast:** "Exposure acknowledgement recorded."

### Start Training
- **Button Label:** "Start Training"
- **Disabled Tooltip (missing supervisor):** "Start Training — requires supervisor confirmation and regulatory verification"
- **Success Toast:** "Training started — your status is now In Training."
- **Blocked Toast (missing supervisor):** "Action blocked: please obtain supervisor confirmation for this student or program."
- **Blocked Toast (missing exposure):** "Action blocked: exposure acknowledgement required before starting training."
- **Blocked Toast (missing regulatory):** "Action blocked: regulatory verification required for DHA/DoH programs."

### Application Status
- **Submitted:** "Application Submitted — awaiting review"
- **Accepted:** "Application Accepted — awaiting supervisor confirmation"
- **Deferred:** "Application Deferred — under review"
- **Declined:** "Application Declined"
- **In Training:** "In Training"
- **Completed:** "Training Completed"

## Supervisor

### Supervisor Confirmation
- **Title:** "Supervisor Confirmation"
- **Description:** "Please confirm you will supervise this student for the listed exposures and scope."
- **Success Toast (student-specific):** "Supervisor confirmation recorded."
- **Success Toast (program-level):** "Program-level supervisor confirmation recorded."
- **Dropdown Label:** "Select Supervisor"
- **Student ID Field Label:** "Student ID (leave blank for program-level)"
- **Dates Field Label:** "Supervision Dates"
- **Exposure Boundaries Field Label:** "Exposure Boundaries"

### Completion Attestation
- **Button Label:** "Attest Completion"
- **Modal Title:** "Completion Attestation"
- **Description:** "Confirm the student has completed their training requirements."
- **Success Toast:** "Completion attestation recorded."

## Admin

### Application Actions
- **Accept Button:** "Accept Application"
- **Defer Button:** "Defer Application"
- **Decline Button:** "Decline Application"
- **Waitlist Button:** "Add to Waitlist"
- **Remove Button:** "Remove Application"
- **Accept Success Toast:** "Application accepted — supervisor will assign observation forms."
- **Defer Success Toast:** "Application deferred for later review."
- **Decline Success Toast:** "Application declined."

### Assignment & EHS
- **Assign Supervisor Label:** "Assign Supervisor"
- **Assign Department Label:** "Assign Department"
- **Create EHS Allocation Button:** "Create EHS Allocation"
- **EHS Modal Title:** "Create EHS Allocation"
- **EHS Success Toast:** "EHS allocation created and student notified."
- **Assignment Success Toast:** "Assignment saved — student has been notified."

### Confirmation
- **Confirm Program Button:** "Confirm Program"
- **Program Confirmed Badge:** "Program Confirmed"
- **Program Confirmed Success:** "Program-level supervisor confirmation recorded."

### Observership
- **Include in Observership Button:** "Include in Observership"
- **Observership Success Toast:** "Student included in observership program."
- **Observership Blocked (no supervisor):** "Cannot include in observership: no supervisor confirmation found for this application."
- **Observership Blocked (no regulatory):** "Cannot include in observership: regulatory requirement not verified for this application."

## Hospital

### Form Assignment
- **Modal Title:** "Assign Observation Form"
- **Form Title Field:** "Form Title"
- **Form Description Field:** "Form Description"
- **Success Toast:** "Form assigned successfully. Student will see it in their next session."

### Hospital Dashboard
- **Pending Applications:** "Pending Applications"
- **Active Training:** "Active Training"
- **Completed Programs:** "Completed Programs"

## Regulatory States

### Badges
- **None:** "No Regulatory Requirement"
- **EHS Pending:** "EHS: Pending Allocation"
- **EHS Verified:** "EHS: Verified"
- **DHA Pending:** "DHA: Pending Verification"
- **DHA Verified:** "DHA: Verified"
- **DoH Pending:** "DoH: Pending Verification"
- **DoH Verified:** "DoH: Verified"

### Tooltips & Messages
- **Admin Toggle Tooltip:** "Toggle regulatory verification for this application. Verified applications can proceed for DHA/DoH-regulated programs."
- **Unverified Blocking Message:** "Regulatory: Unverified — action blocked until verification complete."
- **Verification Success Toast:** "Regulatory status updated to verified."

## Generic Messages

### Success Messages
- **Generic Save:** "Saved successfully."
- **Generic Update:** "Updated successfully."
- **Generic Delete:** "Deleted successfully."

### Error Messages
- **Generic Error:** "An error occurred — try again or contact support."
- **Validation Error:** "Please fill in all required fields."
- **Permission Error:** "Access denied. You don't have permission for this action."

### Loading States
- **Loading:** "Loading..."
- **Submitting:** "Submitting..."
- **Processing:** "Processing..."

## Notifications

### Student Notifications
- **Application Accepted:** "Your application has been accepted. Supervisor will assign observation forms for your sessions."
- **Application Deferred:** "Your application has been deferred for further review. We will contact you with updates."
- **Application Declined:** "We appreciate your interest. Unfortunately, your application was declined."
- **Form Assigned:** "Your observation form '[FORM_TITLE]' is ready. You'll fill it after each session."
- **Observership Confirmed:** "Congratulations! You have been included in the observership program. Please complete your onboarding to begin."
- **EHS Allocation Created:** "An EHS allocation has been created for your program. Please check your application status."

### Hospital Notifications
- **New Application:** "New application received from [STUDENT_NAME]."
- **Form Submitted:** "[STUDENT_NAME] submitted a session form."
- **Training Started:** "[STUDENT_NAME] has started training."

### Admin Notifications
- **Program Confirmed:** "Program [PROGRAM_ID] has a supervisor confirmation."
- **Completion Attestation:** "[STUDENT_NAME] training completion has been attested by supervisor."

## Notes
- Keep strings short and clear
- Use toasts for transient feedback (3-5 seconds)
- Use badges for persistent status
- Use these exact strings for consistency across the pilot
- Variables in brackets [LIKE_THIS] should be replaced with actual values at runtime
