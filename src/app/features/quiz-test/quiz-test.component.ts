import { Component } from '@angular/core';

@Component({
  selector: 'app-quiz-test',
  standalone: true,
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            🧪 Quiz & Knowledge Test Engine
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Practice timed questions, review weak spots, and track topic mastery.</p>
        </div>
        <button class="bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          ⚡ Quick Test (10 Qs)
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-6 shadow-sm dark:shadow-none">
          <div class="text-sm font-semibold text-amber-600 dark:text-amber-400">Angular & Frontend Architecture</div>
          <div class="text-2xl font-bold text-slate-900 dark:text-white mt-2">88% Mastery</div>
          <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">120 Questions Answered</p>
        </div>

        <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-6 shadow-sm dark:shadow-none">
          <div class="text-sm font-semibold text-indigo-600 dark:text-indigo-400">System Design & Databases</div>
          <div class="text-2xl font-bold text-slate-900 dark:text-white mt-2">76% Mastery</div>
          <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">85 Questions Answered</p>
        </div>

        <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-6 shadow-sm dark:shadow-none">
          <div class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">AI Prompting & LLM Agents</div>
          <div class="text-2xl font-bold text-slate-900 dark:text-white mt-2">92% Mastery</div>
          <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">150 Questions Answered</p>
        </div>
      </div>
    </div>
  `
})
export class QuizTestComponent {}
