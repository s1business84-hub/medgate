/**
 * Encryption Utility for Sensitive Information
 * Encrypts: Student contact info (email, phone), regulatory references, credentials
 * Uses AES encryption for data at rest
 */

import CryptoJS from 'crypto-js';

// Secret key for encryption (in production, this should come from environment)
// This is a placeholder - in production use a strong secret from environment variables
const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'medgate-secret-key-v1';

/**
 * Encrypt sensitive data
 * @param data - Plain text data to encrypt
 * @returns Encrypted data as base64 string
 */
export function encrypt(data: string): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    // Convert to base64 for safe storage in localStorage
    return Buffer.from(encrypted).toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
}

/**
 * Decrypt sensitive data
 * @param encryptedData - Encrypted data as base64 string
 * @returns Decrypted plain text
 */
export function decrypt(encryptedData: string): string {
  try {
    // Convert from base64
    const decrypted = Buffer.from(encryptedData, 'base64').toString('utf-8');
    // Decrypt the AES encrypted string
    const decryptedBytes = CryptoJS.AES.decrypt(decrypted, SECRET_KEY);
    const plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}

/**
 * Encrypt an object's sensitive fields
 * @param data - Object with sensitive fields
 * @param fieldsToEncrypt - Array of field names to encrypt
 * @returns New object with encrypted fields
 */
export function encryptObject<T extends Record<string, any>>(
  data: T,
  fieldsToEncrypt: (keyof T)[]
): T {
  const encrypted = { ...data };
  for (const field of fieldsToEncrypt) {
    if (encrypted[field] && typeof encrypted[field] === 'string') {
      encrypted[field] = encrypt(encrypted[field]) as any;
    }
  }
  return encrypted;
}

/**
 * Decrypt an object's sensitive fields
 * @param data - Object with encrypted fields
 * @param fieldsToDecrypt - Array of field names to decrypt
 * @returns New object with decrypted fields
 */
export function decryptObject<T extends Record<string, any>>(
  data: T,
  fieldsToDecrypt: (keyof T)[]
): T {
  const decrypted = { ...data };
  for (const field of fieldsToDecrypt) {
    if (decrypted[field] && typeof decrypted[field] === 'string') {
      decrypted[field] = decrypt(decrypted[field]) as any;
    }
  }
  return decrypted;
}

/**
 * Utility to mask sensitive data for display
 * Shows first and last character with asterisks in between
 * @param value - Value to mask
 * @param charsToShow - Number of characters to show at start and end
 * @returns Masked value
 */
export function maskSensitiveData(value: string, charsToShow: number = 1): string {
  if (!value || value.length <= charsToShow * 2) return '*'.repeat(value.length);
  const firstPart = value.substring(0, charsToShow);
  const lastPart = value.substring(value.length - charsToShow);
  const middleLength = value.length - charsToShow * 2;
  return `${firstPart}${'*'.repeat(middleLength)}${lastPart}`;
}

/**
 * Check if a value appears to be encrypted
 * @param value - Value to check
 * @returns True if value appears to be encrypted (base64 format)
 */
export function isEncrypted(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  try {
    // Base64 strings are typically longer and contain specific characters
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    return base64Regex.test(value) && value.length > 20;
  } catch {
    return false;
  }
}

/**
 * Fields that should be encrypted when stored
 */
export const SENSITIVE_FIELDS = {
  student: ['email', 'phone'],
  application: ['regulatory'],
  document: ['fileUrl'],
} as const;
