# UI Copy Strings — Exposure, Supervisor, Admin Allocation

This file contains ready-to-drop-in UI copy for the pilot screens. Use these exact phrases where indicated.

---

## 1) Student — Exposure Acknowledgement (Modal / Section)

- **Title:** Exposure Acknowledgement
- **Subtitle / Description:** I confirm I have read and understand the exposure guidance for this program. I accept responsibility for completing any required precautions and following hospital instructions while on site.
- **Exposure Level Label:** Exposure level
- **Exposure Option — Observation:** Observation (no hands-on clinical work)
- **Exposure Option — Limited participation:** Limited participation (supervised, non-invasive tasks)
- **Checkbox Label (required):** I confirm this exposure and accept responsibility
- **Acknowledge Button:** Acknowledge & Continue
- **Validation Message (checkbox missing):** You must confirm the exposure to proceed.
- **Validation Message (level missing):** Please select an exposure level.
- **Success Toast / Message:** Exposure acknowledgement recorded. You may now apply for this program.

Usage notes: persist an immutable audit record containing `studentId`, `programId`, `exposureType`, and `acknowledgedAt` (timestamp). Student cannot open the Application Modal or complete Apply until acknowledgment is recorded.

---

## 2) Supervisor — Confirmation (Panel / Modal)

- **Title:** Supervisor Confirmation
- **Description:** Please confirm you will supervise this student for the listed scope and exposure. This will be recorded and visible to hospital staff and the training team.
- **Select Supervisor (placeholder):** Select Supervisor
- **Confirm Button (student-specific):** Confirm Supervision
- **Confirm Button (program-level):** Confirm Program Supervision
- **Cancel Button:** Cancel
- **Success Toast (confirmation):** Supervisor confirmation recorded.
- **Success Toast (program-level):** Program-level supervisor confirmation recorded.
- **Validation Message (no supervisor selected):** Select a supervisor before confirming.

Data notes: store `supervisorId`, optional `studentId` (omit for program-level), `programId`, `dates` or `submissionDate`, `exposureBoundaries` (text), and `confirmedAt` timestamp. This confirmation should be used by gating logic for Start Training.

---

## 3) Admin — EHS Allocation / Assignment (Modal / Panel)

- **Title (EHS Allocation modal):** Create EHS Allocation
- **Description:** Record an externally assigned trainee allocation so the student and hospital can track placement and required regulatory references.
- **Field — Allocation Reference (label):** Allocation Reference
- **Field — Hospital (label):** Hospital / Host Site
- **Field — Notes (label):** Notes (optional)
- **Submit Button:** Create Allocation
- **Success Toast:** EHS allocation created and student notified.

## 3b) Admin — Assign / Accept / Defer / Decline (Application row actions)

- **Accept Button:** Accept Application
- **Defer Button:** Defer Application
- **Decline Button:** Decline Application
- **Assign Supervisor Button / Label:** Assign Supervisor
- **Assign Department Button / Label:** Assign Department
- **Assignment Saved Toast:** Assignment saved

Usage notes: assignment should persist `supervisor` (user id), `department`, and create a light audit entry. Accept/Defer/Decline should update application `status` and create an audit log entry.

---

## 4) Regulatory UI copy (application modal & admin approval)

- **Regulatory Section Title (in Application Modal):** Regulatory (if applicable)
- **Regulatory Type Label (select):** Regulatory type
- **Regulatory Type Options:** None / EHS / DHA / DoH
- **Regulatory Reference Placeholder:** Reference (if applicable)
- **Regulatory Note (helper):** If DHA/DoH selected, a reference is required and hospital verification is needed before training can start.
- **Admin Table — Verify Button (toggle):** Mark Verified / Mark Pending
- **Admin Toast (verify):** Regulatory status updated

Gating note: when `regulatory.type` is `DHA` or `DoH`, Start Training and other progression actions must be blocked until `regulatory.status === 'Verified'`.

---

## 5) Start Training / Student actions

- **Start Training Button (student):** Start Training
- **Start Training Success:** Training started — your status is now In Training.
- **Start Training Blocked — Supervisor:** Action blocked: please obtain supervisor confirmation for this student or program.
- **Start Training Blocked — Exposure:** Action blocked: exposure acknowledgement required before starting training.
- **Start Training Blocked — Regulatory:** Regulatory clearance required and not verified.

---

## 6) Small helper strings and toasts

- **Generic Save:** Saved successfully.
- **Generic Error:** An error occurred — try again or contact support.
- **Network Error Toast:** Network error — please try again.

---

Developer guidance: these strings are intentionally plain, non-marketing, and suitable for a pilot. If you want, I can automatically add these to `lib/uiCopy.ts` under the `student`, `supervisor`, and `admin` keys as appropriate.
