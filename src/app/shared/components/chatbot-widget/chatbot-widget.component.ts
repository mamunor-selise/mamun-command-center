import { Component, signal, inject, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../../../core/services/chatbot.service';

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
                    type="button"
                    class="px-3 py-2 bg-indigo-600 text-white font-medium rounded-xl text-xs hover:bg-indigo-500 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>

              <button
                (click)="toggleSettings()"
                type="button"
                class="mt-auto w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-medium text-center hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Back to Chat
              </button>
            </div>
          } @else {
            <!-- Messages Container -->
            <div #scrollContainer class="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950/50 text-xs">
              @for (msg of messages(); track msg.id) {
                <div
                  class="flex flex-col"
                  [class.items-end]="msg.sender === 'user'"
                  [class.items-start]="msg.sender === 'bot'"
                >
                  <div
                    class="max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm whitespace-pre-wrap leading-relaxed border"
                    [ngClass]="msg.sender === 'user' ? 'bg-indigo-600 text-white border-transparent' : (msg.isError ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700')"
                  >
                    {{ msg.text }}
                  </div>
                  <span class="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">{{ msg.timestamp }}</span>
                </div>
              }

              <!-- Thinking / Loading Indicator -->
              @if (chatbotService.isThinking()) {
                <div class="flex flex-col items-start">
                  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
                    <span class="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span class="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span class="text-[10px] text-slate-400 mt-1 px-1">Command AI is thinking...</span>
                </div>
              }
            </div>

            <!-- Quick Action Prompts -->
            <div class="px-3 py-2 bg-slate-100 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <button
                (click)="sendQuickPrompt('Help me organize my daily routine priorities for today')"
                type="button"
                [disabled]="chatbotService.isThinking()"
                class="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-slate-300 dark:border-slate-700/70 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors disabled:opacity-50"
              >
                📅 Routine Help
              </button>
              <button
                (click)="sendQuickPrompt('Write 3 high-impact CV bullet points for an Angular & Full-Stack Developer')"
                type="button"
                [disabled]="chatbotService.isThinking()"
                class="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-slate-300 dark:border-slate-700/70 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors disabled:opacity-50"
              >
                📄 CV Bullet Points
              </button>
              <button
                (click)="sendQuickPrompt('Ask me a multiple choice quiz question on Angular Signals')"
                type="button"
                [disabled]="chatbotService.isThinking()"
                class="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 border border-slate-300 dark:border-slate-700/70 hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors disabled:opacity-50"
              >
                🧪 Angular Quiz
              </button>
            </div>

            <!-- Input Footer Form -->
            <form (submit)="sendMessage($event)" class="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                [(ngModel)]="newMessageText"
                name="chatInput"
                placeholder="Ask Command AI..."
                [disabled]="chatbotService.isThinking()"
                class="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
              />
              <button
                type="submit"
                [disabled]="!newMessageText.trim() || chatbotService.isThinking()"
                class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1"
              >
                <span>Send</span>
              </button>
            </form>
          }
        </div>
      }

      <!-- Floating Trigger Button -->
      <button
        (click)="toggleChat()"
        type="button"
        class="h-14 w-14 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center text-2xl hover:scale-105 active:scale-95 transition-all duration-200 ring-4 ring-white dark:ring-slate-900"
        [title]="isOpen() ? 'Close AI Assistant' : 'Open OpenRouter AI Assistant'"
      >
        @if (isOpen()) {
          <span>✕</span>
        } @else {
          <div class="relative">
            <span>🤖</span>
            <span class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse"></span>
          </div>
        }
      </button>
    </div>
  `
})
export class ChatbotWidgetComponent implements AfterViewChecked {
  chatbotService = inject(ChatbotService);

  @ViewChild('scrollContainer') private scrollContainer?: ElementRef;

  isOpen = signal<boolean>(false);
  showSettings = signal<boolean>(false);
  newMessageText = '';

  messages = signal<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello Mamun! I am your Command AI assistant powered by OpenRouter. How can I assist with your routine, CV, or technical quiz preparation today?',
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
    this.chatbotService.setModel(modelId);
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

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.messages.update((msgs) => [...msgs, userMsg]);
    this.newMessageText = '';

    try {
      const botResponseText = await this.chatbotService.sendChatMessage(this.messages());
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
