import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-logout-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn select-none">
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full p-6 text-slate-900 dark:text-white space-y-5 text-center">
        
        <!-- Icon -->
        <div class="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-xl mx-auto border border-rose-500/20">
          🚪
        </div>

        <div>
          <h3 class="font-bold text-lg">Log Out Confirmation</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Are you sure you want to log out of your session?
          </p>
        </div>

        <!-- Session User Info Card -->
        <div *ngIf="authService.currentUser()" class="bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
              {{ authService.currentUser()?.name?.charAt(0) || '👤' }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="font-bold text-slate-900 dark:text-white truncate">{{ authService.currentUser()?.name }}</div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">{{ authService.currentUser()?.email }}</div>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span>Database: <strong class="text-emerald-600 dark:text-emerald-400">MongoDB Atlas</strong></span>
            <span>Session: <strong class="text-indigo-600 dark:text-indigo-400">Active</strong></span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex items-center gap-3 pt-2">
          <button 
            (click)="close.emit()" 
            class="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button 
            (click)="confirmLogout()" 
            class="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-md flex items-center justify-center gap-1.5"
          >
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class LogoutModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  authService = inject(AuthService);

  async confirmLogout() {
    await this.authService.logout();
    this.close.emit();
  }
}
