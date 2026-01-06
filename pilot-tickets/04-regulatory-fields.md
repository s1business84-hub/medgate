# Ticket 4 — Regulatory Fields and Pause Logic

Description
- Add regulatory fields to applications and enforce a pause for DHA/DoH until the regulatory `status === Verified`.

Acceptance criteria
- Application modal includes `regulatoryType` (None / EHS / DHA / DoH / Other) and `regulatoryReference` fields.
- Admin can add or toggle regulatory `status` and set it to `Verified`.
- If `regulatory.type` is `DHA` or `DoH` and `status !== Verified`, hospital/admin actions that move the workflow forward (department allocation, `Start Training`) are blocked with a clear message.

Files to update
- `components/application-modal.tsx` (add fields)
- `lib/storage.ts` (persist regulatory fields and setter functions)
- `app/admin/regulatory-approval.tsx` (admin UI to set/verify regulatory data)
- `app/programs/[id]/page.tsx` and `app/admin/page.tsx` (enforce gating and display regulatory status)

Estimate
- 1–2 developer days

Testing notes
- Create an application with `regulatory.type = DHA` and `status = Pending` — verify `Start Training` and include operations are blocked with a clear message.
- Toggle the application to `Verified` as admin and verify the blocked actions then succeed.
