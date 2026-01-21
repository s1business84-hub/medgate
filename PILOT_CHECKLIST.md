ELECTIVIO PILOT — BUILD CHECKLIST (TEAM VERSION)

🔒 PILOT RULE (READ FIRST)

If it doesn’t directly prevent expectation mismatch or undocumented supervision, it does NOT go into the pilot.

Everything below respects that rule.

1. SCENARIOS THE PILOT MUST SUPPORT (FUNCTIONALLY)

✅ Scenario 1 — No regulator
• Hospital-managed electives / observerships
• No regulatory fields required

✅ Scenario 2 — EHS
• Student allocated externally
• Hospital or student can trigger Electivio record
• EHS reference field + status flag

✅ Scenario 3 — DHA / DoH
• DHA/DoH may be required upfront OR flagged later
• Workflow pauses until reference is entered and confirmed

⚠️ No integrations. No verification logic. Just fields + status.

2. CORE FEATURES TO BUILD (NON-NEGOTIABLE)

✅ A. Exposure Acknowledgement (CRITICAL)

Student-side
• Display:
  • Exposure level (Observation / Limited participation)
  • Clear disclaimer text
  • Required checkbox / confirmation
  • Timestamp stored
  • Cannot proceed without confirmation

Backend
• Immutable record
• Visible to hospital + supervisor

✅ B. Supervisor Confirmation (CRITICAL)

Supervisor-side
• One-click confirmation:
  • “I confirm supervision for this student”
  • Exposure boundaries acknowledged
  • Timestamp stored

Rules
• No complex dashboards
• No reminders yet (manual is fine)

✅ C. Simple Trainee Record (READ-ONLY VIEW)

Hospital/admin view
• Table with:
  • Student name
  • Department
  • Supervisor
  • Dates
  • Exposure type
  • Regulatory status (if any)

Rules
• No analytics
• No exports
• No filters beyond basic search

3. REGULATORY HANDLING (MINIMAL, SAFE)

Fields to include
• Regulatory type: None | EHS | DHA | DoH
• Reference number (text field)
• Status: Pending | Verified

Rules
• Workflow must pause if required status ≠ Verified
• No automatic checks
• No regulator logic

4. USER ACTIONS TO SUPPORT (ONLY THESE)

Student can:
• Apply OR enter allocation
• Enter regulatory reference (if prompted)
• Acknowledge exposure

Hospital/admin can:
• Accept / Defer / Decline
• Flag regulatory requirement
• Confirm regulatory status
• Assign department & supervisor

Supervisor can:
• Confirm supervision
• Confirm completion

❌ Nothing else.

5. COMPLETION LOG (LIGHT)
• Supervisor confirms:
  • Training completed
  • Dates
  • Stored as record only
  • No certificate logic in pilot

6. WHAT TO EXPLICITLY NOT BUILD (LOCK THIS)

❌ Pricing / billing
❌ Payments
❌ Capacity limits
❌ Incident reporting
❌ AI scoring
❌ Rankings
❌ Reviews
❌ Accreditation exports
❌ Dashboards
❌ Notifications automation

If anyone suggests these → park them.

7. PILOT UX RULES (VERY IMPORTANT)
• Boring > impressive
• Fewer clicks > more features
• No “wow” animations
• Clear language over smart wording

If a feature needs explanation → it doesn’t belong.

8. PILOT SUCCESS CHECK (INTERNAL QA)
Before going live, verify:
• Student cannot start without exposure acknowledgement
• Supervisor confirmation is required and logged
• Regulatory-required cases block progress correctly
• Hospital can see a clean trainee list
• No workflow breaks across the 3 scenarios

If all 5 pass → pilot ready.

9. PILOT SCOPE LIMITS (HARD)
• 1–2 hospitals
• 1–2 departments
• 10–30 students
• 4–8 weeks max

Anything beyond this is not a pilot.

10. ONE-LINE PILOT DEFINITION (FOR THE TEAM)
The pilot proves that Electivio documents exposure expectations and supervision clearly, without changing hospital processes.

FINAL WARNING TO THE TEAM
This pilot is not about showing capability.
It is about earning institutional trust.

Build less.
Finish faster.
Ship safely.
