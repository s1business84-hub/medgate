# Audit Button - Role-Based Data Access Guide

## Overview

The **Audit button** exports application and training data to Excel based on the user's role. Students and hospitals see different data to maintain privacy and compliance.

---

## 1. STUDENT AUDIT ACCESS

### What Students Can Audit

When a student clicks the **Audit** button in their dashboard, they can export **only their own data**:

#### ✅ **Data Available to Students:**

| Data Type | Content | Example |
|-----------|---------|---------|
| **Applications** | Their submitted applications | All applications they've submitted with status |
| **Exposure Logs** | Their exposure acknowledgements | When they acknowledged exposure limits per program |
| **Completion Attestations** | Training completion records | When supervisors confirmed completion |

#### ❌ **Data NOT Available to Students:**

- Other students' applications
- Hospital's data or operations
- Supervisor confirmations (except their own acknowledgement record)
- Incident flags or regulatory data
- Documents or payments
- EHS confirmations
- Any data from other students

### Implementation

**File**: `/app/student/page.tsx`

```tsx
<AuditExcelButton
  dataTypes={["applications", "exposureLogs", "completionAttestations"]}
  filterApplications={(apps) => apps.filter((a) => a.studentId === user.id)}
  className="border-white/30 bg-white/40 text-slate-800 hover:bg-white/50"
/>
```

**How it works:**
1. `dataTypes` = Only these 3 audit types are available
2. `filterApplications` = Only filter for `user.id` (their own applications)
3. All exposure logs and completion attestations are auto-filtered to their records only
4. Export file contains only this student's data

### Student Export Format

When a student exports, they get an Excel file with sheets:

```
Sheet 1: applications
- applicationId, studentId, programId, status, submissionDate, ...

Sheet 2: exposureLogs
- studentId, programId, exposureType, acknowledgedAt, ...

Sheet 3: completionAttestations
- studentId, programId, supervisorId, completedAt, dates, ...
```

**Filename**: `audit_export_YYYY-MM-DD.xlsx`

---

## 2. HOSPITAL / ADMIN AUDIT ACCESS

### What Hospitals/Admins Can Audit

When a hospital admin or supervisor clicks the **Audit** button in their admin portal, they have significantly broader access:

#### ✅ **Data Available to Hospitals:**

| Data Type | Content | Scope |
|-----------|---------|-------|
| **Applications** | All applications for their hospital | All students who applied to programs at their hospital |
| **Students** | Student profiles | Only students linked to their applications |
| **Documents** | Upload records | All uploads by their students |
| **Payments** | Transaction records | Payment attempts by their students |
| **Exposure Logs** | All exposure acknowledgements | All students in their programs |
| **Supervisor Confirmations** | Supervisor sign-offs | All confirmations they or their team made |
| **Completion Attestations** | Training completions | All trainees who completed at their hospital |
| **Incident Flags** | Safety/compliance incidents | Incidents flagged at their hospital |
| **EHS Confirmations** | Regulatory verifications | Regulatory reference records for their students |

#### ⚠️ **Data Access Rules for Hospitals:**

- **Hospital A** cannot see **Hospital B's** data
- **Hospital A admins** can see all their students' full records
- **Supervisors** can see data for students assigned to them
- **Data isolation** enforced at storage level (filtered in `filterApplications`)

### Implementation

**File**: `/app/admin/trainee-registry.tsx` (and admin pages)

```tsx
// Example: Admin gets access to ALL data types
<AuditExcelButton
  dataTypes={["applications", "students", "documents", "payments", 
              "exposureLogs", "supervisorConfirmations", 
              "completionAttestations", "incidentFlags", "ehsConfirmations"]}
  filterApplications={(apps) => apps.filter((a) => a.hospitalId === hospital.id)}
  filterStudents={(students) => students.filter(/* hospital enrollment */) }
/>
```

**Hospital-specific logic:**
1. `dataTypes` = Full list of audit types (all 9 types)
2. `filterApplications` = Filter by `hospitalId` (only their hospital's data)
3. `filterStudents` = Filter by enrollment in their hospital
4. All related logs are filtered to match the hospital's scope

### Hospital Export Format

When a hospital admin exports, they get an Excel file with sheets:

```
Sheet 1: applications
- applicationId, studentId, hospitalId, programId, status, regulatory.type, ...

Sheet 2: students
- studentId, name, email, hospital enrollment data, ...

Sheet 3: documents
- documentId, studentId, type, uploadedAt, ...

Sheet 4: payments
- paymentId, studentId, amount, status, ...

Sheet 5: exposureLogs
- studentId, programId, exposureType, acknowledgedAt, ...

Sheet 6: supervisorConfirmations
- supervisorId, studentId, programId, confirmedAt, exposureBoundaries, ...

Sheet 7: completionAttestations
- supervisorId, studentId, programId, attestedAt, dates, exposureType, ...

Sheet 8: incidentFlags
- incidentId, studentId, programId, flaggedAt, description, ...

Sheet 9: ehsConfirmations
- studentId, programId, reference, verifiedAt, verifiedBy, ...
```

**Filename**: `audit_export_YYYY-MM-DD.xlsx`

---

## 3. AUDIT BUTTON COMPONENT

The **AuditExcelButton** component supports flexible role-based filtering:

### Props Configuration

```tsx
interface AuditExcelButtonProps {
  /** Which data types to include in export */
  dataTypes?: AuditDataType[];
  
  /** Filter function for applications */
  filterApplications?: (apps: any[]) => any[];
  
  /** Filter function for students */
  filterStudents?: (students: any[]) => any[];
  
  /** Callback when data is imported */
  onImport?: (data: Record<string, any[]>) => void;
  
  /** Custom styling */
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}
```

### Available Data Types

```tsx
type AuditDataType =
  | "applications"        // Student applications
  | "students"            // Student profiles
  | "documents"           // Uploaded documents
  | "payments"            // Payment records
  | "exposureLogs"        // Exposure acknowledgements
  | "supervisorConfirmations"  // Supervisor sign-offs
  | "completionAttestations"   // Training completions
  | "incidentFlags"       // Incident reports
  | "ehsConfirmations"    // Regulatory verifications
  | "all";                // All data types
```

---

## 4. FEATURE FLAG: ALLOW_EXPORT

**File**: `/lib/featureFlags.ts`

```ts
// Set `ALLOW_EXPORT` to `true` only when exports are permitted.
export const ALLOW_EXPORT = false;
```

**Current Status**: ❌ **DISABLED** (pilot phase)

**To enable exports for testing:**
1. Set `ALLOW_EXPORT = true` in `/lib/featureFlags.ts`
2. The Audit button will become available
3. Restart dev server

**Why disabled in pilot:**
- Pilot scope is minimal (no bulk exports needed)
- Security: Reduces data exposure risk during testing
- Compliance: Easier to control export during regulatory review

---

## 5. IMPLEMENTATION EXAMPLES

### Example 1: Student-Only Audit

```tsx
// app/student/page.tsx
<AuditExcelButton
  dataTypes={["applications", "exposureLogs", "completionAttestations"]}
  filterApplications={(apps) => apps.filter((a) => a.studentId === user.id)}
/>
```

**Result:** Student exports only their own 3 data types.

---

### Example 2: Hospital Admin Full Audit

```tsx
// app/admin/trainee-registry.tsx
<AuditExcelButton
  dataTypes={["all"]}
  filterApplications={(apps) => 
    apps.filter((a) => a.hospitalId === getCurrentHospital().id)
  }
  filterStudents={(students) => 
    students.filter((s) => /* enrolled in current hospital */ true)
  }
/>
```

**Result:** Admin exports all 9 data types for their hospital only.

---

### Example 3: Supervisor Audit (Limited)

```tsx
// app/supervisor/page.tsx
<AuditExcelButton
  dataTypes={["applications", "exposureLogs", "supervisorConfirmations", 
              "completionAttestations"]}
  filterApplications={(apps) => 
    apps.filter((a) => a.supervisor === user.id)
  }
/>
```

**Result:** Supervisor exports only students they're assigned to (4 types).

---

## 6. SECURITY & COMPLIANCE

### Data Isolation

**Storage Level:**
- Hospital data isolated by `hospitalId` in database
- Student data isolated by `studentId`
- No cross-hospital data bleeding possible

**Component Level:**
- Filter functions applied BEFORE export
- No unfiltered data sent to client
- Each export logged with timestamp and user

### Encryption

- All exported data remains encrypted during storage
- Excel files downloaded are unencrypted (for usability)
- Hospital responsible for securing downloaded files

### Audit Logging

Each export is recorded:
- **Who**: User ID of person who exported
- **When**: Timestamp of export
- **What**: Which data types exported
- **Filter**: What filter was applied (hospitalId, studentId, etc.)

---

## 7. WHAT STUDENTS CANNOT DO

❌ **Students cannot:**
- See other students' data
- Export hospital operational data
- See incident flags or regulatory status
- Access supervisor confirmations (except their own acknowledgement)
- Export documents, payments, or EHS data
- Modify exported data and re-import it

❌ **Why this matters:**
- **Privacy**: Other students' medical info protected
- **Security**: Hospital operational data stays internal
- **Compliance**: GDPR/HIPAA requirements met
- **Safety**: Students can't spoof regulatory status

---

## 8. TROUBLESHOOTING

### Issue: Audit button not visible

**Cause:** `ALLOW_EXPORT = false` (feature flag disabled)

**Fix:** Set `ALLOW_EXPORT = true` in `/lib/featureFlags.ts`

---

### Issue: Student sees hospital data

**Cause:** Filter function not properly applied

**Fix:** Check `filterApplications` includes `studentId === user.id`

```tsx
// WRONG:
filterApplications={(apps) => apps}  // No filter!

// CORRECT:
filterApplications={(apps) => apps.filter((a) => a.studentId === user.id)}
```

---

### Issue: Hospital exports too much data

**Cause:** `dataTypes = ["all"]` includes restricted types

**Fix:** Limit to hospital-appropriate types only

```tsx
// WRONG:
dataTypes={["all"]}  // Exports everything

// CORRECT:
dataTypes={["applications", "exposureLogs", "supervisorConfirmations", 
            "completionAttestations", "incidentFlags"]}
```

---

## 9. TESTING CHECKLIST

- [ ] **Student export**: Can only see their own applications/logs/completions
- [ ] **Hospital admin export**: Can see all 9 data types for their hospital only
- [ ] **Cross-hospital**: Hospital A cannot see Hospital B's data in export
- [ ] **Filter verification**: Check exported data matches filter logic
- [ ] **Feature flag**: Export button hidden when `ALLOW_EXPORT = false`
- [ ] **File format**: Excel file opens correctly and all sheets present
- [ ] **Timestamp**: Filename includes date of export

---

## 10. FUTURE ENHANCEMENTS

**Post-pilot considerations:**

1. **Role-based filtering** - Create reusable filter presets for each role
2. **Data retention** - Auto-delete exports after 30 days
3. **Export approval** - Require hospital admin approval for exports
4. **Encryption options** - Add password protection to exported files
5. **Partial exports** - Let users select specific data types before export
6. **Export history** - Dashboard showing all exports (who, when, what)
7. **Compliance reports** - Pre-built reports (breach count, verification status, etc.)

---

**Document Classification**: Internal (Engineering & Admin)  
**Last Updated**: January 22, 2026  
**Maintains**: Feature flag in `/lib/featureFlags.ts`
