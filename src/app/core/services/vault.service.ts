import { Injectable, signal, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VaultCryptoService, PasswordGenOptions, EncryptedPayload } from './vault-crypto.service';
import { VaultItem, DecryptedSecret, VaultState, VaultItemType } from '../models/vault.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VaultService {
  private http = inject(HttpClient);
  private cryptoService = inject(VaultCryptoService);
  private authService = inject(AuthService);

  // Angular Signals for state management
  vaultState = signal<VaultState>('LOCKED');
  items = signal<VaultItem[]>([]);
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('all');
  masterPasswordInRAM = signal<string | null>(null);

  // Toast / notification signals
  toastMessage = signal<string | null>(null);

  // Auto-lock timer
  private autoLockTimeoutMs = 5 * 60 * 1000; // 5 minutes inactivity
  private autoLockTimer: any = null;

  constructor() {
    // Automatically lock vault on user logout
    effect(() => {
      const user = this.authService.currentUser();
      if (!user) {
        this.lockVault();
      }
    });

    // Activity listener for auto-lock
    this.setupActivityListener();
  }

  /**
   * Resets auto-lock timer on user activity.
   */
  private setupActivityListener() {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => {
      window.addEventListener(event, () => {
        if (this.vaultState() === 'UNLOCKED') {
          this.resetAutoLockTimer();
        }
      });
    });
  }

  private resetAutoLockTimer() {
    if (this.autoLockTimer) {
      clearTimeout(this.autoLockTimer);
    }
    this.autoLockTimer = setTimeout(() => {
      if (this.vaultState() === 'UNLOCKED') {
        this.showToast('Vault auto-locked due to inactivity.');
        this.lockVault();
      }
    }, this.autoLockTimeoutMs);
  }

  /**
   * Shows a brief non-sensitive toast message.
   */
  showToast(message: string) {
    this.toastMessage.set(message);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }

  /**
   * Unlock vault with master password.
   */
  async unlockVault(masterPassword: string): Promise<boolean> {
    if (!masterPassword) return false;
    this.vaultState.set('UNLOCKING');

    try {
      let rawItems: VaultItem[] = [];
      const token = this.authService.token();
      const headers: any = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        const response: any = await this.http.get('/api/vault', { headers }).toPromise();
        rawItems = response?.items || [];
        const userKey = this.authService.currentUser()?.id || 'guest';
        localStorage.setItem(`mcc_vault_cache_${userKey}`, JSON.stringify(rawItems));
      } catch (httpErr) {
        console.warn('Vault API offline or unparseable, reading local encrypted cache', httpErr);
        const userKey = this.authService.currentUser()?.id || 'guest';
        const cached = localStorage.getItem(`mcc_vault_cache_${userKey}`);
        if (cached) {
          rawItems = JSON.parse(cached);
        }
      }

      // If items exist, attempt decrypting the first item payload to verify master password
      if (rawItems.length > 0) {
        try {
          await this.cryptoService.decrypt(rawItems[0].encryptedPayload, masterPassword);
        } catch (e) {
          this.vaultState.set('LOCKED');
          throw new Error('Incorrect Master Password. Decryption failed.');
        }
      }

      // Store master password temporarily in RAM signal
      this.masterPasswordInRAM.set(masterPassword);
      this.vaultState.set('UNLOCKED');
      this.resetAutoLockTimer();

      // Decrypt all items into RAM memory
      await this.decryptAllItems(rawItems, masterPassword);
      return true;
    } catch (error: any) {
      this.vaultState.set('LOCKED');
      this.masterPasswordInRAM.set(null);
      throw error;
    }
  }

  /**
   * Locks the vault immediately, wiping master password and decrypted items from memory.
   */
  lockVault() {
    this.vaultState.set('LOCKED');
    this.masterPasswordInRAM.set(null);
    this.items.set([]);
    if (this.autoLockTimer) {
      clearTimeout(this.autoLockTimer);
    }
  }

  /**
   * Decrypts all item payloads into RAM.
   */
  private async decryptAllItems(rawItems: VaultItem[], masterPassword: string) {
    const decryptedItems: VaultItem[] = [];

    for (const item of rawItems) {
      try {
        const decryptedData = await this.cryptoService.decrypt(item.encryptedPayload, masterPassword);
        decryptedItems.push({
          ...item,
          decryptedData
        });
      } catch (e) {
        console.warn(`Failed to decrypt item ${item.id}`);
      }
    }

    this.items.set(decryptedItems);
  }

  /**
   * Saves or updates a vault item (encrypts data before sending to server).
   */
  async saveItem(secret: DecryptedSecret, existingId?: string): Promise<void> {
    const masterPass = this.masterPasswordInRAM();
    if (!masterPass || this.vaultState() !== 'UNLOCKED') {
      throw new Error('Vault is locked. Unlock vault to save items.');
    }

    const token = this.authService.token();
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Encrypt payload
    const encryptedPayload = await this.cryptoService.encrypt(secret, masterPass);

    const vaultItem: Partial<VaultItem> = {
      id: existingId || 'vitem-' + Date.now(),
      type: secret.type,
      title: secret.title,
      category: secret.category || 'General',
      encryptedPayload: encryptedPayload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let savedItem: VaultItem = vaultItem as VaultItem;

    try {
      const response: any = await this.http.post('/api/vault', vaultItem, { headers }).toPromise();
      if (response?.item) {
        savedItem = response.item;
      }
    } catch (httpErr) {
      console.warn('API post failed, saving encrypted item to local cache', httpErr);
    }

    savedItem.decryptedData = secret;
    const currentList = this.items();

    const existingIndex = currentList.findIndex(i => i.id === savedItem.id);
    if (existingIndex >= 0) {
      currentList[existingIndex] = savedItem;
      this.items.set([...currentList]);
    } else {
      this.items.set([savedItem, ...currentList]);
    }

    // Save encrypted cache to local storage
    const userKey = this.authService.currentUser()?.id || 'guest';
    const encryptedList = this.items().map(i => ({
      id: i.id,
      userId: i.userId,
      type: i.type,
      title: i.title,
      category: i.category,
      encryptedPayload: i.encryptedPayload,
      createdAt: i.createdAt,
      updatedAt: i.updatedAt
    }));
    localStorage.setItem(`mcc_vault_cache_${userKey}`, JSON.stringify(encryptedList));

    this.showToast(existingId ? 'Vault item updated.' : 'Vault item saved.');
  }

  /**
   * Deletes a vault item.
   */
  async deleteItem(id: string): Promise<void> {
    const token = this.authService.token();
    const headers = { Authorization: `Bearer ${token}` };

    await this.http.delete(`/api/vault?id=${id}`, { headers }).toPromise();
    this.items.set(this.items().filter(i => i.id !== id));
    this.showToast('Vault item deleted.');
  }

  /**
   * Securely copies text to clipboard and clears after 30 seconds.
   */
  async copyToClipboard(text: string, label: string = 'Secret') {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    this.showToast(`${label} copied to clipboard.`);

    // Clear clipboard after 30 seconds
    setTimeout(async () => {
      try {
        const currentText = await navigator.clipboard.readText();
        if (currentText === text) {
          await navigator.clipboard.writeText('');
          this.showToast('Clipboard automatically cleared.');
        }
      } catch (e) {
        // Clipboard read permission might be denied
      }
    }, 30000);
  }

  /**
   * Generates password using VaultCryptoService.
   */
  generatePassword(options: PasswordGenOptions): string {
    return this.cryptoService.generateRandomPassword(options);
  }
}
