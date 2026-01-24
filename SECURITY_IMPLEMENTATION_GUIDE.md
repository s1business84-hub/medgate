# MedGate Security Implementation Guide

## Quick Start

The complete encryption and security system for MedGate has been implemented. This guide shows how to integrate it into your application.

## Installation & Setup

### 1. Add Required Dependencies

```bash
npm install @aws-sdk/client-kms @aws-sdk/client-s3 bcryptjs jsonwebtoken dotenv
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

### 2. Environment Configuration

Create a `.env.local` file:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key-id
AWS_SECRET_ACCESS_KEY=your-secret-key

# KMS Configuration
KMS_ROOT_KEY_ARN=arn:aws:kms:us-east-1:account-id:key/key-id

# S3 Configuration
S3_DOCUMENTS_BUCKET=medgate-documents-prod
S3_PRESIGNED_URL_EXPIRY=3600

# JWT Configuration
JWT_ISSUER=medgate
JWT_AUDIENCE=medgate-api
JWT_ACCESS_EXPIRY=900
JWT_REFRESH_EXPIRY=604800
JWT_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----

# Audit Configuration
AUDIT_LOG_LEVEL=info
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100

# Database
DATABASE_URL=postgresql://user:password@host/dbname
DATABASE_SSL_CA=/path/to/rds-ca.pem

# Deployment
NODE_ENV=production
```

### 3. Database Schema (PostgreSQL)

```sql
-- Applications with encrypted fields
CREATE TABLE applications (
  id VARCHAR PRIMARY KEY,
  hospital_id VARCHAR NOT NULL,
  student_id VARCHAR NOT NULL,
  program_id VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  
  -- Encrypted sensitive fields (JSON)
  student_id_number JSONB NOT NULL,  -- EncryptedField
  date_of_birth JSONB NOT NULL,       -- EncryptedField
  passport_number JSONB,              -- EncryptedField (optional)
  phone_number JSONB NOT NULL,        -- EncryptedField
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT applications_pkey PRIMARY KEY (id),
  CONSTRAINT applications_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

-- Document metadata
CREATE TABLE documents (
  id VARCHAR PRIMARY KEY,
  student_id VARCHAR NOT NULL,
  hospital_id VARCHAR NOT NULL,
  application_id VARCHAR NOT NULL,
  document_type VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  
  storage_key VARCHAR NOT NULL,
  original_filename VARCHAR NOT NULL,
  mime_type VARCHAR NOT NULL,
  size_bytes INTEGER NOT NULL,
  content_hash VARCHAR NOT NULL,
  
  kms_key_id VARCHAR NOT NULL,
  wrapped_dek_key VARCHAR NOT NULL,
  
  uploaded_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP,
  verified_by VARCHAR,
  expires_at TIMESTAMP,
  deleted_at TIMESTAMP,
  
  CONSTRAINT documents_pkey PRIMARY KEY (id),
  CONSTRAINT documents_application_id_fkey FOREIGN KEY (application_id) REFERENCES applications(id)
);

-- Verification attestations
CREATE TABLE verification_attestations (
  id VARCHAR PRIMARY KEY,
  document_id VARCHAR NOT NULL,
  application_id VARCHAR NOT NULL,
  student_id VARCHAR NOT NULL,
  hospital_id VARCHAR NOT NULL,
  
  verified BOOLEAN NOT NULL,
  method VARCHAR NOT NULL,
  verifier_id VARCHAR,
  verifier_role VARCHAR,
  
  extracted_data JSONB DEFAULT '{}',
  content_hash VARCHAR NOT NULL,
  attestation_hash VARCHAR NOT NULL,
  
  verified_at TIMESTAMP NOT NULL,
  attestation_created_at TIMESTAMP NOT NULL,
  
  CONSTRAINT attestations_pkey PRIMARY KEY (id),
  CONSTRAINT attestations_document_id_fkey FOREIGN KEY (document_id) REFERENCES documents(id)
);

-- Audit logs
CREATE TABLE audit_logs (
  id VARCHAR PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  
  actor_id VARCHAR NOT NULL,
  actor_role VARCHAR NOT NULL,
  actor_ip_hash VARCHAR,
  actor_user_agent VARCHAR,
  
  action VARCHAR NOT NULL,
  resource_type VARCHAR NOT NULL,
  resource_id VARCHAR,
  
  tenant_id VARCHAR,
  subject_id VARCHAR,
  reason_code VARCHAR,
  metadata JSONB DEFAULT '{}',
  
  outcome VARCHAR NOT NULL,
  error_code VARCHAR,
  error_message VARCHAR,
  
  session_id VARCHAR,
  request_id VARCHAR,
  
  severity VARCHAR NOT NULL,
  
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id)
);

-- Indexes for performance
CREATE INDEX idx_applications_hospital_id ON applications(hospital_id);
CREATE INDEX idx_applications_student_id ON applications(student_id);
CREATE INDEX idx_documents_application_id ON documents(application_id);
CREATE INDEX idx_documents_hospital_id ON documents(hospital_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_attestations_application_id ON verification_attestations(application_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

## Implementation Examples

### Example 1: Creating an Application with Encrypted Fields

```typescript
// app/api/applications/create/route.ts
import { 
  withPermission, 
  encryptApplicationFields,
  audit 
} from '@/lib/security';

export const POST = withPermission('application:create', async (request, context) => {
  const body = await request.json();

  // Encrypt sensitive fields
  const encryptedData = await encryptApplicationFields(
    body,
    context.user.tenantId || 'default'
  );

  // Save to database
  // const result = await db.applications.create(encryptedData);

  // Log the creation
  await audit({
    action: 'application:created',
    outcome: 'success',
    resourceType: 'application',
    resourceId: encryptedData.id,
    context,
    metadata: { programId: body.programId },
  });

  return NextResponse.json({ applicationId: encryptedData.id });
});
```

### Example 2: Document Upload with Pre-signed URL

```typescript
// app/api/documents/get-upload-url/route.ts
import { 
  withAuth, 
  generateDocumentUploadUrl,
  validateDocumentUpload 
} from '@/lib/security';

export const POST = withAuth(async (request, context) => {
  const { documentType, filename, mimeType, sizeBytes } = await request.json();

  // Validate
  const validation = validateDocumentUpload(documentType, mimeType, sizeBytes);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // Generate pre-signed URL
  const result = await generateDocumentUploadUrl({
    tenantId: context.user.tenantId || 'default',
    studentId: context.user.id,
    documentType,
    filename,
    mimeType,
    sizeBytes,
  });

  return NextResponse.json(result);
});
```

### Example 3: Document Verification

```typescript
// app/api/documents/verify/route.ts
import { 
  withPermission, 
  createVerificationAttestation,
  auditDocumentAccess 
} from '@/lib/security';

export const POST = withPermission('document:verify', async (request, context) => {
  const { documentId, verified, extractedData } = await request.json();

  // Create attestation
  const attestation = await createVerificationAttestation({
    documentId,
    applicationId: 'app_xxx',
    studentId: 'student_xxx',
    hospitalId: context.user.tenantId || 'default',
    verified,
    method: 'manual_review',
    verifierId: context.user.id,
    verifierRole: context.user.role,
    contentHash: 'sha256:...',
    extractedData,
  });

  // Log verification
  await auditDocumentAccess(
    verified ? 'document:verified' : 'document:rejected',
    documentId,
    'success',
    context
  );

  return NextResponse.json({ success: true, attestation });
});
```

### Example 4: Secure Application Retrieval

```typescript
// app/api/applications/[id]/route.ts
import { 
  withAuth, 
  decryptApplicationFields,
  checkTenantAccess,
  audit 
} from '@/lib/security';

export const GET = withAuth(async (request, context) => {
  const applicationId = new URL(request.url).pathname.split('/').pop();

  // Get from database
  // const application = await db.applications.findById(applicationId);

  // Check access
  if (!checkTenantAccess(context.user, application.hospital_id)) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  // Decrypt sensitive fields
  const decrypted = await decryptApplicationFields(
    application,
    context.user.tenantId || 'default'
  );

  // Log access
  await audit({
    action: 'application:viewed' as never,
    outcome: 'success',
    resourceType: 'application',
    resourceId: applicationId,
    context,
  });

  return NextResponse.json(decrypted);
});
```

## Security Checklist Before Production

- [ ] All environment variables configured
- [ ] AWS KMS keys created and rotated
- [ ] Database encryption at rest enabled (RDS)
- [ ] SSL/TLS certificates installed
- [ ] JWT private/public keys generated and secured
- [ ] S3 bucket SSE-KMS enabled
- [ ] CloudTrail logging enabled
- [ ] Database backups encrypted and stored securely
- [ ] Rate limiting tested
- [ ] Audit logs verified and monitored
- [ ] CORS properly configured
- [ ] HSTS enabled
- [ ] Security headers verified
- [ ] Password requirements enforced
- [ ] MFA enabled for admin accounts
- [ ] Penetration testing completed
- [ ] Security audit completed

## Monitoring & Operations

### Audit Log Querying

```typescript
// Query recent failed authentications
const failedLogins = await auditLogger.query({
  action: 'auth:login_failed',
  startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  limit: 100,
});

// Check document access patterns
const decrypts = await auditLogger.query({
  action: 'document:decrypted',
  startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
});

// Get resource audit history
const summary = await auditLogger.getResourceAuditSummary('document', documentId);
```

### Health Check Endpoint

```typescript
// app/api/health/crypto/route.ts
import { getKMSClient, securityConfig } from '@/lib/security';

export async function GET() {
  const kms = getKMSClient();
  const keyValid = await kms.validateKey(securityConfig.kms.rootKeyArn);
  
  return NextResponse.json({
    status: keyValid ? 'healthy' : 'unhealthy',
    kms: keyValid ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
}
```

## Cost Optimization

- KMS API calls: Use batch operations where possible
- S3 Storage: Implement lifecycle policies for document deletion
- CloudWatch Logs: Set retention policies on audit logs
- Database: Monitor query performance with slow query logs

## Troubleshooting

### Common Issues

**KMS Key Access Denied**
- Verify IAM role has `kms:Decrypt`, `kms:GenerateDataKey` permissions
- Check key policy allows the service principal

**Decryption Failures**
- Verify encryption context matches (tenant ID, data type)
- Check wrapped DEK is stored alongside ciphertext
- Ensure KMS key hasn't been deleted or disabled

**S3 Upload URL Expiration**
- Increase `S3_PRESIGNED_URL_EXPIRY` environment variable
- Ensure time is synchronized between servers

## Further Reading

- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md) - Complete architecture documentation
- AWS KMS Best Practices: https://docs.aws.amazon.com/kms/latest/developerguide/best-practices.html
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- HIPAA Security Rule: https://www.hhs.gov/hipaa/for-professionals/security/index.html

## Support

For security issues, please follow responsible disclosure:
1. Do not open public GitHub issues
2. Email security@medgate.example.com
3. Allow 90 days for fix before public disclosure
