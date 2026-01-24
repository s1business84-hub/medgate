/**
 * MedGate KMS Client
 * 
 * Abstraction layer for AWS KMS operations.
 * Handles key wrapping/unwrapping for envelope encryption.
 * 
 * In development mode, provides a mock implementation.
 */

import { 
  DataEncryptionKey, 
  EncryptionContext, 
  KeyManagementError 
} from './types';
import { securityConfig, isDevelopment } from './config';
import {
  generateDEK,
  uint8ArrayToBase64,
  base64ToUint8Array,
  generateSecureId,
  sha256Hex,
} from './crypto';

// ============================================================================
// KMS CLIENT INTERFACE
// ============================================================================

export interface KMSClient {
  /**
   * Generate a new DEK and wrap it with the specified KMS key
   */
  generateDataKey(kmsKeyId: string, context: EncryptionContext): Promise<DataEncryptionKey>;
  
  /**
   * Unwrap (decrypt) a previously wrapped DEK
   */
  unwrapDataKey(
    wrappedKey: string, 
    kmsKeyId: string, 
    context: EncryptionContext
  ): Promise<Uint8Array>;
  
  /**
   * Wrap (encrypt) an existing DEK with KMS
   */
  wrapDataKey(
    key: Uint8Array, 
    kmsKeyId: string, 
    context: EncryptionContext
  ): Promise<string>;
  
  /**
   * Get or create a tenant-specific KMS key
   */
  getTenantKeyId(tenantId: string): Promise<string>;
  
  /**
   * Check if a KMS key exists and is usable
   */
  validateKey(kmsKeyId: string): Promise<boolean>;
}

// ============================================================================
// AWS KMS IMPLEMENTATION
// ============================================================================

/**
 * Production AWS KMS client
 * Requires AWS SDK v3 to be installed
 */
export class AWSKMSClient implements KMSClient {
  private kmsClient: unknown;
  private tenantKeyCache: Map<string, string> = new Map();

  constructor() {
    // Dynamic import to avoid issues when AWS SDK is not installed
    this.initializeClient();
  }

  private async initializeClient(): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { KMSClient } = require('@aws-sdk/client-kms');
      this.kmsClient = new KMSClient({ region: securityConfig.kms.region });
    } catch {
      console.warn('AWS KMS SDK not available, using mock KMS');
    }
  }

  async generateDataKey(
    kmsKeyId: string, 
    context: EncryptionContext
  ): Promise<DataEncryptionKey> {
    if (!this.kmsClient) {
      throw new KeyManagementError('KMS client not initialized');
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { GenerateDataKeyCommand } = require('@aws-sdk/client-kms');
      
      const command = new GenerateDataKeyCommand({
        KeyId: kmsKeyId,
        KeySpec: 'AES_256',
        EncryptionContext: this.formatContext(context),
      });

      const response = await (this.kmsClient as { send: (cmd: unknown) => Promise<{
        Plaintext: Uint8Array;
        CiphertextBlob: Uint8Array;
        KeyId: string;
      }> }).send(command);

      return {
        key: new Uint8Array(response.Plaintext),
        wrappedKey: uint8ArrayToBase64(new Uint8Array(response.CiphertextBlob)),
        kmsKeyId: response.KeyId,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new KeyManagementError('Failed to generate data key via KMS', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async unwrapDataKey(
    wrappedKey: string, 
    kmsKeyId: string, 
    context: EncryptionContext
  ): Promise<Uint8Array> {
    if (!this.kmsClient) {
      throw new KeyManagementError('KMS client not initialized');
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { DecryptCommand } = require('@aws-sdk/client-kms');
      
      const command = new DecryptCommand({
        KeyId: kmsKeyId,
        CiphertextBlob: base64ToUint8Array(wrappedKey),
        EncryptionContext: this.formatContext(context),
      });

      const response = await (this.kmsClient as { send: (cmd: unknown) => Promise<{
        Plaintext: Uint8Array;
      }> }).send(command);

      return new Uint8Array(response.Plaintext);
    } catch (error) {
      throw new KeyManagementError('Failed to unwrap data key via KMS', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async wrapDataKey(
    key: Uint8Array, 
    kmsKeyId: string, 
    context: EncryptionContext
  ): Promise<string> {
    if (!this.kmsClient) {
      throw new KeyManagementError('KMS client not initialized');
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { EncryptCommand } = require('@aws-sdk/client-kms');
      
      const command = new EncryptCommand({
        KeyId: kmsKeyId,
        Plaintext: key,
        EncryptionContext: this.formatContext(context),
      });

      const response = await (this.kmsClient as { send: (cmd: unknown) => Promise<{
        CiphertextBlob: Uint8Array;
      }> }).send(command);

      return uint8ArrayToBase64(new Uint8Array(response.CiphertextBlob));
    } catch (error) {
      throw new KeyManagementError('Failed to wrap data key via KMS', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async getTenantKeyId(tenantId: string): Promise<string> {
    // Check cache first
    const cached = this.tenantKeyCache.get(tenantId);
    if (cached) {
      return cached;
    }

    // In production, you would look up or create tenant-specific keys
    // For now, use the root key with tenant-based alias
    const keyId = process.env[`KMS_KEY_${tenantId.toUpperCase()}`] 
      || securityConfig.kms.rootKeyArn;
    
    this.tenantKeyCache.set(tenantId, keyId);
    return keyId;
  }

  async validateKey(kmsKeyId: string): Promise<boolean> {
    if (!this.kmsClient) {
      return false;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { DescribeKeyCommand } = require('@aws-sdk/client-kms');
      
      const command = new DescribeKeyCommand({ KeyId: kmsKeyId });
      const response = await (this.kmsClient as { send: (cmd: unknown) => Promise<{
        KeyMetadata: { KeyState: string };
      }> }).send(command);

      return response.KeyMetadata.KeyState === 'Enabled';
    } catch {
      return false;
    }
  }

  /**
   * Format encryption context for KMS API
   */
  private formatContext(context: EncryptionContext): Record<string, string> {
    const formatted: Record<string, string> = {};
    for (const [key, value] of Object.entries(context)) {
      if (value !== undefined) {
        formatted[key] = value;
      }
    }
    return formatted;
  }
}

// ============================================================================
// MOCK KMS CLIENT (for development/testing)
// ============================================================================

/**
 * Mock KMS client for development and testing
 * NEVER use in production - keys are not securely managed
 */
export class MockKMSClient implements KMSClient {
  // Simulated "master key" - in reality this is HSM-protected
  private masterKey: Uint8Array;
  private tenantKeys: Map<string, string> = new Map();

  constructor() {
    // Deterministic key for testing (DO NOT USE IN PRODUCTION)
    this.masterKey = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      this.masterKey[i] = i;
    }
    console.warn('⚠️ Using MockKMSClient - NOT FOR PRODUCTION USE');
  }

  async generateDataKey(
    kmsKeyId: string, 
    context: EncryptionContext
  ): Promise<DataEncryptionKey> {
    // Generate a real random DEK
    const key = generateDEK();
    
    // "Wrap" it by XORing with derived key (simulated KMS encryption)
    const contextHash = await sha256Hex(JSON.stringify(context));
    const wrappedKey = await this.simulateWrap(key, kmsKeyId, contextHash);

    return {
      key,
      wrappedKey: uint8ArrayToBase64(wrappedKey),
      kmsKeyId,
      generatedAt: new Date().toISOString(),
    };
  }

  async unwrapDataKey(
    wrappedKey: string, 
    kmsKeyId: string, 
    context: EncryptionContext
  ): Promise<Uint8Array> {
    const contextHash = await sha256Hex(JSON.stringify(context));
    return this.simulateUnwrap(base64ToUint8Array(wrappedKey), kmsKeyId, contextHash);
  }

  async wrapDataKey(
    key: Uint8Array, 
    kmsKeyId: string, 
    context: EncryptionContext
  ): Promise<string> {
    const contextHash = await sha256Hex(JSON.stringify(context));
    const wrapped = await this.simulateWrap(key, kmsKeyId, contextHash);
    return uint8ArrayToBase64(wrapped);
  }

  async getTenantKeyId(tenantId: string): Promise<string> {
    const existing = this.tenantKeys.get(tenantId);
    if (existing) {
      return existing;
    }

    // Generate a mock key ID
    const keyId = `mock-kms-key-${tenantId}-${generateSecureId()}`;
    this.tenantKeys.set(tenantId, keyId);
    return keyId;
  }

  async validateKey(_kmsKeyId: string): Promise<boolean> {
    // Mock always returns true
    return true;
  }

  /**
   * Simulate KMS wrapping (NOT SECURE - for development only)
   */
  private async simulateWrap(
    key: Uint8Array, 
    kmsKeyId: string, 
    contextHash: string
  ): Promise<Uint8Array> {
    // Derive a "wrapping key" from master key + KMS key ID + context
    const derivationInput = `${kmsKeyId}:${contextHash}`;
    const wrapKey = await sha256Hex(derivationInput + uint8ArrayToBase64(this.masterKey));
    const wrapKeyBytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      wrapKeyBytes[i] = parseInt(wrapKey.substring(i * 2, i * 2 + 2), 16);
    }
    
    // XOR to "encrypt" (NOT SECURE - just for testing)
    const wrapped = new Uint8Array(key.length);
    for (let i = 0; i < key.length; i++) {
      wrapped[i] = key[i] ^ wrapKeyBytes[i % wrapKeyBytes.length];
    }
    
    return wrapped;
  }

  /**
   * Simulate KMS unwrapping (NOT SECURE - for development only)
   */
  private async simulateUnwrap(
    wrappedKey: Uint8Array, 
    kmsKeyId: string, 
    contextHash: string
  ): Promise<Uint8Array> {
    // XOR is symmetric, so unwrap is same as wrap
    return this.simulateWrap(wrappedKey, kmsKeyId, contextHash);
  }
}

// ============================================================================
// KMS CLIENT FACTORY
// ============================================================================

let kmsClientInstance: KMSClient | null = null;

/**
 * Get the appropriate KMS client based on environment
 */
export function getKMSClient(): KMSClient {
  if (kmsClientInstance) {
    return kmsClientInstance;
  }

  if (isDevelopment() || !securityConfig.kms.rootKeyArn) {
    kmsClientInstance = new MockKMSClient();
  } else {
    kmsClientInstance = new AWSKMSClient();
  }

  return kmsClientInstance;
}

/**
 * Reset the KMS client (for testing)
 */
export function resetKMSClient(): void {
  kmsClientInstance = null;
}

/**
 * Set a custom KMS client (for testing)
 */
export function setKMSClient(client: KMSClient): void {
  kmsClientInstance = client;
}
