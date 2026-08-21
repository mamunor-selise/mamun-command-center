import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CvService } from '../../../../core/services/cv.service';
import { CvProfile } from '../../../../core/models/cv.model';

@Component({
  selector: 'app-cv-ai-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-xl w-full p-6 text-slate-900 dark:text-white space-y-5">
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">✨</span>
            <div>
              <h3 class="font-bold text-lg">AI CV Generator & Optimizer</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Generate targeted resume bullet points & summary tailored to any job role.</p>
            </div>
          </div>
          <button (click)="close.emit()" class="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold">✕</button>
        </div>

        <!-- Input Form -->
        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-medium mb-1">Target Job Role / Position Title</label>
            <input type="text" [(ngModel)]="targetRole" placeholder="e.g. Senior Angular Developer, AI Solutions Engineer" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div>
            <label class="block font-medium mb-1">Prompt / Paste Job Description (Optional)</label>
            <textarea rows="3" [(ngModel)]="userPrompt" placeholder="Paste requirements from job posting, or list specific projects you want emphasized..." class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
          </div>

          <button 
            [disabled]="isGenerating || !targetRole.trim()" 
            (click)="generateCV()" 
            class="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span *ngIf="isGenerating" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ isGenerating ? 'AI is Crafting Your CV...' : '✨ Generate Tailored CV Content' }}</span>
          </button>
        </div>

        <!-- Generated Output Result -->
        <div *ngIf="aiResult" class="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <div class="font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            <span>Generated AI Proposal</span>
            <span class="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-600">Ready</span>
          </div>

          <div *ngIf="aiResult.summary">
            <strong class="block text-slate-800 dark:text-slate-200 mb-1">Executive Summary:</strong>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed italic bg-white dark:bg-slate-800 p-2.5 rounded border border-slate-200 dark:border-slate-700">{{ aiResult.summary }}</p>
          </div>

          <div *ngIf="aiResult.bulletPoints && aiResult.bulletPoints.length > 0">
            <strong class="block text-slate-800 dark:text-slate-200 mb-1">Impactful Bullet Points:</strong>
            <ul class="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
              <li *ngFor="let pt of aiResult.bulletPoints">{{ pt }}</li>
            </ul>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <button (click)="applyToActiveCV()" class="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg transition-colors">
              Apply to Current CV
            </button>
            <button (click)="createNewCVFromAI()" class="bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
              Create as New CV Variant
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CvAiModalComponent {
  @Input() isOpen = false;
  @Input() activeProfile: CvProfile | null = null;
  @Output() close = new EventEmitter<void>();

  private cvService = inject(CvService);

  targetRole = '';
  userPrompt = '';
  isGenerating = false;
  aiResult: any = null;

  async generateCV() {
    if (!this.targetRole.trim()) return;
    this.isGenerating = true;
    this.aiResult = null;

    try {
      this.aiResult = await this.cvService.generateAiCvContent(this.userPrompt, this.targetRole);
    } catch (err: any) {
      alert('AI Generation failed: ' + (err.message || 'Check your OpenRouter API key.'));
    } finally {
      this.isGenerating = false;
    }
  }

  applyToActiveCV() {
    if (!this.activeProfile || !this.aiResult) return;
    
    if (this.aiResult.summary) {
      this.activeProfile.personalInfo.summary = this.aiResult.summary;
    }
    if (this.aiResult.bulletPoints && this.activeProfile.experiences.length > 0) {
      this.activeProfile.experiences[0].bulletPoints = [
        ...this.activeProfile.experiences[0].bulletPoints,
        ...this.aiResult.bulletPoints
      ];
    }
    this.cvService.saveProfile(this.activeProfile);
    this.close.emit();
  }

  createNewCVFromAI() {
    if (!this.aiResult) return;
    const newCv = this.cvService.createNewProfile(
      `${this.targetRole} (AI Generated)`,
      this.targetRole
    );
    if (this.aiResult.summary) {
      newCv.personalInfo.summary = this.aiResult.summary;
    }
    if (this.aiResult.bulletPoints && newCv.experiences.length > 0) {
      newCv.experiences[0].bulletPoints = this.aiResult.bulletPoints;
    }
    this.cvService.saveProfile(newCv);
    this.close.emit();
  }
}
