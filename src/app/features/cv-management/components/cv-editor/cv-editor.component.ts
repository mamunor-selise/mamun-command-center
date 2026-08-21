import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CvProfile, WorkExperience, Education, SkillCategory, Project, Certification, Award, ExtraCurricular, Language, CvTemplateStyle } from '../../../../core/models/cv.model';

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

        <!-- Career Objective (Phase 3 Requirement) -->
        <div>
          <label class="block font-medium mb-1 text-xs flex items-center justify-between">
            <span>🎯 Career Objective (Used by AI Assistant & Resume Header)</span>
            <span class="text-[10px] text-emerald-500 font-normal">Phase 3 Requirement</span>
          </label>
          <textarea rows="2" [(ngModel)]="profile.personalInfo.careerObjective" (ngModelChange)="onModelChange()" placeholder="To leverage 5+ years of software engineering expertise in building resilient enterprise platforms and leading AI innovation." class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
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
          <button (click)="addExperience()" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
            <span>+ Add Position</span>
          </button>
        </div>

        <div *ngFor="let exp of profile.experiences; let i = index" class="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-3 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-900 dark:text-white">#{{ i + 1 }} {{ exp.role || 'New Role' }} at {{ exp.company || 'Company' }}</span>
            <button (click)="removeExperience(i)" class="text-rose-500 hover:text-rose-600 font-semibold">Remove</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block font-medium mb-1">Company Name</label>
              <input type="text" [(ngModel)]="exp.company" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label class="block font-medium mb-1">Job Role / Title</label>
              <input type="text" [(ngModel)]="exp.role" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label class="block font-medium mb-1">Location</label>
              <input type="text" [(ngModel)]="exp.location" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
            <div class="flex items-center gap-2 pt-5">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="exp.isCurrent" (ngModelChange)="onModelChange()" class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span>Currently Working Here</span>
              </label>
            </div>
            <div>
              <label class="block font-medium mb-1">Start Date</label>
              <input type="text" [(ngModel)]="exp.startDate" (ngModelChange)="onModelChange()" placeholder="2022-01" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label class="block font-medium mb-1">End Date</label>
              <input type="text" [(ngModel)]="exp.endDate" [disabled]="exp.isCurrent" (ngModelChange)="onModelChange()" placeholder="Present or 2023-12" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-50" />
            </div>
          </div>

          <div>
            <label class="block font-medium mb-1">Key Responsibilities & Bullet Points</label>
            <div *ngFor="let bullet of exp.bulletPoints; let bIndex = index; trackBy: trackByIndex" class="flex items-center gap-2 mb-2">
              <input type="text" [(ngModel)]="exp.bulletPoints[bIndex]" (ngModelChange)="onModelChange()" class="flex-1 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
              <button (click)="removeBulletPoint(exp, bIndex)" class="text-rose-500 hover:text-rose-600 text-xs">✕</button>
            </div>
            <button (click)="addBulletPoint(exp)" class="text-emerald-600 dark:text-emerald-400 hover:underline text-xs font-semibold">+ Add Bullet Point</button>
          </div>
        </div>
      </div>

      <!-- TAB 3: KEY PROJECTS -->
      <div *ngIf="activeTab === 'projects'" class="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">🚀 Key Projects</h3>
          <button (click)="addProject()" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
            <span>+ Add Project</span>
          </button>
        </div>

        <div *ngFor="let proj of profile.projects; let pIndex = index" class="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-3 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-900 dark:text-white">#{{ pIndex + 1 }} {{ proj.title || 'New Project' }}</span>
            <button (click)="removeProject(pIndex)" class="text-rose-500 hover:text-rose-600 font-semibold">Remove</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block font-medium mb-1">Project Title</label>
              <input type="text" [(ngModel)]="proj.title" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label class="block font-medium mb-1">Project Link / Repo URL</label>
              <input type="text" [(ngModel)]="proj.link" (ngModelChange)="onModelChange()" placeholder="https://github.com/..." class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
          </div>

          <div>
            <label class="block font-medium mb-1">Project Description & Impact</label>
            <textarea rows="2" [(ngModel)]="proj.description" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"></textarea>
          </div>

          <div>
            <label class="block font-medium mb-1">Technologies & Tools Used</label>
            <div class="flex flex-wrap gap-1.5 mb-2">
              <span *ngFor="let tag of proj.techStack; let tIndex = index" class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs flex items-center gap-1">
                {{ tag }}
                <button (click)="removeTechStackTag(proj, tIndex)" class="hover:text-rose-500 font-bold ml-1">✕</button>
              </span>
            </div>
            <div class="flex items-center gap-2">
              <input #techInput type="text" (keyup.enter)="addTechStackTag(proj, techInput.value); techInput.value = ''" placeholder="Type tech (e.g. Angular 19) & press Enter" class="flex-1 px-3 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs" />
              <button (click)="addTechStackTag(proj, techInput.value); techInput.value = ''" class="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">Add</button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: SKILLS -->
      <div *ngIf="activeTab === 'skills'" class="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">📌 Skills & Technologies</h3>
          <button (click)="addSkillCategory()" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
            <span>+ Add Skill Category</span>
          </button>
        </div>

        <div *ngFor="let cat of profile.skillCategories; let cIndex = index" class="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-3 text-xs">
          <div class="flex items-center justify-between">
            <input type="text" [(ngModel)]="cat.name" (ngModelChange)="onModelChange()" class="font-bold bg-transparent text-slate-900 dark:text-white border-b border-dashed border-slate-400 dark:border-slate-600 focus:outline-none" />
            <button (click)="removeSkillCategory(cIndex)" class="text-rose-500 hover:text-rose-600 font-semibold">Remove Category</button>
          </div>

          <div class="flex flex-wrap gap-1.5">
            <span *ngFor="let skill of cat.skills; let sIndex = index" class="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 shadow-sm">
              {{ skill }}
              <button (click)="removeSkillTag(cat, sIndex)" class="text-slate-400 hover:text-rose-500 font-bold">✕</button>
            </span>
          </div>

          <div class="flex items-center gap-2 pt-2">
            <input #skillInput type="text" (keyup.enter)="addSkillTag(cat, skillInput.value); skillInput.value = ''" placeholder="Type skill (e.g., RxJS, Docker) and press Enter" class="flex-1 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            <button (click)="addSkillTag(cat, skillInput.value); skillInput.value = ''" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium">Add Skill</button>
          </div>
        </div>
      </div>

      <!-- TAB 5: EDUCATION & CERTIFICATIONS -->
      <div *ngIf="activeTab === 'education'" class="space-y-6 bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <!-- Education -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-slate-900 dark:text-white">🎓 Education</h3>
            <button (click)="addEducation()" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
              + Add Education
            </button>
          </div>

          <div *ngFor="let edu of profile.education; let eIndex = index" class="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-3 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-900 dark:text-white">#{{ eIndex + 1 }} {{ edu.degree }} at {{ edu.institution }}</span>
              <button (click)="removeEducation(eIndex)" class="text-rose-500 hover:text-rose-600 font-semibold">Remove</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block font-medium mb-1">Institution Name</label>
                <input type="text" [(ngModel)]="edu.institution" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block font-medium mb-1">Degree Title</label>
                <input type="text" [(ngModel)]="edu.degree" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block font-medium mb-1">Field of Study</label>
                <input type="text" [(ngModel)]="edu.fieldOfStudy" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block font-medium mb-1">Location</label>
                <input type="text" [(ngModel)]="edu.location" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block font-medium mb-1">Start Year</label>
                <input type="text" [(ngModel)]="edu.startDate" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block font-medium mb-1">End Year</label>
                <input type="text" [(ngModel)]="edu.endDate" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
              </div>
            </div>
          </div>
        </div>

        <!-- Certifications -->
        <div class="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-slate-900 dark:text-white">📜 Professional Certifications</h3>
            <button (click)="addCertification()" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
              + Add Certification
            </button>
          </div>

          <div *ngFor="let cert of profile.certifications; let certIndex = index" class="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-3 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-900 dark:text-white">#{{ certIndex + 1 }} {{ cert.title }}</span>
              <button (click)="removeCertification(certIndex)" class="text-rose-500 hover:text-rose-600 font-semibold">Remove</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label class="block font-medium mb-1">Certification Name</label>
                <input type="text" [(ngModel)]="cert.title" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block font-medium mb-1">Issuing Organization</label>
                <input type="text" [(ngModel)]="cert.issuer" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block font-medium mb-1">Issue Date / Year</label>
                <input type="text" [(ngModel)]="cert.date" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 6: AWARDS & HONORS (Phase 3 Requirement) -->
      <div *ngIf="activeTab === 'awards'" class="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🏆 Awards & Honors</span>
            <span class="text-[10px] text-emerald-500 font-normal border border-emerald-500/30 px-2 py-0.5 rounded">Phase 3</span>
          </h3>
          <button (click)="addAward()" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
            <span>+ Add Award</span>
          </button>
        </div>

        <div *ngFor="let award of getAwards(); let aIndex = index" class="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-3 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-900 dark:text-white">#{{ aIndex + 1 }} {{ award.title || 'New Award' }}</span>
            <button (click)="removeAward(aIndex)" class="text-rose-500 hover:text-rose-600 font-semibold">Remove</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block font-medium mb-1">Award Title</label>
              <input type="text" [(ngModel)]="award.title" (ngModelChange)="onModelChange()" placeholder="e.g. Best Innovation Award" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label class="block font-medium mb-1">Issuing Organization</label>
              <input type="text" [(ngModel)]="award.issuer" (ngModelChange)="onModelChange()" placeholder="e.g. SELISE / Hackathon" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label class="block font-medium mb-1">Year / Date Received</label>
              <input type="text" [(ngModel)]="award.date" (ngModelChange)="onModelChange()" placeholder="2024" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
          </div>

          <div>
            <label class="block font-medium mb-1">Description / Key Highlights</label>
            <input type="text" [(ngModel)]="award.description" (ngModelChange)="onModelChange()" placeholder="Awarded for building an autonomous AI agent..." class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
          </div>
        </div>
      </div>

      <!-- TAB 7: EXTRA-CURRICULAR ACTIVITIES (Phase 3 Requirement) -->
      <div *ngIf="activeTab === 'extracurricular'" class="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎨 Extra-Curricular Activities</span>
            <span class="text-[10px] text-emerald-500 font-normal border border-emerald-500/30 px-2 py-0.5 rounded">Phase 3</span>
          </h3>
          <button (click)="addExtraCurricular()" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
            <span>+ Add Activity</span>
          </button>
        </div>

        <div *ngFor="let extra of getExtraCurriculars(); let exIndex = index" class="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-3 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-900 dark:text-white">#{{ exIndex + 1 }} {{ extra.role }} at {{ extra.organization }}</span>
            <button (click)="removeExtraCurricular(exIndex)" class="text-rose-500 hover:text-rose-600 font-semibold">Remove</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block font-medium mb-1">Organization / Club Name</label>
              <input type="text" [(ngModel)]="extra.organization" (ngModelChange)="onModelChange()" placeholder="e.g. University Tech Club" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label class="block font-medium mb-1">Role / Position</label>
              <input type="text" [(ngModel)]="extra.role" (ngModelChange)="onModelChange()" placeholder="e.g. Lead Organizer / Mentor" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label class="block font-medium mb-1">Start Date</label>
              <input type="text" [(ngModel)]="extra.startDate" (ngModelChange)="onModelChange()" placeholder="2021" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label class="block font-medium mb-1">End Date</label>
              <input type="text" [(ngModel)]="extra.endDate" (ngModelChange)="onModelChange()" placeholder="2023" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
          </div>

          <div>
            <label class="block font-medium mb-1">Description & Key Contributions</label>
            <input type="text" [(ngModel)]="extra.description" (ngModelChange)="onModelChange()" placeholder="Organized technical hackathons and mentored students..." class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
          </div>
        </div>
      </div>

      <!-- TAB 8: LANGUAGES -->
      <div *ngIf="activeTab === 'languages'" class="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">🌐 Spoken Languages & Proficiency</h3>
          <button (click)="addLanguage()" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
            + Add Language
          </button>
        </div>

        <div *ngFor="let lang of getLanguages(); let lIndex = index" class="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-3 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-900 dark:text-white">#{{ lIndex + 1 }} {{ lang.name }} ({{ lang.proficiency }}%)</span>
            <button (click)="removeLanguage(lIndex)" class="text-rose-500 hover:text-rose-600 font-semibold">Remove</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block font-medium mb-1">Language Name</label>
              <input type="text" [(ngModel)]="lang.name" (ngModelChange)="onModelChange()" placeholder="English" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label class="block font-medium mb-1">Proficiency Level (10-100%)</label>
              <input type="number" min="10" max="100" [(ngModel)]="lang.proficiency" (ngModelChange)="onModelChange()" class="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 9: 1-PAGE STYLING -->
      <div *ngIf="activeTab === 'layout'" class="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <h3 class="text-base font-semibold text-slate-900 dark:text-white">🎨 1-Page Layout & Font Scaling Controls</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label class="block font-medium mb-1">Template Style</label>
            <select [(ngModel)]="profile.templateStyle" (ngModelChange)="onModelChange()" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none">
              <option value="modern">Executive Navy Two-Column (Matching Design)</option>
              <option value="minimal">Minimalist Clean</option>
              <option value="executive">Executive Classic</option>
              <option value="compact">Compact Tech Specialist</option>
            </select>
          </div>

          <div>
            <label class="block font-medium mb-1">Font Scaling (A4 Fit)</label>
            <select [(ngModel)]="profile.fontSize" (ngModelChange)="onModelChange()" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none">
              <option value="sm">Small (Fits dense experience)</option>
              <option value="base">Standard (Balanced)</option>
              <option value="lg">Large (Fits concise profiles)</option>
            </select>
          </div>

          <div>
            <label class="block font-medium mb-1">Vertical Spacing (A4 Fit)</label>
            <select [(ngModel)]="profile.spacing" (ngModelChange)="onModelChange()" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none">
              <option value="compact">Compact Gap</option>
              <option value="normal">Standard Gap</option>
              <option value="relaxed">Relaxed Gap</option>
            </select>
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
    { id: 'skills', label: 'Skills', icon: '📌' },
    { id: 'education', label: 'Education & Certs', icon: '🎓' },
    { id: 'awards', label: 'Awards & Honors', icon: '🏆' },
    { id: 'extracurricular', label: 'Extra-Curricular', icon: '🎨' },
    { id: 'languages', label: 'Languages', icon: '🌐' },
    { id: 'layout', label: '1-Page Styling', icon: '📐' }
  ];

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  onModelChange() {
    if (this.profile) {
      this.profileChange.emit(this.profile);
    }
  }

  onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.profile) {
      const reader = new FileReader();
      reader.onload = () => {
        if (this.profile) {
          this.profile.personalInfo.avatarUrl = reader.result as string;
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
      company: 'New Company',
      role: 'Software Engineer',
      location: 'Location',
      startDate: '2023-01',
      endDate: 'Present',
      isCurrent: true,
      bulletPoints: ['Architected key software modules.', 'Delivered production features.']
    });
    this.onModelChange();
  }

  removeExperience(index: number) {
    if (!this.profile) return;
    this.profile.experiences.splice(index, 1);
    this.onModelChange();
  }

  addBulletPoint(exp: WorkExperience) {
    exp.bulletPoints.push('New responsibility or achievement');
    this.onModelChange();
  }

  removeBulletPoint(exp: WorkExperience, bIndex: number) {
    exp.bulletPoints.splice(bIndex, 1);
    this.onModelChange();
  }

  addProject() {
    if (!this.profile) return;
    this.profile.projects.push({
      id: 'proj-' + Date.now(),
      title: 'New Key Project',
      description: 'Built a high performance web system.',
      link: 'https://github.com/...',
      techStack: ['Angular', 'TypeScript']
    });
    this.onModelChange();
  }

  removeProject(index: number) {
    if (!this.profile) return;
    this.profile.projects.splice(index, 1);
    this.onModelChange();
  }

  addTechStackTag(proj: Project, tagStr: string) {
    const trimmed = tagStr.trim();
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

  getAwards(): Award[] {
    if (!this.profile) return [];
    if (!this.profile.awards) {
      this.profile.awards = [];
    }
    return this.profile.awards;
  }

  addAward() {
    if (!this.profile) return;
    if (!this.profile.awards) {
      this.profile.awards = [];
    }
    this.profile.awards.push({
      id: 'award-' + Date.now(),
      title: 'New Award / Honor',
      issuer: 'Issuing Body',
      date: '2024',
      description: 'Award description'
    });
    this.onModelChange();
  }

  removeAward(index: number) {
    if (!this.profile || !this.profile.awards) return;
    this.profile.awards.splice(index, 1);
    this.onModelChange();
  }

  getExtraCurriculars(): ExtraCurricular[] {
    if (!this.profile) return [];
    if (!this.profile.extraCurriculars) {
      this.profile.extraCurriculars = [];
    }
    return this.profile.extraCurriculars;
  }

  addExtraCurricular() {
    if (!this.profile) return;
    if (!this.profile.extraCurriculars) {
      this.profile.extraCurriculars = [];
    }
    this.profile.extraCurriculars.push({
      id: 'extra-' + Date.now(),
      organization: 'Organization Name',
      role: 'Role / Member',
      startDate: '2021',
      endDate: '2023',
      description: 'Activity details'
    });
    this.onModelChange();
  }

  removeExtraCurricular(index: number) {
    if (!this.profile || !this.profile.extraCurriculars) return;
    this.profile.extraCurriculars.splice(index, 1);
    this.onModelChange();
  }

  getLanguages(): Language[] {
    if (!this.profile) return [];
    if (!this.profile.languages) {
      this.profile.languages = [
        { id: 'l1', name: 'English', proficiency: 90 },
        { id: 'l2', name: 'Bengali', proficiency: 100 },
        { id: 'l3', name: 'German', proficiency: 65 },
        { id: 'l4', name: 'Hindi', proficiency: 80 }
      ];
    }
    return this.profile.languages;
  }

  addLanguage() {
    if (!this.profile) return;
    if (!this.profile.languages) {
      this.profile.languages = [];
    }
    this.profile.languages.push({
      id: 'lang-' + Date.now(),
      name: 'New Language',
      proficiency: 80
    });
    this.onModelChange();
  }

  removeLanguage(index: number) {
    if (!this.profile || !this.profile.languages) return;
    this.profile.languages.splice(index, 1);
    this.onModelChange();
  }
}
