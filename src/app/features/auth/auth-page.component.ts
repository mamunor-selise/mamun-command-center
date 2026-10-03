import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#070b19] text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden font-sans">
      <!-- Background Ambient Glow & Spheres -->
      <div class="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[125px] pointer-events-none"></div>
      <div class="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-purple-700/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div class="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[130px] pointer-events-none"></div>

      <!-- Floating Visual Spheres (Mockup Orbs) -->
      <div class="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-600/10 to-transparent blur-xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-600/30 via-indigo-600/20 to-transparent blur-2xl pointer-events-none"></div>

      <!-- Top Header Branding -->
      <header class="p-6 md:p-8 flex items-center justify-between relative z-10 max-w-7xl mx-auto w-full">
        <div class="flex items-center gap-3">
          <div class="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25 text-xl tracking-wider">
            M
          </div>
          <div>
            <span class="text-base font-bold tracking-wide block text-white">Mamun Command Center</span>
            <span class="text-[10px] text-cyan-400 font-mono font-semibold tracking-widest uppercase block">MONGODB ATLAS • NEXT.JS • BE</span>
          </div>
        </div>
      </header>

      <!-- Main Container: 2-Column Desktop Grid -->
      <main class="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10 max-w-7xl mx-auto w-full my-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">

          <!-- Left Column: Hero Branding & Value Proposition -->
          <div class="lg:col-span-6 space-y-8 text-left py-4">
            
            <!-- Security Badge -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-xs font-medium text-indigo-300 backdrop-blur-md shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <span>Secure • Fast • Reliable</span>
            </div>

            <!-- Main Headline -->
            <div class="space-y-2">
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Welcome to
                <span class="block bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent pb-1">
                  Mamun Command Center
                </span>
              </h1>
              <p class="text-sm md:text-base text-slate-300/90 leading-relaxed max-w-xl pt-2">
                Your central hub for managing applications, monitoring systems, and making better decisions — all in one place.
              </p>
            </div>

            <!-- Feature Highlight Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <!-- Feature 1 -->
              <div class="p-3.5 rounded-2xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-md flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-semibold text-white">Modern Stack</div>
                  <div class="text-[10px] text-slate-400">MongoDB Atlas • Next.js • BE</div>
                </div>
              </div>

              <!-- Feature 2 -->
              <div class="p-3.5 rounded-2xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-md flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-semibold text-white">Secure Access</div>
                  <div class="text-[10px] text-slate-400">Your data, our priority</div>
                </div>
              </div>

              <!-- Feature 3 -->
              <div class="p-3.5 rounded-2xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-md flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-semibold text-white">Higher Productivity</div>
                  <div class="text-[10px] text-slate-400">Built for performance</div>
                </div>
              </div>
            </div>

          </div>

          <!-- Right Column: Card Authentication Container -->
          <div class="lg:col-span-6 flex justify-center lg:justify-end">
            <div class="w-full max-w-lg bg-[#0c1229]/80 border border-indigo-500/20 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-2xl space-y-6">
              
              <!-- Tab Switcher Header (Sign In | Create Account) -->
              <div class="grid grid-cols-2 gap-1 bg-[#060914]/80 p-1.5 rounded-2xl text-xs font-semibold border border-indigo-900/40">
                <button 
                  type="button"
                  (click)="mode = 'signin'; errorMessage = ''"
                  [ngClass]="mode === 'signin' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'"
                  class="py-3 rounded-xl transition-all text-center"
                >
                  Sign In
                </button>
                <button 
                  type="button"
                  (click)="mode = 'signup'; errorMessage = ''"
                  [ngClass]="mode === 'signup' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'"
                  class="py-3 rounded-xl transition-all text-center"
                >
                  Create Account
                </button>
              </div>

              <!-- Error Alert Banner -->
              <div *ngIf="errorMessage" class="p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-xs text-rose-300 flex items-center gap-2.5 animate-fadeIn">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <span>{{ errorMessage }}</span>
              </div>

              <!-- Authentication Form -->
              <form (submit)="onSubmit($event)" class="space-y-4 text-xs">
                
                <!-- Full Name Field (Sign Up only) -->
                <div *ngIf="mode === 'signup'" class="space-y-1.5">
                  <label class="block font-medium text-slate-300">Full name</label>
                  <div class="relative flex items-center">
                    <div class="absolute left-3.5 text-slate-400 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      [(ngModel)]="name" 
                      name="name" 
                      placeholder="Mamun Or Rashid"
                      required 
                      class="w-full pl-10 pr-3.5 py-3 rounded-xl border border-indigo-900/50 bg-[#060914]/90 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <!-- Email Address Field -->
                <div class="space-y-1.5">
                  <label class="block font-medium text-slate-300">Email address</label>
                  <div class="relative flex items-center">
                    <div class="absolute left-3.5 text-slate-400 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input 
                      type="email" 
                      [(ngModel)]="email" 
                      name="email" 
                      placeholder="you@example.com"
                      required 
                      class="w-full pl-10 pr-3.5 py-3 rounded-xl border border-indigo-900/50 bg-[#060914]/90 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <!-- Password Field -->
                <div class="space-y-1.5">
                  <label class="block font-medium text-slate-300">Password</label>
                  <div class="relative flex items-center">
                    <div class="absolute left-3.5 text-slate-400 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input 
                      [type]="showPassword ? 'text' : 'password'" 
                      [(ngModel)]="password" 
                      name="password" 
                      placeholder="Enter your password"
                      required 
                      class="w-full pl-10 pr-10 py-3 rounded-xl border border-indigo-900/50 bg-[#060914]/90 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                    <!-- Password Visibility Toggle Icon -->
                    <button 
                      type="button" 
                      (click)="togglePasswordVisibility()" 
                      class="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                      title="Toggle password visibility"
                    >
                      <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.016 10.016 0 014.288-1.063c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                      </svg>
                      <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Remember Me & Forgot Password Row -->
                <div class="flex items-center justify-between pt-1 text-slate-300">
                  <label class="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="rememberMe" 
                      name="rememberMe" 
                      class="w-4 h-4 rounded border-indigo-900 bg-[#060914] text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 transition-colors"
                    />
                    <span class="text-xs">Remember me</span>
                  </label>
                  <a href="#" (click)="$event.preventDefault()" class="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    Forgot password?
                  </a>
                </div>

                <!-- Submit Button -->
                <button 
                  type="submit" 
                  [disabled]="authService.isLoading()" 
                  class="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mt-2"
                >
                  <span *ngIf="authService.isLoading()" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <svg *ngIf="!authService.isLoading()" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>{{ mode === 'signin' ? 'Sign In to Command Suite' : 'Create Command Account' }}</span>
                </button>
              </form>

              <!-- Divider -->
              <div class="relative flex items-center justify-center my-4">
                <div class="border-t border-slate-800 w-full"></div>
                <span class="bg-[#0c1229] px-3 text-[11px] font-medium text-slate-500 uppercase tracking-widest absolute">OR</span>
              </div>

              <!-- Google SSO Button -->
              <button 
                type="button" 
                (click)="handleGoogleSignIn()"
                class="w-full bg-[#060914]/80 hover:bg-slate-900 border border-slate-800 text-slate-200 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3 text-xs shadow-sm hover:border-slate-700"
              >
                <!-- Google SVG Logo -->
                <svg class="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <!-- Card Bottom Platform Trust Badges -->
              <div class="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[10px] text-slate-400">
                <div class="p-2 rounded-xl bg-[#060914]/60 border border-slate-800/60 flex flex-col items-center text-center gap-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-indigo-400 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  <span class="font-medium text-slate-200">Trusted Platform</span>
                  <span class="text-[9px] text-slate-500">99.9% uptime</span>
                </div>

                <div class="p-2 rounded-xl bg-[#060914]/60 border border-slate-800/60 flex flex-col items-center text-center gap-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-cyan-400 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  <span class="font-medium text-slate-200">Cloud Powered</span>
                  <span class="text-[9px] text-slate-500">MongoDB Atlas</span>
                </div>

                <div class="p-2 rounded-xl bg-[#060914]/60 border border-slate-800/60 flex flex-col items-center text-center gap-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-emerald-400 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span class="font-medium text-slate-200">Enterprise Ready</span>
                  <span class="text-[9px] text-slate-500">Security first</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      <!-- Page Bottom Footer -->
      <footer class="p-4 text-center text-[11px] text-slate-500 relative z-10 flex items-center justify-center gap-1.5">
        <span>Mamun Command Center</span>
        <span>•</span>
        <span>Built with <span class="text-purple-400">💜</span> using Next.js</span>
        <span>•</span>
        <span>MongoDB Atlas</span>
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
  rememberMe = true;
  showPassword = false;
  errorMessage = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  handleGoogleSignIn() {
    this.errorMessage = 'Google Single Sign-On will be supported in an upcoming release.';
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
    } catch (err: any) {
      this.errorMessage = err.message || 'Authentication failed. Please try again.';
    }
  }
}
