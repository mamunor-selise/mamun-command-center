import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden font-sans">
      <!-- Background Ambient Glow Effects -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Top Header Branding -->
      <header class="p-6 md:p-8 flex items-center justify-between relative z-10 max-w-7xl mx-auto w-full">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 text-lg">
            S
          </div>
          <div>
            <span class="text-base font-bold tracking-wide block">SecureOps Center</span>
            <span class="text-[10px] text-emerald-400 font-mono font-semibold tracking-wider uppercase block">MongoDB Atlas • Next.js BE</span>
          </div>
        </div>
      </header>

      <!-- Center Auth Card Workspace -->
      <main class="flex-1 flex items-center justify-center p-4 relative z-10 my-6">
        <div class="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
          
          <!-- Welcome Title -->
          <div class="text-center space-y-2">
            <h1 class="text-2xl font-bold tracking-tight text-white">
              {{ mode === 'signin' ? 'Welcome Back 👋' : 'Create Your Account 🚀' }}
            </h1>
            <p class="text-xs text-slate-400">
              {{ mode === 'signin' ? 'Sign in to access your daily schedule, CV variants & quiz engine.' : 'Sign up to start organizing your personal productivity suite.' }}
            </p>
          </div>

          <!-- Mode Toggle Tabs -->
          <div class="grid grid-cols-2 gap-1 bg-slate-950 p-1.5 rounded-2xl text-xs font-semibold border border-slate-800">
            <button 
              (click)="mode = 'signin'; errorMessage = ''"
              [class.bg-indigo-600]="mode === 'signin'"
              [class.text-white]="mode === 'signin'"
              [class.shadow-md]="mode === 'signin'"
              class="py-2.5 rounded-xl transition-all text-slate-400 hover:text-white"
            >
              Sign In
            </button>
            <button 
              (click)="mode = 'signup'; errorMessage = ''"
              [class.bg-indigo-600]="mode === 'signup'"
              [class.text-white]="mode === 'signup'"
              [class.shadow-md]="mode === 'signup'"
              class="py-2.5 rounded-xl transition-all text-slate-400 hover:text-white"
            >
              Create Account
            </button>
          </div>

          <!-- Error Alert Banner -->
          <div *ngIf="errorMessage" class="p-3.5 bg-rose-950/60 border border-rose-800 rounded-2xl text-xs text-rose-300 flex items-center gap-2.5 animate-fadeIn">
            <span class="text-base">⚠️</span>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Authentication Form -->
          <form (submit)="onSubmit($event)" class="space-y-4 text-xs">
            <!-- Full Name (Sign Up only) -->
            <div *ngIf="mode === 'signup'" class="space-y-1">
              <label class="block font-medium text-slate-300">Full Name</label>
              <input 
                type="text" 
                [(ngModel)]="name" 
                name="name" 
                placeholder="Mamun Or Rashid"
                required 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <!-- Email -->
            <div class="space-y-1">
              <label class="block font-medium text-slate-300">Email Address</label>
              <input 
                type="email" 
                [(ngModel)]="email" 
                name="email" 
                placeholder="mamunor.selise@gmail.com"
                required 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <!-- Password -->
            <div class="space-y-1">
              <label class="block font-medium text-slate-300">Password</label>
              <input 
                type="password" 
                [(ngModel)]="password" 
                name="password" 
                placeholder="••••••••"
                required 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              [disabled]="authService.isLoading()" 
              class="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mt-2"
            >
              <span *ngIf="authService.isLoading()" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ mode === 'signin' ? 'Sign In to Command Suite' : 'Create MongoDB Account' }}</span>
            </button>
          </form>

          <!-- Module Highlights Footer Bar -->
          <div class="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[10px] text-center text-slate-400">
            <div class="p-2 rounded-xl bg-slate-950/60 border border-slate-800/50">📅 Daily Routine</div>
            <div class="p-2 rounded-xl bg-slate-950/60 border border-slate-800/50">📄 A4 CV Builder</div>
            <div class="p-2 rounded-xl bg-slate-950/60 border border-slate-800/50">🤖 AI Assistant</div>
          </div>
        </div>
      </main>

      <!-- Footer Info -->
      <footer class="p-4 text-center text-[11px] text-slate-500 relative z-10">
        SecureOps Center • Connected to MongoDB Atlas & Next.js Serverless API
      </footer>
    </div>
  `
})
export class AuthPageComponent {
  authService = inject(AuthService);

  mode: 'signin' | 'signup' = 'signin';
  name = '';
  email = '';
  password = '';
  errorMessage = '';

  async onSubmit(event: Event) {
    event.preventDefault();
    this.errorMessage = '';

    try {
      if (this.mode === 'signup') {
        await this.authService.signup(this.name, this.email, this.password);
      } else {
        await this.authService.signin(this.email, this.password);
      }
    } catch (err: any) {
      this.errorMessage = err.message || 'Authentication failed. Please try again.';
    }
  }
}
