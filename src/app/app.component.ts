import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <header class="border-b border-slate-800 bg-slate-950 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">
            M
          </div>
          <h1 class="text-xl font-semibold text-white tracking-wide">Mamun Command Center</h1>
        </div>
        <div class="flex items-center gap-4 text-sm text-slate-400">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Angular 19 Baseline
          </span>
        </div>
      </header>

      <main class="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Module 1: Daily Routine -->
        <div class="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition-colors">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-lg text-slate-100 flex items-center gap-2">
              📅 Daily Routine
            </h2>
            <span class="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Phase 2</span>
          </div>
          <p class="text-sm text-slate-400 mb-4">
            Time-blocked scheduler, task priority queue, and habit streak tracker.
          </p>
          <div class="text-xs text-indigo-400 font-medium">Ready for implementation</div>
        </div>

        <!-- Module 2: CV Management -->
        <div class="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition-colors">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-lg text-slate-100 flex items-center gap-2">
              📄 CV Management
            </h2>
            <span class="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Phase 3</span>
          </div>
          <p class="text-sm text-slate-400 mb-4">
            Master profile repository, targeted variant generator, and PDF exporter.
          </p>
          <div class="text-xs text-indigo-400 font-medium">Ready for implementation</div>
        </div>

        <!-- Module 3: Quiz Test -->
        <div class="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition-colors">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-lg text-slate-100 flex items-center gap-2">
              🧪 Quiz Test Engine
            </h2>
            <span class="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Phase 4</span>
          </div>
          <p class="text-sm text-slate-400 mb-4">
            Question bank management, timed practice tests, and mastery analytics.
          </p>
          <div class="text-xs text-indigo-400 font-medium">Ready for implementation</div>
        </div>

        <!-- Module 4: Chat Bot -->
        <div class="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition-colors">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-lg text-slate-100 flex items-center gap-2">
              🤖 AI Chatbot
            </h2>
            <span class="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Phase 5</span>
          </div>
          <p class="text-sm text-slate-400 mb-4">
            Contextual AI assistant linked to routines, notes, and quiz topics.
          </p>
          <div class="text-xs text-indigo-400 font-medium">Ready for implementation</div>
        </div>
      </main>

      <footer class="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500">
        Mamun Command Center Baseline • Phase 1 Setup (Jira MCC-1)
      </footer>
    </div>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'mamun-command-center';
}
