import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  currentTheme = signal<Theme>('dark');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('mcc_theme') as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        this.currentTheme.set(savedTheme);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.currentTheme.set(prefersDark ? 'dark' : 'light');
      }

      this.applyTheme(this.currentTheme());

      effect(() => {
        const theme = this.currentTheme();
        this.applyTheme(theme);
        localStorage.setItem('mcc_theme', theme);
      });
    }
  }

  toggleTheme() {
    this.currentTheme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  private applyTheme(theme: Theme) {
    if (!isPlatformBrowser(this.platformId)) return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }
}
