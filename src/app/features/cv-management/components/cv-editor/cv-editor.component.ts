import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CvProfile, WorkExperience, Education, SkillCategory, Project, Certification, CvTemplateStyle } from '../../../../core/models/cv.model';

@Component({
  selector: 'app-cv-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="profile" class="space-y-6 text-slate-800 dark:text-slate-200">
      <!-- Section Tabs -->
      <div class="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs font-medium">
        <button 
          *ngFor="let tab of tabs" 
          (click)="activeTab = tab.id"
          [class.bg-white]="activeTab === tab.id"
          [class.dark:bg-slate-700]="activeTab === tab.id"
          [class.text-emerald-600]="activeTab === tab.id"
          [class.dark:text-emerald-400]="activeTab === tab.id"
          [class.shadow-sm]="activeTab === tab.id"
          class="px-3 py-1.5 rounded-lg transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <!-- TAB 1: PERSONAL & PHOTO -->
      <div *ngIf="activeTab === 'personal'" class="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <h3 class="text-base font-semibold text-slate-900 dark:text-white flex items-center justify-between">
          <span>👤 Personal Information & Photo</span>
        </h3>

        <!-- Profile Photo Upload -->
        <div class="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div class="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500 bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <img *ngIf="profile.personalInfo.avatarUrl" [src]="profile.personalInfo.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
            <span *ngIf="!profile.personalInfo.avatarUrl" class="text-2xl text-slate-400 font-bold">
              {{ profile.personalInfo.fullName.charAt(0) || '👤' }}
            </span>
          </div>
          <div class="space-y-1 text-xs">
            <div class="font-medium text-slate-900 dark:text-white">Profile Photo</div>
            <p class="text-slate-500 dark:text-slate-400">Upload a professional headshot to include on your CV.</p>
            <div class="flex items-center gap-2 pt-1">
              <label class="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs transition-colors">
                Upload Image
                <input type="file" accept="image/*" class="hidden" (change)="onPhotoSelected($event)" />
              </label>
              <button *ngIf="profile.personalInfo.avatarUrl" (click)="removePhoto()" class="text-rose-500 hover:underline">
                Remove
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block font-medium mb-1">Full Name</label>
            <input type="text" [(ngModel)]="profile.personalInfo.fullName" (ngModelChange)="onModelChange()" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label class="block font-medium mb-1">Job Title</label>
            <input type="text" [(ngModel)]="profile.personalInfo.jobTitle" (ngModelChange)="onModelChange()" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label class="block font-medium mb-1">Email</label>
            <input type="email" [(ngModel)]="profile.personalInfo.email" (ngModelChange)="onModelChange()" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label class="block font-medium mb-1">Phone</label>
            <input type="text" [(ngModel)]="profile.personalInfo.phone" (ngModelChange)="onModelChange()" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label class="block font-medium mb-1">Location</label>
            <input type="text" [(ngModel)]="profile.personalInfo.location" (ngModelChange)="onModelChange()" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label class="block font-medium mb-1">LinkedIn Profile</label>
            <input type="text" [(ngModel)]="profile.personalInfo.linkedin" (ngModelChange)="onModelChange()" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://linkedin.com/in/..." />
          </div>
          <div>
            <label class="block font-medium mb-1">GitHub Profile</label>
            <input type="text" [(ngModel)]="profile.personalInfo.github" (ngModelChange)="onModelChange()" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://github.com/..." />
          </div>
          <div>
            <label class="block font-medium mb-1">Personal Website</label>
            <input type="text" [(ngModel)]="profile.personalInfo.website" (ngModelChange)="onModelChange()" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://mamun-dev.com" />
          </div>
        </div>

        <div>
          <label class="block font-medium mb-1 text-xs">Professional Executive Summary</label>
          <textarea rows="3" [(ngModel)]="profile.personalInfo.summary" (ngModelChange)="onModelChange()" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
        </div>
      </div>

      <!-- TAB 2: WORK EXPERIENCE -->
      <div *ngIf="activeTab === 'experience'" class="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">💼 Work Experience</h3>
          <button (click)="addExperience()" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
            + Add Experience
          </button>
        </div>

        <div *ngFor="let exp of profile.experiences; let idx = index" class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-xs text-emerald-600 dark:text-emerald-400">Position #{{ idx + 1 }}</span>
            <button (click)="removeExperience(idx)" class="text-rose-500 hover:text-rose-600 text-xs font-medium">Remove</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label class="block font-medium mb-1">Company / Organization</label>
              <input type="text" [(ngModel)]="exp.company" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </div>
            <div>
              <label class="block font-medium mb-1">Job Title / Role</label>
              <input type="text" [(ngModel)]="exp.role" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </div>
            <div>
              <label class="block font-medium mb-1">Start Date</label>
              <input type="text" [(ngModel)]="exp.startDate" (ngModelChange)="onModelChange()" placeholder="e.g. 2023-01" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </div>
            <div>
              <label class="block font-medium mb-1">End Date</label>
              <input type="text" [(ngModel)]="exp.endDate" [disabled]="exp.isCurrent" (ngModelChange)="onModelChange()" placeholder="e.g. Present" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-50" />
            </div>
          </div>

          <!-- Bullet Points -->
          <div class="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div class="flex items-center justify-between text-xs">
              <label class="font-medium">Key Achievements & Bullet Points</label>
              <button (click)="addBullet(exp)" class="text-emerald-600 dark:text-emerald-400 hover:underline">+ Add Bullet</button>
            </div>
            <div *ngFor="let pt of exp.bulletPoints; let bIdx = index; trackBy: trackByIndex" class="flex items-center gap-2">
              <input type="text" [(ngModel)]="exp.bulletPoints[bIdx]" (ngModelChange)="onModelChange()" class="flex-1 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
              <button (click)="removeBullet(exp, bIdx)" class="text-rose-500 text-xs px-1">✕</button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: KEY PROJECTS -->
      <div *ngIf="activeTab === 'projects'" class="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">🚀 Key Projects</h3>
          <button (click)="addProject()" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
            + Add Project
          </button>
        </div>

        <div *ngIf="!profile.projects || profile.projects.length === 0" class="text-xs text-slate-500 dark:text-slate-400 italic py-4 text-center">
          No key projects added yet. Click "+ Add Project" to highlight your portfolio projects on your CV.
        </div>

        <div *ngFor="let proj of profile.projects; let idx = index" class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-emerald-600 dark:text-emerald-400">Project #{{ idx + 1 }}</span>
            <button (click)="removeProject(idx)" class="text-rose-500 hover:text-rose-600 text-xs font-medium">Remove</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block font-medium mb-1">Project Title</label>
              <input type="text" [(ngModel)]="proj.title" (ngModelChange)="onModelChange()" placeholder="e.g. Mamun Command Center" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </div>
            <div>
              <label class="block font-medium mb-1">Role / Contribution</label>
              <input type="text" [(ngModel)]="proj.role" (ngModelChange)="onModelChange()" placeholder="e.g. Lead Developer & Architect" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </div>
            <div class="md:col-span-2">
              <label class="block font-medium mb-1">Project Link / URL</label>
              <input type="text" [(ngModel)]="proj.link" (ngModelChange)="onModelChange()" placeholder="https://github.com/username/project" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono" />
            </div>
            <div class="md:col-span-2">
              <label class="block font-medium mb-1">Description & Impact</label>
              <textarea rows="2" [(ngModel)]="proj.description" (ngModelChange)="onModelChange()" placeholder="Describe what the project does and key metrics..." class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"></textarea>
            </div>
          </div>

          <!-- Tech Stack Tags -->
          <div class="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
            <label class="block font-medium text-slate-500 dark:text-slate-400">Tech Stack Tags</label>
            <div class="flex flex-wrap gap-1.5 mb-1.5">
              <span *ngFor="let tech of proj.techStack; let tIdx = index" class="inline-flex items-center gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px]">
                {{ tech }}
                <button (click)="removeTechStackTag(proj, tIdx)" class="hover:text-rose-500 font-bold ml-1">✕</button>
              </span>
            </div>
            <div class="flex items-center gap-2">
              <input #techInput type="text" placeholder="Add tech (e.g. Angular, Node.js) & press Enter" (keyup.enter)="addTechStackTag(proj, techInput.value); techInput.value=''" class="flex-1 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
              <button (click)="addTechStackTag(proj, techInput.value); techInput.value=''" class="bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded text-xs font-medium">Add</button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: SKILLS & CATEGORIES -->
      <div *ngIf="activeTab === 'skills'" class="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">🛠️ Skills & Competencies</h3>
          <button (click)="addSkillCategory()" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
            + Add Category
          </button>
        </div>

        <div *ngFor="let cat of profile.skillCategories; let idx = index" class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div class="flex items-center justify-between gap-3 text-xs">
            <input type="text" [(ngModel)]="cat.name" (ngModelChange)="onModelChange()" placeholder="Category Name (e.g. Frontend & UI)" class="font-bold px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs flex-1" />
            <button (click)="removeSkillCategory(idx)" class="text-rose-500 hover:text-rose-600 text-xs">Remove</button>
          </div>

          <div class="text-xs space-y-2">
            <label class="block font-medium text-slate-500 dark:text-slate-400">Skills (Comma-separated or tag list)</label>
            <div class="flex flex-wrap gap-1.5 mb-2">
              <span *ngFor="let s of cat.skills; let sIdx = index" class="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-xs">
                {{ s }}
                <button (click)="removeSkillTag(cat, sIdx)" class="hover:text-rose-500 font-bold ml-1">✕</button>
              </span>
            </div>
            <div class="flex items-center gap-2">
              <input #newSkillInput type="text" placeholder="Type new skill & press Enter" (keyup.enter)="addSkillTag(cat, newSkillInput.value); newSkillInput.value=''" class="flex-1 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
              <button (click)="addSkillTag(cat, newSkillInput.value); newSkillInput.value=''" class="bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded text-xs font-medium">Add</button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 5: EDUCATION & CERTIFICATIONS -->
      <div *ngIf="activeTab === 'education'" class="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">🎓 Education & Certifications</h3>
          <button (click)="addEducation()" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
            + Add Education
          </button>
        </div>

        <div *ngFor="let edu of profile.education; let idx = index" class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-emerald-600 dark:text-emerald-400">Education #{{ idx + 1 }}</span>
            <button (click)="removeEducation(idx)" class="text-rose-500 hover:underline">Remove</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block font-medium mb-1">Degree / Qualification</label>
              <input type="text" [(ngModel)]="edu.degree" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </div>
            <div>
              <label class="block font-medium mb-1">Institution</label>
              <input type="text" [(ngModel)]="edu.institution" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </div>
            <div>
              <label class="block font-medium mb-1">Dates</label>
              <div class="flex items-center gap-2">
                <input type="text" [(ngModel)]="edu.startDate" (ngModelChange)="onModelChange()" placeholder="Start" class="w-1/2 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
                <input type="text" [(ngModel)]="edu.endDate" (ngModelChange)="onModelChange()" placeholder="End" class="w-1/2 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
              </div>
            </div>
          </div>
        </div>

        <!-- Certifications Section -->
        <div class="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold text-xs text-slate-900 dark:text-white">📜 Certifications & Credentials</h4>
            <button (click)="addCertification()" class="text-emerald-600 dark:text-emerald-400 hover:underline text-xs">+ Add Certification</button>
          </div>

          <div *ngFor="let cert of profile.certifications; let cIdx = index" class="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-medium text-emerald-600 dark:text-emerald-400">Certification #{{ cIdx + 1 }}</span>
              <button (click)="removeCertification(cIdx)" class="text-rose-500 hover:underline">Remove</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label class="block font-medium mb-1">Title</label>
                <input type="text" [(ngModel)]="cert.title" (ngModelChange)="onModelChange()" placeholder="e.g. AWS Certified Developer" class="w-full px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
              </div>
              <div>
                <label class="block font-medium mb-1">Issuer</label>
                <input type="text" [(ngModel)]="cert.issuer" (ngModelChange)="onModelChange()" placeholder="e.g. Amazon Web Services" class="w-full px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
              </div>
              <div>
                <label class="block font-medium mb-1">Year / Date</label>
                <input type="text" [(ngModel)]="cert.date" (ngModelChange)="onModelChange()" placeholder="e.g. 2023" class="w-full px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 6: TEMPLATE & PAGE FORMATTING -->
      <div *ngIf="activeTab === 'layout'" class="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <h3 class="text-base font-semibold text-slate-900 dark:text-white">🎨 Template Style & 1-Page Layout Controls</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block font-semibold mb-2">Resume Template Theme</label>
            <div class="grid grid-cols-2 gap-2">
              <button 
                *ngFor="let st of styles"
                (click)="profile.templateStyle = st.id; onModelChange()"
                [class.border-emerald-500]="profile.templateStyle === st.id"
                [class.bg-emerald-50]="profile.templateStyle === st.id"
                [class.dark:bg-emerald-950]="profile.templateStyle === st.id"
                class="p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-left transition-all hover:border-emerald-500"
              >
                <div class="font-bold text-slate-900 dark:text-white">{{ st.name }}</div>
                <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{{ st.desc }}</div>
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block font-semibold mb-1">Font Scaling (Fit to Page)</label>
              <div class="flex gap-2">
                <button (click)="profile.fontSize = 'sm'; onModelChange()" [class.bg-emerald-600]="profile.fontSize === 'sm'" [class.text-white]="profile.fontSize === 'sm'" class="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-xs flex-1">Small (Compact)</button>
                <button (click)="profile.fontSize = 'base'; onModelChange()" [class.bg-emerald-600]="profile.fontSize === 'base'" [class.text-white]="profile.fontSize === 'base'" class="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-xs flex-1">Medium (Standard)</button>
                <button (click)="profile.fontSize = 'lg'; onModelChange()" [class.bg-emerald-600]="profile.fontSize === 'lg'" [class.text-white]="profile.fontSize === 'lg'" class="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-xs flex-1">Large</button>
              </div>
            </div>

            <div>
              <label class="block font-semibold mb-1">Section Spacing</label>
              <div class="flex gap-2">
                <button (click)="profile.spacing = 'compact'; onModelChange()" [class.bg-emerald-600]="profile.spacing === 'compact'" [class.text-white]="profile.spacing === 'compact'" class="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-xs flex-1">Tight</button>
                <button (click)="profile.spacing = 'normal'; onModelChange()" [class.bg-emerald-600]="profile.spacing === 'normal'" [class.text-white]="profile.spacing === 'normal'" class="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-xs flex-1">Normal</button>
                <button (click)="profile.spacing = 'relaxed'; onModelChange()" [class.bg-emerald-600]="profile.spacing === 'relaxed'" [class.text-white]="profile.spacing === 'relaxed'" class="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-xs flex-1">Relaxed</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CvEditorComponent {
  @Input() profile: CvProfile | null = null;
  @Output() profileChange = new EventEmitter<CvProfile>();

  activeTab = 'personal';

  tabs = [
    { id: 'personal', label: 'Personal & Photo', icon: '👤' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'projects', label: 'Key Projects', icon: '🚀' },
    { id: 'skills', label: 'Skills', icon: '🛠️' },
    { id: 'education', label: 'Education & Certs', icon: '🎓' },
    { id: 'layout', label: '1-Page Styling', icon: '🎨' }
  ];

  styles: { id: CvTemplateStyle; name: string; desc: string }[] = [
    { id: 'modern', name: 'Modern Split', desc: 'Clean 2-column with emerald accents' },
    { id: 'minimal', name: 'Minimalist', desc: 'Elegant single column serif header' },
    { id: 'executive', name: 'Executive', desc: 'Dark banner with prominent headshot' },
    { id: 'compact', name: 'Compact Tech', desc: 'Dense monospaced developer layout' }
  ];

  trackByIndex(index: number): number {
    return index;
  }

  onModelChange() {
    if (this.profile) {
      this.profileChange.emit(this.profile);
    }
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.profile) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (this.profile && e.target?.result) {
          this.profile.personalInfo.avatarUrl = e.target.result as string;
          this.onModelChange();
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto() {
    if (this.profile) {
      this.profile.personalInfo.avatarUrl = '';
      this.onModelChange();
    }
  }

  addExperience() {
    if (!this.profile) return;
    this.profile.experiences.push({
      id: 'exp-' + Date.now(),
      company: 'Company Name',
      role: 'Role Title',
      location: 'Location',
      startDate: '2023',
      endDate: 'Present',
      isCurrent: true,
      bulletPoints: ['Accomplished key task using technology X.']
    });
    this.onModelChange();
  }

  removeExperience(index: number) {
    if (!this.profile) return;
    this.profile.experiences.splice(index, 1);
    this.onModelChange();
  }

  addBullet(exp: WorkExperience) {
    exp.bulletPoints.push('New key accomplishment or responsibility.');
    this.onModelChange();
  }

  removeBullet(exp: WorkExperience, index: number) {
    exp.bulletPoints.splice(index, 1);
    this.onModelChange();
  }

  addProject() {
    if (!this.profile) return;
    if (!this.profile.projects) {
      this.profile.projects = [];
    }
    this.profile.projects.push({
      id: 'proj-' + Date.now(),
      title: 'New Key Project',
      description: 'Key project description and technical achievements.',
      role: 'Lead Architect',
      link: '',
      techStack: ['TypeScript', 'Angular']
    });
    this.onModelChange();
  }

  removeProject(index: number) {
    if (!this.profile || !this.profile.projects) return;
    this.profile.projects.splice(index, 1);
    this.onModelChange();
  }

  addTechStackTag(proj: Project, techStr: string) {
    const trimmed = techStr.trim();
    if (trimmed && !proj.techStack.includes(trimmed)) {
      proj.techStack.push(trimmed);
      this.onModelChange();
    }
  }

  removeTechStackTag(proj: Project, index: number) {
    proj.techStack.splice(index, 1);
    this.onModelChange();
  }

  addSkillCategory() {
    if (!this.profile) return;
    this.profile.skillCategories.push({
      id: 'cat-' + Date.now(),
      name: 'New Skill Category',
      skills: ['Skill 1', 'Skill 2']
    });
    this.onModelChange();
  }

  removeSkillCategory(index: number) {
    if (!this.profile) return;
    this.profile.skillCategories.splice(index, 1);
    this.onModelChange();
  }

  addSkillTag(cat: SkillCategory, skillStr: string) {
    const trimmed = skillStr.trim();
    if (trimmed && !cat.skills.includes(trimmed)) {
      cat.skills.push(trimmed);
      this.onModelChange();
    }
  }

  removeSkillTag(cat: SkillCategory, index: number) {
    cat.skills.splice(index, 1);
    this.onModelChange();
  }

  addEducation() {
    if (!this.profile) return;
    this.profile.education.push({
      id: 'edu-' + Date.now(),
      degree: 'B.Sc. in Computer Science',
      institution: 'University Name',
      fieldOfStudy: 'Computer Science',
      location: 'Location',
      startDate: '2018',
      endDate: '2022'
    });
    this.onModelChange();
  }

  removeEducation(index: number) {
    if (!this.profile) return;
    this.profile.education.splice(index, 1);
    this.onModelChange();
  }

  addCertification() {
    if (!this.profile) return;
    if (!this.profile.certifications) {
      this.profile.certifications = [];
    }
    this.profile.certifications.push({
      id: 'cert-' + Date.now(),
      title: 'New Certification',
      issuer: 'Issuing Body',
      date: '2023'
    });
    this.onModelChange();
  }

  removeCertification(index: number) {
    if (!this.profile || !this.profile.certifications) return;
    this.profile.certifications.splice(index, 1);
    this.onModelChange();
  }
}
