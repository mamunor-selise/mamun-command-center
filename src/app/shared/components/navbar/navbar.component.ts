import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <header class="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-3.5 transition-colors">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <!-- Logo / Brand -->
        <a routerLink="/" class="flex items-center gap-3 group">
          <div class="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            S
          </div>
          <div>
            <span class="text-base font-bold text-slate-900 dark:text-white tracking-wide block">SecureOps Center</span>
            <span class="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium tracking-wider uppercase block">Personal Suite</span>
          </div>
        </a>

        <!-- Desktop Navigation Menu -->
        <nav class="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <a
            routerLink="/"
            [routerLinkActiveOptions]="{ exact: true }"
            routerLinkActive="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-sm"
            class="px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all flex items-center gap-2"
          >
            <span>🏠</span> Dashboard
          </a>

          <a
            routerLink="/routine"
            routerLinkActive="bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-500/30"
            class="px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all flex items-center gap-2"
          >
            <span>📅</span> Daily Routine
          </a>

          <a
            routerLink="/cv-management"
            routerLinkActive="bg-emerald-50 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-500/30"
            class="px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all flex items-center gap-2"
          >
            <span>📄</span> CV Management
          </a>

          <a
            routerLink="/quiz-test"
            routerLinkActive="bg-amber-50 dark:bg-amber-600/20 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-500/30"
            class="px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all flex items-center gap-2"
          >
            <span>🧪</span> Quiz Test Engine
          </a>

          <a
            routerLink="/query-builder"
            routerLinkActive="bg-cyan-50 dark:bg-cyan-600/20 text-cyan-700 dark:text-cyan-300 font-semibold border border-cyan-200 dark:border-cyan-500/30"
            class="px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all flex items-center gap-2"
          >
            <span>⚡</span> Query Builder
          </a>
        </nav>

        <!-- Right Side Actions & Theme Toggle -->
        <div class="flex items-center gap-3">
          <app-theme-toggle />
        </div>
      </div>

      <!-- Mobile Navigation Menu Bar -->
      <nav class="flex md:hidden items-center justify-around mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
        <a routerLink="/" [routerLinkActiveOptions]="{ exact: true }" routerLinkActive="text-indigo-600 dark:text-indigo-400 font-bold" class="text-slate-600 dark:text-slate-400 flex flex-col items-center">
          <span>🏠</span> Home
        </a>
        <a routerLink="/routine" routerLinkActive="text-indigo-600 dark:text-indigo-400 font-bold" class="text-slate-600 dark:text-slate-400 flex flex-col items-center">
          <span>📅</span> Routine
        </a>
        <a routerLink="/cv-management" routerLinkActive="text-emerald-600 dark:text-emerald-400 font-bold" class="text-slate-600 dark:text-slate-400 flex flex-col items-center">
          <span>📄</span> CV
        </a>
        <a routerLink="/quiz-test" routerLinkActive="text-amber-600 dark:text-amber-400 font-bold" class="text-slate-600 dark:text-slate-400 flex flex-col items-center">
          <span>🧪</span> Quiz
        </a>
        <a routerLink="/query-builder" routerLinkActive="text-cyan-600 dark:text-cyan-400 font-bold" class="text-slate-600 dark:text-slate-400 flex flex-col items-center">
          <span>⚡</span> Query Builder
        </a>
      </nav>
    </header>
  `
})
export class NavbarComponent {}
