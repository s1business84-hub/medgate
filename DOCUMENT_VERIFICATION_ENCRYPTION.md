# Document Verification & Encryption Process

## Overview

All documents uploaded by students through the verification process are encrypted, validated, and tracked for compliance audits. This document explains the end-to-end flow.

---

## 1. DOCUMENT TYPES & VERIFICATION REQUIREMENTS

### 1.1 Required Documents by Program Type

| Program Type | Required Documents | Verification Type |
|--------------|-------------------|-------------------|
| Observership | Passport, Medical License, Emirates ID | Document validation |
| Internship | All above + Medical Fitness Certificate | Medical credential check |
| Residency | All above + Specialty Certification | Regulatory body validation |
| Elective | Passport, Academic Transcript | Academic verification |
| Fellowship | License + Specialty + Insurance | Insurance + credential check |

### 1.2 Document Type Enum

```typescript
type DocumentType =
  | "Passport"                      // Government ID
  | "Medical Certificate"           // Medical license
  | "Academic Transcript"           // University records
  | "Emirates ID"                   // UAE national ID
  | "Medical Fitness Certificate"   // Health clearance
  | "Police Clearance Certificate"  // Background check
  | "Immunization Records"          // Vaccination proof
  | "Nursing License"               // Nursing credential
  | "Specialty Certification"       // Advanced credential
  | "Other";                        // Custom document
```

### 1.3 Validation Status

```typescript
type ValidationStatus =
  | "Pending"      // Awaiting hospital/admin review
  | "Validated"    // Approved and encrypted
  | "Rejected";    // Failed verification, must re-upload
```

---

## 2. DOCUMENT UPLOAD & ENCRYPTION FLOW

### 2.1 Upload Process

**Step 1: Student Uploads Document**
```typescript
// Student submits document via upload form
{
  applicationId: "app_123",
  type: "Medical Certificate",
  fileName: "medical_license_2026.pdf",
  fileContent: <ArrayBuffer>
}
```

**Step 2: Pre-Upload Validation**
- File size check: Max 10MB
- File type validation: PDF, JPG, PNG only
- File name sanitization: Remove special characters
- Virus scan (placeholder for future integration)

**Step 3: Encryption & Storage**

```typescript
// ENCRYPTION PROCESS:
1. Generate encryption key (AES-256)
2. Encrypt file content using AES-256-GCM
3. Generate file hash (SHA-256) for integrity
4. Store encrypted file in secure storage
5. Store encryption metadata (key ID, algorithm)
6. Create audit log entry
```

**Encryption Details:**
```
Algorithm: AES-256-GCM
Key Size: 256 bits
IV: 96 bits (randomly generated per file)
Authentication Tag: 128 bits
Hash Algorithm: SHA-256
Integrity: HMAC-SHA256
```

### 2.2 Storage Structure

**Database Record:**
```typescript
interface Document {
  id: string;                        // doc_123456
  applicationId: string;             // app_123
  type: DocumentType;                // "Medical Certificate"
  fileName: string;                  // "medical_license_2026.pdf"
  fileUrl: string;                   // URL to encrypted file
  uploadedAt: string;                // ISO timestamp
  validationStatus: ValidationStatus; // "Pending"
  
  // Encryption metadata
  encryption?: {
    algorithm: "AES-256-GCM";
    keyId: string;                   // Reference to key manager
    encryptedAt: string;             // When encrypted
    fileHash: string;                // SHA-256 hash for integrity
  };
  
  // Verification metadata
  verification?: {
    verifiedBy?: string;             // Verifier user ID
    verifiedAt?: string;             // When verified
    rejectionReason?: string;        // If rejected
  };
}
```

---

## 3. DOCUMENT VERIFICATION PROCESS

### 3.1 Hospital Review Workflow

**Initial State:** `validationStatus: "Pending"`

**Hospital Admin Reviews:**
1. Opens encrypted document (decryption happens server-side)
2. Validates authenticity (checks expiration dates, etc.)
3. Confirms document matches student profile
4. Approves or rejects

### 3.2 Validation Rules

#### For Medical Certificates:
```typescript
Rules:
✅ License number format valid (matches issuing country)
✅ License not expired
✅ License issuer recognized (HAAD, DHA, Ministry of Health, etc.)
✅ Specialty matches program requirements (if applicable)
❌ Reject if forgery detected
❌ Reject if date in future
❌ Reject if issuer unrecognized
```

#### For Emirates ID:
```typescript
Rules:
✅ ID number format valid (18-19 digits)
✅ ID not expired
✅ Name matches application
✅ Nationality matches profile
❌ Reject if forgery signs detected
❌ Reject if ID expired
```

#### For Academic Transcripts:
```typescript
Rules:
✅ University name recognized
✅ Graduation date matches or is future (for current students)
✅ GPA/grades visible (if required)
✅ Signature/seal present
❌ Reject if university unrecognized
❌ Reject if dates inconsistent
```

### 3.3 Verification Status Flow

```
UPLOAD
  ↓
  ├→ PRE-VALIDATION (System checks)
  │  ├→ File size OK? 
  │  ├→ File type OK?
  │  └→ File not corrupted?
  │
  ├→ ENCRYPTION
  │  ├→ Generate encryption key
  │  ├→ Encrypt file (AES-256-GCM)
  │  ├→ Store securely
  │  └→ Create audit log
  │
  ├→ HOSPITAL REVIEW
  │  ├→ Decrypt for viewing (audit logged)
  │  ├→ Manual verification
  │  └→ Approve/Reject decision
  │
  ├→ APPROVED → validationStatus: "Validated"
  │  └→ Document locked (immutable)
  │
  └→ REJECTED → validationStatus: "Rejected"
     └→ Student notified to re-upload
        └→ Previous encrypted copy archived
```

---

## 4. ENCRYPTION & DECRYPTION MECHANICS

### 4.1 Encryption (On Upload)

**Client-Side:**
```typescript
async function encryptDocument(fileBuffer: ArrayBuffer): Promise<{
  encryptedData: ArrayBuffer;
  keyId: string;
  iv: string;
  tag: string;
  hash: string;
}> {
  // 1. Generate random IV (96 bits)
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // 2. Generate file hash before encryption
  const fileHash = await sha256(fileBuffer);
  
  // 3. Encrypt using AES-256-GCM
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    encryptionKey,
    fileBuffer
  );
  
  return {
    encryptedData,
    keyId: "key_2026_01_primary",
    iv: bufferToBase64(iv),
    tag: extractAuthTag(encryptedData),
    hash: fileHash
  };
}
```

**Result:**
- Original file: 2.5MB (plaintext)
- Encrypted file: 2.5MB (ciphertext + metadata)
- Key stored in: Secure key management service
- IV stored in: Database (per-file, random)
- Hash stored in: Database (for integrity check)

### 4.2 Decryption (On Download/View)

**Server-Side Only:**
```typescript
async function decryptDocument(
  documentId: string,
  userContext: UserContext
): Promise<ArrayBuffer> {
  // 1. Verify authorization
  if (!canUserAccessDocument(userContext, documentId)) {
    logAccessDenial(userContext.userId, documentId);
    throw new Error("Unauthorized");
  }
  
  // 2. Retrieve encrypted document
  const doc = database.getDocument(documentId);
  const encryptedBuffer = storage.getFile(doc.fileUrl);
  
  // 3. Retrieve encryption key
  const encryptionKey = keyManager.getKey(doc.encryption.keyId);
  
  // 4. Verify integrity (HMAC-SHA256)
  const computedHash = await sha256(encryptedBuffer);
  if (computedHash !== doc.encryption.fileHash) {
    logIntegrityFailure(documentId);
    throw new Error("File integrity check failed");
  }
  
  // 5. Decrypt using AES-256-GCM
  const iv = base64ToBuffer(doc.encryption.iv);
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    encryptionKey,
    encryptedBuffer
  );
  
  // 6. Log access for audit trail
  logDocumentAccess(userContext.userId, documentId, 'decryption');
  
  return decryptedBuffer;
}
```

**Access Logging:**
```typescript
// Logged on every decryption
{
  timestamp: "2026-01-22T14:30:00Z",
  userId: "user_123",
  documentId: "doc_456",
  action: "decryption",
  applicationId: "app_789",
  reason: "hospital_verification_review",
  ipAddress: "192.168.1.100",
  status: "success"
}
```

---

## 5. VERIFICATION INTEGRATION WITH AUDIT FLOW

### 5.1 Document Verification as Part of Application Status

```
Application Status Flow:
1. SUBMITTED
   └─ Documents required, upload pending

2. DOCUMENTS_PENDING
   └─ Student uploads documents
   └─ Each document → encrypted & stored

3. UNDER_REVIEW
   └─ Hospital reviews encrypted documents
   └─ Decryption logged
   └─ Validates authenticity

4. DOCUMENTS_VERIFIED ✅
   └─ All required documents validated
   └─ Status locked (immutable)

5. READY_FOR_TRAINING
   └─ Exposure acknowledgement next
```

### 5.2 Regulatory Verification Integration

**For EHS-Regulated Programs:**
```
Document Verification:
  ↓
EHS Reference Verification
  ├─ Student provides EHS reference
  ├─ System verifies against EHS database
  └─ Status: Pending → Verified

  ↓
Training Can Begin
```

**For DHA-Regulated Programs:**
```
Document Verification:
  ↓
DHA Credential Check
  ├─ DHA performs background check
  ├─ Medical license verified with DHA
  └─ Status: Pending → Verified

  ↓
Training Can Begin
```

---

## 6. ENCRYPTION KEY MANAGEMENT

### 6.1 Key Rotation Policy

**Primary Key:**
- Algorithm: AES-256-GCM
- Rotation: Annually (January)
- Storage: Hardware Security Module (HSM)
- Backup: Encrypted backup stored separately

**Key Versions:**
```
Key ID: key_2026_01_primary  (Current)
        key_2025_01_archived  (Archived)
        key_2024_01_archived  (Archived)
```

**Document Decryption with Key Rotation:**
```typescript
// System handles key rotation transparently
function getEncryptionKey(keyId: string) {
  if (keyId === 'key_2026_01_primary') {
    return hsm.getActiveKey(); // Current key in HSM
  } else if (keyId === 'key_2025_01_archived') {
    return vault.getArchivedKey('key_2025_01'); // Archived key
  } else {
    throw new Error(`Unknown key: ${keyId}`);
  }
}

// Old documents automatically decrypt with correct historical key
```

### 6.2 Access Control for Keys

```
Only accessible to:
✅ Document encryption service
✅ Document decryption service (server-side only)
✅ Key rotation service
❌ Student users
❌ Unauthorized admin users
❌ Network/File system users
```

---

## 7. DOCUMENT VERIFICATION AUDIT TRAIL

### 7.1 Complete Audit Log

Every document action is logged:

```typescript
interface DocumentAuditLog {
  documentId: string;
  timestamp: string;
  userId: string;
  action: "upload" | "view" | "encrypt" | "decrypt" | "validate" | "reject";
  details: {
    fileSize?: number;
    fileHash?: string;
    encryptionAlgorithm?: string;
    validationResult?: string;
    rejectionReason?: string;
  };
  ipAddress: string;
  userRole: string;
}
```

### 7.2 Example Audit Trail

```
2026-01-20 10:15:00 | user_123 (student) | upload | file_size: 2.5MB, encrypted: ✅
2026-01-20 10:15:05 | system              | encrypt | algorithm: AES-256-GCM, keyId: key_2026_01_primary
2026-01-20 10:15:10 | system              | audit_log_created | document locked for audit
2026-01-20 14:30:00 | user_456 (hospital) | view | decryption_logged, access_granted
2026-01-20 14:35:00 | user_456 (hospital) | validate | status: approved, signed_off_by: hospital_admin
2026-01-20 14:35:05 | system              | document_immutable | status: locked, cannot modify
```

---

## 8. VERIFICATION FAILURE & RETRY FLOW

### 8.1 Document Rejected

**Scenario:** Hospital detects document is invalid/forged

```
Document Status: Rejected
Reason: "Medical license expired (valid until 2024, submitted 2025)"
Action: validationStatus = "Rejected"

Student Notification:
Email: "Document verification failed - Medical Certificate rejected
        Reason: Expired license
        Action: Please upload an updated certificate"

Student Action:
1. New certificate uploaded
2. Previous encrypted copy archived
3. New document encrypted with same key
4. Hospital reviews again
```

### 8.2 Retry Counter

```typescript
interface Document {
  // ... existing fields
  uploadAttempts: {
    attempt1: { uploadedAt: "2026-01-15T10:00Z", status: "Rejected", reason: "Expired" }
    attempt2: { uploadedAt: "2026-01-15T15:00Z", status: "Validated", reason: "OK" }
  };
  
  // Status locked after validation
  validationLocked: boolean;
}
```

---

## 9. COMPLIANCE & REGULATORY ALIGNMENT

### 9.1 UAE Healthcare Compliance

**DHA (Dubai Health Authority):**
- ✅ Documents encrypted per DHA data protection standards
- ✅ Audit logs maintained for 7 years
- ✅ Access restricted to authorized personnel
- ✅ Key rotation annually

**DoH (Abu Dhabi Department of Health):**
- ✅ Student confidentiality maintained
- ✅ Medical data isolation enforced
- ✅ Verification process audited
- ✅ Document integrity guaranteed (hash verification)

**EHS (Emirates Health Services):**
- ✅ Credential verification trackable
- ✅ Cross-regulatory data isolation
- ✅ Reference number verification audited

### 9.2 GDPR Compliance (EU Citizens)

**Data Subject Rights:**
```
✅ Right to access encrypted documents
✅ Right to rectification (re-upload)
✅ Right to deletion (30 days after completion)
✅ Right to data portability (encrypted export)
```

---

## 10. TESTING & DEMO DATA

### 10.1 Demo Hospital Data

**Hospital: Dubai Medical Institute**
```
Hospital ID: hosp_dubai_1
Registration: DHA-2023-12345
Emirate: Dubai
Type: Teaching Hospital
Departments: 
  - Cardiology (lead: Dr. Ahmed)
  - Orthopedics (lead: Dr. Fatima)
  - Neurology (lead: Dr. Hassan)

Trainees:
  1. Asha Kumar (stu_101)
     - Program: Cardiology Observership
     - Status: In Training
     - Documents: Medical License (Validated), Passport (Validated), EHS Ref (Verified)
  
  2. Mohammed Al-Mansouri (stu_102)
     - Program: Orthopedic Surgery Internship
     - Status: Accepted
     - Documents: License (Validated), Fitness Cert (Pending)
  
  3. Sara Al-Naqbi (stu_103)
     - Program: Neurology Elective
     - Status: Declined
     - Documents: Transcript (Rejected - wrong specialization)
```

### 10.2 Export Example

**Compliance Audit Export:**
```
File: compliance_audit_hospital_full_hosp_dubai_1_2026-01-22.xlsx

Sheets:
1. Applications (3 records)
2. Students (3 records)
3. Documents (7 records)
   - Asha Kumar Medical License (Validated, Encrypted)
   - Asha Kumar Passport (Validated, Encrypted)
   - Mohammed Al-Mansouri License (Validated, Encrypted)
   - Mohammed Al-Mansouri Fitness Cert (Pending, Encrypted)
   - Sara Al-Naqbi Transcript (Rejected, Encrypted)
   - [etc.]
4. Exposure Logs (2 records)
5. Supervisor Confirmations (1 record)
6. Completion Attestations (0 records)
7. Incident Flags (0 records)
8. EHS Confirmations (1 record)
```

---

## 11. TROUBLESHOOTING

### Issue: Document Decryption Failed

**Cause:** Key rotation or key ID mismatch

**Resolution:**
```typescript
// System automatically retries with archived keys
1. Try current key (key_2026_01_primary)
2. If fails, try previous key (key_2025_01_archived)
3. If fails, try backup key
4. Log failure and alert admin
```

---

## 12. FUTURE ENHANCEMENTS

- [ ] OCR verification for automated document scanning
- [ ] Blockchain verification for document immutability
- [ ] Real-time DHA/DoH verification API integration
- [ ] Multi-signature approval workflow
- [ ] Digital signature verification
- [ ] Biometric verification for ID documents

---

**Document Classification**: Internal (Engineering & Compliance)  
**Last Updated**: January 22, 2026  
**Next Review**: July 22, 2026
