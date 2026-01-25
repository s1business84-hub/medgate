/**
 * MedGate Cryptographic Utilities
 * 
 * Low-level AES-256-GCM encryption and hashing utilities.
 * Uses the Web Crypto API for browser compatibility and Node.js crypto for server.
 */

import { EncryptionError, DecryptionError } from './types';
import { securityConfig } from './config';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface EncryptionResult {
  ciphertext: Uint8Array;
  iv: Uint8Array;
  authTag: Uint8Array;
}

interface DecryptionInput {
  ciphertext: Uint8Array;
  iv: Uint8Array;
  authTag: Uint8Array;
  key: Uint8Array;
  additionalData?: Uint8Array;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert Uint8Array to Base64 string
 */
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  // Browser fallback
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert Base64 string to Uint8Array
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }
  // Browser fallback
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Convert string to Uint8Array (UTF-8)
 */
export function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Convert Uint8Array to string (UTF-8)
 */
export function uint8ArrayToString(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

/**
 * Convert Uint8Array to hex string
 */
export function uint8ArrayToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hex string to Uint8Array
 */
export function hexToUint8Array(hex: string): Uint8Array {
  const matches = hex.match(/.{1,2}/g) || [];
  return new Uint8Array(matches.map(byte => parseInt(byte, 16)));
}

/**
 * Concatenate multiple Uint8Arrays
 */
export function concatUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

/**
 * Constant-time comparison to prevent timing attacks
 */
export function secureCompare(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

// ============================================================================
// RANDOM GENERATION
// ============================================================================

/**
 * Generate cryptographically secure random bytes
 */
export function generateRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else if (typeof require !== 'undefined') {
    // Node.js fallback
    const nodeCrypto = require('crypto');
    const nodeBuffer = nodeCrypto.randomBytes(length);
    bytes.set(nodeBuffer);
  } else {
    throw new EncryptionError('No secure random source available');
  }
  
  return bytes;
}

/**
 * Generate a new Data Encryption Key (256 bits)
 */
export function generateDEK(): Uint8Array {
  return generateRandomBytes(securityConfig.encryption.keyLengthBytes);
}

/**
 * Generate a new IV/Nonce for AES-GCM (96 bits)
 */
export function generateIV(): Uint8Array {
  return generateRandomBytes(securityConfig.encryption.ivLengthBytes);
}

/**
 * Generate a unique ID
 */
export function generateSecureId(prefix = ''): string {
  const bytes = generateRandomBytes(16);
  const hex = uint8ArrayToHex(bytes);
  return prefix ? `${prefix}_${hex}` : hex;
}

// ============================================================================
// AES-256-GCM ENCRYPTION (Web Crypto API)
// ============================================================================

/**
 * Encrypt data using AES-256-GCM (Web Crypto API)
 */
export async function encryptAESGCM(
  plaintext: Uint8Array,
  key: Uint8Array,
  additionalData?: Uint8Array
): Promise<EncryptionResult> {
  if (key.length !== securityConfig.encryption.keyLengthBytes) {
    throw new EncryptionError(
      `Invalid key length. Expected ${securityConfig.encryption.keyLengthBytes} bytes, got ${key.length}`
    );
  }

  const iv = generateIV();

  try {
    // Import the key (cast to BufferSource for TypeScript compatibility)
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key.buffer.slice(key.byteOffset, key.byteOffset + key.byteLength) as ArrayBuffer,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    // Prepare algorithm parameters
    const algorithm: AesGcmParams = {
      name: 'AES-GCM',
      iv: iv.buffer.slice(iv.byteOffset, iv.byteOffset + iv.byteLength) as ArrayBuffer,
      tagLength: securityConfig.encryption.authTagLengthBytes * 8, // bits
    };

    if (additionalData) {
      algorithm.additionalData = additionalData.buffer.slice(
        additionalData.byteOffset, 
        additionalData.byteOffset + additionalData.byteLength
      ) as ArrayBuffer;
    }

    // Encrypt
    const ciphertextWithTag = await crypto.subtle.encrypt(
      algorithm,
      cryptoKey,
      plaintext.buffer.slice(plaintext.byteOffset, plaintext.byteOffset + plaintext.byteLength) as ArrayBuffer
    );

    const ciphertextWithTagArray = new Uint8Array(ciphertextWithTag);
    
    // GCM appends the auth tag to the ciphertext
    const authTagStart = ciphertextWithTagArray.length - securityConfig.encryption.authTagLengthBytes;
    const ciphertext = ciphertextWithTagArray.slice(0, authTagStart);
    const authTag = ciphertextWithTagArray.slice(authTagStart);

    return { ciphertext, iv, authTag };
  } catch (error) {
    throw new EncryptionError('AES-GCM encryption failed', { 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
}

/**
 * Decrypt data using AES-256-GCM (Web Crypto API)
 */
export async function decryptAESGCM(input: DecryptionInput): Promise<Uint8Array> {
  const { ciphertext, iv, authTag, key, additionalData } = input;

  if (key.length !== securityConfig.encryption.keyLengthBytes) {
    throw new DecryptionError(
      `Invalid key length. Expected ${securityConfig.encryption.keyLengthBytes} bytes, got ${key.length}`
    );
  }

  if (iv.length !== securityConfig.encryption.ivLengthBytes) {
    throw new DecryptionError(
      `Invalid IV length. Expected ${securityConfig.encryption.ivLengthBytes} bytes, got ${iv.length}`
    );
  }

  if (authTag.length !== securityConfig.encryption.authTagLengthBytes) {
    throw new DecryptionError(
      `Invalid auth tag length. Expected ${securityConfig.encryption.authTagLengthBytes} bytes, got ${authTag.length}`
    );
  }

  try {
    // Import the key (cast to ArrayBuffer for TypeScript compatibility)
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key.buffer.slice(key.byteOffset, key.byteOffset + key.byteLength) as ArrayBuffer,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    // GCM expects ciphertext + authTag concatenated
    const ciphertextWithTag = concatUint8Arrays(ciphertext, authTag);

    // Prepare algorithm parameters
    const algorithm: AesGcmParams = {
      name: 'AES-GCM',
      iv: iv.buffer.slice(iv.byteOffset, iv.byteOffset + iv.byteLength) as ArrayBuffer,
      tagLength: securityConfig.encryption.authTagLengthBytes * 8, // bits
    };

    if (additionalData) {
      algorithm.additionalData = additionalData.buffer.slice(
        additionalData.byteOffset,
        additionalData.byteOffset + additionalData.byteLength
      ) as ArrayBuffer;
    }

    // Decrypt
    const plaintext = await crypto.subtle.decrypt(
      algorithm,
      cryptoKey,
      ciphertextWithTag.buffer.slice(
        ciphertextWithTag.byteOffset,
        ciphertextWithTag.byteOffset + ciphertextWithTag.byteLength
      ) as ArrayBuffer
    );

    return new Uint8Array(plaintext);
  } catch (error) {
    // Don't leak information about why decryption failed
    throw new DecryptionError('AES-GCM decryption failed - data may be corrupted or tampered');
  }
}

// ============================================================================
// NODE.JS CRYPTO FALLBACK (for server-side when Web Crypto is unavailable)
// ============================================================================

/**
 * Encrypt using Node.js crypto (server-side fallback)
 */
export function encryptAESGCMNode(
  plaintext: Uint8Array,
  key: Uint8Array,
  additionalData?: Uint8Array
): EncryptionResult {
  const nodeCrypto = require('crypto');
  
  const iv = generateIV();
  const cipher = nodeCrypto.createCipheriv('aes-256-gcm', key, iv);
  
  if (additionalData) {
    cipher.setAAD(additionalData);
  }
  
  const ciphertext = Buffer.concat([
    cipher.update(plaintext),
    cipher.final()
  ]);
  
  const authTag = cipher.getAuthTag();
  
  return {
    ciphertext: new Uint8Array(ciphertext),
    iv,
    authTag: new Uint8Array(authTag)
  };
}

/**
 * Decrypt using Node.js crypto (server-side fallback)
 */
export function decryptAESGCMNode(input: DecryptionInput): Uint8Array {
  const nodeCrypto = require('crypto');
  
  const { ciphertext, iv, authTag, key, additionalData } = input;
  
  const decipher = nodeCrypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  
  if (additionalData) {
    decipher.setAAD(additionalData);
  }
  
  try {
    const plaintext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final()
    ]);
    
    return new Uint8Array(plaintext);
  } catch {
    throw new DecryptionError('AES-GCM decryption failed - data may be corrupted or tampered');
  }
}

// ============================================================================
// HASHING
// ============================================================================

/**
 * Calculate SHA-256 hash
 */
export async function sha256(data: Uint8Array): Promise<Uint8Array> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const input = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
    const hashBuffer = await crypto.subtle.digest('SHA-256', input);
    return new Uint8Array(hashBuffer);
  }
  
  // Node.js fallback
  const nodeCrypto = require('crypto');
  const hash = nodeCrypto.createHash('sha256').update(data).digest();
  return new Uint8Array(hash);
}

/**
 * Calculate SHA-256 hash and return as hex string
 */
export async function sha256Hex(data: Uint8Array | string): Promise<string> {
  const dataBytes = typeof data === 'string' ? stringToUint8Array(data) : data;
  const hash = await sha256(dataBytes);
  return uint8ArrayToHex(hash);
}

/**
 * Calculate SHA-256 hash with prefix for identification
 */
export async function sha256Prefixed(data: Uint8Array | string): Promise<string> {
  const hex = await sha256Hex(data);
  return `sha256:${hex}`;
}

/**
 * HMAC-SHA256 for message authentication
 */
export async function hmacSha256(
  data: Uint8Array,
  key: Uint8Array
): Promise<Uint8Array> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key.buffer.slice(key.byteOffset, key.byteOffset + key.byteLength) as ArrayBuffer,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign(
      'HMAC', 
      cryptoKey, 
      data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer
    );
    return new Uint8Array(signature);
  }
  
  // Node.js fallback
  const nodeCrypto = require('crypto');
  const hmac = nodeCrypto.createHmac('sha256', key).update(data).digest();
  return new Uint8Array(hmac);
}

// ============================================================================
// KEY DERIVATION
// ============================================================================

/**
 * Derive a key from a password using PBKDF2
 * Note: For user passwords, use bcrypt/argon2 instead. This is for key derivation.
 */
export async function deriveKey(
  password: string,
  salt: Uint8Array,
  iterations = 100000
): Promise<Uint8Array> {
  const passwordBytes = stringToUint8Array(password);
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const baseKey = await crypto.subtle.importKey(
      'raw',
      passwordBytes.buffer.slice(passwordBytes.byteOffset, passwordBytes.byteOffset + passwordBytes.byteLength) as ArrayBuffer,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt.buffer.slice(salt.byteOffset, salt.byteOffset + salt.byteLength) as ArrayBuffer,
        iterations,
        hash: 'SHA-256'
      },
      baseKey,
      256 // bits
    );
    
    return new Uint8Array(derivedBits);
  }
  
  // Node.js fallback
  const nodeCrypto = require('crypto');
  const derived = nodeCrypto.pbkdf2Sync(
    passwordBytes,
    salt,
    iterations,
    32, // bytes
    'sha256'
  );
  
  return new Uint8Array(derived);
}

// ============================================================================
// IP ADDRESS HASHING (for privacy-preserving audit logs)
// ============================================================================

/**
 * Hash an IP address for privacy-preserving audit logging
 * Uses a daily rotating salt to prevent correlation across days
 */
export async function hashIpAddress(ip: string, salt?: string): Promise<string> {
  // Default salt rotates daily
  const dailySalt = salt ?? `ip-salt-${new Date().toISOString().split('T')[0]}`;
  const data = `${ip}:${dailySalt}`;
  const hash = await sha256Hex(data);
  // Return first 16 characters for reasonable privacy/utility balance
  return hash.substring(0, 16);
}

// ============================================================================
// SECURE MEMORY
// ============================================================================

/**
 * Zero out a Uint8Array to clear sensitive data from memory
 */
export function zeroMemory(data: Uint8Array): void {
  for (let i = 0; i < data.length; i++) {
    data[i] = 0;
  }
}

/**
 * Execute a function with a key, then zero out the key
 */
export async function withSecureKey<T>(
  key: Uint8Array,
  fn: (key: Uint8Array) => Promise<T>
): Promise<T> {
  try {
    return await fn(key);
  } finally {
    zeroMemory(key);
  }
}
