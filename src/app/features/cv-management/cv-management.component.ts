import { Component } from '@angular/core';

@Component({
  selector: 'app-cv-management',
  standalone: true,
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            📄 CV & Resume Management
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage master experiences, targeted role profiles, and PDF exports.</p>
        </div>
        <button class="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + Create CV Variant
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-6 shadow-sm dark:shadow-none">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Full-stack Engineer Profile</h3>
          <p class="text-xs text-slate-600 dark:text-slate-400 mb-4">Tailored for Senior Full-stack / Angular & Node.js roles.</p>
          <div class="flex items-center gap-3 text-xs">
            <span class="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">Updated 2 days ago</span>
            <span class="px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">PDF Ready</span>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-6 shadow-sm dark:shadow-none">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">AI Systems Specialist</h3>
          <p class="text-xs text-slate-600 dark:text-slate-400 mb-4">Focuses on LLM integrations, agentic workflows, and cloud architecture.</p>
          <div class="flex items-center gap-3 text-xs">
            <span class="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">Updated yesterday</span>
            <span class="px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">PDF Ready</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CvManagementComponent {}
