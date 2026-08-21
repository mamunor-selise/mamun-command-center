import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CvService } from '../../core/services/cv.service';
import { CvProfile } from '../../core/models/cv.model';
import { CvPreviewComponent } from './components/cv-preview/cv-preview.component';
import { CvEditorComponent } from './components/cv-editor/cv-editor.component';
import { CvAiModalComponent } from './components/cv-ai-modal/cv-ai-modal.component';

@Component({
  selector: 'app-cv-management',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    CvPreviewComponent, 
    CvEditorComponent, 
    CvAiModalComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Main Header & Controls (Hidden when printing) -->
      <div class="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            📄 CV & Resume Management
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build tailored role variants, edit master experiences, and export pixel-perfect 1-page A4 PDFs.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Profile Selector -->
          <div class="relative">
            <select 
              [ngModel]="cvService.activeProfileId()" 
              (ngModelChange)="cvService.setActiveProfile($event)" 
              class="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500"
            >
              <option *ngFor="let p of cvService.profiles()" [value]="p.id">
                📋 {{ p.title }}
              </option>
            </select>
          </div>

          <button (click)="createVariant()" class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
            + New Variant
          </button>

          <button (click)="duplicateVariant()" class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
            📋 Duplicate
          </button>

          <button (click)="isAiModalOpen = true" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-sm">
            ✨ AI Assistant
          </button>

          <button (click)="exportPdf()" class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-sm">
            🖨️ Download PDF / Print
          </button>
        </div>
      </div>

      <!-- View Layout Selector Bar (Hidden when printing) -->
      <div class="print:hidden flex items-center justify-between bg-slate-100 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div class="flex items-center gap-1">
          <button 
            (click)="viewMode = 'split'"
            [class.bg-white]="viewMode === 'split'"
            [class.dark:bg-slate-800]="viewMode === 'split'"
            [class.text-emerald-600]="viewMode === 'split'"
            [class.dark:text-emerald-400]="viewMode === 'split'"
            [class.font-bold]="viewMode === 'split'"
            class="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 transition-all"
          >
            🖥️ Split View
          </button>
          <button 
            (click)="viewMode = 'editor'"
            [class.bg-white]="viewMode === 'editor'"
            [class.dark:bg-slate-800]="viewMode === 'editor'"
            [class.text-emerald-600]="viewMode === 'editor'"
            [class.dark:text-emerald-400]="viewMode === 'editor'"
            [class.font-bold]="viewMode === 'editor'"
            class="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 transition-all"
          >
            ✏️ Editor Only
          </button>
          <button 
            (click)="viewMode = 'preview'"
            [class.bg-white]="viewMode === 'preview'"
            [class.dark:bg-slate-800]="viewMode === 'preview'"
            [class.text-emerald-600]="viewMode === 'preview'"
            [class.dark:text-emerald-400]="viewMode === 'preview'"
            [class.font-bold]="viewMode === 'preview'"
            class="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 transition-all"
          >
            📄 1-Page A4 Canvas Only
          </button>
        </div>

        <div class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span>Active Profile: <strong class="text-slate-800 dark:text-slate-200">{{ cvService.activeProfile()?.title }}</strong></span>
          <button (click)="deleteVariant()" class="text-rose-500 hover:underline">Delete Profile</button>
        </div>
      </div>

      <!-- Main Workspace (Editor & Live Preview) -->
      <div class="grid grid-cols-1" [class.lg:grid-cols-12]="viewMode === 'split'" [class.gap-6]="viewMode === 'split'">
        <!-- Editor Section -->
        <div 
          *ngIf="viewMode === 'split' || viewMode === 'editor'" 
          class="print:hidden"
          [class.lg:col-span-6]="viewMode === 'split'"
        >
          <app-cv-editor 
            [profile]="cvService.activeProfile()" 
            (profileChange)="onProfileUpdated($event)"
          ></app-cv-editor>
        </div>

        <!-- Live Preview Section -->
        <div 
          *ngIf="viewMode === 'split' || viewMode === 'preview'" 
          [class.lg:col-span-6]="viewMode === 'split'"
          class="w-full flex justify-center"
        >
          <app-cv-preview [profile]="cvService.activeProfile()"></app-cv-preview>
        </div>
      </div>

      <!-- AI Assistant Modal -->
      <app-cv-ai-modal 
        [isOpen]="isAiModalOpen" 
        [activeProfile]="cvService.activeProfile()"
        (close)="isAiModalOpen = false"
      ></app-cv-ai-modal>
    </div>
  `
})
export class CvManagementComponent {
  cvService = inject(CvService);

  viewMode: 'split' | 'editor' | 'preview' = 'split';
  isAiModalOpen = false;

  onProfileUpdated(updatedProfile: CvProfile) {
    this.cvService.saveProfile(updatedProfile);
  }

  createVariant() {
    const name = prompt('Enter a title for this new CV Variant:', 'Full-Stack Developer Resume');
    if (name) {
      this.cvService.createNewProfile(name, name);
    }
  }

  duplicateVariant() {
    const active = this.cvService.activeProfile();
    if (active) {
      this.cvService.duplicateProfile(active.id);
    }
  }

  deleteVariant() {
    const active = this.cvService.activeProfile();
    if (active && confirm(`Are you sure you want to delete "${active.title}"?`)) {
      this.cvService.deleteProfile(active.id);
    }
  }

  exportPdf() {
    this.cvService.exportToPdf();
  }
}
