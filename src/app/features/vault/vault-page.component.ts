import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VaultService } from '../../core/services/vault.service';
import { VaultItem, DecryptedSecret, VaultItemType } from '../../core/models/vault.model';
import { PasswordGenOptions } from '../../core/services/vault-crypto.service';

@Component({
  selector: 'app-vault-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6 text-slate-800 dark:text-slate-200">
      
      <!-- Toast Notification Bar -->
      <div *ngIf="vaultService.toastMessage()" class="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
        <span class="text-emerald-400">🛡️</span>
        <span>{{ vaultService.toastMessage() }}</span>
      </div>

      <!-- PAGE HEADER -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
              <span>🔐</span> Password & Credentials Vault
            </h1>
            <span [ngClass]="{
              'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20': vaultService.vaultState() === 'UNLOCKED',
              'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20': vaultService.vaultState() === 'LOCKED'
            }" class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border">
              {{ vaultService.vaultState() }}
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Zero-Knowledge Client-Side AES-256-GCM Encrypted Storage. Secrets are never exposed to the server.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            *ngIf="vaultService.vaultState() === 'UNLOCKED'"
            (click)="showGeneratorModal.set(true)" 
            class="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <span>🎲</span> Generator
          </button>
          
          <button 
            *ngIf="vaultService.vaultState() === 'UNLOCKED'"
            (click)="openAddSecretModal()" 
            class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <span>+</span> Add Secret
          </button>

          <button 
            *ngIf="vaultService.vaultState() === 'UNLOCKED'"
            (click)="vaultService.lockVault()" 
            class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <span>🔒</span> Lock Vault
          </button>
        </div>
      </div>

      <!-- 1. LOCKED VAULT VIEW (Master Password Unlock Form) -->
      <div *ngIf="vaultService.vaultState() === 'LOCKED'" class="max-w-md mx-auto my-12 bg-white dark:bg-slate-800/90 p-8 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xl text-center space-y-6">
        <div class="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center text-3xl mx-auto">
          🔐
        </div>

        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-1">Unlock Your Vault</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Enter your Master Password to decrypt your stored credentials locally in RAM.
          </p>
        </div>

        <form (ngSubmit)="handleUnlock()" class="space-y-4 text-left">
          <div>
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Master Password</label>
            <div class="relative">
              <input 
                [type]="showMasterPassword() ? 'text' : 'password'" 
                [(ngModel)]="masterPasswordInput" 
                name="masterPassword"
                placeholder="Enter Master Password..." 
                required
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:border-emerald-500"
              />
              <button 
                type="button"
                (click)="showMasterPassword.set(!showMasterPassword())" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs"
              >
                {{ showMasterPassword() ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <div *ngIf="errorMessage()" class="text-xs text-rose-500 font-medium bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
            ⚠️ {{ errorMessage() }}
          </div>

          <button 
            type="submit" 
            [disabled]="isSubmitting()"
            class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-600/20"
          >
            {{ isSubmitting() ? 'Decrypting Vault...' : '🔓 Unlock Vault' }}
          </button>
        </form>

        <div class="text-[11px] text-slate-400 border-t border-slate-200 dark:border-slate-700/60 pt-4 text-justify">
          ℹ️ <strong>Zero-Knowledge Security:</strong> Your Master Password is used exclusively on your local device to generate the decryption key. It is never transmitted across the network or stored in database logs.
        </div>
      </div>

      <!-- 2. UNLOCKED VAULT CONTENT VIEW -->
      <div *ngIf="vaultService.vaultState() === 'UNLOCKED'" class="space-y-6">
        
        <!-- Search & Filter Header -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <!-- Search Input -->
          <div class="relative w-full md:w-80">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input 
              type="text" 
              [ngModel]="vaultService.searchQuery()" 
              (ngModelChange)="vaultService.searchQuery.set($event)"
              placeholder="Search secrets by title, username, category..." 
              class="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:border-emerald-500"
            />
          </div>

          <!-- Type Filter Tabs -->
          <div class="flex flex-wrap gap-1 text-xs font-medium bg-slate-100 dark:bg-slate-900/60 p-1 rounded-lg">
            <button 
              *ngFor="let tab of filterTabs" 
              (click)="vaultService.selectedCategory.set(tab.id)"
              [class.bg-white]="vaultService.selectedCategory() === tab.id"
              [class.dark:bg-slate-700]="vaultService.selectedCategory() === tab.id"
              [class.text-emerald-600]="vaultService.selectedCategory() === tab.id"
              [class.dark:text-emerald-400]="vaultService.selectedCategory() === tab.id"
              [class.shadow-sm]="vaultService.selectedCategory() === tab.id"
              class="px-3 py-1.5 rounded-md transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              {{ tab.icon }} {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredItems().length === 0" class="text-center py-16 bg-white dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
          <div class="text-4xl text-slate-300 dark:text-slate-600">🗝️</div>
          <h3 class="text-base font-semibold text-slate-800 dark:text-white">No Vault Secrets Found</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            You have no stored secrets matching your criteria. Click "+ Add Secret" to store a new credential safely.
          </p>
          <button (click)="openAddSecretModal()" class="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold">
            + Add First Secret
          </button>
        </div>

        <!-- Secrets Items Grid -->
        <div *ngIf="filteredItems().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div *ngFor="let item of filteredItems()" class="bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-4 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-2">
                  <span class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm">
                    {{ getTypeIcon(item.type) }}
                  </span>
                  <div>
                    <h4 class="font-bold text-slate-900 dark:text-white text-sm leading-snug">{{ item.title }}</h4>
                    <span class="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{{ item.category }} • {{ item.type }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-1">
                  <button (click)="openEditSecretModal(item)" class="text-slate-400 hover:text-emerald-500 text-xs p-1">✏️</button>
                  <button (click)="handleDeleteItem(item.id)" class="text-slate-400 hover:text-rose-500 text-xs p-1">🗑️</button>
                </div>
              </div>

              <!-- Login Credential Card -->
              <div *ngIf="item.type === 'login' && item.decryptedData" class="space-y-2 text-xs bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/40">
                <div *ngIf="item.decryptedData.username" class="flex justify-between items-center">
                  <span class="text-slate-400">Username:</span>
                  <span class="font-medium text-slate-800 dark:text-slate-200 select-all">{{ item.decryptedData.username }}</span>
                </div>

                <div *ngIf="item.decryptedData.password" class="flex justify-between items-center">
                  <span class="text-slate-400">Password:</span>
                  <div class="flex items-center gap-2">
                    <span class="font-mono text-slate-800 dark:text-slate-200">
                      {{ revealedSecretIds().has(item.id) ? item.decryptedData.password : '••••••••••••' }}
                    </span>
                    <button (click)="toggleReveal(item.id)" class="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-white">
                      {{ revealedSecretIds().has(item.id) ? 'Hide' : 'Show' }}
                    </button>
                    <button (click)="vaultService.copyToClipboard(item.decryptedData.password!, 'Password')" class="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-800 dark:text-white font-semibold">
                      Copy
                    </button>
                  </div>
                </div>

                <div *ngIf="item.decryptedData.url" class="flex justify-between items-center truncate">
                  <span class="text-slate-400">URL:</span>
                  <a [href]="item.decryptedData.url" target="_blank" class="text-emerald-600 dark:text-emerald-400 truncate hover:underline">
                    {{ item.decryptedData.url }}
                  </a>
                </div>
              </div>

              <!-- Secure Note Card -->
              <div *ngIf="item.type === 'note' && item.decryptedData" class="text-xs bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/40 space-y-1">
                <div class="text-slate-400 font-semibold mb-1">Encrypted Note:</div>
                <p class="text-slate-700 dark:text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                  {{ revealedSecretIds().has(item.id) ? item.decryptedData.notes : '••••••••••••••••••••••••' }}
                </p>
                <button (click)="toggleReveal(item.id)" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  {{ revealedSecretIds().has(item.id) ? 'Hide Note' : 'Reveal Note' }}
                </button>
              </div>

              <!-- Credit Card Card -->
              <div *ngIf="item.type === 'card' && item.decryptedData" class="space-y-1.5 text-xs bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/40">
                <div class="flex justify-between">
                  <span class="text-slate-400">Cardholder:</span>
                  <span class="font-medium text-slate-800 dark:text-slate-200">{{ item.decryptedData.cardholder }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-400">Number:</span>
                  <div class="flex items-center gap-1.5 font-mono">
                    <span>{{ revealedSecretIds().has(item.id) ? item.decryptedData.cardNumber : '•••• •••• •••• ' + (item.decryptedData.cardNumber?.slice(-4) || '****') }}</span>
                    <button (click)="vaultService.copyToClipboard(item.decryptedData.cardNumber!, 'Card Number')" class="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">Copy</button>
                  </div>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Exp / CVV:</span>
                  <span class="font-mono text-slate-800 dark:text-slate-200">
                    {{ item.decryptedData.expiryDate }} | {{ revealedSecretIds().has(item.id) ? item.decryptedData.cvv : '***' }}
                  </span>
                </div>
              </div>

              <!-- API Key Card -->
              <div *ngIf="item.type === 'apiKey' && item.decryptedData" class="space-y-1.5 text-xs bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/40">
                <div class="flex justify-between">
                  <span class="text-slate-400">Service:</span>
                  <span class="font-medium text-slate-800 dark:text-slate-200">{{ item.decryptedData.serviceName }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-400">API Key:</span>
                  <div class="flex items-center gap-1.5">
                    <span class="font-mono text-slate-800 dark:text-slate-200">
                      {{ revealedSecretIds().has(item.id) ? item.decryptedData.apiKey : '••••••••••••••••' }}
                    </span>
                    <button (click)="vaultService.copyToClipboard(item.decryptedData.apiKey!, 'API Key')" class="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">Copy</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-2 text-[10px] text-slate-400 flex justify-between items-center border-t border-slate-100 dark:border-slate-700/40 mt-3">
              <span>Updated: {{ item.updatedAt | date:'shortDate' }}</span>
              <button (click)="toggleReveal(item.id)" class="text-slate-500 dark:text-slate-400 hover:text-emerald-500 font-semibold">
                {{ revealedSecretIds().has(item.id) ? '👁️ Mask' : '👁️ Reveal' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL: ADD / EDIT SECRET -->
      <div *ngIf="showAddSecretModal()" class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-800 w-full max-w-lg p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">
              {{ editingItemId() ? 'Edit Vault Secret' : 'Add New Secret' }}
            </h3>
            <button (click)="showAddSecretModal.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-white text-base">✕</button>
          </div>

          <form (ngSubmit)="handleSaveSecret()" class="space-y-4 text-xs">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold mb-1">Secret Type</label>
                <select [(ngModel)]="secretForm.type" name="type" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none">
                  <option value="login">🔑 Login Credentials</option>
                  <option value="note">📝 Secure Note</option>
                  <option value="card">💳 Credit Card</option>
                  <option value="apiKey">⚡ API Key</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold mb-1">Category</label>
                <input type="text" [(ngModel)]="secretForm.category" name="category" placeholder="Personal, Work, Finance..." class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none" />
              </div>
            </div>

            <div>
              <label class="block font-semibold mb-1">Title / Name</label>
              <input type="text" [(ngModel)]="secretForm.title" name="title" required placeholder="e.g. GitHub Account" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none" />
            </div>

            <!-- LOGIN FIELDS -->
            <div *ngIf="secretForm.type === 'login'" class="space-y-3">
              <div>
                <label class="block font-semibold mb-1">Username / Email</label>
                <input type="text" [(ngModel)]="secretForm.username" name="username" placeholder="user@domain.com" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none" />
              </div>

              <div>
                <div class="flex justify-between mb-1">
                  <label class="font-semibold">Password</label>
                  <button type="button" (click)="generateFormPassword()" class="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">🎲 Generate Password</button>
                </div>
                <input type="text" [(ngModel)]="secretForm.password" name="password" placeholder="Password..." class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono outline-none" />
              </div>

              <div>
                <label class="block font-semibold mb-1">Website URL</label>
                <input type="text" [(ngModel)]="secretForm.url" name="url" placeholder="https://..." class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none" />
              </div>
            </div>

            <!-- NOTE FIELDS -->
            <div *ngIf="secretForm.type === 'note'" class="space-y-2">
              <label class="block font-semibold mb-1">Encrypted Note Content</label>
              <textarea [(ngModel)]="secretForm.notes" name="notes" rows="5" placeholder="Write confidential notes here..." class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono outline-none"></textarea>
            </div>

            <!-- CREDIT CARD FIELDS -->
            <div *ngIf="secretForm.type === 'card'" class="space-y-3">
              <div>
                <label class="block font-semibold mb-1">Cardholder Name</label>
                <input type="text" [(ngModel)]="secretForm.cardholder" name="cardholder" placeholder="John Doe" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none" />
              </div>
              <div class="grid grid-cols-3 gap-2">
                <div class="col-span-2">
                  <label class="block font-semibold mb-1">Card Number</label>
                  <input type="text" [(ngModel)]="secretForm.cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono outline-none" />
                </div>
                <div>
                  <label class="block font-semibold mb-1">Expiry / CVV</label>
                  <input type="text" [(ngModel)]="secretForm.expiryDate" name="expiryDate" placeholder="12/28" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono outline-none" />
                </div>
              </div>
            </div>

            <!-- API KEY FIELDS -->
            <div *ngIf="secretForm.type === 'apiKey'" class="space-y-3">
              <div>
                <label class="block font-semibold mb-1">Service Name</label>
                <input type="text" [(ngModel)]="secretForm.serviceName" name="serviceName" placeholder="OpenAI / AWS / GitHub" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none" />
              </div>
              <div>
                <label class="block font-semibold mb-1">API Key / Secret</label>
                <input type="text" [(ngModel)]="secretForm.apiKey" name="apiKey" placeholder="sk-..." class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono outline-none" />
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button type="button" (click)="showAddSecretModal.set(false)" class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">Cancel</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/20">
                🔒 Encrypt & Save
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL: PASSWORD GENERATOR -->
      <div *ngIf="showGeneratorModal()" class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-800 w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl space-y-5">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🎲</span> Password Generator
            </h3>
            <button (click)="showGeneratorModal.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-white text-base">✕</button>
          </div>

          <!-- Generated Password Display -->
          <div class="p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span class="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 break-all select-all">
              {{ generatedPassword() }}
            </span>
            <button (click)="vaultService.copyToClipboard(generatedPassword(), 'Generated Password')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shrink-0 ml-2">
              Copy
            </button>
          </div>

          <!-- Generator Options Controls -->
          <div class="space-y-4 text-xs">
            <div>
              <div class="flex justify-between font-semibold mb-1">
                <span>Password Length: {{ genOptions.length }}</span>
              </div>
              <input type="range" min="8" max="64" [(ngModel)]="genOptions.length" (ngModelChange)="updateGeneratedPassword()" class="w-full accent-emerald-500" />
            </div>

            <div class="grid grid-cols-2 gap-3 font-medium">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="genOptions.useUppercase" (ngModelChange)="updateGeneratedPassword()" class="accent-emerald-500" />
                <span>Uppercase (A-Z)</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="genOptions.useLowercase" (ngModelChange)="updateGeneratedPassword()" class="accent-emerald-500" />
                <span>Lowercase (a-z)</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="genOptions.useNumbers" (ngModelChange)="updateGeneratedPassword()" class="accent-emerald-500" />
                <span>Numbers (0-9)</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="genOptions.useSymbols" (ngModelChange)="updateGeneratedPassword()" class="accent-emerald-500" />
                <span>Symbols (!&#64;#$)</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <button (click)="updateGeneratedPassword()" class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-semibold">
              🔄 Regenerate
            </button>
            <button (click)="showGeneratorModal.set(false)" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VaultPageComponent {
  vaultService = inject(VaultService);

  masterPasswordInput = '';
  showMasterPassword = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  // Modals
  showAddSecretModal = signal(false);
  showGeneratorModal = signal(false);

  // Edit State
  editingItemId = signal<string | null>(null);
  revealedSecretIds = signal<Set<string>>(new Set());

  // Filter Tabs
  filterTabs = [
    { id: 'all', label: 'All Items', icon: '📁' },
    { id: 'login', label: 'Logins', icon: '🔑' },
    { id: 'note', label: 'Notes', icon: '📝' },
    { id: 'card', label: 'Cards', icon: '💳' },
    { id: 'apiKey', label: 'API Keys', icon: '⚡' }
  ];

  // Secret Form Model
  secretForm: DecryptedSecret = {
    title: '',
    type: 'login',
    category: 'General',
    username: '',
    password: '',
    url: '',
    notes: '',
    cardholder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    serviceName: '',
    apiKey: ''
  };

  // Password Generator State
  genOptions: PasswordGenOptions = {
    length: 16,
    useUppercase: true,
    useLowercase: true,
    useNumbers: true,
    useSymbols: true,
    excludeAmbiguous: false
  };

  generatedPassword = signal<string>('');

  constructor() {
    this.updateGeneratedPassword();
  }

  // Filtered Items Computed Signal
  filteredItems = computed(() => {
    const all = this.vaultService.items();
    const query = this.vaultService.searchQuery().toLowerCase();
    const category = this.vaultService.selectedCategory();

    return all.filter(item => {
      const matchesCategory = category === 'all' || item.type === category;
      const matchesQuery = !query || 
        item.title.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query) ||
        item.decryptedData?.username?.toLowerCase().includes(query) ||
        item.decryptedData?.serviceName?.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  });

  async handleUnlock() {
    if (!this.masterPasswordInput) return;
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    try {
      await this.vaultService.unlockVault(this.masterPasswordInput);
      this.masterPasswordInput = '';
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Unlock failed.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  toggleReveal(itemId: string) {
    const current = new Set(this.revealedSecretIds());
    if (current.has(itemId)) {
      current.delete(itemId);
    } else {
      current.add(itemId);
    }
    this.revealedSecretIds.set(current);
  }

  openAddSecretModal() {
    this.editingItemId.set(null);
    this.secretForm = {
      title: '',
      type: 'login',
      category: 'General',
      username: '',
      password: '',
      url: '',
      notes: '',
      cardholder: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      serviceName: '',
      apiKey: ''
    };
    this.showAddSecretModal.set(true);
  }

  openEditSecretModal(item: VaultItem) {
    this.editingItemId.set(item.id);
    this.secretForm = {
      ...item.decryptedData,
      title: item.title,
      type: item.type,
      category: item.category
    };
    this.showAddSecretModal.set(true);
  }

  async handleSaveSecret() {
    if (!this.secretForm.title) return;
    try {
      await this.vaultService.saveItem(this.secretForm, this.editingItemId() || undefined);
      this.showAddSecretModal.set(false);
    } catch (e: any) {
      alert(e.message);
    }
  }

  async handleDeleteItem(id: string) {
    if (confirm('Are you sure you want to delete this encrypted secret?')) {
      await this.vaultService.deleteItem(id);
    }
  }

  generateFormPassword() {
    this.secretForm.password = this.vaultService.generatePassword(this.genOptions);
  }

  updateGeneratedPassword() {
    this.generatedPassword.set(this.vaultService.generatePassword(this.genOptions));
  }

  getTypeIcon(type: VaultItemType): string {
    switch (type) {
      case 'login': return '🔑';
      case 'note': return '📝';
      case 'card': return '💳';
      case 'apiKey': return '⚡';
      default: return '🛡️';
    }
  }
}
