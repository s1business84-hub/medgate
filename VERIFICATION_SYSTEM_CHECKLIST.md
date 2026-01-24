# MedGate — Verification System Checklist

**Engineering-grade, copilot-ready acceptance criteria for verification domains**

---

## A. Identity & Account Verification (FOUNDATIONAL)

### Required Checks
- [ ] Email verification (OTP + expiry)
- [ ] Phone number verification (OTP + rate-limited)
- [ ] Single-user identity (prevent duplicate accounts)
- [ ] Name consistency across profile + documents
- [ ] Date of birth consistency (if collected)

### Optional / Phase 2
- [ ] Government ID upload (only if hospital requires)
- [ ] Liveness/selfie check (disabled by default)
- [ ] Fraud pattern detection (multiple accounts, reused docs)

### Output (must exist)
```
identity_status = VERIFIED | REVIEW | FAILED
identity_verified_at = timestamp
identity_verification_method = string
```

---

## B. Student Status Verification (CORE MEDGATE VALUE)

### Supported Methods (at least one must pass)
- [ ] Student ID upload
- [ ] Enrollment letter upload
- [ ] Transcript snippet (optional)
- [ ] Academic email domain confirmation
- [ ] Manual verification workflow (admin review)

### Consistency Checks
- [ ] Name matches identity profile
- [ ] University name consistency
- [ ] Program/year consistency
- [ ] Enrollment validity dates checked

### Output
```
student_status = VERIFIED | REVIEW | FAILED
student_verified_at = timestamp
student_verification_method = string
student_verification_expiry = timestamp
```

---

## C. Document Verification Engine

### Upload Controls
- [ ] File type restrictions (PDF/JPG/PNG)
- [ ] File size limits
- [ ] Virus/malware scan
- [ ] Upload via pre-signed URLs

### Integrity Checks
- [ ] File hash generated on upload
- [ ] Hash stored for tamper detection
- [ ] Document readability check
- [ ] Expiry date detection (manual or assisted)

### Output
```
document_status = ACCEPTED | REJECTED | RESUBMIT
document_rejection_reason = string (optional)
document_uploaded_at = timestamp
```

---

## D. Clinical Safety & Hospital Prerequisites (CONFIGURABLE)

### Immunizations (hospital-configurable)
- [ ] Hepatitis B (+ titer if required)
- [ ] MMR
- [ ] Varicella
- [ ] TB test (IGRA/PPD with validity period)
- [ ] Influenza (seasonal)
- [ ] COVID (if required)

### Certifications
- [ ] BLS / CPR
- [ ] Infection control training
- [ ] Occupational health clearance (if required)

### System Requirements
- [ ] Per-hospital requirement templates
- [ ] Expiry tracking per item
- [ ] Auto-flag expired/missing items

### Output
```
checklist_view = PASS | MISSING | EXPIRED (per item)
clinical_clearance_status = string
```

---

## E. Legal & Compliance Acknowledgements (NON-NEGOTIABLE)

### Required Acceptances
- [ ] Observership scope (no hands-on care)
- [ ] Confidentiality / NDA
- [ ] Hospital policies
- [ ] Patient data handling acknowledgement
- [ ] Code of conduct

### Technical Requirements
- [ ] Digital signature / checkbox with timestamp
- [ ] Versioned policy text
- [ ] Immutable audit record

### Output
```
compliance_status = COMPLETE | INCOMPLETE
accepted_at = { policy: string, timestamp: ISO8601 }[]
```

---

## F. Eligibility & Fit Rules (APPROVAL QUALITY)

### Automated Rules
- [ ] Minimum year of study
- [ ] Required documents completed
- [ ] Department eligibility rules
- [ ] Rotation duration limits
- [ ] Blackout dates / capacity rules

### Output
```
eligibility_status = ELIGIBLE | INELIGIBLE
eligibility_failure_reason = string (optional)
```

---

## G. Verification Lifecycle & Reuse

### Validity Management
- [ ] Verification expiry engine
- [ ] Auto re-verification triggers
- [ ] Profile change invalidation logic

### Reusability
- [ ] "Verified Profile" reusable across hospitals
- [ ] Hospital-specific overrides

### Output
```
verification_passport_id = uuid
overall_verification_status = VERIFIED | REVIEW | FAILED | NEEDS_RECHECK
```

---

## H. Hospital-Facing View (PRIVACY-FIRST)

### Hospitals MUST See
- [ ] Verification status summary
- [ ] Expiry dates
- [ ] Method of verification
- [ ] Reason codes for failures
- [ ] Approval/deny controls

### Hospitals MUST NOT See by Default
- [ ] Raw passport scans
- [ ] Full student ID images
- [ ] Full transcripts

### Optional
- [ ] Time-limited document access (logged)

---

## I. Security & Encryption (MANDATORY)

### Encryption
- [ ] TLS everywhere
- [ ] AES-256-GCM encryption at rest
- [ ] Envelope encryption (DEK + KMS)
- [ ] Per-hospital or per-tenant key separation

### Access Control
- [ ] Role-based access (student / hospital / admin)
- [ ] Least-privilege enforcement
- [ ] Time-limited sensitive access

### Auditing
- [ ] Log every document view/decrypt
- [ ] Immutable audit logs
- [ ] Admin access review

---

## J. Data Retention & Deletion

### Policies
- [ ] Auto-delete raw documents after verification + X days
- [ ] Retain verification outcomes only
- [ ] User-initiated deletion (where allowed)

### Output
```
retention_policy_applied = boolean
deletion_scheduled_at = timestamp
```

---

## K. Copilot Cross-Check Acceptance Criteria (USE THIS VERBATIM)

When Copilot finishes a feature, ask:

1. **Does it store only what is necessary?**
2. **Are raw documents encrypted and short-lived?**
3. **Is every verification timestamped and auditable?**
4. **Can a hospital approve/deny without seeing raw documents?**
5. **Are expiries automatically enforced?**
6. **Can this scale to multiple hospitals with different rules?**

**If the answer is "no" to any → the feature is incomplete.**

---

## L. Final MVP Scope

### ABSOLUTE MINIMUM (Demo-Ready)
- [ ] Identity + student verification
- [ ] Document upload + integrity
- [ ] Verification status outputs
- [ ] Hospital dashboard (approve/deny)
- [ ] Encryption + audit logs

**Everything else can phase in after MVP validation.**

---

## Implementation Status

| Domain | Status | Owner | ETA |
|--------|--------|-------|-----|
| A. Identity & Account | `TODO` | — | — |
| B. Student Status | `TODO` | — | — |
| C. Document Verification | `TODO` | — | — |
| D. Clinical Safety | `TODO` | — | — |
| E. Legal & Compliance | `TODO` | — | — |
| F. Eligibility Rules | `TODO` | — | — |
| G. Verification Lifecycle | `TODO` | — | — |
| H. Hospital Dashboard | `TODO` | — | — |
| I. Security & Encryption | `TODO` | — | — |
| J. Data Retention | `TODO` | — | — |

---

## Next Steps

Choose one:

1. **Convert to GitHub issue tree** — Break each domain into actionable issues with dependencies
2. **Create system diagram** — Boxes + arrows showing data flow and verification gates
3. **Write master Copilot prompt** — Single prompt that forces AI to stay within this checklist during implementation

