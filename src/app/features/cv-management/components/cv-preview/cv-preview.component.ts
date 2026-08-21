import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvProfile } from '../../../../core/models/cv.model';

@Component({
  selector: 'app-cv-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cv-preview-wrapper flex flex-col items-center select-text">
      <!-- Controls Toolbar (Hidden when printing) -->
      <div class="print:hidden w-full max-w-[210mm] flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-3 rounded-t-xl border border-slate-200 dark:border-slate-700 text-xs mb-0">
        <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Exact Pixel-Perfect 1-Page A4 Resume Canvas
        </div>
        <div class="flex items-center gap-3">
          <span class="text-slate-500 dark:text-slate-400">Design: <strong class="capitalize text-slate-900 dark:text-white">Executive Curved Two-Column</strong></span>
          <span class="text-slate-500 dark:text-slate-400">Fit: <strong class="capitalize text-slate-900 dark:text-white">{{ profile?.spacing || 'normal' }} / {{ profile?.fontSize || 'base' }}</strong></span>
        </div>
      </div>

      <!-- A4 Printable Paper Canvas Container -->
      <div 
        id="cv-printable-page" 
        class="cv-page shadow-2xl transition-all duration-200 bg-white text-slate-900 relative select-text flex flex-row overflow-hidden font-sans border border-slate-200"
        [ngClass]="[
          'spacing-' + (profile?.spacing || 'normal'),
          'font-size-' + (profile?.fontSize || 'base')
        ]"
        style="width: 210mm; min-height: 297mm; max-height: 297mm; height: 297mm; box-sizing: border-box;"
      >
        <!-- LEFT SIDEBAR: DUAL-TONE (NAVY HEADER + LIGHT OFF-WHITE BODY) (35% width) -->
        <div class="w-[35%] bg-[#f0f4f8] text-[#081e36] flex flex-col justify-start relative z-10 shrink-0 border-r border-slate-300">
          
          <!-- Top Dark Navy Profile Avatar Container with Curved Bottom Curve -->
          <div class="bg-[#081e36] text-white pt-6 pb-10 px-4 flex flex-col items-center relative shadow-md" style="border-bottom-right-radius: 75px 45px;">
            <div class="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-slate-700 flex items-center justify-center shrink-0">
              <img *ngIf="profile?.personalInfo?.avatarUrl" [src]="profile?.personalInfo?.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
              <span *ngIf="!profile?.personalInfo?.avatarUrl" class="text-5xl text-white font-bold">
                {{ profile?.personalInfo?.fullName?.charAt(0) || 'J' }}
              </span>
            </div>
          </div>

          <!-- Light Sidebar Content Body (Contact, Skills, Education, Certifications, Languages) -->
          <div class="p-5 space-y-3.5 text-[10px] leading-snug">
            <!-- 👤 CONTACT -->
            <div class="space-y-2">
              <h2 class="text-[11px] font-extrabold tracking-wider uppercase border-b border-slate-300 pb-1 flex items-center gap-1.5 text-[#081e36]">
                <svg class="w-3.5 h-3.5 fill-current text-[#081e36]" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                <span>CONTACT</span>
              </h2>
              <div class="space-y-2 text-[#081e36] text-[9.5px]">
                <div *ngIf="profile?.personalInfo?.phone" class="flex items-center gap-2">
                  <span class="w-4 text-center shrink-0">📞</span>
                  <span>{{ profile?.personalInfo?.phone }}</span>
                </div>
                <div *ngIf="profile?.personalInfo?.email" class="flex items-center gap-2 truncate">
                  <span class="w-4 text-center shrink-0">✉️</span>
                  <span class="truncate">{{ profile?.personalInfo?.email }}</span>
                </div>
                <div *ngIf="profile?.personalInfo?.location" class="flex items-center gap-2">
                  <span class="w-4 text-center shrink-0">📍</span>
                  <span>{{ profile?.personalInfo?.location }}</span>
                </div>
                <div *ngIf="profile?.personalInfo?.linkedin" class="flex items-center gap-2 truncate">
                  <span class="w-4 text-center shrink-0">🔗</span>
                  <span class="truncate">{{ profile?.personalInfo?.linkedin }}</span>
                </div>
                <div *ngIf="profile?.personalInfo?.github" class="flex items-center gap-2 truncate">
                  <span class="w-4 text-center shrink-0">💻</span>
                  <span class="truncate">{{ profile?.personalInfo?.github }}</span>
                </div>
              </div>
            </div>

            <!-- ⚙️ SKILLS -->
            <div *ngIf="(profile?.skillCategories?.length || 0) > 0" class="space-y-1.5">
              <h2 class="text-[11px] font-extrabold tracking-wider uppercase border-b border-slate-300 pb-1 flex items-center gap-1.5 text-[#081e36]">
                <svg class="w-3.5 h-3.5 fill-current text-[#081e36]" viewBox="0 0 24 24"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
                <span>SKILLS</span>
              </h2>
              <div class="space-y-1 text-[9.5px] text-[#081e36]">
                <ng-container *ngFor="let cat of profile?.skillCategories">
                  <div *ngFor="let skill of cat.skills" class="flex items-start gap-1.5">
                    <span class="text-slate-500 select-none">•</span>
                    <span>{{ skill }}</span>
                  </div>
                </ng-container>
              </div>
            </div>

            <!-- 🎓 EDUCATION -->
            <div *ngIf="(profile?.education?.length || 0) > 0" class="space-y-2">
              <h2 class="text-[11px] font-extrabold tracking-wider uppercase border-b border-slate-300 pb-1 flex items-center gap-1.5 text-[#081e36]">
                <svg class="w-3.5 h-3.5 fill-current text-[#081e36]" viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
                <span>EDUCATION</span>
              </h2>
              <div *ngFor="let edu of profile?.education" class="space-y-0.5 text-[9.5px]">
                <div class="font-bold text-[#081e36] leading-tight">{{ edu.degree }}</div>
                <div class="text-slate-700 font-medium">{{ edu.institution }}</div>
                <div class="text-slate-500">{{ edu.startDate }} – {{ edu.endDate }}</div>
                <div *ngIf="edu.cgpa" class="text-[#081e36] font-normal mt-0.5">{{ edu.cgpa }}</div>
              </div>
            </div>

            <!-- 📜 CERTIFICATIONS -->
            <div *ngIf="(profile?.certifications?.length || 0) > 0" class="space-y-1.5">
              <h2 class="text-[11px] font-extrabold tracking-wider uppercase border-b border-slate-300 pb-1 flex items-center gap-1.5 text-[#081e36]">
                <svg class="w-3.5 h-3.5 fill-current text-[#081e36]" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                <span>CERTIFICATIONS</span>
              </h2>
              <div class="space-y-1 text-[9.5px] text-[#081e36]">
                <div *ngFor="let cert of profile?.certifications" class="flex items-start gap-1.5">
                  <span class="text-slate-500 select-none">•</span>
                  <span>{{ cert.title }}</span>
                </div>
              </div>
            </div>

            <!-- 🌐 LANGUAGES -->
            <div *ngIf="getLanguages().length > 0" class="space-y-2">
              <h2 class="text-[11px] font-extrabold tracking-wider uppercase border-b border-slate-300 pb-1 flex items-center gap-1.5 text-[#081e36]">
                <svg class="w-3.5 h-3.5 fill-current text-[#081e36]" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.91-4.33-3.56zm2.95-8H5.08c.96-1.65 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>
                <span>LANGUAGES</span>
              </h2>
              <div class="space-y-1.5 text-[9.5px]">
                <div *ngFor="let lang of getLanguages()" class="space-y-0.5">
                  <div class="flex justify-between items-center text-[#081e36]">
                    <span>{{ lang.name }}</span>
                  </div>
                  <div class="w-full bg-slate-300 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-[#081e36] h-full rounded-full" [style.width.%]="lang.proficiency || 80"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT MAIN CONTENT COLUMN (65% width) -->
        <div class="w-[65%] bg-white text-slate-900 p-6 flex flex-col justify-between overflow-hidden">
          <div>
            <!-- HEADER: NAME & TITLE -->
            <div class="mb-4">
              <h1 class="text-3xl font-extrabold text-[#081e36] uppercase tracking-tight font-sans mb-1 leading-none">
                {{ profile?.personalInfo?.fullName || 'JOHN DOE' }}
              </h1>
              <p class="text-xs font-bold text-[#103a6b] uppercase tracking-widest mb-2">
                {{ profile?.personalInfo?.jobTitle || 'SENIOR SOFTWARE ENGINEER' }}
              </p>
              
              <!-- Decorative Line Separator with center diamond -->
              <div class="flex items-center gap-2 my-2">
                <div class="h-[1px] bg-slate-300 flex-1"></div>
                <div class="w-1.5 h-1.5 bg-[#103a6b] rotate-45 shrink-0"></div>
                <div class="h-[1px] bg-slate-300 flex-1"></div>
              </div>

              <!-- Career Objective -->
              <div *ngIf="profile?.personalInfo?.careerObjective" class="mt-2 mb-2 p-2.5 bg-slate-50 border-l-2 border-[#103a6b] rounded-r">
                <div class="text-[10px] font-extrabold uppercase tracking-wider text-[#103a6b] mb-0.5">CAREER OBJECTIVE</div>
                <p class="text-slate-700 text-[10.5px] italic leading-snug">{{ profile?.personalInfo?.careerObjective }}</p>
              </div>

              <!-- Professional Summary -->
              <p *ngIf="profile?.personalInfo?.summary" class="text-slate-700 text-[10.5px] leading-relaxed mt-2 text-justify">
                {{ profile?.personalInfo?.summary }}
              </p>
            </div>

            <!-- 💼 EXPERIENCE -->
            <div *ngIf="(profile?.experiences?.length || 0) > 0" class="mb-4 space-y-2.5">
              <div class="flex items-center gap-2 mb-1.5">
                <div class="w-5 h-5 rounded-full bg-[#081e36] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">💼</div>
                <h2 class="text-[12px] font-extrabold uppercase tracking-wider text-[#081e36] whitespace-nowrap">EXPERIENCE</h2>
                <div class="h-[1px] bg-slate-300 flex-1"></div>
              </div>

              <div class="space-y-3">
                <div *ngFor="let exp of profile?.experiences">
                  <div class="flex justify-between items-baseline mb-0.5">
                    <span class="font-bold text-slate-900 text-[11px]">{{ exp.role }}</span>
                    <span class="text-[10px] font-semibold text-[#103a6b] font-mono">{{ exp.startDate }} – {{ exp.isCurrent ? 'Present' : exp.endDate }}</span>
                  </div>
                  <div class="text-[10.5px] font-semibold text-[#103a6b] mb-1">
                    {{ exp.company }} <span *ngIf="exp.location" class="text-slate-500 font-normal">| {{ exp.location }}</span>
                  </div>
                  <ul class="list-disc list-inside space-y-0.5 text-[10px] text-slate-700 pl-0">
                    <li *ngFor="let pt of exp.bulletPoints" class="leading-tight">{{ pt }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- 🚀 KEY PROJECTS -->
            <div *ngIf="(profile?.projects?.length || 0) > 0" class="mb-4 space-y-2.5">
              <div class="flex items-center gap-2 mb-1.5">
                <div class="w-5 h-5 rounded-full bg-[#081e36] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">🚀</div>
                <h2 class="text-[12px] font-extrabold uppercase tracking-wider text-[#081e36] whitespace-nowrap">KEY PROJECTS</h2>
                <div class="h-[1px] bg-slate-300 flex-1"></div>
              </div>

              <div class="space-y-2.5">
                <div *ngFor="let proj of profile?.projects">
                  <div class="font-bold text-slate-900 text-[11px] mb-0.5">{{ proj.title }}</div>
                  <div *ngIf="(proj.techStack?.length || 0) > 0" class="text-[10px] font-semibold text-[#103a6b] mb-1">
                    {{ proj.techStack.join(', ') }}
                  </div>
                  <p *ngIf="proj.description" class="text-[10px] text-slate-700 mb-1 leading-tight">{{ proj.description }}</p>
                  <ul *ngIf="(proj.bulletPoints?.length || 0) > 0" class="list-disc list-inside space-y-0.5 text-[10px] text-slate-700">
                    <li *ngFor="let pt of proj.bulletPoints" class="leading-tight">{{ pt }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- BOTTOM SECTION: AWARDS & EXTRA-CURRICULAR (Hidden completely if neither exists) -->
          <div *ngIf="(profile?.awards?.length || 0) > 0 || (profile?.extraCurriculars?.length || 0) > 0" 
               class="grid gap-4 border-t border-slate-200 pt-3 mt-auto"
               [ngClass]="((profile?.awards?.length || 0) > 0 && (profile?.extraCurriculars?.length || 0) > 0) ? 'grid-cols-2' : 'grid-cols-1'">
            
            <!-- 🏆 AWARDS & HONORS -->
            <div *ngIf="(profile?.awards?.length || 0) > 0">
              <div class="flex items-center gap-1.5 mb-1.5">
                <div class="w-4 h-4 rounded-full bg-[#081e36] text-white flex items-center justify-center text-[9px] shrink-0">🏆</div>
                <h3 class="text-[10.5px] font-extrabold uppercase tracking-wider text-[#081e36]">AWARDS & HONORS</h3>
                <div class="h-[1px] bg-slate-300 flex-1"></div>
              </div>
              <div class="space-y-1 text-[9.5px] text-slate-800">
                <div *ngFor="let award of profile?.awards" class="flex items-start gap-1.5">
                  <span class="text-[#103a6b] font-bold select-none">★</span>
                  <span>{{ award.title }} <span *ngIf="award.date" class="text-slate-500">– {{ award.date }}</span></span>
                </div>
              </div>
            </div>

            <!-- 👤 EXTRA-CURRICULAR -->
            <div *ngIf="(profile?.extraCurriculars?.length || 0) > 0">
              <div class="flex items-center gap-1.5 mb-1.5">
                <div class="w-4 h-4 rounded-full bg-[#081e36] text-white flex items-center justify-center text-[9px] shrink-0">👤</div>
                <h3 class="text-[10.5px] font-extrabold uppercase tracking-wider text-[#081e36]">EXTRA-CURRICULAR</h3>
                <div class="h-[1px] bg-slate-300 flex-1"></div>
              </div>
              <div class="space-y-1 text-[9.5px] text-slate-800">
                <div *ngFor="let extra of profile?.extraCurriculars" class="flex items-start gap-1.5">
                  <span class="text-[#103a6b] font-bold select-none">✓</span>
                  <span>{{ extra.role }} <span *ngIf="extra.organization" class="text-slate-500">({{ extra.organization }})</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CvPreviewComponent {
  @Input() profile: CvProfile | null = null;

  getLanguages(): any[] {
    if (this.profile && this.profile.languages && this.profile.languages.length > 0) {
      return this.profile.languages;
    }
    return [
      { id: 'l1', name: 'English', proficiency: 90 },
      { id: 'l2', name: 'Bengali', proficiency: 100 },
      { id: 'l3', name: 'German', proficiency: 65 },
      { id: 'l4', name: 'Hindi', proficiency: 80 }
    ];
  }
}
