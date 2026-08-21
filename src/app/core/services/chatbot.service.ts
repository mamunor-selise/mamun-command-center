import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isError?: boolean;
}

export interface AIModelOption {
  id: string;
  name: string;
  provider: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private platformId = inject(PLATFORM_ID);

  apiKey = signal<string>('');
  selectedModel = signal<string>('deepseek/deepseek-chat');
  isThinking = signal<boolean>(false);

  availableModels: AIModelOption[] = [
    { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', provider: 'DeepSeek' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
    { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5', provider: 'Google' },
    { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', provider: 'Meta' },
  ];

  constructor() {
    let initialKey = environment.openRouterApiKey || '';

    if (isPlatformBrowser(this.platformId)) {
      const savedKey = localStorage.getItem('mcc_openrouter_key');
      if (savedKey) {
        initialKey = savedKey;
      }
      const savedModel = localStorage.getItem('mcc_openrouter_model');
      if (savedModel) {
        this.selectedModel.set(savedModel);
      }
    }

    this.apiKey.set(initialKey);
  }

  setApiKey(key: string) {
    const trimmed = key.trim();
    this.apiKey.set(trimmed);
    if (isPlatformBrowser(this.platformId)) {
      if (trimmed) {
        localStorage.setItem('mcc_openrouter_key', trimmed);
      } else {
        localStorage.removeItem('mcc_openrouter_key');
      }
    }
  }

  setModel(modelId: string) {
    this.selectedModel.set(modelId);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('mcc_openrouter_model', modelId);
    }
  }

  async sendChatMessage(messages: ChatMessage[]): Promise<string> {
    this.isThinking.set(true);

    try {
      const apiMessages = [
        {
          role: 'system',
          content: 'You are Mamun\'s AI Command Center Assistant. Help Mamun manage his daily routine, CVs, and technical quizzes efficiently, professionally, and concisely. Keep answers clear, engaging, and well-structured.'
        },
        ...messages.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      ];

      const userCustomKey = this.apiKey().trim();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (userCustomKey) {
        headers['X-Client-Api-Key'] = userCustomKey;
        headers['Authorization'] = `Bearer ${userCustomKey}`;
      }

      const body = JSON.stringify({
        model: this.selectedModel(),
        messages: apiMessages
      });

      let response: Response;

      // 1. Try Vercel Serverless Function Endpoint (/api/chat)
      try {
        response = await fetch('/api/chat', {
          method: 'POST',
          headers,
          body
        });

        // If local dev without vercel api (404) and user has custom key, call OpenRouter directly
        if (response.status === 404 && userCustomKey) {
          response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${userCustomKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'http://localhost:4200',
              'X-Title': 'Mamun Command Center'
            },
            body
          });
        }
      } catch (networkErr) {
        // Fallback for direct client-side fetch if /api/chat is unreachable
        if (userCustomKey) {
          response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${userCustomKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'http://localhost:4200',
              'X-Title': 'Mamun Command Center'
            },
            body
          });
        } else {
          throw networkErr;
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errMsg);
      }

      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content;

      if (!botReply) {
        throw new Error('Received an empty response from OpenRouter AI.');
      }

      return botReply.trim();
    } catch (err: any) {
      console.error('OpenRouter Chatbot Error:', err);
      throw err;
    } finally {
      this.isThinking.set(false);
    }
  }
}
