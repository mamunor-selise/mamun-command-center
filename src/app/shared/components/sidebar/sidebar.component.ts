import { Component, inject, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { LayoutService } from '../../../core/services/layout.service';
import { AuthService } from '../../../core/services/auth.service';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  exact?: boolean;
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Mobile Drawer Backdrop Overlay -->
    @if (layoutService.isMobileOpen()) {
      <div
        (click)="layoutService.closeMobileMenu()"
        class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
      ></div>
    }

    <!-- Left Sidebar Panel -->
    <aside
      class="fixed md:sticky top-0 left-0 bottom-0 h-screen z-50 md:z-20 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out shrink-0 select-none shadow-xl md:shadow-none print:hidden"
      [class.w-64]="!layoutService.isCollapsed()"
      [class.w-20]="layoutService.isCollapsed()"
      [class.translate-x-0]="layoutService.isMobileOpen()"
      [class.-translate-x-full]="!layoutService.isMobileOpen()"
      [class.md:translate-x-0]="true"
    >
      <!-- Sidebar Header: Logo & Title -->
      <div class="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 overflow-hidden">
        <a
          routerLink="/"
          (click)="layoutService.closeMobileMenu()"
          class="flex items-center gap-3 group min-w-0"
        >
          <div class="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            S
          </div>
          @if (!layoutService.isCollapsed() || layoutService.isMobileOpen()) {
            <div class="truncate transition-opacity duration-200">
              <span class="text-sm font-bold text-slate-900 dark:text-white tracking-wide block truncate">SecureOps Center</span>
              <span class="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase block">Personal Suite</span>
            </div>
          }
        </a>

        <!-- Mobile Drawer Close Button -->
        <button
          (click)="layoutService.closeMobileMenu()"
          type="button"
          class="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close drawer"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
            routerLinkActive="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border-indigo-600 dark:border-indigo-400 shadow-sm"
            (click)="layoutService.closeMobileMenu()"
            class="group relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl border border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/80 transition-all duration-200"
            [class.justify-center]="layoutService.isCollapsed() && !layoutService.isMobileOpen()"
          >
            <!-- Icon -->
            <span class="shrink-0 text-lg group-hover:scale-110 transition-transform">
              {{ item.icon }}
            </span>

            <!-- Label -->
            @if (!layoutService.isCollapsed() || layoutService.isMobileOpen()) {
              <span class="text-sm tracking-wide truncate flex-1">
                {{ item.label }}
              </span>

              @if (item.badge) {
                <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                  {{ item.badge }}
                </span>
              }
            }

            <!-- Collapsed Hover Tooltip -->
            @if (layoutService.isCollapsed() && !layoutService.isMobileOpen()) {
              <div class="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-slate-700">
                {{ item.label }}
              </div>
            }
          </a>
        }
      </nav>

      <!-- Sidebar Bottom Action / Profile Widget -->
      <div class="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 shrink-0">
        <div class="flex items-center gap-3" [class.justify-center]="layoutService.isCollapsed() && !layoutService.isMobileOpen()">
          <div class="relative shrink-0">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
              {{ authService.currentUser()?.name?.charAt(0) || 'MR' }}
            </div>
            <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
          </div>

          @if (!layoutService.isCollapsed() || layoutService.isMobileOpen()) {
            <div class="truncate min-w-0 flex-1">
              <p class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{{ authService.currentUser()?.name || 'Mamun' }}</p>
              <p class="text-[10px] text-slate-500 dark:text-slate-400 truncate">{{ authService.isAuthenticated() ? 'Authenticated • Next.js BE' : 'Guest Mode' }}</p>
            </div>

            <button
              (click)="layoutService.toggleCollapse()"
              type="button"
              class="hidden md:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              title="Collapse menu"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          }
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  layoutService = inject(LayoutService);
  authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/', icon: '🏠', exact: true },
    { label: 'Daily Routine', route: '/routine', icon: '📅' },
    { label: 'CV Management', route: '/cv-management', icon: '📄' },
    { label: 'Quiz Test Engine', route: '/quiz-test', icon: '🧪', badge: 'v1.0' },
    { label: 'Query Builder', route: '/query-builder', icon: '⚡', badge: 'Visual' },
    { label: 'Password Vault', route: '/vault', icon: '🔐', badge: 'AES' },
  ];

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (isPlatformBrowser(this.platformId) && window.innerWidth >= 768) {
      this.layoutService.closeMobileMenu();
    }
  }
}
