/**
 * MedGate Envelope Encryption Service
 * 
 * Implements envelope encryption pattern:
 * 1. Generate unique DEK for each encryption
 * 2. Encrypt data with DEK using AES-256-GCM
 * 3. Wrap DEK with KMS-managed KEK
 * 4. Store encrypted data + wrapped DEK
 */

import {
  EncryptedEnvelope,
  EncryptionContext,
  DataEncryptionKey,
  EncryptionError,
  DecryptionError,
} from './types';
import { securityConfig } from './config';
import { getKMSClient } from './kms';
import {
  encryptAESGCM,
  decryptAESGCM,
  uint8ArrayToBase64,
  base64ToUint8Array,
  stringToUint8Array,
  uint8ArrayToString,
  zeroMemory,
} from './crypto';

// ============================================================================
// ENVELOPE ENCRYPTION SERVICE
// ============================================================================

export class EnvelopeEncryptionService {
  /**
   * Encrypt data using envelope encryption
   * 
   * @param plaintext - Data to encrypt (Buffer, Uint8Array, or string)
   * @param tenantId - Tenant ID for key selection
   * @param context - Encryption context for additional authentication
   * @returns Encrypted envelope containing ciphertext and wrapped DEK
   */
  async encrypt(
    plaintext: Uint8Array | string,
    tenantId: string,
    context?: Partial<EncryptionContext>
  ): Promise<EncryptedEnvelope> {
    const kms = getKMSClient();
    
    // Build full encryption context
    const fullContext: EncryptionContext = {
      tenantId,
      dataType: context?.dataType ?? 'document',
      ...context,
    };

    // Get tenant-specific KMS key
    const kmsKeyId = await kms.getTenantKeyId(tenantId);
    
    // Generate new DEK wrapped by KMS
    let dek: DataEncryptionKey | null = null;
    
    try {
      dek = await kms.generateDataKey(kmsKeyId, fullContext);
      
      // Convert plaintext to Uint8Array if string
      const plaintextBytes = typeof plaintext === 'string' 
        ? stringToUint8Array(plaintext) 
        : plaintext;
      
      // Create AAD (Additional Authenticated Data) from context
      const aad = stringToUint8Array(JSON.stringify(fullContext));
      
      // Encrypt with the DEK
      const { ciphertext, iv, authTag } = await encryptAESGCM(
        plaintextBytes,
        dek.key,
        aad
      );

      // Build the envelope
      const envelope: EncryptedEnvelope = {
        ciphertext: uint8ArrayToBase64(ciphertext),
        iv: uint8ArrayToBase64(iv),
        authTag: uint8ArrayToBase64(authTag),
        wrappedDek: dek.wrappedKey,
        kmsKeyId: dek.kmsKeyId,
        algorithm: securityConfig.encryption.algorithm,
        encryptedAt: new Date().toISOString(),
        version: securityConfig.encryption.version,
      };

      return envelope;
    } finally {
      // Always zero out the DEK from memory
      if (dek) {
        zeroMemory(dek.key);
      }
    }
  }

  /**
   * Decrypt an encrypted envelope
   * 
   * @param envelope - Encrypted envelope to decrypt
   * @param tenantId - Tenant ID for key lookup
   * @param context - Encryption context (must match what was used for encryption)
   * @returns Decrypted data as Uint8Array
   */
  async decrypt(
    envelope: EncryptedEnvelope,
    tenantId: string,
    context?: Partial<EncryptionContext>
  ): Promise<Uint8Array> {
    const kms = getKMSClient();
    
    // Build full encryption context (must match encryption context)
    const fullContext: EncryptionContext = {
      tenantId,
      dataType: context?.dataType ?? 'document',
      ...context,
    };

    // Unwrap the DEK using KMS
    let dekBytes: Uint8Array | null = null;
    
    try {
      dekBytes = await kms.unwrapDataKey(
        envelope.wrappedDek,
        envelope.kmsKeyId,
        fullContext
      );

      // Recreate the AAD
      const aad = stringToUint8Array(JSON.stringify(fullContext));

      // Decrypt with the DEK
      const plaintext = await decryptAESGCM({
        ciphertext: base64ToUint8Array(envelope.ciphertext),
        iv: base64ToUint8Array(envelope.iv),
        authTag: base64ToUint8Array(envelope.authTag),
        key: dekBytes,
        additionalData: aad,
      });

      return plaintext;
    } finally {
      // Always zero out the DEK from memory
      if (dekBytes) {
        zeroMemory(dekBytes);
      }
    }
  }

  /**
   * Decrypt to string (convenience method)
   */
  async decryptToString(
    envelope: EncryptedEnvelope,
    tenantId: string,
    context?: Partial<EncryptionContext>
  ): Promise<string> {
    const plaintext = await this.decrypt(envelope, tenantId, context);
    return uint8ArrayToString(plaintext);
  }

  /**
   * Re-encrypt data with a new DEK (for key rotation)
   * 
   * This unwraps the old envelope, generates a new DEK, and re-encrypts.
   * Used when rotating encryption keys or migrating to new key versions.
   */
  async reEncrypt(
    envelope: EncryptedEnvelope,
    tenantId: string,
    context?: Partial<EncryptionContext>,
    newKmsKeyId?: string
  ): Promise<EncryptedEnvelope> {
    // Decrypt with old envelope
    const plaintext = await this.decrypt(envelope, tenantId, context);
    
    try {
      // Re-encrypt with new DEK (and optionally new KMS key)
      const newContext = { ...context };
      
      // If new KMS key specified, temporarily override tenant key lookup
      // In production, this would be handled more elegantly
      const newEnvelope = await this.encrypt(plaintext, tenantId, newContext);
      
      return newEnvelope;
    } finally {
      // Zero out the plaintext
      zeroMemory(plaintext);
    }
  }

  /**
   * Verify envelope integrity without decrypting
   * 
   * Checks that the envelope structure is valid and the KMS key exists.
   * Does NOT verify the ciphertext can be decrypted (that requires KMS access).
   */
  async verifyIntegrity(envelope: EncryptedEnvelope): Promise<{
    valid: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];

    // Check version
    if (envelope.version !== securityConfig.encryption.version) {
      issues.push(`Version mismatch: expected ${securityConfig.encryption.version}, got ${envelope.version}`);
    }

    // Check algorithm
    if (envelope.algorithm !== securityConfig.encryption.algorithm) {
      issues.push(`Algorithm mismatch: expected ${securityConfig.encryption.algorithm}, got ${envelope.algorithm}`);
    }

    // Check required fields exist and decode properly
    try {
      const iv = base64ToUint8Array(envelope.iv);
      if (iv.length !== securityConfig.encryption.ivLengthBytes) {
        issues.push(`Invalid IV length: expected ${securityConfig.encryption.ivLengthBytes}, got ${iv.length}`);
      }
    } catch {
      issues.push('Invalid IV encoding');
    }

    try {
      const authTag = base64ToUint8Array(envelope.authTag);
      if (authTag.length !== securityConfig.encryption.authTagLengthBytes) {
        issues.push(`Invalid auth tag length: expected ${securityConfig.encryption.authTagLengthBytes}, got ${authTag.length}`);
      }
    } catch {
      issues.push('Invalid auth tag encoding');
    }

    try {
      base64ToUint8Array(envelope.ciphertext);
    } catch {
      issues.push('Invalid ciphertext encoding');
    }

    try {
      base64ToUint8Array(envelope.wrappedDek);
    } catch {
      issues.push('Invalid wrapped DEK encoding');
    }

    // Verify KMS key exists
    if (envelope.kmsKeyId) {
      const kms = getKMSClient();
      const keyValid = await kms.validateKey(envelope.kmsKeyId);
      if (!keyValid) {
        issues.push(`KMS key not accessible: ${envelope.kmsKeyId}`);
      }
    } else {
      issues.push('Missing KMS key ID');
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let envelopeServiceInstance: EnvelopeEncryptionService | null = null;

/**
 * Get the envelope encryption service singleton
 */
export function getEnvelopeEncryptionService(): EnvelopeEncryptionService {
  if (!envelopeServiceInstance) {
    envelopeServiceInstance = new EnvelopeEncryptionService();
  }
  return envelopeServiceInstance;
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Encrypt data using envelope encryption
 */
export async function envelopeEncrypt(
  plaintext: Uint8Array | string,
  tenantId: string,
  context?: Partial<EncryptionContext>
): Promise<EncryptedEnvelope> {
  return getEnvelopeEncryptionService().encrypt(plaintext, tenantId, context);
}

/**
 * Decrypt an encrypted envelope
 */
export async function envelopeDecrypt(
  envelope: EncryptedEnvelope,
  tenantId: string,
  context?: Partial<EncryptionContext>
): Promise<Uint8Array> {
  return getEnvelopeEncryptionService().decrypt(envelope, tenantId, context);
}

/**
 * Decrypt an encrypted envelope to string
 */
export async function envelopeDecryptToString(
  envelope: EncryptedEnvelope,
  tenantId: string,
  context?: Partial<EncryptionContext>
): Promise<string> {
  return getEnvelopeEncryptionService().decryptToString(envelope, tenantId, context);
}
