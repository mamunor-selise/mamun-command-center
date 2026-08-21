import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { ChatbotWidgetComponent } from './shared/components/chatbot-widget/chatbot-widget.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, ChatbotWidgetComponent],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <!-- Left Navigation Menu Sidebar -->
      <app-sidebar />

      <!-- Main Layout Content Column (Header + Route Content + Footer) -->
      <div class="flex-1 flex flex-col min-w-0 min-h-screen">
        <!-- Sticky Top Header Bar -->
        <app-header />

        <!-- Router Outlet Content -->
        <main class="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
          <router-outlet />
        </main>

        <!-- Page Footer -->
        <footer class="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-6 py-4 text-center text-xs text-slate-500 transition-colors">
          Mamun Command Center • Dark & Light Mode Theme Support (MCC-3)
        </footer>
      </div>

      <!-- Floating AI Chatbot Widget -->
      <app-chatbot-widget />
    </div>
  `
})
export class AppComponent {
  title = 'mamun-command-center';
}
