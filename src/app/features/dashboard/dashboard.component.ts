import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Welcome Header -->
      <div class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-sm dark:shadow-none transition-colors">
        <h2 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Welcome to Mamun Command Center 🚀
        </h2>
        <p class="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl text-sm md:text-base">
          Manage your daily routines, curate CV variants, challenge your knowledge with interactive quiz engines, and get instant assistance from your AI chatbot.
        </p>
      </div>

      <!-- Quick Navigation Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Daily Routine -->
        <a routerLink="/routine" class="group bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-6 hover:border-indigo-500/50 shadow-sm dark:shadow-none transition-all duration-200">
          <div class="h-12 w-12 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            📅
          </div>
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">Daily Routine</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Control your schedules, time blocks, and habit streaks.</p>
          <div class="mt-4 flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400">
            Open Routine Controller →
          </div>
        </a>

        <!-- CV Management -->
        <a routerLink="/cv-management" class="group bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-6 hover:border-emerald-500/50 shadow-sm dark:shadow-none transition-all duration-200">
          <div class="h-12 w-12 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            📄
          </div>
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300">CV Management</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage master profiles, job variants, and PDF exports.</p>
          <div class="mt-4 flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Manage Resumes →
          </div>
        </a>

        <!-- Quiz Test Engine -->
        <a routerLink="/quiz-test" class="group bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-6 hover:border-amber-500/50 shadow-sm dark:shadow-none transition-all duration-200">
          <div class="h-12 w-12 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            🧪
          </div>
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300">Quiz Test Engine</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Test your skill mastery with dynamic timed quizzes.</p>
          <div class="mt-4 flex items-center text-xs font-medium text-amber-600 dark:text-amber-400">
            Start Practice Quiz →
          </div>
        </a>
      </div>
    </div>
  `
})
export class DashboardComponent {}
