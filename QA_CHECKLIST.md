# QA Checklist — Pilot Locked Flows

Purpose: Manual verification steps to confirm the pilot scope and recent changes (supervisor dropdowns, program-level confirmations, hidden exports, start-training gating).

Prerequisites
- Run `npm install` if dependencies changed.
- Start the app locally (development): `npm run dev` or verify production build with `npm run build`.

Sanity checks (build)
- Run:

```bash
npm run build
```

- Expect: "Compiled successfully" and no TypeScript errors.

Test data seeding (browser console)
- Open the app in the browser and run the following in the developer console to create sample users, a student, and an application for testing:

```js
// Seed minimal demo data for QA
localStorage.setItem('users', JSON.stringify([
  { id: 'admin_demo', name: 'Admin Demo', email: 'admin@demo', role: 'admin' },
  { id: 'sup_demo', name: 'Supervisor Demo', email: 'sup@demo', role: 'hospital', hospitalId: 'hosp_demo' },
  { id: 'student_demo', name: 'Student Demo', email: 'student@demo', role: 'student' },
  { id: 'hospital_user', name: 'Hospital User', email: 'hosp@demo', role: 'hospital', hospitalId: 'hosp_demo' }
]));

localStorage.setItem('students', JSON.stringify([
  { id: 'student_demo', name: 'Student Demo', email: 'student@demo' }
]));

localStorage.setItem('applications', JSON.stringify([
  { id: 'app_demo_1', studentId: 'student_demo', programId: 'mock_program_1', hospitalId: 'hosp_demo', status: 'Submitted', submissionDate: new Date().toISOString(), notes: 'observational' }
]));

console.log('Demo data seeded');
```

Manual verification steps

1) Verify CSV/export hidden
- Go to `Admin → Trainee Registry`.
- Confirm there is no visible "Export CSV" button; export code remains behind a feature flag.

2) Supervisor dropdown & confirmation
- Open `Supervisor Dashboard`.
- Confirm each application row has a "Confirm Supervision" button.
- Click it; a supervisor dropdown should appear populated with demo supervisors.
- Select a supervisor and optionally enter a student ID (or leave blank for program-level confirmation) and submit.
- Expect a toast: "Supervisor confirmation recorded".
- Verify program-level confirmation shows a badge in `Program Detail` and the `Admin` application list.

3) Program-level confirmation visibility
- As admin (`admin_demo`) open `Admin Dashboard`.
- Select an application and confirm program-level supervision using the supervisor dropdown.
- Expect: toast and the application list displays "Program confirmed by..." with date.
- On `Program Detail` page, look for the "Program Confirmed" badge.

4) Start Training gating
- As `student_demo` go to the `Program` page where an application exists.
- Ensure exposure acknowledgement is present; complete acknowledgement.
- Ensure there's a supervisor confirmation (student-specific or program-level) and regulatory verification as required. Then click "Start Training".
- Expect: toast "Training started — record updated" and application status updated to `In Training`.

5) Admin assignment flows
- As admin, open an application details panel.
- Use the "Assign Supervisor" dropdown to select a supervisor and save.
- Expect: toast "Assignment saved" and a notification recorded for the student (visible in localStorage `notifications`).

6) EHS allocation modal
- As admin, click "Create EHS Allocation" on an application.
- Submit the EHS form; expect toast "EHS allocation created and student notified" and a new application created with regulatory type `EHS`.

7) Completion attestation
- As supervisor, open the dashboard and click "Attest Completion" for an application.
- Select a supervisor and submit.
- Expect toast "Completion attestation recorded" and an entry in the in-memory completion attestations (`lib/auditStore.ts`).

8) Audit logs and notifications
- Inspect localStorage keys: `auditLogs`, `notifications`, `applications`, `users`, `students` to verify recent actions.

9) Regression check
- Walk through a few other pages (`/programs`, `/student`, `/hospital`) to ensure nothing else visually broken.

Notes / Troubleshooting
- If toasts do not appear, check browser console for errors and ensure `lib/toast.ts` is loaded.
- If a change doesn't reflect immediately, clear localStorage and re-seed test data.
- Exports are intentionally hidden behind `ALLOW_EXPORT` flag in `app/admin/trainee-registry.tsx`.

When QA is complete
- If everything passes, mark the QA ticket as done in your issue tracker and push changes.
- If issues are found, create GitHub issues and attach console logs / repro steps.
