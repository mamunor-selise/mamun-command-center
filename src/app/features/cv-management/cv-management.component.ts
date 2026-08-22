import { Component, inject, signal } from '@angular/core';
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
    <div class="space-y-6 text-slate-800 dark:text-slate-200">
      <!-- Main Header & Controls (Hidden when printing) -->
      <div class="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            📄 CV & Resume Builder
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create multi-person CVs, build role variants, and export pixel-perfect 1-page A4 PDFs.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Profile Selector -->
          <div class="relative">
            <select 
              [ngModel]="cvService.activeProfileId()" 
              (ngModelChange)="cvService.setActiveProfile($event)" 
              class="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500"
            >
              <option *ngFor="let p of cvService.profiles()" [value]="p.id">
                📋 {{ p.personalInfo.fullName || 'Person' }} - {{ p.title }}
              </option>
            </select>
          </div>

          <!-- CREATE NEW CV BUTTON -->
          <button 
            (click)="isCreateModalOpen.set(true)" 
            class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
          >
            <span>➕</span> Create New CV
          </button>

          <button (click)="duplicateVariant()" class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
            📋 Duplicate
          </button>

          <button (click)="isAiModalOpen = true" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm">
            ✨ AI Assistant
          </button>

          <button (click)="exportPdf()" class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm">
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
          <span>Active CV: <strong class="text-slate-800 dark:text-slate-200">{{ cvService.activeProfile()?.personalInfo?.fullName || 'John Doe' }} ({{ cvService.activeProfile()?.title }})</strong></span>
          <button (click)="deleteVariant()" class="text-rose-500 hover:underline font-semibold ml-2">Delete Profile</button>
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

      <!-- CREATE NEW PERSON CV MODAL -->
      <div *ngIf="isCreateModalOpen()" class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-800 w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>➕</span> Create CV for Person
            </h3>
            <button (click)="isCreateModalOpen.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-white text-base">✕</button>
          </div>

          <form (ngSubmit)="submitCreateCv()" class="space-y-4 text-xs">
            <div>
              <label class="block font-semibold mb-1">Person's Full Name</label>
              <input 
                type="text" 
                [(ngModel)]="newCvForm.personName" 
                name="personName" 
                required 
                placeholder="e.g. Sarah Smith / Alex Johnson" 
                class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            <div>
              <label class="block font-semibold mb-1">Target Job Title / Role</label>
              <input 
                type="text" 
                [(ngModel)]="newCvForm.targetRole" 
                name="targetRole" 
                required 
                placeholder="e.g. Senior Software Engineer" 
                class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            <div>
              <label class="block font-semibold mb-1">CV / Resume Profile Title</label>
              <input 
                type="text" 
                [(ngModel)]="newCvForm.title" 
                name="title" 
                placeholder="e.g. Sarah Smith - Executive Resume" 
                class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            <div class="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button type="button" (click)="isCreateModalOpen.set(false)" class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">Cancel</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/20">
                🚀 Build CV Profile
              </button>
            </div>
          </form>
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
  isCreateModalOpen = signal(false);

  newCvForm = {
    personName: '',
    targetRole: 'Senior Software Engineer',
    title: ''
  };

  onProfileUpdated(updatedProfile: CvProfile) {
    this.cvService.saveProfile(updatedProfile);
  }

  submitCreateCv() {
    if (!this.newCvForm.personName) return;
    const title = this.newCvForm.title || `${this.newCvForm.personName}'s Resume`;
    
    this.cvService.createNewProfile(title, this.newCvForm.personName, this.newCvForm.targetRole);
    this.isCreateModalOpen.set(false);
    
    // Reset form
    this.newCvForm = {
      personName: '',
      targetRole: 'Senior Software Engineer',
      title: ''
    };
  }

  duplicateVariant() {
    const active = this.cvService.activeProfile();
    if (active) {
      this.cvService.duplicateProfile(active.id);
    }
  }

  deleteVariant() {
    const active = this.cvService.activeProfile();
    if (active && confirm(`Are you sure you want to delete "${active.title}" for ${active.personalInfo.fullName}?`)) {
      this.cvService.deleteProfile(active.id);
    }
  }

  exportPdf() {
    this.cvService.exportToPdf();
  }
}
