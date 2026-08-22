import { Component } from '@angular/core';
import { AiTrendsSectionComponent } from './components/ai-trends-section/ai-trends-section.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AiTrendsSectionComponent],
  template: `
    <div class="space-y-6">
      <!-- Main Dashboard Grid Layout: Middle Panel (Empty) & Right Panel (AI Tools Pulse) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Middle Panel (Currently Empty workspace) -->
        <div class="lg:col-span-7 xl:col-span-8 space-y-6">
          <div class="border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[450px] bg-slate-50/50 dark:bg-slate-900/20">
            <div class="h-16 w-16 rounded-2xl bg-slate-200/50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center text-3xl mb-4">
              📊
            </div>
            <h3 class="text-base font-bold text-slate-700 dark:text-slate-300">Dashboard Workspace Panel</h3>
            <p class="text-xs text-slate-500 dark:text-slate-500 max-w-sm mt-1 leading-relaxed">
              This central panel is currently unassigned and ready for upcoming modules, widgets, or daily routine overview cards.
            </p>
          </div>
        </div>

        <!-- Right Panel: AI Intelligence & Tools Pulse -->
        <div class="lg:col-span-5 xl:col-span-4">
          <app-ai-trends-section></app-ai-trends-section>
        </div>

      </div>
    </div>
  `
})
export class DashboardComponent { }
