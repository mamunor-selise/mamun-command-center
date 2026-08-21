import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn select-none">
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 text-slate-900 dark:text-white space-y-5">
        
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              🔑
            </div>
            <div>
              <h3 class="font-bold text-base">Account Authentication</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Next.js API Serverless Auth</p>
            </div>
          </div>
          <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold">✕</button>
        </div>

        <!-- Mode Toggle Tabs -->
        <div class="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button 
            (click)="mode = 'signin'; errorMessage = ''"
            [class.bg-white]="mode === 'signin'"
            [class.dark:bg-slate-700]="mode === 'signin'"
            [class.text-indigo-600]="mode === 'signin'"
            [class.dark:text-indigo-400]="mode === 'signin'"
            [class.shadow-sm]="mode === 'signin'"
            class="py-2 rounded-lg transition-all text-slate-600 dark:text-slate-400"
          >
            Sign In
          </button>
          <button 
            (click)="mode = 'signup'; errorMessage = ''"
            [class.bg-white]="mode === 'signup'"
            [class.dark:bg-slate-700]="mode === 'signup'"
            [class.text-indigo-600]="mode === 'signup'"
            [class.dark:text-indigo-400]="mode === 'signup'"
            [class.shadow-sm]="mode === 'signup'"
            class="py-2 rounded-lg transition-all text-slate-600 dark:text-slate-400"
          >
            Create Account
          </button>
        </div>

        <!-- Error Alert -->
        <div *ngIf="errorMessage" class="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
          <span>⚠️</span>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Form Body -->
        <form (submit)="onSubmit($event)" class="space-y-4 text-xs">
          <!-- Name (Sign Up only) -->
          <div *ngIf="mode === 'signup'">
            <label class="block font-medium mb-1">Full Name</label>
            <input 
              type="text" 
              [(ngModel)]="name" 
              name="name" 
              placeholder="Mamun Or Rashid"
              required 
              class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block font-medium mb-1">Email Address</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email" 
              placeholder="mamunor.selise@gmail.com"
              required 
              class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block font-medium mb-1">Password</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password" 
              placeholder="••••••••"
              required 
              class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            [disabled]="authService.isLoading()" 
            class="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span *ngIf="authService.isLoading()" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ mode === 'signin' ? 'Sign In to Command Center' : 'Create Account' }}</span>
          </button>
        </form>
      </div>
    </div>
  `
})
export class AuthModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  authService = inject(AuthService);

  mode: 'signin' | 'signup' = 'signin';
  name = '';
  email = '';
  password = '';
  errorMessage = '';

  closeModal() {
    this.errorMessage = '';
    this.close.emit();
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.errorMessage = '';

    try {
      if (this.mode === 'signup') {
        await this.authService.signup(this.name, this.email, this.password);
      } else {
        await this.authService.signin(this.email, this.password);
      }
      this.closeModal();
    } catch (err: any) {
      this.errorMessage = err.message || 'Authentication failed.';
    }
  }
}
