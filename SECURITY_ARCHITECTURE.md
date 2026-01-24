# MedGate Security Architecture

## Overview

This document describes the comprehensive encryption and security system for MedGate. The architecture follows industry best practices for handling sensitive medical/educational data with four security layers:

1. **Encryption in Transit** - TLS/HTTPS for all data movement
2. **Encryption at Rest** - Envelope encryption with AES-256-GCM
3. **Key Management** - KMS-backed keys with rotation
4. **Access Control** - RBAC with audit logging

## Architecture Decision: MedGate Verification Model

**Chosen Approach**: Verification happens on **MedGate's infrastructure** (recommended for faster adoption)

- MedGate holds keys via KMS and decrypts only inside the verification service
- Hospitals see verification results; they don't store raw documents
- Per-hospital tenant isolation via separate encryption keys

---

## 1. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              STUDENT DEVICE                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Browser/App                                                           │   │
│  │   1. Generate file hash (SHA-256) for integrity                      │   │
│  │   2. Request pre-signed upload URL from MedGate API                  │   │
│  │   3. Upload directly to S3 via pre-signed URL (TLS encrypted)        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ TLS 1.3 / HTTPS
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            MEDGATE BACKEND                                   │
│                                                                              │
│  ┌─────────────────────┐    ┌─────────────────────┐                         │
│  │   API Gateway       │───▶│ Auth Middleware     │                         │
│  │   (Rate Limiting)   │    │ (JWT + RBAC)        │                         │
│  └─────────────────────┘    └─────────────────────┘                         │
│                                      │                                       │
│           ┌──────────────────────────┼──────────────────────────┐           │
│           ▼                          ▼                          ▼           │
│  ┌────────────────┐       ┌────────────────────┐      ┌─────────────────┐  │
│  │ Document       │       │ Application        │      │ Verification    │  │
│  │ Service        │       │ Service            │      │ Service                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                │  │
│  │                │       │                    │      │                 │  │
│  │ - Pre-signed   │       │ - Field-level      │      │ - Decrypt docs  │  │
│  │   URL gen      │       │   encryption       │      │ - Verify ID     │  │
│  │ - Upload track │       │ - Sensitive data   │      │ - Generate      │  │
│  │ - Hash verify  │       │   protection       │      │   attestation   │  │
│  └────────────────┘       └────────────────────┘      └─────────────────┘  │
│           │                          │                          │           │
│           └──────────────────────────┼──────────────────────────┘           │
│                                      ▼                                       │
│                      ┌──────────────────────────────┐                       │
│                      │    Encryption Service        │                       │
│                      │                              │                       │
│                      │  - Envelope encryption       │                       │
│                      │  - DEK generation            │                       │
│                      │  - KEK wrapping via KMS      │                       │
│                      └──────────────────────────────┘                       │
│                                      │                                       │
│                                      ▼                                       │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌────────────────┐  │
│  │   AWS KMS           │    │   AWS Secrets       │    │ Audit Logger   │  │
│  │   (HSM-backed)      │    │   Manager           │    │                │  │
│  │                     │    │                     │    │ - Every access │  │
│  │ - Master Keys (KEK) │    │ - App secrets       │    │ - Decrypt logs │  │
│  │ - Per-tenant keys   │    │ - API keys          │    │ - Alerts       │  │
│  │ - Auto-rotation     │    │ - DB credentials    │    │                │  │
│  └─────────────────────┘    └─────────────────────┘    └────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA STORES                                     │
│                                                                              │
│  ┌─────────────────────────────┐    ┌───────────────────────────────────┐  │
│  │      AWS S3 Bucket          │    │      PostgreSQL (RDS)              │  │
│  │                             │    │                                    │  │
│  │  - SSE-KMS encryption       │    │  - Encryption at rest (RDS)       │  │
│  │  - Per-tenant prefix        │    │  - Field-level encryption (app)   │  │
│  │  - Lifecycle policies       │    │  - Connection SSL required        │  │
│  │  - Access logging           │    │                                    │  │
│  │                             │    │  ┌─────────────────────────────┐  │  │
│  │  /documents/                │    │  │ applications                │  │  │
│  │    /{hospital_id}/          │    │  │   - id, hospital_id         │  │  │
│  │      /{student_id}/         │    │  │   - status (plain)          │  │  │
│  │        /{doc_type}/         │    │  │   - student_id_enc (cipher) │  │  │
│  │          file.enc           │    │  │   - dob_enc (cipher)        │  │  │
│  │          file.enc.key       │    │  │   - wrapped_dek             │  │  │
│  │                             │    │  └─────────────────────────────┘  │  │
│  └─────────────────────────────┘    └───────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Encryption Scheme

### 2.1 Envelope Encryption

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENVELOPE ENCRYPTION                          │
│                                                                 │
│   ┌─────────────┐                                               │
│   │ Plaintext   │                                               │
│   │ Document    │                                               │
│   └──────┬──────┘                                               │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ AES-256-GCM Encryption                                  │  │
│   │                                                         │  │
│   │   DEK (Data Encryption Key) ──────────────────────┐     │  │
│   │     - 256-bit random key                          │     │  │
│   │     - Unique per document                         │     │  │
│   │                                                   │     │  │
│   │   IV/Nonce ──────────────────────────────────┐   │     │  │
│   │     - 96-bit random                          │   │     │  │
│   │                                              │   │     │  │
│   │   Auth Tag ─────────────────────────────┐   │   │     │  │
│   │     - 128-bit integrity tag             │   │   │     │  │
│   │                                         │   │   │     │  │
│   └─────────────────────────────────────────┼───┼───┼─────┘  │
│                                             │   │   │        │
│          ┌──────────────────────────────────┘   │   │        │
│          │                                      │   │        │
│          ▼                                      │   │        │
│   ┌─────────────┐                              │   │        │
│   │ Encrypted   │◀─────────────────────────────┴───┘        │
│   │ Document    │                                            │
│   └─────────────┘                                            │
│                                                              │
│          │                                                   │
│          │  DEK needs protection                            │
│          ▼                                                   │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ AWS KMS Encrypt                                      │   │
│   │                                                      │   │
│   │   KEK (Key Encryption Key) ───────────────────┐      │   │
│   │     - Stored in KMS (HSM-backed)              │      │   │
│   │     - Per-tenant (per-hospital)               │      │   │
│   │     - Auto-rotated every 90 days              │      │   │
│   │                                               │      │   │
│   │   Output: Wrapped DEK (ciphertext blob)       │      │   │
│   │                                               ▼      │   │
│   └───────────────────────────────────────────────┬──────┘   │
│                                                   │          │
│                                                   ▼          │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  STORED TOGETHER:                                    │   │
│   │                                                      │   │
│   │  1. Encrypted Document (ciphertext)                  │   │
│   │  2. IV/Nonce (96 bits, prepended to ciphertext)      │   │
│   │  3. Auth Tag (128 bits, appended to ciphertext)      │   │
│   │  4. Wrapped DEK (encrypted by KEK)                   │   │
│   │  5. KMS Key ID (which KEK was used)                  │   │
│   │                                                      │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Field-Level Encryption for Database

```typescript
// Encrypted field structure
interface EncryptedField {
  ciphertext: string;     // Base64 encoded encrypted value
  iv: string;             // Base64 encoded initialization vector
  authTag: string;        // Base64 encoded authentication tag
  wrappedDek: string;     // Base64 encoded KMS-wrapped DEK
  kmsKeyId: string;       // KMS key ARN used for wrapping
  encryptedAt: string;    // ISO timestamp
}

// Application record with selective encryption
interface ApplicationRecord {
  id: string;                           // Plain - needed for queries
  hospitalId: string;                   // Plain - needed for queries
  studentId: string;                    // Plain - internal reference
  status: string;                       // Plain - needed for filtering
  programId: string;                    // Plain - needed for queries
  
  // Encrypted sensitive fields
  studentIdNumber: EncryptedField;      // Government ID number
  dateOfBirth: EncryptedField;          // DOB
  passportNumber?: EncryptedField;      // If collected
  phoneNumber: EncryptedField;          // Contact info
  
  // Document references (not the documents themselves)
  documents: DocumentReference[];
  
  // Verification result (not encrypted - it's the "proof")
  verification: VerificationAttestation;
  
  createdAt: string;
  updatedAt: string;
}
```

---

## 3. Key Management

### 3.1 Key Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                      KEY HIERARCHY                              │
│                                                                 │
│  Level 1: Root Key (AWS managed, never exported)                │
│     │                                                           │
│     └─► Level 2: Tenant Master Keys (KEKs)                     │
│            │                                                    │
│            ├─► hospital-001-key                                │
│            │     └─► DEK for each document/field               │
│            │                                                    │
│            ├─► hospital-002-key                                │
│            │     └─► DEK for each document/field               │
│            │                                                    │
│            └─► medgate-internal-key                            │
│                  └─► DEK for internal data                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Key Rotation Policy

| Key Type | Rotation Period | Method |
|----------|-----------------|--------|
| KMS Master Key (KEK) | 90 days | Automatic via AWS KMS |
| Data Encryption Key (DEK) | Per-operation | New DEK for each encrypt |
| API Keys | 30 days | Manual rotation via Secrets Manager |
| JWT Signing Key | 7 days | Automatic rotation |

---

## 4. Access Control (RBAC)

### 4.1 Role Definitions

```typescript
enum Role {
  STUDENT = 'student',
  HOSPITAL_REVIEWER = 'hospital_reviewer',
  HOSPITAL_ADMIN = 'hospital_admin',
  MEDGATE_VERIFIER = 'medgate_verifier',
  MEDGATE_ADMIN = 'medgate_admin',
  SYSTEM = 'system'
}

// Permission matrix
const permissions = {
  // Document operations
  'document:upload': [Role.STUDENT],
  'document:view_own': [Role.STUDENT],
  'document:view_pending': [Role.MEDGATE_VERIFIER, Role.MEDGATE_ADMIN],
  'document:verify': [Role.MEDGATE_VERIFIER, Role.MEDGATE_ADMIN],
  'document:delete': [Role.SYSTEM], // Only automated cleanup
  
  // Application operations
  'application:create': [Role.STUDENT],
  'application:view_own': [Role.STUDENT],
  'application:view_hospital': [Role.HOSPITAL_REVIEWER, Role.HOSPITAL_ADMIN],
  'application:approve': [Role.HOSPITAL_ADMIN],
  'application:reject': [Role.HOSPITAL_ADMIN],
  
  // Verification results (not raw documents)
  'verification:view': [Role.HOSPITAL_REVIEWER, Role.HOSPITAL_ADMIN],
  
  // Audit
  'audit:view_own': [Role.STUDENT],
  'audit:view_hospital': [Role.HOSPITAL_ADMIN],
  'audit:view_all': [Role.MEDGATE_ADMIN],
  'audit:export': [Role.MEDGATE_ADMIN],
  
  // Admin
  'admin:manage_users': [Role.HOSPITAL_ADMIN, Role.MEDGATE_ADMIN],
  'admin:manage_keys': [Role.MEDGATE_ADMIN],
  'admin:view_metrics': [Role.HOSPITAL_ADMIN, Role.MEDGATE_ADMIN]
};
```

### 4.2 Access Decision Flow

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Request    │────▶│  Auth Middleware │────▶│  RBAC Check      │
│              │     │                 │     │                  │
│  - JWT Token │     │  - Validate JWT │     │  - Extract role  │
│  - Resource  │     │  - Check expiry │     │  - Check perms   │
│  - Action    │     │  - Get user ctx │     │  - Tenant match  │
└──────────────┘     └─────────────────┘     └──────────────────┘
                                                      │
                            ┌─────────────────────────┴─────────────┐
                            │                                       │
                            ▼                                       ▼
                     ┌──────────────┐                       ┌──────────────┐
                     │   ALLOWED    │                       │   DENIED     │
                     │              │                       │              │
                     │ Log: access  │                       │ Log: denied  │
                     │ Proceed      │                       │ Return 403   │
                     └──────────────┘                       └──────────────┘
```

---

## 5. Document Lifecycle

### 5.1 Privacy-Minimizing Storage

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DOCUMENT LIFECYCLE                                    │
│                                                                          │
│  DAY 0: Upload                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Student uploads: ID photo, enrollment letter, passport scan      │   │
│  │ → Encrypted with unique DEK                                      │   │
│  │ → Stored in S3 with tenant-specific prefix                       │   │
│  │ → Status: PENDING_VERIFICATION                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  DAY 1-3: Verification                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ MedGate verifier decrypts and reviews                            │   │
│  │ → Creates VerificationAttestation record                         │   │
│  │ → Extracts non-sensitive proof elements                          │   │
│  │ → Status: VERIFIED / REJECTED                                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  DAY 30: Document Deletion                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Automated job deletes raw documents                              │   │
│  │ → S3 lifecycle policy enforced                                   │   │
│  │ → Wrapped DEK deleted (docs become unrecoverable)                │   │
│  │ → Verification attestation RETAINED                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  RETAINED FOREVER (Proof Objects):                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ VerificationAttestation:                                         │   │
│  │   - verified: true                                               │   │
│  │   - verifiedAt: "2026-01-22T10:30:00Z"                          │   │
│  │   - verifierMethod: "manual_review"                              │   │
│  │   - studentIdLast4: "3456"                                       │   │
│  │   - documentHash: "sha256:abc123..."  (tamper-proof reference)   │   │
│  │   - expiresAt: null (proof is permanent)                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Audit Logging

### 6.1 Logged Events

| Event Category | Events | Retention |
|----------------|--------|-----------|
| Authentication | login, logout, token_refresh, login_failed | 2 years |
| Authorization | access_granted, access_denied | 2 years |
| Document | upload, view, verify, delete | 7 years |
| Encryption | encrypt, decrypt, key_access | 7 years |
| Admin | user_created, role_changed, export | 7 years |

### 6.2 Audit Log Schema

```typescript
interface AuditLogEntry {
  id: string;                    // Unique log ID
  timestamp: string;             // ISO 8601
  
  // Actor
  actorId: string;               // User ID
  actorRole: Role;               // Role at time of action
  actorIp: string;               // Client IP (hashed for privacy)
  actorUserAgent: string;        // Browser/client info
  
  // Action
  action: string;                // e.g., "document:decrypt"
  resourceType: string;          // e.g., "document", "application"
  resourceId: string;            // ID of affected resource
  
  // Context
  hospitalId?: string;           // Tenant context
  studentId?: string;            // Subject of action (if applicable)
  reasonCode?: string;           // Why action was taken
  
  // Outcome
  outcome: 'success' | 'failure' | 'denied';
  errorCode?: string;
  
  // Security
  sessionId: string;             // JWT session ID
  requestId: string;             // Correlation ID for tracing
}
```

### 6.3 Alert Triggers

| Condition | Alert Level | Action |
|-----------|-------------|--------|
| >10 decrypts by same user in 5 min | WARNING | Notify security team |
| >50 downloads in 1 hour from same IP | CRITICAL | Block + investigate |
| Access denied >5 times in 1 min | WARNING | Potential brute force |
| Key access outside business hours | INFO | Log for review |
| Bulk export initiated | INFO | Notify admins |

---

## 7. API Security

### 7.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    JWT AUTHENTICATION                           │
│                                                                 │
│  1. Login Request                                               │
│     POST /api/auth/login                                        │
│     { email, password }                                         │
│                                                                 │
│  2. Validate Credentials                                        │
│     - Check password hash (bcrypt, cost 12)                     │
│     - Check account status                                      │
│     - Verify MFA if enabled                                     │
│                                                                 │
│  3. Generate Tokens                                             │
│     - Access Token (15 min expiry)                              │
│       - Contains: userId, role, hospitalId, sessionId           │
│       - Signed with RS256 (asymmetric)                          │
│     - Refresh Token (7 days expiry)                             │
│       - Stored server-side                                      │
│       - HttpOnly cookie                                         │
│                                                                 │
│  4. Subsequent Requests                                         │
│     Authorization: Bearer <access_token>                        │
│     - Validate signature                                        │
│     - Check expiry                                              │
│     - Extract claims for RBAC                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 API Headers Required

```typescript
// Required headers for all API calls
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': "default-src 'self'; ...",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

---

## 8. Implementation Files

| File | Purpose |
|------|---------|
| `lib/security/crypto.ts` | AES-256-GCM encryption utilities |
| `lib/security/kms.ts` | AWS KMS client abstraction |
| `lib/security/envelope.ts` | Envelope encryption service |
| `lib/security/field-encryption.ts` | Field-level encryption |
| `lib/security/document-service.ts` | Secure document handling |
| `lib/security/audit.ts` | Audit logging service |
| `lib/security/rbac.ts` | Role-based access control |
| `lib/security/middleware.ts` | API authentication middleware |
| `lib/security/presigned-urls.ts` | S3 pre-signed URL generation |
| `lib/security/config.ts` | Security configuration |
| `lib/security/types.ts` | Security type definitions |

---

## 9. Compliance Checklist

✅ **Proper Encryption Claims:**

| Claim | Implementation |
|-------|----------------|
| TLS everywhere + HSTS | Security headers + Vercel/AWS defaults |
| Direct-to-storage uploads | Pre-signed S3 URLs |
| AES-256-GCM at rest | Envelope encryption |
| KMS-backed keys (HSM) | AWS KMS per-tenant keys |
| Per-hospital key separation | Tenant-specific KEKs |
| RBAC + least privilege | Permission matrix + middleware |
| Audit logs for every access | Comprehensive audit service |
| Automatic retention/deletion | S3 lifecycle + job |
| Signed verification attestations | Cryptographic proof objects |

---

## 10. Deployment Notes

### Environment Variables Required

```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx

# KMS Keys (per-tenant keys created via Terraform/CloudFormation)
KMS_ROOT_KEY_ARN=arn:aws:kms:us-east-1:xxx:key/xxx

# S3
S3_DOCUMENTS_BUCKET=medgate-documents-prod
S3_PRESIGNED_URL_EXPIRY=3600  # 1 hour

# Database
DATABASE_URL=postgresql://...
DATABASE_SSL_CA=/path/to/rds-ca.pem

# JWT
JWT_PRIVATE_KEY=xxx  # RSA private key (from Secrets Manager)
JWT_PUBLIC_KEY=xxx   # RSA public key
JWT_ACCESS_EXPIRY=900  # 15 minutes
JWT_REFRESH_EXPIRY=604800  # 7 days

# Security
AUDIT_LOG_LEVEL=info
RATE_LIMIT_WINDOW=60000  # 1 minute
RATE_LIMIT_MAX=100  # requests per window
```

### Infrastructure (AWS)

```hcl
# Simplified Terraform structure
- kms.tf          # KMS keys per tenant
- s3.tf           # Document bucket with SSE-KMS
- rds.tf          # PostgreSQL with encryption
- secrets.tf      # Secrets Manager entries
- iam.tf          # Service roles with least privilege
- cloudtrail.tf   # API audit logging
- cloudwatch.tf   # Metrics and alerts
```
