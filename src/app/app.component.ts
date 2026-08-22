import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { ChatbotWidgetComponent } from './shared/components/chatbot-widget/chatbot-widget.component';
import { AuthPageComponent } from './features/auth/auth-page.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    ChatbotWidgetComponent,
    AuthPageComponent
  ],
  template: `
    <!-- INITIAL LOADING VIEW: Sign In / Sign Up page if not authenticated -->
    <ng-container *ngIf="!authService.isAuthenticated()">
      <app-auth-page></app-auth-page>
    </ng-container>

    <!-- AUTHENTICATED VIEW: Full Mamun Command Center Application Workspace -->
    <ng-container *ngIf="authService.isAuthenticated()">
      <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row selection:bg-indigo-500 selection:text-white transition-colors duration-200">
        <!-- Left Navigation Menu Sidebar -->
        <app-sidebar />

        <!-- Main Layout Content Column (Header + Route Content + Footer) -->
        <div class="flex-1 flex flex-col min-w-0 min-h-screen">
          <!-- Sticky Top Header Bar -->
          <app-header />

          <!-- Router Outlet Content -->
          <main class="flex-1 w-full mx-auto p-4 md:p-8">
            <router-outlet />
          </main>

          <!-- Page Footer -->
          <footer class="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-6 py-4 text-center text-xs text-slate-500 transition-colors print:hidden">
            Mamun Command Center • Dark & Light Mode Theme Support (MCC-3)
          </footer>
        </div>

        <!-- Floating AI Chatbot Widget -->
        <app-chatbot-widget />
      </div>
    </ng-container>
  `
})
export class AppComponent {
  title = 'mamun-command-center';
  authService = inject(AuthService);
}
