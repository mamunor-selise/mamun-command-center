import { Component } from '@angular/core';
import { AiTrendsSectionComponent } from './components/ai-trends-section/ai-trends-section.component';
import { LlmExplanationCardComponent } from './components/llm-explanation-card/llm-explanation-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AiTrendsSectionComponent, LlmExplanationCardComponent],
  template: `
    <div class="space-y-6">
      <!-- Main Dashboard Grid Layout: Middle Panel & Right Panel (AI Tools Pulse) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Middle Content Panel: MCC-6 LLM Explanation Card -->
        <div class="lg:col-span-7 xl:col-span-8 space-y-6">
          <app-llm-explanation-card></app-llm-explanation-card>
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
