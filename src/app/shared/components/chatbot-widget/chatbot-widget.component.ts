import { Component, signal, inject, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../../../core/services/chatbot.service';
import { CvService } from '../../../core/services/cv.service';

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Chatbot Container - Bottom Right Side -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none print:hidden">
      <!-- Chat Window Drawer -->
      @if (isOpen()) {
        <div class="w-80 sm:w-96 h-[520px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-4 duration-200 transition-colors">
          
          <!-- Chat Header -->
          <div class="bg-gradient-to-r from-indigo-700 to-indigo-900 dark:from-indigo-900 dark:to-slate-950 px-4 py-3 border-b border-indigo-800 dark:border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="relative">
                <div class="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-lg shadow-md">
                  🤖
                </div>
                <span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-indigo-900"></span>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white tracking-wide">Command AI</h3>
                <p class="text-[10px] text-indigo-200 flex items-center gap-1">
                  <span>Powered by OpenRouter</span>
                  <span>•</span>
                  <span class="font-medium text-emerald-300">{{ getModelName(chatbotService.selectedModel()) }}</span>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <!-- Settings Toggle Button -->
              <button
                (click)="toggleSettings()"
                type="button"
                class="text-indigo-200 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                [title]="showSettings() ? 'Back to Chat' : 'AI Settings & Model Selection'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <!-- Close Chat Window -->
              <button
                (click)="toggleChat()"
                type="button"
                class="text-indigo-200 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Close Chat Window"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Settings Panel Drawer -->
          @if (showSettings()) {
            <div class="p-4 bg-slate-50 dark:bg-slate-950 flex-1 flex flex-col gap-4 text-xs overflow-y-auto">
              <div>
                <h4 class="font-bold text-slate-800 dark:text-slate-200 mb-1">OpenRouter AI Model</h4>
                <p class="text-[11px] text-slate-500 mb-2">Select the AI model powering your assistant:</p>
                <div class="space-y-1.5">
                  @for (model of chatbotService.availableModels; track model.id) {
                    <button
                      (click)="selectModel(model.id)"
                      type="button"
                      class="w-full text-left px-3 py-2 rounded-xl border flex items-center justify-between transition-all"
                      [ngClass]="chatbotService.selectedModel() === model.id ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'"
                    >
                      <div>
                        <span class="font-semibold block text-slate-900 dark:text-white">{{ model.name }}</span>
                        <span class="text-[10px] text-slate-400">{{ model.provider }}</span>
                      </div>
                      @if (chatbotService.selectedModel() === model.id) {
                        <span class="text-indigo-600 dark:text-indigo-400 font-bold">✓</span>
                      }
                    </button>
                  }
                </div>
              </div>

              <div class="pt-2 border-t border-slate-200 dark:border-slate-800">
                <h4 class="font-bold text-slate-800 dark:text-slate-200 mb-1">API Key Configuration</h4>
                <p class="text-[11px] text-slate-500 mb-2">Active OpenRouter Key:</p>
                <div class="flex gap-2">
                  <input
                    type="password"
                    [value]="chatbotService.apiKey()"
                    #keyInput
                    placeholder="Enter OpenRouter Key..."
                    class="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                  />
                  <button
                    (click)="updateKey(keyInput.value)"
                    class="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl font-semibold transition-colors"
                  >
                    Save Key
                  </button>
                </div>
              </div>
            </div>
          } @else {
            <!-- Chat Messages Log Container -->
            <div #scrollContainer class="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-950/50">
              @for (msg of messages(); track msg.id) {
                <div [ngClass]="msg.sender === 'user' ? 'justify-end' : 'justify-start'" class="flex items-start gap-2.5">
                  @if (msg.sender === 'bot') {
                    <div class="w-7 h-7 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">
                      🤖
                    </div>
                  }
                  <div [ngClass]="[
                    msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none shadow-sm' : 
                    msg.isError ? 'bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl rounded-tl-none' : 
                    'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-none shadow-sm'
                  ]" class="p-3 text-xs max-w-[82%] leading-relaxed font-sans select-text">
                    <p class="whitespace-pre-wrap">{{ msg.text }}</p>
                    <span [ngClass]="msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'" class="text-[9px] block text-right mt-1 font-mono">
                      {{ msg.timestamp }}
                    </span>
                  </div>
                </div>
              }

              @if (chatbotService.isThinking()) {
                <div class="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
                  <div class="w-6 h-6 rounded-lg bg-indigo-600/10 flex items-center justify-center">🤖</div>
                  <span>Command AI is typing response...</span>
                </div>
              }
            </div>

            <!-- Quick Suggestions Toolbar -->
            <div class="px-3 py-2 bg-slate-100 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto text-[10px]">
              <button (click)="sendQuickPrompt('Review my Career Objective & CV summary')" class="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 whitespace-nowrap">
                📄 Optimize CV Objective
              </button>
              <button (click)="sendQuickPrompt('Help me write 3 high-impact CV bullet points')" class="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 whitespace-nowrap">
                🚀 CV Bullet Points
              </button>
            </div>

            <!-- Chat Footer Input Form -->
            <form (submit)="sendMessage($event)" class="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                [(ngModel)]="newMessageText"
                name="chatInput"
                placeholder="Ask Command AI..."
                class="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                [disabled]="!newMessageText.trim() || chatbotService.isThinking()"
                class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2 rounded-xl transition-all shadow-sm shrink-0"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          }
        </div>
      }

      <!-- Floating Launcher Button -->
      <button
        (click)="toggleChat()"
        type="button"
        class="h-13 w-13 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center text-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-indigo-400/30"
        title="Toggle Command AI Assistant"
      >
        @if (isOpen()) {
          ✕
        } @else {
          🤖
        }
      </button>
    </div>
  `
})
export class ChatbotWidgetComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  chatbotService = inject(ChatbotService);
  cvService = inject(CvService);

  isOpen = signal<boolean>(false);
  showSettings = signal<boolean>(false);
  newMessageText = '';

  messages = signal<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I am Command AI. I have access to your Career Objective, CV profiles, and productivity schedule. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen.update((v) => !v);
  }

  toggleSettings() {
    this.showSettings.update((v) => !v);
  }

  selectModel(modelId: string) {
    this.chatbotService.selectedModel.set(modelId);
    this.showSettings.set(false);
  }

  updateKey(key: string) {
    this.chatbotService.setApiKey(key);
    this.showSettings.set(false);
  }

  getModelName(modelId: string): string {
    const found = this.chatbotService.availableModels.find((m) => m.id === modelId);
    return found ? found.name : 'DeepSeek';
  }

  sendQuickPrompt(promptText: string) {
    this.newMessageText = promptText;
    this.sendMessage();
  }

  async sendMessage(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    const text = this.newMessageText.trim();
    if (!text || this.chatbotService.isThinking()) return;

    // Attach CV Career Objective & Context if user asks about CV
    const activeCv = this.cvService.activeProfile();
    let promptWithContext = text;

    if (activeCv && (text.toLowerCase().includes('cv') || text.toLowerCase().includes('resume') || text.toLowerCase().includes('objective') || text.toLowerCase().includes('bullet'))) {
      promptWithContext = `[USER CV CONTEXT]
Target Role: ${activeCv.targetRole}
Career Objective: ${activeCv.personalInfo.careerObjective || 'Not specified'}
Executive Summary: ${activeCv.personalInfo.summary || 'Not specified'}

User Question: ${text}`;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.messages.update((msgs) => [...msgs, userMsg]);
    this.newMessageText = '';

    try {
      // Build context payload
      const payloadMessages = this.messages().map(m => {
        if (m.id === userMsg.id) {
          return { ...m, text: promptWithContext };
        }
        return m;
      });

      const botResponseText = await this.chatbotService.sendChatMessage(payloadMessages);
      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      this.messages.update((msgs) => [...msgs, botReply]);
    } catch (err: any) {
      const errorReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `⚠️ Unable to connect to OpenRouter AI: ${err?.message || 'Unknown error'}. Please check your API key in settings.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      this.messages.update((msgs) => [...msgs, errorReply]);
    }
  }

  private scrollToBottom() {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }
}
