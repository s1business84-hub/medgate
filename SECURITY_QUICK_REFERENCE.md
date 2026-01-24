# MedGate Security Quick Reference

## Import Everything You Need

```typescript
import {
  // Types
  Role,
  type EncryptedField,
  type DocumentMetadata,
  type AuditLogEntry,
  
  // Authentication & Access Control
  withAuth,
  withPermission,
  withRole,
  checkTenantAccess,
  createJwt,
  
  // Encryption
  envelopeEncrypt,
  envelopeDecrypt,
  encryptField,
  decryptField,
  encryptApplicationFields,
  decryptApplicationFields,
  
  // Documents
  generateDocumentUploadUrl,
  createVerificationAttestation,
  
  // Audit
  audit,
  auditAuth,
  auditDocumentAccess,
  auditEncryption,
  auditAccessControl,
  
  // Configuration
  hasPermission,
  validateDocumentUpload,
  securityConfig,
} from '@/lib/security';
```

## Common Patterns

### Protect an API Route

```typescript
// Require authentication
export const GET = withAuth(handler);

// Require permission
export const POST = withPermission('document:upload', handler);

// Require specific role
export const DELETE = withRole([Role.MEDGATE_ADMIN], handler);

// Combine: auth + permission + rate limit
export const POST = withRateLimit(
  withPermission('application:create', handler)
);
```

### Encrypt/Decrypt Data

```typescript
// Encrypt
const encrypted = await encryptApplicationFields(data, tenantId);

// Decrypt
const decrypted = await decryptApplicationFields(encrypted, tenantId);

// Check if something is encrypted
if (isEncryptedField(value)) {
  const plain = await decryptField(value, tenantId);
}
```

### Handle Documents

```typescript
// Generate upload URL (client-side direct to S3)
const { uploadUrl } = await generateDocumentUploadUrl({
  tenantId: context.user.tenantId,
  studentId: context.user.id,
  documentType: 'student_id',
  filename: 'my-id.pdf',
  mimeType: 'application/pdf',
  sizeBytes: 50000,
});

// Create verification proof
await createVerificationAttestation({
  documentId: 'doc_xxx',
  applicationId: 'app_xxx',
  studentId: 'student_xxx',
  hospitalId: context.user.tenantId,
  verified: true,
  method: 'manual_review',
  verifierId: context.user.id,
  verifierRole: context.user.role,
  contentHash: 'sha256:abc123...',
  extractedData: {
    studentIdLast4: '3456',
    universityName: 'University of Dubai'
  }
});
```

### Audit Events

```typescript
// Generic audit
await audit({
  action: 'application:created',
  outcome: 'success',
  resourceType: 'application',
  resourceId: appId,
  context,
  metadata: { programId },
});

// Auth audit
await auditAuth('auth:login', 'success', context);

// Document access audit
await auditDocumentAccess('document:verified', docId, 'success', context);

// Encryption audit
await auditEncryption('encryption:data_decrypted', 'document', docId, 'success', context);

// Access control audit
await auditAccessControl('denied', 'document', docId, context, 'document:verify');
```

### Check Permissions

```typescript
// Check if user has permission
if (hasPermission(context.user, 'document:verify')) {
  // Allow verification
}

// Check tenant access
if (!checkTenantAccess(context.user, resourceTenantId)) {
  return NextResponse.json({ error: 'Access denied' }, { status: 403 });
}
```

## Roles & Permissions

| Role | Use Case |
|------|----------|
| `STUDENT` | Students uploading documents, viewing own applications |
| `HOSPITAL_REVIEWER` | Hospital staff reviewing verification results |
| `HOSPITAL_ADMIN` | Hospital admin managing users and approving applications |
| `MEDGATE_VERIFIER` | MedGate staff verifying documents |
| `MEDGATE_ADMIN` | MedGate administrators managing system |
| `SYSTEM` | Automated jobs (cleanup, rotation) |

### Common Permission Checks

```typescript
// Can upload documents?
hasPermission(user, 'document:upload')

// Can verify documents?
hasPermission(user, 'document:verify')

// Can view all applications?
hasPermission(user, 'application:view_hospital')

// Can export data?
hasPermission(user, 'audit:export')

// Can manage users?
hasPermission(user, 'admin:manage_users')

// Can manage encryption keys?
hasPermission(user, 'admin:manage_keys')
```

## Configuration

### Security Headers (automatically applied)

```typescript
// Import and apply to responses
import { applySecurityHeaders } from '@/lib/security';

const response = NextResponse.json(data);
return applySecurityHeaders(response);
```

### Validate Document Upload

```typescript
import { validateDocumentUpload } from '@/lib/security';

const validation = validateDocumentUpload('student_id', 'application/pdf', 5000000);
if (!validation.valid) {
  return NextResponse.json({ error: validation.error }, { status: 400 });
}
```

### Check Environment

```typescript
import { validateEnvironment, isDevelopment, isProduction } from '@/lib/security';

const { valid, missing } = validateEnvironment();
if (!valid) {
  console.error('Missing environment variables:', missing);
}

if (isDevelopment()) {
  // Use mock implementations
}

if (isProduction()) {
  // Enforce strict security
}
```

## Authentication

### Create JWT Token

```typescript
import { createJwt, Role } from '@/lib/security';

const token = await createJwt(
  userId,
  Role.STUDENT,
  hospitalId,
  'access'  // access or refresh
);
```

### Authenticate Request

```typescript
import { authenticateRequest } from '@/lib/security';

const context = await authenticateRequest(request);
console.log(context.user.id);
console.log(context.user.role);
console.log(context.user.permissions);
```

## Testing with Mock Data

### Create Mock Auth Context

```typescript
import { createMockAuthContext, Role } from '@/lib/security';

// Student context
const studentContext = createMockAuthContext(Role.STUDENT);

// Admin context  
const adminContext = createMockAuthContext(Role.MEDGATE_ADMIN);

// Custom context
const customContext = createMockAuthContext(
  Role.HOSPITAL_ADMIN,
  'hospital-123'
);
```

## Development Mode

In development, the security system uses:
- **MockKMSClient** (keys not real HSM)
- **Simplified JWT verification**
- **Console-based audit logging**
- **No rate limiting**

```bash
NODE_ENV=development npm run dev
```

In production:
- **AWSKMSClient** (real KMS HSM)
- **Strict JWT signature verification**
- **CloudWatch/Database audit logging**
- **Full rate limiting enforced**

```bash
NODE_ENV=production npm start
```

## Environment Variables Needed

```env
# AWS
AWS_REGION=us-east-1
KMS_ROOT_KEY_ARN=arn:aws:kms:us-east-1:xxx:key/xxx
S3_DOCUMENTS_BUCKET=medgate-documents

# JWT
JWT_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----...
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----...

# Database
DATABASE_URL=postgresql://user:pass@host/db
```

## Rate Limiting

```typescript
import { checkRateLimit, withRateLimit } from '@/lib/security';

// Check manually
const { allowed, remaining, resetTime } = checkRateLimit(userId, endpoint);
if (!allowed) {
  // Rate limited
}

// Automatic with middleware
export const POST = withRateLimit(
  withPermission('document:upload', handler)
);
```

## Debugging

### Check Current User Permissions

```typescript
import { getPermissions, Role } from '@/lib/security';

const studentPermissions = getPermissions(Role.STUDENT);
console.log(studentPermissions);
// ['document:upload', 'document:view_own', 'application:create', ...]
```

### Verify Encrypted Field

```typescript
import { isEncryptedField } from '@/lib/security';

if (isEncryptedField(fieldValue)) {
  console.log('This field is encrypted');
  const decrypted = await decryptField(fieldValue, tenantId);
}
```

### Check KMS Connection

```typescript
import { getKMSClient, securityConfig } from '@/lib/security';

const kms = getKMSClient();
const isHealthy = await kms.validateKey(securityConfig.kms.rootKeyArn);
console.log(isHealthy ? 'KMS is accessible' : 'KMS connection failed');
```

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `AUTHENTICATION_ERROR` | Missing/invalid JWT | Check Authorization header |
| `AUTHORIZATION_ERROR` | Missing permission | Grant user required permission |
| `DECRYPTION_ERROR` | Data corrupted/tampered | Verify encryption context matches |
| `TENANT_ACCESS_DENIED` | Accessing another tenant | Check tenant isolation |
| `RATE_LIMITED` | Too many requests | Wait for window to reset |
| `KEY_MANAGEMENT_ERROR` | KMS unreachable | Check AWS credentials/network |

## API Response Format

### Success

```json
{
  "data": { ... }
}
```

### Error

```json
{
  "error": "Human-readable message",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

### With Security Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

## Need More Help?

- **Architecture**: See `SECURITY_ARCHITECTURE.md`
- **Integration**: See `SECURITY_IMPLEMENTATION_GUIDE.md`
- **Examples**: Check `app/api/secure/*.ts`
- **API Docs**: See `lib/security/index.ts`
