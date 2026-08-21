import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button
      (click)="themeService.toggleTheme()"
      class="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 text-xs font-medium"
      [title]="'Switch to ' + (themeService.currentTheme() === 'dark' ? 'Light' : 'Dark') + ' Mode'"
    >
      @if (themeService.currentTheme() === 'dark') {
        <span>☀️ Light</span>
      } @else {
        <span>🌙 Dark</span>
      }
    </button>
  `
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
