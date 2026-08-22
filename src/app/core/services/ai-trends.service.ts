import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface AiBuzzword {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  trendScore: string;
  whyItMatters?: string;
  keyTakeaway?: string;
}

export interface TrendingAiTool {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  pricing: string;
  trendingRank: number;
  icon: string;
  tags: string[];
  rating: number;
}

export interface StoreAiTool {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  pricing: string;
  icon: string;
  tags: string[];
  rating: number;
  isFeatured?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AiTrendsService {
  private platformId = inject(PLATFORM_ID);

  buzzwords = signal<AiBuzzword[]>([]);
  trendingTools = signal<TrendingAiTool[]>([]);
  storeTools = signal<StoreAiTool[]>([]);
  
  isLoading = signal<boolean>(false);
  isRefreshingOpenRouter = signal<boolean>(false);
  selectedCategory = signal<string>('All');
  searchQuery = signal<string>('');
  errorMsg = signal<string | null>(null);

  categories = signal<string[]>([
    'All',
    'Development',
    'Design',
    'Productivity',
    'LLM',
    'Research',
    'Audio',
    'Video'
  ]);

  filteredStoreTools = computed(() => {
    const category = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();
    
    return this.storeTools().filter(tool => {
      const matchesCategory = category === 'All' || tool.category.toLowerCase() === category.toLowerCase();
      const matchesQuery = !query || 
        tool.name.toLowerCase().includes(query) || 
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAiTrends();
    }
  }

  async loadAiTrends() {
    this.isLoading.set(true);
    this.errorMsg.set(null);
    try {
      const res = await fetch('/api/ai-trends');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const result = await res.json();
      if (result.success && result.data) {
        this.buzzwords.set(result.data.buzzwords || []);
        this.trendingTools.set(result.data.trendingTools || []);
        this.storeTools.set(result.data.storeTools || []);
      }
    } catch (err: any) {
      console.warn('AiTrendsService fetch failed, loading default fallback dataset:', err.message);
      this.loadFallbackData();
    } finally {
      this.isLoading.set(false);
    }
  }

  async refreshViaOpenRouter() {
    this.isRefreshingOpenRouter.set(true);
    this.errorMsg.set(null);
    try {
      const savedKey = localStorage.getItem('mcc_openrouter_key') || '';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (savedKey) {
        headers['X-Client-Api-Key'] = savedKey;
      }

      const res = await fetch('/api/ai-trends', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'refresh-openrouter' })
      });

      const result = await res.json();
      if (result.success && result.data) {
        if (result.data.buzzwords) this.buzzwords.set(result.data.buzzwords);
        if (result.data.trendingTools) this.trendingTools.set(result.data.trendingTools);
        if (result.data.storeTools) this.storeTools.set(result.data.storeTools);
      }
    } catch (err: any) {
      this.errorMsg.set('Failed to refresh trends from OpenRouter: ' + err.message);
    } finally {
      this.isRefreshingOpenRouter.set(false);
    }
  }

  async addCustomTool(toolData: Partial<StoreAiTool>) {
    try {
      const res = await fetch('/api/ai-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add-tool', tool: toolData })
      });
      const result = await res.json();
      if (result.success && result.tool) {
        this.storeTools.update(tools => [result.tool, ...tools]);
        return true;
      }
    } catch (err) {
      console.error('Error adding custom AI tool:', err);
    }
    return false;
  }

  openToolInNewTab(url: string) {
    if (!url) return;
    const finalUrl = url.startsWith('http') ? url : `https://${url}`;
    if (isPlatformBrowser(this.platformId)) {
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    }
  }

  private loadFallbackData() {
    this.buzzwords.set([
      {
        id: 'bw-1',
        title: 'Agentic Workflows & Multi-Agent Systems',
        tagline: 'Autonomous AI agents collaborating on complex tasks',
        description: 'Moving beyond single prompt-response interactions to networks of specialized AI agents that decompose problems, execute code, verify results, and self-correct.',
        category: 'Agentic AI',
        trendScore: '98%',
        whyItMatters: 'Enables end-to-end automation of software engineering, research, and operations without human intervention at every step.',
        keyTakeaway: 'Focus shifts from writing individual prompts to orchestrating agent teams.'
      },
      {
        id: 'bw-2',
        title: 'Vibe Coding',
        tagline: 'Building software by describing intent and letting AI write code',
        description: 'A term popularized by Andrej Karpathy describing a paradigm where developers write natural language prompts and review AI-generated code while focusing on high-level architecture.',
        category: 'Software Engineering',
        trendScore: '95%',
        whyItMatters: 'Reduces boilerplate coding time by 80% and lowers the barrier to entry for full-stack software prototyping.',
        keyTakeaway: 'Prompt clarity and system architecture design become the core developer skills.'
      },
      {
        id: 'bw-3',
        title: 'Model Context Protocol (MCP)',
        tagline: 'Open standard connecting AI models to tools and databases',
        description: 'An open standard released by Anthropic that allows AI applications to securely connect with local filesystems, git repositories, databases, and third-party APIs.',
        category: 'Integration Standards',
        trendScore: '92%',
        whyItMatters: 'Standardizes tool integration across different IDEs and AI assistants, eliminating custom API glue code.',
        keyTakeaway: 'Build once, connect any LLM to your developer environment seamlessly.'
      },
      {
        id: 'bw-4',
        title: 'Reasoning & Chain-of-Thought Models',
        tagline: 'Test-time compute scaling for complex mathematical & logical reasoning',
        description: 'Models like DeepSeek R1 and OpenAI o3 that spend extra compute processing internal reasoning chains before emitting final responses, achieving state-of-the-art accuracy.',
        category: 'LLM Architecture',
        trendScore: '96%',
        whyItMatters: 'Drastically improves performance on competitive programming, math proofs, and complex debugging.',
        keyTakeaway: 'Models can now "think" through edge cases before answering.'
      },
      {
        id: 'bw-5',
        title: 'Multimodal RAG & Knowledge Graphs',
        tagline: 'Retrieval Augmented Generation with vision, audio, and structured graphs',
        description: 'Combining vector databases with GraphRAG and vision models to index complex PDFs, codebase diagrams, audio recordings, and relational knowledge bases.',
        category: 'Data & RAG',
        trendScore: '89%',
        whyItMatters: 'Eliminates hallucinations by grounding responses in exact documentation and structural data.',
        keyTakeaway: 'Enterprise AI relies heavily on rich, multimodal retrieval accuracy.'
      }
    ]);

    this.trendingTools.set([
      {
        id: 'tool-1',
        name: 'Cursor AI',
        category: 'Development',
        description: 'AI-first code editor built on VS Code with deep codebase indexing, inline multi-file edits, and instant terminal command suggestions.',
        url: 'https://www.cursor.com',
        pricing: 'Freemium',
        trendingRank: 1,
        icon: '💻',
        tags: ['IDE', 'Code Generation', 'Multi-File Edit'],
        rating: 4.9
      },
      {
        id: 'tool-2',
        name: 'DeepSeek R1 & V3',
        category: 'LLM & Reasoning',
        description: 'Open-weights reasoning model with state-of-the-art performance in math, coding, and logical reasoning at a fraction of the cost.',
        url: 'https://chat.deepseek.com',
        pricing: 'Free / API',
        trendingRank: 2,
        icon: '🐳',
        tags: ['Open Weights', 'Reasoning', 'Coding'],
        rating: 4.9
      },
      {
        id: 'tool-3',
        name: 'Claude 3.7 Sonnet',
        category: 'LLM & Writing',
        description: 'Anthropic hybrid reasoning model capable of standard fast responses and deep extended thinking for code and document analysis.',
        url: 'https://claude.ai',
        pricing: 'Freemium',
        trendingRank: 3,
        icon: '🧠',
        tags: ['Extended Thinking', 'Coding', 'Writing'],
        rating: 4.8
      },
      {
        id: 'tool-4',
        name: 'v0 by Vercel',
        category: 'Design & UI',
        description: 'Generative UI system that creates responsive React, Tailwind, and HTML components from simple text prompts and design mocks.',
        url: 'https://v0.dev',
        pricing: 'Freemium',
        trendingRank: 4,
        icon: '🎨',
        tags: ['Generative UI', 'React', 'Tailwind'],
        rating: 4.7
      },
      {
        id: 'tool-5',
        name: 'Perplexity AI',
        category: 'Research & Search',
        description: 'Conversational answer engine providing real-time web search results with verified citations, research papers, and code summaries.',
        url: 'https://www.perplexity.ai',
        pricing: 'Freemium',
        trendingRank: 5,
        icon: '🔍',
        tags: ['Search Engine', 'Citations', 'Research'],
        rating: 4.8
      },
      {
        id: 'tool-6',
        name: 'ElevenLabs',
        category: 'Audio & Voice',
        description: 'Industry-leading AI voice generator, realistic text-to-speech, voice cloning, and dubbing engine in 30+ languages.',
        url: 'https://elevenlabs.io',
        pricing: 'Freemium',
        trendingRank: 6,
        icon: '🎙️',
        tags: ['Text-to-Speech', 'Voice Clone', 'Audio'],
        rating: 4.8
      }
    ]);

    this.storeTools.set([
      {
        id: 'store-1',
        name: 'Cursor AI',
        category: 'Development',
        description: 'AI-first code editor built on VS Code with codebase context and multi-file inline edits.',
        url: 'https://www.cursor.com',
        pricing: 'Freemium',
        icon: '💻',
        tags: ['IDE', 'Code Generation'],
        rating: 4.9,
        isFeatured: true
      },
      {
        id: 'store-2',
        name: 'v0 by Vercel',
        category: 'Design',
        description: 'Generative UI component builder producing React, Next.js, and Tailwind CSS code.',
        url: 'https://v0.dev',
        pricing: 'Freemium',
        icon: '🎨',
        tags: ['UI Design', 'React', 'Tailwind'],
        rating: 4.7,
        isFeatured: true
      },
      {
        id: 'store-3',
        name: 'Bolt.new',
        category: 'Development',
        description: 'In-browser AI web development sandbox powered by WebContainers to build full-stack apps from prompt.',
        url: 'https://bolt.new',
        pricing: 'Freemium',
        icon: '⚡',
        tags: ['Full Stack', 'WebContainer', 'No-Setup'],
        rating: 4.8,
        isFeatured: true
      },
      {
        id: 'store-4',
        name: 'Midjourney v6',
        category: 'Design',
        description: 'State-of-the-art photorealistic image generation engine accessible via Discord and Web UI.',
        url: 'https://www.midjourney.com',
        pricing: 'Paid',
        icon: '🖼️',
        tags: ['Image Gen', 'Photorealism', 'Art'],
        rating: 4.9,
        isFeatured: true
      },
      {
        id: 'store-5',
        name: 'Perplexity AI',
        category: 'Research',
        description: 'AI research search engine with cited answers, deep research mode, and instant summary.',
        url: 'https://www.perplexity.ai',
        pricing: 'Freemium',
        icon: '🔍',
        tags: ['Search', 'Research', 'Citations'],
        rating: 4.8,
        isFeatured: false
      },
      {
        id: 'store-6',
        name: 'ElevenLabs Voice AI',
        category: 'Audio',
        description: 'Ultra-realistic human text-to-speech, voice generation, and multilingual sound design.',
        url: 'https://elevenlabs.io',
        pricing: 'Freemium',
        icon: '🎙️',
        tags: ['Voice Synthesis', 'Dubbing', 'Audio'],
        rating: 4.8,
        isFeatured: false
      },
      {
        id: 'store-7',
        name: 'Superhuman AI',
        category: 'Productivity',
        description: 'Blazing fast email client with integrated AI drafting, summaries, and instant reply triage.',
        url: 'https://superhuman.com',
        pricing: 'Paid',
        icon: '✉️',
        tags: ['Email', 'Productivity', 'Smart Reply'],
        rating: 4.6,
        isFeatured: false
      },
      {
        id: 'store-8',
        name: 'Phind AI',
        category: 'Development',
        description: 'Search engine tailored specifically for software engineers and technical documentation queries.',
        url: 'https://www.phind.com',
        pricing: 'Freemium',
        icon: '🤖',
        tags: ['Developer Search', 'Code Explanations'],
        rating: 4.7,
        isFeatured: false
      },
      {
        id: 'store-9',
        name: 'Runway Gen-3 Alpha',
        category: 'Video',
        description: 'Generative video platform converting text and images into cinematic video clips.',
        url: 'https://runwayml.com',
        pricing: 'Freemium',
        icon: '🎬',
        tags: ['Text-to-Video', 'VFX', 'Animation'],
        rating: 4.7,
        isFeatured: false
      },
      {
        id: 'store-10',
        name: 'Notion AI',
        category: 'Productivity',
        description: 'Connected workspace assistant integrated directly into documents, databases, and project boards.',
        url: 'https://www.notion.so',
        pricing: 'Paid Add-on',
        icon: '📝',
        tags: ['Docs', 'Knowledge Base', 'Writing'],
        rating: 4.6,
        isFeatured: false
      },
      {
        id: 'store-11',
        name: 'Luma Dream Machine',
        category: 'Video',
        description: 'Next-generation video creation model producing highly detailed 3D camera motions.',
        url: 'https://lumalabs.ai/dream-machine',
        pricing: 'Freemium',
        icon: '🎥',
        tags: ['3D Video', 'Cinematic', 'Generative'],
        rating: 4.6,
        isFeatured: false
      },
      {
        id: 'store-12',
        name: 'OpenRouter AI API',
        category: 'LLM',
        description: 'Unified API routing gateway to top AI models (Claude, GPT-4o, DeepSeek, Llama 3) with flexible keys.',
        url: 'https://openrouter.ai',
        pricing: 'Pay-per-token',
        icon: '🌐',
        tags: ['API Router', 'Model Gateway', 'LLM Hub'],
        rating: 4.9,
        isFeatured: true
      }
    ]);
  }
}
