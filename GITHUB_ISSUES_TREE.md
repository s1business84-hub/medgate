# MedGate Verification System - GitHub Issues Tree

This document maps the verification system checklist to actionable GitHub issues with dependencies and acceptance criteria.

---

## Epic: Verification System Implementation

**Objective**: Implement all 11 verification domains to reach MVP compliance.

---

## 🔴 BLOCKER ISSUES (Must complete first)

### Issue #101: Identity & Account Verification Foundation
**Type**: Feature  
**Priority**: CRITICAL  
**Labels**: `verification`, `security`, `blocker`  
**Dependencies**: None

#### Acceptance Criteria
- [ ] Email OTP verification implemented (6-digit code, 10-minute expiry)
- [ ] Email OTP rate limiting (max 3 attempts per hour)
- [ ] Single-user identity enforcement (no duplicate email/phone)
- [ ] Phone OTP verification implemented (SMS backend)
- [ ] Phone OTP rate limiting (max 3 attempts per 24h)
- [ ] Name consistency check on profile vs. documents
- [ ] DOB consistency tracking in database
- [ ] Identity status enum: `VERIFIED | REVIEW | FAILED`
- [ ] Timestamps: `identity_verified_at`, `identity_verification_method`
- [ ] API endpoint: `POST /api/secure/identity/verify-email-otp`
- [ ] API endpoint: `POST /api/secure/identity/verify-phone-otp`
- [ ] Unit tests: 95%+ coverage

#### Subtasks
- [ ] Create OTP generation service (crypto-secure, 10min TTL)
- [ ] Create email sending service (Resend/SendGrid)
- [ ] Create SMS sending service (Twilio)
- [ ] Create identity deduplication rules
- [ ] Create identity status database schema
- [ ] Create API endpoints with rate limiting
- [ ] Write integration tests

**Estimate**: 40 hours  
**Owner**: @backend-team

---

### Issue #102: Student Status Verification Engine
**Type**: Feature  
**Priority**: CRITICAL  
**Labels**: `verification`, `student`, `blocker`  
**Dependencies**: #101 (identity must exist first)

#### Acceptance Criteria
- [ ] Student ID document upload with metadata extraction
- [ ] Enrollment letter upload with date validation
- [ ] Transcript snippet upload with university parsing
- [ ] Academic email domain confirmation (auto-verify)
- [ ] Manual admin verification workflow (dashboard UI)
- [ ] Consistency checks:
  - [ ] Name matches identity profile
  - [ ] University name consistency across documents
  - [ ] Program/year consistency
  - [ ] Enrollment validity dates checked
- [ ] Student status enum: `VERIFIED | REVIEW | FAILED`
- [ ] Timestamps: `student_verified_at`, `student_verification_method`, `student_verification_expiry`
- [ ] API endpoint: `POST /api/secure/student/upload-verification`
- [ ] API endpoint: `POST /api/secure/student/verify` (admin)
- [ ] Admin dashboard UI for student verification
- [ ] Unit tests: 95%+ coverage

#### Subtasks
- [ ] Create document extraction service (OCR for IDs/letters)
- [ ] Create university database lookup
- [ ] Create enrollment date validator
- [ ] Create consistency check rules engine
- [ ] Create student verification status schema
- [ ] Build admin verification dashboard component
- [ ] Write integration tests

**Estimate**: 50 hours  
**Owner**: @backend-team + @frontend-team

---

## 🟠 HIGH PRIORITY ISSUES

### Issue #103: Document Verification Engine (File Validation & Integrity)
**Type**: Feature  
**Priority**: HIGH  
**Labels**: `verification`, `documents`, `security`  
**Dependencies**: None (but enhances #101, #102)

#### Acceptance Criteria
- [ ] File type restrictions: PDF, JPG, PNG only
- [ ] File size limits: max 25MB per file
- [ ] File hash generation: SHA-256 on upload
- [ ] Hash stored in database for tamper detection
- [ ] File integrity verification on download
- [ ] Document readability check (OCR test)
- [ ] Expiry date auto-detection from document metadata
- [ ] Virus/malware scanning via ClamAV or VirusTotal API
- [ ] Document status enum: `ACCEPTED | REJECTED | RESUBMIT | EXPIRED`
- [ ] Rejection reasons: structured list (file_too_large, invalid_format, etc.)
- [ ] Timestamps: `document_uploaded_at`, `verified_at`, `expires_at`
- [ ] API endpoint: `POST /api/secure/documents/validate`
- [ ] Database schema for document integrity tracking
- [ ] Unit tests: 95%+ coverage

#### Subtasks
- [ ] Create file validator service (type, size, magic bytes)
- [ ] Create hash generation & storage service
- [ ] Create OCR readability checker
- [ ] Create malware scanner integration
- [ ] Create document metadata extractor
- [ ] Create document status schema
- [ ] Create validation API endpoint
- [ ] Write integration tests

**Estimate**: 35 hours  
**Owner**: @backend-team

---

### Issue #104: Clinical Safety & Hospital Prerequisites
**Type**: Feature  
**Priority**: HIGH  
**Labels**: `verification`, `clinical`, `hospital-config`  
**Dependencies**: None (but #101, #102 should be done first)

#### Acceptance Criteria
- [ ] Hospital-configurable immunization requirements:
  - [ ] Hepatitis B (+ titer if required)
  - [ ] MMR
  - [ ] Varicella
  - [ ] TB test (IGRA/PPD with validity period)
  - [ ] Influenza (seasonal)
  - [ ] COVID (if required)
- [ ] Hospital-configurable certifications:
  - [ ] BLS/CPR
  - [ ] Infection control training
  - [ ] Occupational health clearance
- [ ] Per-hospital requirement templates (configurable UI)
- [ ] Expiry tracking per item (auto-flagged when 30 days from expiry)
- [ ] Auto-flag for expired/missing items (background job)
- [ ] Clinical clearance status: `PASS | MISSING | EXPIRED`
- [ ] Database schema for hospital requirements
- [ ] Hospital admin UI for requirement configuration
- [ ] Student dashboard UI showing clinical requirements
- [ ] Background job for expiry checking (daily)
- [ ] Unit tests: 95%+ coverage

#### Subtasks
- [ ] Create hospital requirements schema
- [ ] Create requirement configuration UI (admin)
- [ ] Create student clinical checklist service
- [ ] Create expiry tracking service
- [ ] Create background job for expiry notifications
- [ ] Create student clinical dashboard component
- [ ] Write integration tests

**Estimate**: 45 hours  
**Owner**: @backend-team + @frontend-team

---

### Issue #105: Verification Lifecycle & Reuse Engine
**Type**: Feature  
**Priority**: HIGH  
**Labels**: `verification`, `lifecycle`, `reusability`  
**Dependencies**: #101, #102, #103

#### Acceptance Criteria
- [ ] Verification expiry engine (configurable TTL per verification type)
- [ ] Auto re-verification triggers (on profile change or expiry)
- [ ] Profile change invalidation logic (invalidates related verifications)
- [ ] "Verified Profile" concept (portable across hospitals)
- [ ] Hospital-specific verification overrides
- [ ] Verification passport ID (UUID for reuse tracking)
- [ ] Overall verification status: `VERIFIED | REVIEW | FAILED | NEEDS_RECHECK`
- [ ] Verification history (immutable audit trail)
- [ ] API endpoint: `GET /api/secure/verification/passport/{passportId}`
- [ ] API endpoint: `POST /api/secure/verification/passport/create`
- [ ] Database schema for verification passport
- [ ] Unit tests: 95%+ coverage

#### Subtasks
- [ ] Create verification lifecycle state machine
- [ ] Create expiry trigger service
- [ ] Create reusable profile service
- [ ] Create hospital override rules engine
- [ ] Create verification passport schema
- [ ] Write integration tests

**Estimate**: 40 hours  
**Owner**: @backend-team

---

### Issue #106: Data Retention & Auto-Deletion Policy
**Type**: Feature  
**Priority**: HIGH  
**Labels**: `verification`, `privacy`, `data-retention`, `security`  
**Dependencies**: #101, #102, #103

#### Acceptance Criteria
- [ ] Auto-delete raw documents 30 days after verification
- [ ] Retain verification outcomes indefinitely
- [ ] User-initiated deletion workflow (with confirmation)
- [ ] Deletion audit trail (who deleted what, when)
- [ ] Soft-delete first, hard-delete after 90 days
- [ ] Database schema for deletion tracking
- [ ] Background job for auto-deletion (daily)
- [ ] API endpoint: `POST /api/secure/documents/{id}/delete`
- [ ] Compliance with GDPR/data minimization
- [ ] Unit tests: 95%+ coverage

#### Subtasks
- [ ] Create retention policy service
- [ ] Create soft-delete schema
- [ ] Create background job for auto-deletion
- [ ] Create deletion audit service
- [ ] Create user deletion UI
- [ ] Write integration tests

**Estimate**: 25 hours  
**Owner**: @backend-team

---

## 🟡 MEDIUM PRIORITY ISSUES

### Issue #107: Hospital Dashboard - Privacy & Verification View
**Type**: Feature  
**Priority**: MEDIUM  
**Labels**: `verification`, `hospital`, `ui`, `privacy`  
**Dependencies**: #101, #102, #103, #105

#### Acceptance Criteria
- [ ] Hospital can see verification status summary (VERIFIED/REVIEW/FAILED)
- [ ] Hospital can see verification expiry dates
- [ ] Hospital can see verification method (student_id, enrollment_letter, etc.)
- [ ] Hospital can see rejection reason codes
- [ ] Hospital can approve/deny students
- [ ] Privacy controls: **hospitals CANNOT see**:
  - [ ] Raw student ID scans (only last 4 digits + expiry)
  - [ ] Full passport scans (only last 4 digits + country)
  - [ ] Full transcripts (summary only)
- [ ] Time-limited document access (password-protected, logged)
- [ ] Dashboard UI component with filters/sorting
- [ ] Unit tests: 95%+ coverage

#### Subtasks
- [ ] Create privacy masking service
- [ ] Create time-limited access token service
- [ ] Create hospital dashboard component
- [ ] Create document view logging
- [ ] Write integration tests

**Estimate**: 30 hours  
**Owner**: @frontend-team + @backend-team

---

### Issue #108: Legal & Compliance Acknowledgements
**Type**: Feature  
**Priority**: MEDIUM  
**Labels**: `verification`, `compliance`, `legal`  
**Dependencies**: None (but should coordinate with #101)

#### Acceptance Criteria
- [ ] Compliance checklist items:
  - [ ] Observership scope (no hands-on care)
  - [ ] Confidentiality / NDA
  - [ ] Hospital policies
  - [ ] Patient data handling acknowledgement
  - [ ] Code of conduct
- [ ] Digital signature with timestamp (checkbox + e-signature)
- [ ] Versioned policy text (each version immutable)
- [ ] Immutable audit record (who accepted what version, when)
- [ ] Compliance status: `COMPLETE | INCOMPLETE`
- [ ] API endpoint: `POST /api/secure/compliance/acknowledge`
- [ ] Database schema for versioned policies
- [ ] Student UI component for policy acceptance
- [ ] Admin UI for policy version management
- [ ] Unit tests: 95%+ coverage

#### Subtasks
- [ ] Create policy versioning schema
- [ ] Create compliance acknowledgement service
- [ ] Create policy acceptance UI
- [ ] Create admin policy management UI
- [ ] Create audit trail service
- [ ] Write integration tests

**Estimate**: 35 hours  
**Owner**: @backend-team + @frontend-team

---

### Issue #109: Eligibility & Fit Rules Engine
**Type**: Feature  
**Priority**: MEDIUM  
**Labels**: `verification`, `eligibility`, `rules-engine`  
**Dependencies**: #101, #102

#### Acceptance Criteria
- [ ] Automated eligibility rules:
  - [ ] Minimum year of study (configurable per program)
  - [ ] Required documents completed (student, ID, etc.)
  - [ ] Department eligibility rules (specialty filters)
  - [ ] Rotation duration limits (min/max days)
  - [ ] Blackout dates / capacity rules
- [ ] Eligibility status: `ELIGIBLE | INELIGIBLE`
- [ ] Eligibility failure reason: structured code
- [ ] Per-program rule configuration (admin UI)
- [ ] Real-time eligibility checking
- [ ] API endpoint: `GET /api/secure/eligibility/check`
- [ ] Database schema for rules
- [ ] Unit tests: 95%+ coverage

#### Subtasks
- [ ] Create rules engine (DSL or simple rule objects)
- [ ] Create eligibility checker service
- [ ] Create admin rule configuration UI
- [ ] Write integration tests

**Estimate**: 30 hours  
**Owner**: @backend-team + @frontend-team

---

## Implementation Timeline

**Phase 1 (Week 1-2)**: Issues #101, #102 (Blockers)  
**Phase 2 (Week 3)**: Issues #103, #104, #105, #106  
**Phase 3 (Week 4)**: Issues #107, #108, #109  
**Phase 4**: Testing, deployment, refinement

---

## Copilot Acceptance Checklist

Before closing any issue, verify:

- [ ] Does it store only what is necessary?
- [ ] Are raw documents encrypted and short-lived?
- [ ] Is every verification timestamped and auditable?
- [ ] Can a hospital approve/deny without seeing raw documents?
- [ ] Are expiries automatically enforced?
- [ ] Can this scale to multiple hospitals with different rules?

**If NO to any → issue remains OPEN**

---

## Related Documentation

- [VERIFICATION_SYSTEM_CHECKLIST.md](./VERIFICATION_SYSTEM_CHECKLIST.md) — Full requirements
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md) — Encryption & security design
- [SECURITY_IMPLEMENTATION_GUIDE.md](./SECURITY_IMPLEMENTATION_GUIDE.md) — Integration guide

