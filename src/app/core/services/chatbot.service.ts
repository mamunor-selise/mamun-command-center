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
    // Initial key from environment variable (e.g. GitHub Secret / process.env)
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
    const activeKey = this.apiKey().trim();
    if (!activeKey) {
      throw new Error('OpenRouter API key is missing. Please set your API Key (OPEN_ROUTER_API_KEY) in settings.');
    }

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

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:4200',
          'X-Title': 'Mamun Command Center'
        },
        body: JSON.stringify({
          model: this.selectedModel(),
          messages: apiMessages
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errMsg);
      }

      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content;

      if (!botReply) {
        throw new Error('Received an empty response from OpenRouter API.');
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
