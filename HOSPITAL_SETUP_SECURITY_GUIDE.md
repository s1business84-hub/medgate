# Hospital Setup & Security Guide

## Overview

This guide explains how Medgate (Electivio) handles data security, encryption, breach procedures, and verification processes. It's designed for hospital administrators, IT teams, and compliance officers.

---

## 1. ENCRYPTION & DATA PROTECTION

### 1.1 Data at Rest (Storage Encryption)

**Standard**: AES-256 encryption for all stored student and hospital data

**What's encrypted:**
- Student personal information (name, ID, contact details)
- Medical credentials and certifications
- Training dates and exposure records
- Supervisor confirmations and timestamps
- Regulatory references (EHS, DHA, DoH)

**Infrastructure:**
- Database encryption using Vercel PostgreSQL (industry standard)
- Encryption keys managed by Vercel's Key Management Service
- No plaintext storage of sensitive fields

**Hospital responsibility:**
- Access control: Only authorized staff can view student records
- Role-based access: Admin, Hospital Supervisor, Trainer roles

---

### 1.2 Data in Transit (Communication Encryption)

**Standard**: TLS 1.2+ (HTTPS) for all network communications

**What's protected:**
- Login credentials
- Student application submissions
- Hospital decision records (Accept/Defer/Decline)
- Regulatory verification data
- Exposure acknowledgements and supervisor confirmations

**Implementation:**
- SSL/TLS certificates from trusted Certificate Authority
- HTTPS enforced on all endpoints
- No HTTP fallback allowed
- Secure cookies (HttpOnly, Secure, SameSite flags)

**Hospital IT requirements:**
- Access platform only via HTTPS
- Disable legacy TLS versions (1.0, 1.1) on hospital network if applicable
- Use current browser versions (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

---

### 1.3 API Communication Security

**Authentication:**
- Session-based authentication with secure tokens
- Tokens expire after 24 hours of inactivity
- Re-authentication required for sensitive operations

**Authorization:**
- Role-Based Access Control (RBAC)
  - **Hospital Admin**: Full hospital record access, user management, supervisor assignment
  - **Supervisor**: View assigned trainees, confirm supervision, mark completion
  - **Student**: View personal application, acknowledge exposure, upload documents

**Data isolation:**
- Hospital A cannot see Hospital B's data
- Students cannot access other students' records
- Regulatory data isolated by institution type (EHS, DHA, DoH)

---

## 2. DATA BREACH RESPONSE PROCEDURES

### 2.1 Breach Definition & Scope

A **data breach** is unauthorized access, use, or disclosure of:
- Student personal information (name, ID numbers, contact details)
- Medical credentials or training records
- Hospital operational data
- Regulatory references or compliance records
- Any encrypted data that is decrypted and exposed

**Not counted as breach:**
- Accidental submission of wrong application (can be retracted)
- Student accidentally viewing own record twice
- Supervisor logging in multiple times
- System outages where data remains encrypted and inaccessible

---

### 2.2 Breach Detection & Counting

**How breaches are monitored:**
1. **Automated alerts**: System flags unusual access patterns
   - Multiple failed login attempts (5+ in 15 minutes)
   - Access from unfamiliar IP addresses
   - Data downloads exceeding normal patterns
   - Off-hours mass data queries

2. **Manual detection**: Hospital staff report suspicious activity
   - Unauthorized access observed
   - Missing or altered records
   - Unexplained data changes

3. **Audit logs**: All access is timestamped and logged
   - Who accessed the data (user ID)
   - When it was accessed (timestamp)
   - What was accessed (record type, field)
   - Whether data was modified, viewed, or downloaded

**Breach counting methodology:**
- **Per-student count**: Each student record exposed = 1 breach
- **Per-institution count**: Each hospital's data set exposed = separate breach
- **Total impact**: Sum of all student records exposed in single incident

**Example:**
- Incident: Unauthorized access to Hospital A database
- Students affected: 47 student records
- **Breach count: 47** (one per exposed record)

---

### 2.3 Breach Notification Protocol

**Immediate Actions (within 1 hour):**
1. Isolate affected systems (if applicable)
2. Disable compromised user account(s)
3. Notify Medgate security team
4. Preserve evidence (logs, screenshots, access records)

**Investigation Phase (within 24 hours):**
1. Determine scope of breach (which data, which records, which hospitals)
2. Identify root cause (unauthorized access, system vulnerability, user error)
3. Assess risk level (Low/Medium/High/Critical)
4. Document timeline of discovery

**Notification Requirements (based on risk level):**

**Critical Breach (government/regulatory data exposed):**
- Notify within 24 hours
- Hospital admin + Medgate leadership
- Regulatory bodies (DHA, DoH, EHS if applicable)
- Affected students (email + SMS)

**High Breach (10+ student records + personal info):**
- Notify within 48 hours
- Hospital admin
- Medgate security team
- Affected students

**Medium Breach (1-9 records exposed):**
- Notify within 5 business days
- Hospital admin
- Medgate security team
- Affected students (if personal identifiable information exposed)

**Low Breach (metadata only, no personal data):**
- Document in incident log
- Notify hospital within 10 business days
- No external notification required

---

### 2.4 Hospital's Breach Reporting Role

**Hospital must report to Medgate:**
- Any suspected unauthorized access to student data
- Any staff member accessing records without authorization
- Any loss, theft, or unauthorized sharing of printouts/exports
- Any phishing attempts targeting hospital staff
- Any malware or ransomware incidents affecting the platform

**Reporting channels:**
- **Immediate (Critical)**: Call Medgate security hotline: [CONTACT TO BE PROVIDED]
- **Urgent (High)**: Email: security@medgate.io with subject "BREACH REPORT - URGENT"
- **Standard**: Use in-app incident reporting portal (Admin > Compliance > Report Incident)

**Information to include:**
- Date and time of suspected breach
- Type of data involved
- Number of records potentially exposed
- How breach was discovered
- Current status (ongoing, contained, resolved)
- Any evidence or screenshots

---

## 3. VERIFICATION PROCESS

### 3.1 Student Verification Workflow

**Stage 1: Identity Verification**
- Student submits government-issued ID
- Medgate verifies ID format (UAE national ID, passport, etc.)
- ID number matched against existing records
- ✅ Status: Verified or ❌ Status: Document required

**Stage 2: Medical Credential Verification**
- Student uploads medical license/certificate
- License number validated against issuing body database (where available)
- Expiration date checked (must be valid)
- ✅ Status: Verified or ⚠️ Status: Manual review required

**Stage 3: Regulatory Status Check** (if applicable)
- **EHS Allocation**: Medgate contacts EHS for reference verification
- **DHA/DoH**: Hospital or student must provide reference number
- Reference checked against regulatory database
- ✅ Status: Verified or ❌ Status: Reference not found

**Stage 4: Hospital Acceptance**
- Hospital reviews student profile
- Hospital approves credentials based on program requirements
- ✅ Status: Accepted or ❌ Status: Declined

---

### 3.2 Data Verification & Integrity

**Ongoing verification checks:**

**Daily audit runs:**
- Check for orphaned records (student with no hospital assignment)
- Verify all timestamps are valid (not in future, not duplicates)
- Confirm exposure levels are set before training start
- Validate regulatory status is consistent

**Weekly data quality checks:**
- Count total active students
- Count completed trainings
- Flag incomplete records (missing supervisor confirmation)
- Verify no data corruption in encrypted fields

**Monthly compliance verification:**
- Generate breach/incident count report
- Verify all access logs are complete
- Confirm no unauthorized field modifications
- Audit role-based access permissions

**Data verification outputs:**
```
VERIFICATION REPORT TEMPLATE
Generated: [DATE] [TIME]

INTEGRITY CHECKS
✅ All 247 student records accessible
✅ All timestamps valid
⚠️ 3 records missing supervisor confirmation (flagged for follow-up)
✅ All encryption keys present and valid

SECURITY CHECKS
✅ No unauthorized access detected
✅ All API calls authenticated
✅ No TLS certificate issues
❌ 1 failed login (blocked, user notified)

COMPLIANCE CHECKS
✅ 0 breaches reported this period
✅ All access logged
✅ GDPR/HIPAA retention policies enforced
```

---

### 3.3 Hospital Verification Record

Each hospital maintains a **Verification Record** showing:

| Field | Purpose | Updated | By |
|-------|---------|---------|-----|
| Hospital ID | Unique identifier | Once at setup | Medgate |
| Registration Number | Official registration | Annually | Hospital Admin |
| Regulatory Status | DHA/HAAD/Other | Ongoing | Auto-check |
| Compliance Level | Current compliance rating | Quarterly | Audit |
| Last Audit Date | When last verified | After audit | Medgate |
| Breach History | Count of incidents | Real-time | System |
| Data Protection Officer | Contact for security issues | On change | Hospital |

**Hospital responsibilities in verification:**
- Keep registration information current
- Report any compliance changes
- Designate point of contact for security issues
- Respond to data verification requests within 5 business days
- Notify Medgate of staff turnover affecting data access

---

## 4. COMPLIANCE STANDARDS

### 4.1 Regulatory Frameworks

**UAE Healthcare Regulations:**
- **HAAD (Health Authority Abu Dhabi) Standards**: Data protection, patient privacy
- **DHA (Dubai Health Authority) Standards**: Medical training oversight, data handling
- **DoH (Department of Health) Standards**: Training program compliance

**International Standards:**
- **GDPR (EU General Data Protection Regulation)**: If EU citizens' data processed
- **HIPAA (US Health Insurance Portability Act)**: If US-related data processed
- **ISO 27001**: Information security management

### 4.2 Data Retention Policy

**Student records kept for:**
- Active training: Duration of program + 1 year
- Completed training: 7 years (regulatory requirement in UAE)
- Declined/Deferred applications: 1 year

**Hospital administrative data:**
- User access logs: 2 years (security/audit requirement)
- Breach reports: 7 years
- Regulatory verification records: Indefinitely

**Automatic deletion:**
- Records automatically deleted after retention period expires
- Deletion is permanent and cannot be reversed
- Deletion confirmed by email to hospital admin

### 4.3 Data Subject Rights

**Student rights:**
- Access their own data anytime
- Request correction of inaccurate information
- Request deletion (after training completion + retention period)
- Opt-out of non-essential communications

**Hospital/Supervisor rights:**
- Access only relevant trainee data
- Request audit log of who accessed their data
- Report data concerns to Medgate

**Requesting data rights:**
- Use in-app "Data Rights Request" form
- Response within 30 days
- No fee for standard requests

---

## 5. HOSPITAL SETUP CHECKLIST

### Initial Setup

- [ ] **Account creation** - Hospital admin account established
- [ ] **Staff onboarding** - Designate admin, supervisors, trainers
- [ ] **Password policy** - Set minimum password complexity (12+ chars, mixed case/numbers)
- [ ] **Two-factor authentication (2FA)** - Enable 2FA for all admin accounts
- [ ] **Data Protection Officer** - Assign named contact for security/compliance
- [ ] **Access review** - Confirm role assignments (who can see what data)

### Ongoing Compliance

- [ ] **Monthly access review** - Audit who accessed what data
- [ ] **Quarterly staff turnover** - Remove access for departing staff within 1 day
- [ ] **Annual compliance audit** - Medgate verifies hospital compliance
- [ ] **Incident reporting** - Report any suspected breaches within 24 hours
- [ ] **Training updates** - Hospital staff trained on data privacy annually

### Security Best Practices

- [ ] **Strong passwords** - Enforce password changes every 90 days
- [ ] **Logout on exit** - Always logout from hospital devices
- [ ] **No sharing credentials** - Each user has unique login
- [ ] **Report phishing** - Forward suspicious emails to security@medgate.io
- [ ] **Secure printing** - If printing reports, store securely and shred after use
- [ ] **Network security** - Ensure hospital network is protected by firewall
- [ ] **Device security** - Use antivirus on devices accessing platform

---

## 6. INCIDENT REPORTING CONTACTS

### Medgate Security Team

**For security incidents:**
- **Email**: security@medgate.io
- **Phone**: [CONTACT TO BE PROVIDED]
- **Emergency (24/7)**: [CONTACT TO BE PROVIDED]

**Information to include:**
- Incident type (breach, suspicious access, system issue)
- Date and time
- Affected data/records
- Your name and role
- Contact information

### Support & Questions

**For technical support:**
- **Email**: support@medgate.io
- **Help portal**: https://support.medgate.io

**For compliance questions:**
- **Email**: compliance@medgate.io
- **Response time**: Within 2 business days

---

## 7. FREQUENTLY ASKED QUESTIONS

**Q: Can hospitals export student data?**
A: Export functionality is read-only in pilot phase. Hospital can export trainee lists for internal records but cannot modify exported data. All exports are timestamped and logged.

**Q: What happens if a student's data is leaked externally?**
A: If Medgate-side breach (system vulnerability), we notify within 24 hours. If hospital-side breach (hospital staff unauthorized access), hospital must report to Medgate. Each exposed record = 1 breach count.

**Q: How long is data kept after training ends?**
A: Completion records kept for 7 years (UAE regulatory requirement). After 7 years, automatically deleted.

**Q: Who can see hospital data - Medgate staff?**
A: Only Medgate security and compliance staff can access encrypted hospital data for audit purposes. Hospital data is isolated by default.

**Q: What's the difference between verification and verified?**
A: **Verification** = process of checking credentials (identity, medical license, regulatory status). **Verified** = status indicating check passed. Breaches are "verified incidents" when confirmed true.

**Q: Can we store data on our own servers?**
A: No. All data must be stored in Medgate's encrypted infrastructure. Hospitals can export for backup but must not store personally identifiable data outside secure systems.

---

## 8. REVISION HISTORY

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0 | Jan 22, 2026 | Initial guide | Medgate Compliance |

---

**Document Classification**: Public (Hospital staff level)  
**Last Updated**: January 22, 2026  
**Next Review**: July 22, 2026  
**Questions?** Contact compliance@medgate.io
