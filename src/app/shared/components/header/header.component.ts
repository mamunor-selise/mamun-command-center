import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LayoutService } from '../../../core/services/layout.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  template: `
    <header class="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between transition-colors print:hidden">
      <div class="flex items-center gap-3">
        <!-- Mobile Menu Hamburger Button -->
        <button
          (click)="layoutService.toggleMobileMenu()"
          type="button"
          class="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
          aria-label="Toggle Mobile Menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            @if (layoutService.isMobileOpen()) {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            } @else {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>

        <!-- Desktop Collapse Sidebar Toggle Button -->
        <button
          (click)="layoutService.toggleCollapse()"
          type="button"
          class="hidden md:flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm"
          [title]="layoutService.isCollapsed() ? 'Expand Sidebar' : 'Collapse Sidebar'"
        >
          <svg
            class="w-5 h-5 transition-transform duration-300"
            [class.rotate-180]="layoutService.isCollapsed()"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        <!-- Page Header Breadcrumb / Title -->
        <div class="flex items-center gap-2.5">
          <div class="hidden sm:flex items-center text-slate-400 text-sm">
            <span>Mamun Center</span>
            <svg class="w-4 h-4 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <h1 class="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{{ currentPageIcon() }}</span>
            <span>{{ currentPageTitle() }}</span>
          </h1>
        </div>
      </div>

      <!-- Right Header Actions -->
      <div class="flex items-center gap-3">
        <app-theme-toggle />
      </div>
    </header>
  `
})
export class HeaderComponent {
  layoutService = inject(LayoutService);
  private router = inject(Router);

  currentPageTitle = signal<string>('Dashboard');
  currentPageIcon = signal<string>('🏠');

  constructor() {
    this.updateTitle(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateTitle(event.urlAfterRedirects || event.url);
      });
  }

  private updateTitle(url: string) {
    const cleanUrl = url.split('?')[0];
    if (cleanUrl === '/' || cleanUrl === '') {
      this.currentPageTitle.set('Dashboard');
      this.currentPageIcon.set('🏠');
    } else if (cleanUrl.startsWith('/routine')) {
      this.currentPageTitle.set('Daily Routine');
      this.currentPageIcon.set('📅');
    } else if (cleanUrl.startsWith('/cv-management')) {
      this.currentPageTitle.set('CV Management');
      this.currentPageIcon.set('📄');
    } else if (cleanUrl.startsWith('/quiz-test')) {
      this.currentPageTitle.set('Quiz Test Engine');
      this.currentPageIcon.set('🧪');
    } else {
      this.currentPageTitle.set('Mamun Command Center');
      this.currentPageIcon.set('⚡');
    }
  }
}
