import { Component } from '@angular/core';

@Component({
  selector: 'app-routine',
  standalone: true,
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            📅 Daily Routine Controller
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Organize your daily schedule, time blocking, and habits.</p>
        </div>
        <button class="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + Add New Routine Task
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Timeline -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-6 shadow-sm dark:shadow-none">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Today's Schedule</h3>
          <div class="space-y-3">
            <div class="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div class="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">08:00 AM - 09:00 AM</div>
                <div class="text-sm font-medium text-slate-900 dark:text-white">Morning Planning & Exercise</div>
              </div>
              <span class="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Completed</span>
            </div>

            <div class="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div class="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">09:30 AM - 01:00 PM</div>
                <div class="text-sm font-medium text-slate-900 dark:text-white">Deep Work / Feature Engineering</div>
              </div>
              <span class="text-xs px-2 py-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">In Progress</span>
            </div>
          </div>
        </div>

        <!-- Habit Tracker Widget -->
        <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-6 shadow-sm dark:shadow-none">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Habit Streaks</h3>
          <div class="space-y-4 text-sm">
            <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60">
              <span class="text-slate-700 dark:text-slate-300">Daily Coding Practice</span>
              <span class="text-amber-600 dark:text-amber-400 font-bold">🔥 14 Days</span>
            </div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60">
              <span class="text-slate-700 dark:text-slate-300">Reading Tech Docs</span>
              <span class="text-amber-600 dark:text-amber-400 font-bold">🔥 8 Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RoutineComponent {}
