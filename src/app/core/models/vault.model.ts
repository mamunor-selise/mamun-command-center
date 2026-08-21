import { EncryptedPayload } from '../services/vault-crypto.service';

export type VaultItemType = 'login' | 'note' | 'card' | 'apiKey' | 'recoveryCode';

export interface DecryptedSecret {
  title: string;
  type: VaultItemType;
  category: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
  // Card specific
  cardholder?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  // API Key specific
  serviceName?: string;
  apiKey?: string;
  apiSecret?: string;
  // Recovery codes
  codes?: string[];
}

export interface VaultItem {
  id: string;
  userId: string;
  type: VaultItemType;
  title: string; // Plaintext metadata title for list view
  category: string; // e.g. "Work", "Personal", "Finance"
  encryptedPayload: EncryptedPayload;
  createdAt: string;
  updatedAt: string;

  // Transient decrypted data in RAM when vault is UNLOCKED
  decryptedData?: DecryptedSecret;
}

export type VaultState = 'LOCKED' | 'UNLOCKING' | 'UNLOCKED';
