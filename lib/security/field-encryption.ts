/**
 * MedGate Field-Level Encryption
 * 
 * Encrypts sensitive fields in database records while keeping
 * non-sensitive fields in plaintext for querying.
 * 
 * Example:
 *   studentIdNumber: "123456789" → EncryptedField
 *   status: "pending" → "pending" (unchanged)
 */

import { EncryptedField, EncryptionContext } from './types';
import { sensitiveFields, isSensitiveField } from './config';
import {
  envelopeEncrypt,
  envelopeDecryptToString,
  getEnvelopeEncryptionService,
} from './envelope';
import { stringToUint8Array, uint8ArrayToString } from './crypto';

// ============================================================================
// FIELD ENCRYPTION SERVICE
// ============================================================================

export class FieldEncryptionService {
  /**
   * Encrypt a single field value
   */
  async encryptField(
    value: string,
    tenantId: string,
    fieldName: string,
    resourceId?: string
  ): Promise<EncryptedField> {
    const context: Partial<EncryptionContext> = {
      dataType: 'field',
      resourceId,
    };

    const envelope = await envelopeEncrypt(value, tenantId, context);

    return {
      ciphertext: envelope.ciphertext,
      iv: envelope.iv,
      authTag: envelope.authTag,
      wrappedDek: envelope.wrappedDek,
      kmsKeyId: envelope.kmsKeyId,
      encryptedAt: envelope.encryptedAt,
    };
  }

  /**
   * Decrypt a single encrypted field
   */
  async decryptField(
    encryptedField: EncryptedField,
    tenantId: string,
    resourceId?: string
  ): Promise<string> {
    const context: Partial<EncryptionContext> = {
      dataType: 'field',
      resourceId,
    };

    // Convert EncryptedField to EncryptedEnvelope
    const envelope = {
      ciphertext: encryptedField.ciphertext,
      iv: encryptedField.iv,
      authTag: encryptedField.authTag,
      wrappedDek: encryptedField.wrappedDek,
      kmsKeyId: encryptedField.kmsKeyId,
      algorithm: 'AES-256-GCM' as const,
      encryptedAt: encryptedField.encryptedAt,
      version: 1,
    };

    return envelopeDecryptToString(envelope, tenantId, context);
  }

  /**
   * Encrypt all sensitive fields in an object
   * 
   * @param data - Object with potentially sensitive fields
   * @param entityType - Type of entity (application, student, user)
   * @param tenantId - Tenant ID for encryption
   * @param resourceId - Optional resource ID for context
   * @returns Object with sensitive fields encrypted
   */
  async encryptSensitiveFields<T extends Record<string, unknown>>(
    data: T,
    entityType: keyof typeof sensitiveFields,
    tenantId: string,
    resourceId?: string
  ): Promise<T> {
    const result = { ...data };

    for (const [key, value] of Object.entries(data)) {
      if (
        isSensitiveField(entityType, key) &&
        typeof value === 'string' &&
        value.length > 0
      ) {
        (result as Record<string, unknown>)[key] = await this.encryptField(
          value,
          tenantId,
          key,
          resourceId
        );
      }
    }

    return result;
  }

  /**
   * Decrypt all encrypted fields in an object
   * 
   * @param data - Object with potentially encrypted fields
   * @param tenantId - Tenant ID for decryption
   * @param resourceId - Optional resource ID for context
   * @returns Object with encrypted fields decrypted
   */
  async decryptSensitiveFields<T extends Record<string, unknown>>(
    data: T,
    tenantId: string,
    resourceId?: string
  ): Promise<T> {
    const result = { ...data };

    for (const [key, value] of Object.entries(data)) {
      if (this.isEncryptedField(value)) {
        (result as Record<string, unknown>)[key] = await this.decryptField(
          value as EncryptedField,
          tenantId,
          resourceId
        );
      }
    }

    return result;
  }

  /**
   * Check if a value is an encrypted field
   */
  isEncryptedField(value: unknown): value is EncryptedField {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const obj = value as Record<string, unknown>;
    return (
      typeof obj.ciphertext === 'string' &&
      typeof obj.iv === 'string' &&
      typeof obj.authTag === 'string' &&
      typeof obj.wrappedDek === 'string' &&
      typeof obj.kmsKeyId === 'string'
    );
  }

  /**
   * Create a masked version of a value (e.g., "****3456" for last 4)
   */
  maskValue(value: string, showLast: number = 4): string {
    if (value.length <= showLast) {
      return '*'.repeat(value.length);
    }
    const masked = '*'.repeat(value.length - showLast);
    const visible = value.slice(-showLast);
    return masked + visible;
  }

  /**
   * Extract last N characters for verification proof
   */
  extractLastN(value: string, n: number = 4): string {
    if (value.length <= n) {
      return value;
    }
    return value.slice(-n);
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let fieldEncryptionInstance: FieldEncryptionService | null = null;

export function getFieldEncryptionService(): FieldEncryptionService {
  if (!fieldEncryptionInstance) {
    fieldEncryptionInstance = new FieldEncryptionService();
  }
  return fieldEncryptionInstance;
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Encrypt a single field value
 */
export async function encryptField(
  value: string,
  tenantId: string,
  fieldName: string,
  resourceId?: string
): Promise<EncryptedField> {
  return getFieldEncryptionService().encryptField(value, tenantId, fieldName, resourceId);
}

/**
 * Decrypt a single encrypted field
 */
export async function decryptField(
  encryptedField: EncryptedField,
  tenantId: string,
  resourceId?: string
): Promise<string> {
  return getFieldEncryptionService().decryptField(encryptedField, tenantId, resourceId);
}

/**
 * Check if a value is an encrypted field
 */
export function isEncryptedField(value: unknown): value is EncryptedField {
  return getFieldEncryptionService().isEncryptedField(value);
}

// ============================================================================
// ENCRYPTED RECORD HELPERS
// ============================================================================

/**
 * Type helper to mark which fields are encrypted in a record type
 * 
 * Usage:
 *   type EncryptedApplication = WithEncryptedFields<Application, 'studentIdNumber' | 'dateOfBirth'>;
 */
export type WithEncryptedFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[P] extends string ? EncryptedField : T[P];
};

/**
 * Type helper to mark which fields are decrypted (string) in a record type
 */
export type WithDecryptedFields<T> = {
  [K in keyof T]: T[K] extends EncryptedField ? string : T[K];
};

// ============================================================================
// APPLICATION-SPECIFIC ENCRYPTION
// ============================================================================

/**
 * Fields to encrypt in an application record
 */
export const applicationSensitiveFields = [
  'studentIdNumber',
  'dateOfBirth',
  'passportNumber',
  'phoneNumber',
  'emergencyContactPhone',
] as const;

export type ApplicationSensitiveField = typeof applicationSensitiveFields[number];

/**
 * Encrypt sensitive fields in an application record
 */
export async function encryptApplicationFields<T extends Record<string, unknown>>(
  application: T,
  tenantId: string
): Promise<T> {
  const service = getFieldEncryptionService();
  return service.encryptSensitiveFields(
    application,
    'application',
    tenantId,
    (application as { id?: string }).id
  );
}

/**
 * Decrypt sensitive fields in an application record
 */
export async function decryptApplicationFields<T extends Record<string, unknown>>(
  application: T,
  tenantId: string
): Promise<T> {
  const service = getFieldEncryptionService();
  return service.decryptSensitiveFields(
    application,
    tenantId,
    (application as { id?: string }).id
  );
}

// ============================================================================
// STUDENT-SPECIFIC ENCRYPTION
// ============================================================================

/**
 * Fields to encrypt in a student record
 */
export const studentSensitiveFields = [
  'studentIdNumber',
  'dateOfBirth',
  'passportNumber',
  'phoneNumber',
  'address',
] as const;

export type StudentSensitiveField = typeof studentSensitiveFields[number];

/**
 * Encrypt sensitive fields in a student record
 */
export async function encryptStudentFields<T extends Record<string, unknown>>(
  student: T,
  tenantId: string
): Promise<T> {
  const service = getFieldEncryptionService();
  return service.encryptSensitiveFields(
    student,
    'student',
    tenantId,
    (student as { id?: string }).id
  );
}

/**
 * Decrypt sensitive fields in a student record
 */
export async function decryptStudentFields<T extends Record<string, unknown>>(
  student: T,
  tenantId: string
): Promise<T> {
  const service = getFieldEncryptionService();
  return service.decryptSensitiveFields(
    student,
    tenantId,
    (student as { id?: string }).id
  );
}
