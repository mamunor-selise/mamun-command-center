import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private platformId = inject(PLATFORM_ID);

  isCollapsed = signal<boolean>(false);
  isMobileOpen = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedCollapseState = localStorage.getItem('mcc_sidebar_collapsed');
      if (savedCollapseState !== null) {
        this.isCollapsed.set(savedCollapseState === 'true');
      }
    }
  }

  toggleCollapse() {
    this.isCollapsed.update(val => {
      const next = !val;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('mcc_sidebar_collapsed', String(next));
      }
      return next;
    });
  }

  toggleMobileMenu() {
    this.isMobileOpen.update(val => !val);
  }

  closeMobileMenu() {
    this.isMobileOpen.set(false);
  }
}
