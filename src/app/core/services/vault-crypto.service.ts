import { Injectable } from '@angular/core';

export interface EncryptedPayload {
  version: number;
  algorithm: string;
  nonce: string; // Base64
  ciphertext: string; // Base64
  salt: string; // Base64
}

export interface PasswordGenOptions {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  excludeAmbiguous: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VaultCryptoService {
  private readonly ALGORITHM_NAME = 'AES-GCM';
  private readonly KEY_DERIVATION_ALGO = 'PBKDF2';
  private readonly HASH_ALGO = 'SHA-256';
  private readonly PBKDF2_ITERATIONS = 100000;

  /**
   * Generates a cryptographically secure random salt (16 bytes).
   */
  generateSalt(): Uint8Array {
    const salt = new Uint8Array(16);
    window.crypto.getRandomValues(salt);
    return salt;
  }

  /**
   * Converts Uint8Array to Base64 string.
   */
  arrayToBase64(array: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < array.byteLength; i++) {
      binary += String.fromCharCode(array[i]);
    }
    return btoa(binary);
  }

  /**
   * Converts Base64 string to Uint8Array.
   */
  base64ToArray(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Derives an AES-GCM key from master password and salt using WebCrypto PBKDF2.
   */
  private async deriveKey(masterPassword: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordBytes = encoder.encode(masterPassword);

    const baseKey = await window.crypto.subtle.importKey(
      'raw',
      passwordBytes,
      { name: this.KEY_DERIVATION_ALGO },
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: this.KEY_DERIVATION_ALGO,
        salt: salt,
        iterations: this.PBKDF2_ITERATIONS,
        hash: this.HASH_ALGO
      },
      baseKey,
      { name: this.ALGORITHM_NAME, length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypts plaintext data object using AES-256-GCM under master password.
   */
  async encrypt(data: any, masterPassword: string, existingSaltBase64?: string): Promise<EncryptedPayload> {
    const saltBytes = existingSaltBase64 ? this.base64ToArray(existingSaltBase64) : this.generateSalt();
    const key = await this.deriveKey(masterPassword, saltBytes);

    const iv = new Uint8Array(12); // 96-bit nonce for AES-GCM
    window.crypto.getRandomValues(iv);

    const encoder = new TextEncoder();
    const jsonString = JSON.stringify(data);
    const encodedData = encoder.encode(jsonString);

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: this.ALGORITHM_NAME,
        iv: iv
      },
      key,
      encodedData
    );

    return {
      version: 1,
      algorithm: 'AES-256-GCM',
      nonce: this.arrayToBase64(iv),
      ciphertext: this.arrayToBase64(new Uint8Array(encryptedBuffer)),
      salt: this.arrayToBase64(saltBytes)
    };
  }

  /**
   * Decrypts AES-256-GCM payload using master password.
   */
  async decrypt(payload: EncryptedPayload, masterPassword: string): Promise<any> {
    const saltBytes = this.base64ToArray(payload.salt);
    const ivBytes = this.base64ToArray(payload.nonce);
    const ciphertextBytes = this.base64ToArray(payload.ciphertext);

    const key = await this.deriveKey(masterPassword, saltBytes);

    try {
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: this.ALGORITHM_NAME,
          iv: ivBytes
        },
        key,
        ciphertextBytes
      );

      const decoder = new TextDecoder();
      const jsonString = decoder.decode(decryptedBuffer);
      return JSON.parse(jsonString);
    } catch (e) {
      throw new Error('Invalid master password or tampered ciphertext.');
    }
  }

  /**
   * Generates a cryptographically secure random password using WebCrypto APIs.
   */
  generateRandomPassword(options: PasswordGenOptions): string {
    let chars = '';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const ambiguous = 'i1I0OolL';

    if (options.useUppercase) chars += upper;
    if (options.useLowercase) chars += lower;
    if (options.useNumbers) chars += numbers;
    if (options.useSymbols) chars += symbols;

    if (options.excludeAmbiguous) {
      for (const amb of ambiguous) {
        chars = chars.replace(new RegExp('\\' + amb, 'g'), '');
      }
    }

    if (!chars) chars = lower + numbers;

    const length = Math.max(8, Math.min(64, options.length));
    const randomBytes = new Uint8Array(length);
    window.crypto.getRandomValues(randomBytes);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(randomBytes[i] % chars.length);
    }

    return result;
  }
}
