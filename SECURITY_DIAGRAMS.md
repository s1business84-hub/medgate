# MedGate Security System - Visual Diagrams

## 1. Complete Data Flow (End-to-End)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ STUDENT DEVICE                                                               │
│ ┌──────────────────────────────────────────────────────────────────────┐   │
│ │ 1. User selects document to upload                                  │   │
│ │    - Reads file from device                                         │   │
│ │    - Calculates SHA-256 hash for integrity checking                │   │
│ └──────────────────────────────────────────────────────────────────────┘   │
│                          │                                                  │
│                          ▼                                                  │
│ ┌──────────────────────────────────────────────────────────────────────┐   │
│ │ 2. Request pre-signed URL (HTTPS)                                    │   │
│ │    POST /api/secure/documents/upload-url                           │   │
│ │    { documentType, filename, mimeType, sizeBytes }                 │   │
│ └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
           │
           │ TLS 1.3 + JWT Token
           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ MEDGATE BACKEND (AWS)                                                        │
│ ┌──────────────────────────────────────────────────────────────────────┐   │
│ │ 3. API Gateway                                                       │   │
│ │    - Rate limiting check                                             │   │
│ │    - Request ID correlation                                          │   │
│ └──────────────────────────────────────────────────────────────────────┘   │
│                          │                                                  │
│                          ▼                                                  │
│ ┌──────────────────────────────────────────────────────────────────────┐   │
│ │ 4. Auth Middleware                                                   │   │
│ │    - Extract JWT from Authorization header                           │   │
│ │    - Verify signature (RS256)                                        │   │
│ │    - Check expiration                                                │   │
│ │    - Get user permissions                                            │   │
│ └──────────────────────────────────────────────────────────────────────┘   │
│                          │                                                  │
│                          ▼                                                  │
│ ┌──────────────────────────────────────────────────────────────────────┐   │
│ │ 5. RBAC Check                                                        │   │
│ │    - User role: student                                              │   │
│ │    - Required permission: document:upload ✓                         │   │
│ │    - Tenant access: ✓                                                │   │
│ └──────────────────────────────────────────────────────────────────────┘   │
│                          │                                                  │
│                          ▼                                                  │
│ ┌──────────────────────────────────────────────────────────────────────┐   │
│ │ 6. Document Service                                                  │   │
│ │    - Validate file type/size/mimetype                                │   │
│ │    - Generate unique storage key:                                    │   │
│ │      documents/hospital-123/student-456/student_id/abc123.enc       │   │
│ │    - Generate pre-signed S3 URL (1-hour expiry)                      │   │
│ └──────────────────────────────────────────────────────────────────────┘   │
│                          │                                                  │
│                          ▼                                                  │
│ ┌──────────────────────────────────────────────────────────────────────┐   │
│ │ 7. Audit Logging                                                     │   │
│ │    {                                                                  │   │
│ │      action: 'document:upload_initiated',                            │   │
│ │      outcome: 'success',                                             │   │
│ │      actorId: student-456,                                           │   │
│ │      resourceId: abc123 (storageKey),                                │   │
│ │      timestamp: 2026-01-22T10:15:00Z,                               │   │
│ │      metadata: { documentType, mimeType, sizeBytes }                 │   │
│ │    }                                                                  │   │
│ └──────────────────────────────────────────────────────────────────────┘   │
│                          │                                                  │
│                          ▼                                                  │
│ ┌──────────────────────────────────────────────────────────────────────┐   │
│ │ 8. Return Response                                                   │   │
│ │    {                                                                  │   │
│ │      uploadUrl: https://s3.amazonaws.com/medgate/...,               │   │
│ │      storageKey: documents/hospital-123/student-456/.../abc123.enc, │   │
│ │      expiresAt: 2026-01-22T11:15:00Z                                │   │
│ │    }                                                                  │   │
│ └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
           │
           │ HTTPS Response
           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STUDENT DEVICE                                                               │
│ ┌──────────────────────────────────────────────────────────────────────┐   │
│ │ 9. Direct Upload to S3 (HTTPS)                                       │   │
│ │    - Use pre-signed URL (no AWS credentials needed)                  │   │
│ │    - S3 automatically applies SSE-KMS encryption                     │   │
│ │    - Document stored encrypted at rest                               │   │
│ │    - Returns ETag (verification)                                     │   │
│ └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Encryption at Rest - Detailed View

```
┌──────────────────────────────────────────────────────────────────────────┐
│ PLAINTEXT DOCUMENT                                                        │
│ Student ID Photo: student_id_photo.jpg (2.5 MB)                          │
└──────────────────────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Generate Unique DEK (Data Encryption Key)                        │
│                                                                           │
│ - 256-bit random key                                                      │
│ - Generated uniquely for THIS document                                    │
│ - Never reused                                                            │
│                                                                           │
│ DEK = [0x47, 0x8F, 0x23, ..., 0xA1] (32 bytes)                           │
└──────────────────────────────────────────────────────────────────────────┘
             │
             ├──────────────────────────┬──────────────────────────┐
             │                          │                          │
             ▼                          ▼                          ▼
┌─────────────────────┐     ┌──────────────────┐    ┌──────────────────────┐
│ AES-256-GCM         │     │ Generate IV      │    │ Generate IV          │
│ Encryption          │     │ (nonce)          │    │ (nonce)              │
│                     │     │                  │    │                      │
│ plaintext + DEK     │     │ 96-bit random    │    │ 96-bit random        │
│           → cipher  │     │                  │    │                      │
└─────────────────────┘     │ IV = [0x12,      │    │ IV = [0x12,          │
                            │       0x34, ...]  │    │       0x34, ...]     │
                            └──────────────────┘    └──────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ ENCRYPTED DATA + AUTHENTICATION TAG                                       │
│                                                                           │
│ Ciphertext: [0x9F, 0x1C, 0xE5, ..., 0x7D] (2.5 MB encrypted)            │
│ Auth Tag:   [0x2A, 0x5B, 0x8F, ..., 0x14] (128 bits - integrity proof)   │
└──────────────────────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Wrap DEK with KMS Master Key                                    │
│                                                                           │
│ DEK (in memory) + KEK (in AWS KMS)                                       │
│         ↓                    ↓                                            │
│    AWS KMS.encrypt()  ←──────┴────────→ Returns wrapped DEK             │
│                                                                           │
│ Wrapped DEK: [0xC4, 0x2E, 0x91, ..., 0xB3] (base64 encoded)             │
│ (Encrypted by KMS, impossible to decrypt without KMS access)            │
└──────────────────────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ FINAL STORAGE (in S3 + Database)                                         │
│                                                                           │
│ S3 Storage:                                                               │
│ ┌────────────────────────────────────────────────────────────────┐       │
│ │ Object: documents/hospital-123/student/id/abc123.enc           │       │
│ │ Content:                                                        │       │
│ │  - Ciphertext: [0x9F, 0x1C, 0xE5, ...] ← encrypted file      │       │
│ │  - IV: [0x12, 0x34, ...]                ← from encryption    │       │
│ │  - Auth Tag: [0x2A, 0x5B, ...]         ← integrity proof     │       │
│ │                                                                 │       │
│ │ Metadata Headers:                                               │       │
│ │ - x-amz-server-side-encryption: aws:kms                        │       │
│ │ - x-amz-server-side-encryption-aws-kms-key-id: arn:aws:kms:..│       │
│ └────────────────────────────────────────────────────────────────┘       │
│                                                                           │
│ Database Record (DocumentMetadata):                                       │
│ ┌────────────────────────────────────────────────────────────────┐       │
│ │ {                                                              │       │
│ │   id: "doc_abc123",                                            │       │
│ │   storageKey: "documents/hospital-123/.../abc123.enc",        │       │
│ │   kmsKeyId: "arn:aws:kms:...",                                │       │
│ │   wrappedDekKey: "documents/hospital-123/.../abc123.enc.dek", │       │
│ │   contentHash: "sha256:a1b2c3...",                            │       │
│ │   status: "pending_verification",                             │       │
│ │   uploadedAt: "2026-01-22T10:15:00Z"                          │       │
│ │ }                                                              │       │
│ └────────────────────────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Decryption Process (For Verification)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ MEDGATE VERIFIER REQUESTS TO DECRYPT DOCUMENT                             │
│                                                                           │
│ MedGate Verifier: "I want to verify document abc123"                     │
└──────────────────────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Load Encrypted Data from Storage                                 │
│                                                                           │
│ Get from database: Document metadata                                     │
│ Get from S3: Ciphertext + IV + Auth Tag                                  │
│ Get from S3: Wrapped DEK key file                                        │
└──────────────────────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Unwrap DEK using KMS                                             │
│                                                                           │
│ AWS KMS.decrypt(                                                          │
│   CiphertextBlob: [wrapped DEK bytes],                                   │
│   KeyId: "arn:aws:kms:us-east-1:123456789:key/...",                     │
│   EncryptionContext: { tenantId: "hospital-123" }                        │
│ )                                                                         │
│                                                                           │
│ Returns: DEK (decrypted, only in memory)                                 │
└──────────────────────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Decrypt Ciphertext using DEK                                     │
│                                                                           │
│ AES-256-GCM.decrypt(                                                      │
│   ciphertext: [encrypted bytes],                                          │
│   key: DEK (from KMS),                                                    │
│   iv: [0x12, 0x34, ...],                                                 │
│   authTag: [0x2A, 0x5B, ...],                                            │
│   additionalData: context (tenant ID, data type, etc)                    │
│ )                                                                          │
│                                                                           │
│ ✓ Auth tag verified → data not tampered                                  │
│ ✓ Decryption successful → plaintext returned                             │
└──────────────────────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Display Document                                                 │
│                                                                           │
│ Plaintext: student_id_photo.jpg (2.5 MB)                                │
│                                                                           │
│ Verifier can now see document and make verification decision             │
└──────────────────────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 5: AUDIT LOG                                                        │
│                                                                           │
│ {                                                                         │
│   id: "aud_xyz789",                                                       │
│   timestamp: "2026-01-22T10:18:00Z",                                     │
│   action: "document:decrypted",                                          │
│   outcome: "success",                                                     │
│   actorId: "verifier-123",                                               │
│   actorRole: "medgate_verifier",                                         │
│   resourceType: "document",                                               │
│   resourceId: "doc_abc123",                                              │
│   tenantId: "hospital-123",                                              │
│   severity: "info"                                                        │
│ }                                                                         │
└──────────────────────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 6: Zero Out DEK from Memory                                         │
│                                                                           │
│ DEK = [0x00, 0x00, 0x00, ..., 0x00]  ← all zeros                        │
│                                                                           │
│ (Prevents accidental memory leak)                                        │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Authentication & Authorization Flow

```
┌────────────────────────────────────┐
│ USER ENTERS CREDENTIALS             │
│ Email: student@example.com          │
│ Password: ••••••••••                │
└────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ POST /api/auth/login                │
│ (HTTPS + Rate Limited)              │
└────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────┐
│ VALIDATE CREDENTIALS                                            │
│ 1. Find user by email                                          │
│ 2. Compare password hash (bcrypt, cost 12)                     │
│ 3. Check account status (active/suspended)                     │
│ 4. Verify MFA if enabled                                       │
└────────────────────────────────────────────────────────────────┘
             │
             ▼ (if valid)
┌────────────────────────────────────────────────────────────────┐
│ GENERATE TOKENS                                                 │
│                                                                 │
│ Access Token (15 minutes):                                      │
│ {                                                               │
│   sub: "student-123",                                           │
│   role: "student",                                              │
│   tenantId: "hospital-456",                                     │
│   sessionId: "sess_abc123",                                     │
│   permissions: ["document:upload", "application:create", ...], │
│   iat: 1672754700,                                              │
│   exp: 1672755600,                                              │
│   iss: "medgate",                                               │
│   aud: "medgate-api"                                            │
│ }                                                               │
│                                                                 │
│ Signed: RS256 signature (private key)                           │
│ Result: eyJhbGc... (JWT)                                        │
│                                                                 │
│ Refresh Token (7 days):                                         │
│ - Stored server-side in Redis/Database                         │
│ - HttpOnly cookie (not accessible to JavaScript)               │
│ - Used to get new access token                                 │
└────────────────────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ RETURN TO CLIENT                    │
│ {                                  │
│   accessToken: "eyJhbGc...",       │
│   refreshToken: "eyJyZWY..."       │
│   expiresIn: 900                   │
│ }                                  │
└────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────┐
│ CLIENT MAKES AUTHENTICATED REQUEST                              │
│ GET /api/applications/app_123                                  │
│                                                                 │
│ Headers:                                                        │
│ Authorization: Bearer eyJhbGc...                               │
│ Content-Type: application/json                                 │
│ X-Tenant-ID: hospital-456                                      │
└────────────────────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────┐
│ API GATEWAY                                                     │
│ 1. Extract JWT from Authorization header                        │
│ 2. Verify RS256 signature with public key ✓                    │
│ 3. Check expiration (iat, exp) ✓                               │
│ 4. Verify issuer and audience ✓                                │
│ 5. Extract claims                                              │
└────────────────────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────┐
│ BUILD AUTHENTICATED CONTEXT                                     │
│ {                                                               │
│   user: {                                                       │
│     id: "student-123",                                          │
│     email: "student@example.com",                              │
│     role: "student",                                            │
│     tenantId: "hospital-456",                                   │
│     permissions: [...]                                          │
│     sessionId: "sess_abc123"                                    │
│   },                                                            │
│   requestId: "req_xyz789",                                      │
│   ipAddress: "203.0.113.45",                                    │
│   userAgent: "Mozilla/5.0..."                                  │
│ }                                                               │
└────────────────────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────┐
│ PERMISSION CHECK                                                │
│                                                                 │
│ Required Permission: "application:view_own"                    │
│ User Permissions: ["document:upload", "application:create",    │
│                    "application:view_own", ...]                │
│                                                                 │
│ ✓ ALLOWED                                                       │
└────────────────────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────┐
│ EXECUTE HANDLER                                                 │
│ (Get application data, decrypt sensitive fields, return)        │
└────────────────────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────┐
│ AUDIT LOG ENTRY                                                 │
│ {                                                               │
│   action: "access:granted",                                    │
│   outcome: "success",                                          │
│   resourceType: "application",                                 │
│   resourceId: "app_123",                                       │
│   actorId: "student-123",                                      │
│   actorRole: "student",                                        │
│   permission: "application:view_own"                           │
│ }                                                               │
└────────────────────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ RETURN RESPONSE                     │
│ HTTP 200 OK                         │
│ {application data}                 │
│ + Security Headers                 │
└────────────────────────────────────┘
```

---

## 5. Alert Rule Triggering Example

```
┌─────────────────────────────────────────────────────────────┐
│ ALERT RULE: Excessive Document Decrypts                     │
│ - Action: document:decrypted                                │
│ - Time Window: 5 minutes                                    │
│ - Threshold: 10 decrypts                                    │
│ - Severity: warning                                         │
└─────────────────────────────────────────────────────────────┘

Timeline of Events:

10:00:00 - Decrypt doc_001 ✓ (count: 1)
10:00:15 - Decrypt doc_002 ✓ (count: 2)
10:00:30 - Decrypt doc_003 ✓ (count: 3)
10:01:00 - Decrypt doc_004 ✓ (count: 4)
10:02:00 - Decrypt doc_005 ✓ (count: 5)
10:02:30 - Decrypt doc_006 ✓ (count: 6)
10:03:00 - Decrypt doc_007 ✓ (count: 7)
10:03:30 - Decrypt doc_008 ✓ (count: 8)
10:04:00 - Decrypt doc_009 ✓ (count: 9)
10:04:20 - Decrypt doc_010 ✓ (count: 10)
                    │
                    ▼
        🚨 THRESHOLD REACHED!
        
        ALERT TRIGGERED:
        {
          ruleId: "excessive-decrypts",
          ruleName: "Excessive Document Decrypts",
          severity: "warning",
          triggeredBy: "aud_alert_001",
          actorId: "verifier-123",
          count: 10,
          threshold: 10,
          windowSeconds: 300,
          timestamp: "2026-01-22T10:04:20Z"
        }
        
        Notification Channels:
        - Email sent to security@medgate.example.com
        - Slack message to #security-alerts
        - Database record for audit trail

10:04:25 - Decrypt doc_011 ✓ (tracking reset)
```

---

## 6. Document Lifecycle Timeline

```
DAY 0: UPLOAD
─────────────────────────────────────────────────────────────────
  Student uploads: student_id.pdf
  │
  ├─ Encrypted with unique DEK
  ├─ Stored in S3 with SSE-KMS
  ├─ Wrapped DEK stored separately
  ├─ Document metadata in database
  └─ Status: PENDING_VERIFICATION
  
  Audit Log: document:upload_initiated


DAY 1-3: VERIFICATION
─────────────────────────────────────────────────────────────────
  MedGate Verifier reviews document
  │
  ├─ Decrypts document from S3
  ├─ Views student ID information
  ├─ Cross-checks with university database (optional)
  ├─ Makes verification decision
  └─ Status: VERIFIED or REJECTED
  
  Audit Logs:
  - document:viewed
  - document:decrypted
  - document:verified
  
  Creates VerificationAttestation:
  {
    id: "vat_001",
    documentId: "doc_abc123",
    verified: true,
    method: "manual_review",
    verifierId: "verifier-456",
    extractedData: {
      studentIdLast4: "3456",
      universityName: "University of Dubai"
    },
    contentHash: "sha256:abc123...",
    attestationHash: "sha256:xyz789...",
    verifiedAt: "2026-01-22T11:30:00Z"
  }


DAY 30: AUTO-DELETION
─────────────────────────────────────────────────────────────────
  Automated job runs
  │
  ├─ Find documents with expiresAt < today
  ├─ Delete encrypted document from S3
  ├─ Delete wrapped DEK from S3
  ├─ Mark document as deleted in database
  └─ VerificationAttestation RETAINED
  
  Audit Log: document:deleted (by SYSTEM)
  
  Result: Raw document permanently inaccessible


FOREVER: VERIFICATION PROOF RETAINED
─────────────────────────────────────────────────────────────────
  VerificationAttestation remains in database
  │
  ├─ Can verify document was legitimate
  ├─ Provides audit trail of verification
  ├─ Includes cryptographic proof (hash)
  ├─ Tamper-proof (can detect changes)
  └─ Hospital can trust result without seeing raw data
  
  Audit Log: Retained for 7+ years per compliance requirements
```

---

## 7. Key Rotation Process

```
OLD KEY STATE
──────────────────────────────────────────────────────────────────
  KEK (Key Encryption Key) in AWS KMS
  Rotation Date: 90 days ago
  Status: About to rotate


NEW KEY CREATED
──────────────────────────────────────────────────────────────────
  AWS KMS automatically creates new key version
  │
  ├─ New key material generated
  ├─ Old key version still accessible
  ├─ All future encryptions use new version
  └─ Status: Active


EXISTING DATA REMAINS ENCRYPTED
──────────────────────────────────────────────────────────────────
  Documents encrypted with old DEK + old KEK
  │
  ├─ Wrapped DEK stores KMS key ID
  ├─ On decrypt: AWS KMS recognizes old key
  ├─ Uses appropriate key version
  ├─ Decryption succeeds transparently
  └─ No re-encryption needed


RE-ENCRYPTION (OPTIONAL)
──────────────────────────────────────────────────────────────────
  For enhanced security, can trigger re-encryption:
  │
  ├─ For each document:
  │  ├─ Decrypt using old DEK/KEK
  │  ├─ Generate new DEK
  │  ├─ Wrap with new KEK version
  │  └─ Store new wrapped DEK
  │
  ├─ Operation is transparent:
  │  ├─ File content doesn't change
  │  ├─ Ciphertext may change (new IV, new DEK)
  │  └─ Audit log shows re-encryption
  │
  └─ Result: Data encrypted with latest keys


AUDIT TRAIL
──────────────────────────────────────────────────────────────────
  {
    action: "admin:key_rotated",
    timestamp: "2026-01-22T00:00:00Z",
    metadata: {
      oldKeyVersion: "1",
      newKeyVersion: "2",
      documentsReencrypted: 1250,
      duration: "2h 15m"
    }
  }
```

These diagrams show the complete security architecture in action.
