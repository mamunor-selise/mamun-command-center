import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvProfile } from '../../../../core/models/cv.model';

@Component({
  selector: 'app-cv-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cv-preview-wrapper flex flex-col items-center">
      <!-- Controls Toolbar (Hidden when printing) -->
      <div class="print:hidden w-full max-w-[210mm] flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-3 rounded-t-xl border border-slate-200 dark:border-slate-700 text-xs mb-0">
        <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          A4 Single Page Live Canvas
        </div>
        <div class="flex items-center gap-3">
          <span class="text-slate-500 dark:text-slate-400">Template: <strong class="capitalize text-slate-800 dark:text-slate-200">{{ profile?.templateStyle || 'modern' }}</strong></span>
          <span class="text-slate-500 dark:text-slate-400">Fit: <strong class="capitalize text-slate-800 dark:text-slate-200">{{ profile?.spacing || 'normal' }} / {{ profile?.fontSize || 'base' }}</strong></span>
        </div>
      </div>

      <!-- A4 Printable Paper Container -->
      <div 
        id="cv-printable-page" 
        class="cv-page shadow-2xl transition-all duration-200 bg-white text-slate-800 relative select-text"
        [ngClass]="[
          'style-' + (profile?.templateStyle || 'modern'),
          'spacing-' + (profile?.spacing || 'normal'),
          'font-size-' + (profile?.fontSize || 'base')
        ]"
      >
        <!-- MODERN TEMPLATE LAYOUT -->
        <ng-container *ngIf="(profile?.templateStyle || 'modern') === 'modern'">
          <div class="h-full flex flex-col justify-between p-7 text-[12px] leading-relaxed">
            <!-- Header Section -->
            <div class="border-b-2 border-slate-800 pb-4 mb-4 flex items-start justify-between gap-4">
              <div class="flex-1">
                <h1 class="text-2xl font-bold tracking-tight text-slate-900 uppercase font-sans mb-1">
                  {{ profile?.personalInfo?.fullName || 'Mamun Or Rashid' }}
                </h1>
                <p class="text-sm font-semibold text-emerald-700 tracking-wide mb-2">
                  {{ profile?.personalInfo?.jobTitle || 'Senior Full-Stack Engineer' }}
                </p>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600">
                  <span *ngIf="profile?.personalInfo?.email">📧 {{ profile?.personalInfo?.email }}</span>
                  <span *ngIf="profile?.personalInfo?.phone">📞 {{ profile?.personalInfo?.phone }}</span>
                  <span *ngIf="profile?.personalInfo?.location">📍 {{ profile?.personalInfo?.location }}</span>
                  <span *ngIf="profile?.personalInfo?.linkedin">🔗 {{ profile?.personalInfo?.linkedin }}</span>
                  <span *ngIf="profile?.personalInfo?.github">💻 {{ profile?.personalInfo?.github }}</span>
                </div>
              </div>
              <div *ngIf="profile?.personalInfo?.avatarUrl" class="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-600 shrink-0">
                <img [src]="profile?.personalInfo?.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- Main Content 2-Column Split -->
            <div class="grid grid-cols-12 gap-5 flex-1 overflow-hidden">
              <!-- Left Main Column (Summary, Experience, Projects) -->
              <div class="col-span-8 space-y-4">
                <!-- Summary -->
                <div *ngIf="profile?.personalInfo?.summary">
                  <h2 class="text-[12px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-600"></span> Summary
                  </h2>
                  <p class="text-slate-700 leading-snug text-[11px]">
                    {{ profile?.personalInfo?.summary }}
                  </p>
                </div>

                <!-- Experience -->
                <div *ngIf="profile?.experiences && profile!.experiences.length > 0">
                  <h2 class="text-[12px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-600"></span> Work Experience
                  </h2>
                  <div class="space-y-3">
                    <div *ngFor="let exp of profile?.experiences" class="relative">
                      <div class="flex items-baseline justify-between mb-0.5">
                        <span class="font-bold text-slate-900 text-[11.5px]">{{ exp.role }}</span>
                        <span class="text-[10px] text-slate-500 font-medium">{{ exp.startDate }} - {{ exp.isCurrent ? 'Present' : exp.endDate }}</span>
                      </div>
                      <div class="text-[11px] text-emerald-800 font-semibold mb-1">
                        {{ exp.company }} <span class="text-slate-400 font-normal">| {{ exp.location }}</span>
                      </div>
                      <ul class="list-disc list-inside space-y-0.5 text-[10.5px] text-slate-700">
                        <li *ngFor="let pt of exp.bulletPoints" class="leading-tight">{{ pt }}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Featured Projects -->
                <div *ngIf="profile?.projects && profile!.projects.length > 0">
                  <h2 class="text-[12px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-600"></span> Key Projects
                  </h2>
                  <div class="space-y-2">
                    <div *ngFor="let proj of profile?.projects">
                      <div class="flex items-baseline justify-between">
                        <span class="font-bold text-slate-900 text-[11px]">{{ proj.title }}</span>
                        <span *ngIf="proj.link" class="text-[9.5px] text-blue-600 underline font-mono">{{ proj.link }}</span>
                      </div>
                      <p class="text-[10.5px] text-slate-700 leading-tight mb-1">{{ proj.description }}</p>
                      <div class="flex flex-wrap gap-1">
                        <span *ngFor="let tech of proj.techStack" class="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-mono font-medium">
                          {{ tech }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Sidebar Column (Skills, Education, Certifications) -->
              <div class="col-span-4 space-y-4 border-l border-slate-200 pl-4">
                <!-- Skill Categories -->
                <div *ngIf="profile?.skillCategories && profile!.skillCategories.length > 0">
                  <h2 class="text-[12px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Skills & Tech
                  </h2>
                  <div class="space-y-2.5">
                    <div *ngFor="let cat of profile?.skillCategories">
                      <div class="text-[10.5px] font-bold text-slate-800 mb-1">{{ cat.name }}</div>
                      <div class="flex flex-wrap gap-1">
                        <span *ngFor="let skill of cat.skills" class="px-1.5 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded text-[9.5px]">
                          {{ skill }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Education -->
                <div *ngIf="profile?.education && profile!.education.length > 0">
                  <h2 class="text-[12px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Education
                  </h2>
                  <div class="space-y-2">
                    <div *ngFor="let edu of profile?.education">
                      <div class="font-bold text-slate-900 text-[11px]">{{ edu.degree }}</div>
                      <div class="text-[10.5px] text-slate-700">{{ edu.institution }}</div>
                      <div class="text-[10px] text-slate-500">{{ edu.startDate }} - {{ edu.endDate }}</div>
                    </div>
                  </div>
                </div>

                <!-- Certifications -->
                <div *ngIf="profile?.certifications && profile!.certifications.length > 0">
                  <h2 class="text-[12px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Certifications
                  </h2>
                  <div class="space-y-1.5">
                    <div *ngFor="let cert of profile?.certifications">
                      <div class="font-bold text-slate-900 text-[10.5px]">{{ cert.title }}</div>
                      <div class="text-[9.5px] text-slate-600">{{ cert.issuer }} ({{ cert.date }})</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- MINIMAL TEMPLATE LAYOUT -->
        <ng-container *ngIf="profile?.templateStyle === 'minimal'">
          <div class="h-full flex flex-col justify-between p-8 text-[11.5px] leading-relaxed">
            <!-- Header -->
            <div class="text-center border-b border-slate-300 pb-4 mb-4">
              <h1 class="text-2xl font-serif font-bold text-slate-900 tracking-wide mb-1">
                {{ profile?.personalInfo?.fullName }}
              </h1>
              <div class="text-xs uppercase tracking-widest text-slate-600 font-mono mb-2">
                {{ profile?.personalInfo?.jobTitle }}
              </div>
              <div class="flex justify-center flex-wrap items-center gap-3 text-[10.5px] text-slate-600">
                <span *ngIf="profile?.personalInfo?.email">{{ profile?.personalInfo?.email }}</span>
                <span *ngIf="profile?.personalInfo?.phone">• {{ profile?.personalInfo?.phone }}</span>
                <span *ngIf="profile?.personalInfo?.location">• {{ profile?.personalInfo?.location }}</span>
                <span *ngIf="profile?.personalInfo?.linkedin">• {{ profile?.personalInfo?.linkedin }}</span>
              </div>
            </div>

            <!-- Single Column Body -->
            <div class="space-y-4 flex-1">
              <div *ngIf="profile?.personalInfo?.summary" class="text-slate-700 italic text-center max-w-xl mx-auto text-[11px]">
                "{{ profile?.personalInfo?.summary }}"
              </div>

              <!-- Experience -->
              <div *ngIf="profile?.experiences && profile!.experiences.length > 0">
                <h2 class="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 pb-0.5 mb-2">
                  Professional Experience
                </h2>
                <div class="space-y-3">
                  <div *ngFor="let exp of profile?.experiences">
                    <div class="flex justify-between items-baseline font-bold text-slate-900 text-[11px]">
                      <span>{{ exp.role }} — <span class="font-normal italic">{{ exp.company }}</span></span>
                      <span class="text-[10px] font-mono text-slate-500">{{ exp.startDate }} – {{ exp.isCurrent ? 'Present' : exp.endDate }}</span>
                    </div>
                    <ul class="list-disc list-inside space-y-0.5 text-[10.5px] text-slate-700 mt-1">
                      <li *ngFor="let pt of exp.bulletPoints">{{ pt }}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Skills & Education Grid -->
              <div class="grid grid-cols-2 gap-6 pt-2">
                <div>
                  <h2 class="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 pb-0.5 mb-2">
                    Core Technical Skills
                  </h2>
                  <div class="space-y-1 text-[10.5px]">
                    <div *ngFor="let cat of profile?.skillCategories">
                      <strong class="text-slate-800">{{ cat.name }}:</strong> {{ cat.skills.join(', ') }}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 class="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 pb-0.5 mb-2">
                    Education & Credentials
                  </h2>
                  <div *ngFor="let edu of profile?.education" class="text-[10.5px]">
                    <div class="font-bold text-slate-900">{{ edu.degree }}</div>
                    <div class="text-slate-600">{{ edu.institution }} ({{ edu.startDate }} - {{ edu.endDate }})</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- EXECUTIVE TEMPLATE LAYOUT -->
        <ng-container *ngIf="profile?.templateStyle === 'executive'">
          <div class="h-full flex flex-col justify-between text-[11.5px]">
            <!-- Top Dark Banner -->
            <div class="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold tracking-tight mb-1">{{ profile?.personalInfo?.fullName }}</h1>
                <p class="text-emerald-400 font-medium text-xs tracking-wider uppercase">{{ profile?.personalInfo?.jobTitle }}</p>
                <div class="flex flex-wrap gap-3 text-[10px] text-slate-300 mt-2">
                  <span *ngIf="profile?.personalInfo?.email">📧 {{ profile?.personalInfo?.email }}</span>
                  <span *ngIf="profile?.personalInfo?.phone">📞 {{ profile?.personalInfo?.phone }}</span>
                  <span *ngIf="profile?.personalInfo?.location">📍 {{ profile?.personalInfo?.location }}</span>
                </div>
              </div>
              <div *ngIf="profile?.personalInfo?.avatarUrl" class="w-16 h-16 rounded-lg overflow-hidden border-2 border-emerald-400 shrink-0">
                <img [src]="profile?.personalInfo?.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- Body Split -->
            <div class="p-6 grid grid-cols-12 gap-5 flex-1">
              <div class="col-span-8 space-y-4">
                <div *ngIf="profile?.personalInfo?.summary">
                  <h3 class="text-[11px] font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 mb-1.5 border-l-4 border-slate-900">
                    Executive Profile
                  </h3>
                  <p class="text-[10.5px] text-slate-700 leading-snug">{{ profile?.personalInfo?.summary }}</p>
                </div>

                <div *ngIf="profile?.experiences && profile!.experiences.length > 0">
                  <h3 class="text-[11px] font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 mb-2 border-l-4 border-slate-900">
                    Career History
                  </h3>
                  <div class="space-y-3">
                    <div *ngFor="let exp of profile?.experiences">
                      <div class="flex justify-between font-bold text-slate-900 text-[11px]">
                        <span>{{ exp.role }}</span>
                        <span class="text-[10px] text-slate-500 font-normal">{{ exp.startDate }} - {{ exp.isCurrent ? 'Present' : exp.endDate }}</span>
                      </div>
                      <div class="text-[10.5px] font-medium text-slate-700 mb-1">{{ exp.company }}</div>
                      <ul class="list-disc list-inside space-y-0.5 text-[10px] text-slate-600">
                        <li *ngFor="let pt of exp.bulletPoints">{{ pt }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-span-4 space-y-4 border-l border-slate-200 pl-4">
                <div>
                  <h3 class="text-[11px] font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 mb-2 border-l-4 border-slate-900">
                    Competencies
                  </h3>
                  <div *ngFor="let cat of profile?.skillCategories" class="mb-2">
                    <div class="text-[10px] font-bold text-slate-800">{{ cat.name }}</div>
                    <div class="text-[9.5px] text-slate-600">{{ cat.skills.join(' • ') }}</div>
                  </div>
                </div>

                <div>
                  <h3 class="text-[11px] font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 mb-2 border-l-4 border-slate-900">
                    Education
                  </h3>
                  <div *ngFor="let edu of profile?.education" class="text-[10px]">
                    <div class="font-bold text-slate-900">{{ edu.degree }}</div>
                    <div class="text-slate-600">{{ edu.institution }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- COMPACT TECH TEMPLATE LAYOUT -->
        <ng-container *ngIf="profile?.templateStyle === 'compact'">
          <div class="h-full flex flex-col justify-between p-5 text-[10.5px] leading-tight font-sans">
            <!-- Header Compact -->
            <div class="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div>
                <h1 class="text-xl font-bold text-slate-900 font-mono">{{ profile?.personalInfo?.fullName }}</h1>
                <p class="text-xs font-bold text-blue-700 font-mono">{{ profile?.personalInfo?.jobTitle }}</p>
              </div>
              <div class="text-right text-[9.5px] text-slate-600 font-mono space-y-0.5">
                <div>{{ profile?.personalInfo?.email }} | {{ profile?.personalInfo?.phone }}</div>
                <div>{{ profile?.personalInfo?.location }} | {{ profile?.personalInfo?.github }}</div>
              </div>
            </div>

            <!-- Compact Grid -->
            <div class="space-y-3 flex-1">
              <div *ngIf="profile?.personalInfo?.summary" class="bg-blue-50/50 p-2 rounded border border-blue-100 text-[10px] text-slate-800">
                {{ profile?.personalInfo?.summary }}
              </div>

              <!-- Experience -->
              <div *ngIf="profile?.experiences && profile!.experiences.length > 0">
                <div class="font-mono font-bold text-[11px] text-slate-900 border-b border-slate-400 pb-0.5 mb-1.5 uppercase">
                  > Experience
                </div>
                <div class="space-y-2">
                  <div *ngFor="let exp of profile?.experiences">
                    <div class="flex justify-between font-bold text-slate-900">
                      <span>{{ exp.role }} &#64; {{ exp.company }}</span>
                      <span class="font-mono text-[9px] text-slate-500">{{ exp.startDate }} - {{ exp.isCurrent ? 'Present' : exp.endDate }}</span>
                    </div>
                    <ul class="list-disc list-inside space-y-0.5 text-[9.5px] text-slate-700 mt-0.5">
                      <li *ngFor="let pt of exp.bulletPoints">{{ pt }}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Skills & Projects Split -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="font-mono font-bold text-[11px] text-slate-900 border-b border-slate-400 pb-0.5 mb-1.5 uppercase">
                    > Tech Stack
                  </div>
                  <div *ngFor="let cat of profile?.skillCategories" class="mb-1">
                    <span class="font-bold text-[9.5px] text-slate-800">{{ cat.name }}: </span>
                    <span class="text-[9px] text-slate-700">{{ cat.skills.join(', ') }}</span>
                  </div>
                </div>

                <div>
                  <div class="font-mono font-bold text-[11px] text-slate-900 border-b border-slate-400 pb-0.5 mb-1.5 uppercase">
                    > Education & Info
                  </div>
                  <div *ngFor="let edu of profile?.education" class="mb-1 text-[9.5px]">
                    <div class="font-bold text-slate-900">{{ edu.degree }}</div>
                    <div class="text-slate-600">{{ edu.institution }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    /* A4 Dimensions for Preview Screen: 210mm x 297mm */
    .cv-page {
      width: 210mm;
      height: 297mm;
      min-height: 297mm;
      max-height: 297mm;
      box-sizing: border-box;
      overflow: hidden;
      margin: 0 auto;
      background: #ffffff;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    }

    /* Scaling / Font size modifier classes */
    .font-size-sm { font-size: 10px; }
    .font-size-base { font-size: 11.5px; }
    .font-size-lg { font-size: 13px; }

    .spacing-compact .space-y-4 { gap: 0.5rem; }
    .spacing-compact .space-y-3 { gap: 0.35rem; }
    .spacing-compact .space-y-2 { gap: 0.25rem; }
    
    .spacing-relaxed .space-y-4 { gap: 1.25rem; }
    .spacing-relaxed .space-y-3 { gap: 1rem; }

    /* Direct Browser Window Print Engine */
    @media print {
      body * {
        visibility: hidden;
      }
      .cv-preview-wrapper,
      #cv-printable-page,
      #cv-printable-page * {
        visibility: visible;
      }
      .cv-preview-wrapper {
        position: fixed !important;
        left: 0 !important;
        top: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important;
        z-index: 99999 !important;
      }
      #cv-printable-page {
        position: fixed !important;
        left: 0 !important;
        top: 0 !important;
        width: 210mm !important;
        height: 297mm !important;
        max-height: 297mm !important;
        box-shadow: none !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      @page {
        size: A4 portrait;
        margin: 0;
      }
    }
  `]
})
export class CvPreviewComponent {
  @Input() profile: CvProfile | null = null;
}
