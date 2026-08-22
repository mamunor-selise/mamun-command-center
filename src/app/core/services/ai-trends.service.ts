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

export interface TechQna {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AiTrendsService {
  private platformId = inject(PLATFORM_ID);

  buzzwords = signal<AiBuzzword[]>([]);
  qnaItems = signal<TechQna[]>([]);
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
        this.qnaItems.set(result.data.qnaItems || []);
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
        if (result.data.qnaItems) this.qnaItems.set(result.data.qnaItems);
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
      },
      {
        id: 'bw-6',
        title: 'Test-Time Compute Scaling',
        tagline: 'Allocating additional inference budget to achieve higher accuracy',
        description: 'The breakthrough technique where LLMs generate multiple candidate solution paths, evaluate intermediate steps, and verify proofs dynamically during generation.',
        category: 'Inference Scaling',
        trendScore: '94%',
        whyItMatters: 'Allows smaller models to outperform giant models simply by thinking longer during response generation.',
        keyTakeaway: 'Inference latency can be traded for superior problem-solving quality.'
      },
      {
        id: 'bw-7',
        title: 'Speculative Decoding & Model Distillation',
        tagline: 'Accelerating LLM token output speeds by using draft models',
        description: 'Using small, ultra-fast draft models to propose token sequences that a larger target LLM verifies in parallel, yielding 2x-3x faster response speeds.',
        category: 'Performance & Speed',
        trendScore: '91%',
        whyItMatters: 'Dramatically reduces user waiting time for long code completions and streaming chats.',
        keyTakeaway: 'Fast speculative drafting combined with large model verification is becoming standard.'
      },
      {
        id: 'bw-8',
        title: 'Context Window Expansion & Needle in a Haystack',
        tagline: 'Processing millions of tokens of context with high retrieval precision',
        description: 'Models expanding context windows up to 2 Million tokens (e.g. Gemini 1.5 Pro, Claude 3.7) while maintaining 99%+ accuracy in retrieving specific facts hidden deep inside huge documents.',
        category: 'LLM Memory',
        trendScore: '88%',
        whyItMatters: 'Enables analyzing entire code repositories or multi-hundred page technical specifications in a single prompt.',
        keyTakeaway: 'Large context windows transform how technical documentation is ingested.'
      },
      {
        id: 'bw-9',
        title: 'AI Code Review & Automated PR Agents',
        tagline: 'Autonomous GitHub bots catching bugs and writing regression tests',
        description: 'AI agents embedded into CI/CD pipelines that inspect incoming git pull requests, verify unit test coverage, flag security vulnerabilities, and propose code fixes directly.',
        category: 'DevOps & Automation',
        trendScore: '93%',
        whyItMatters: 'Improves code quality standards and speeds up code review turnaround times for engineering teams.',
        keyTakeaway: 'Code review becomes an interactive dialogue between human devs and AI reviewers.'
      },
      {
        id: 'bw-10',
        title: 'Structured Outputs & Function Calling',
        tagline: 'Guaranteeing strict JSON schema compliance from LLM completions',
        description: 'Constraining LLM token sampling at the decoding layer to strictly adhere to Pydantic, Zod, or JSON Schemas, ensuring 100% reliable program parsing.',
        category: 'API & Tool Use',
        trendScore: '90%',
        whyItMatters: 'Eliminates JSON syntax errors when integrating LLM output into backend code databases.',
        keyTakeaway: 'Deterministic JSON mode turns natural language into type-safe APIs.'
      },
      {
        id: 'bw-11',
        title: 'Local LLMs & On-Device AI (Ollama / WebGPU)',
        tagline: 'Running open-weights models locally without cloud server costs or leaks',
        description: 'Utilizing quantization tools like Ollama, llama.cpp, and WebGPU to run 7B-70B models directly on Mac Silicon or local GPUs with complete data privacy.',
        category: 'Edge AI & Privacy',
        trendScore: '87%',
        whyItMatters: 'Protects sensitive enterprise IP and enables offline zero-latency AI execution.',
        keyTakeaway: 'Privacy-sensitive applications are migrating to local or hybrid model routing.'
      },
      {
        id: 'bw-12',
        title: 'Synthetic Data Generation & Self-Correction',
        tagline: 'Models creating and filtering high-quality training datasets for themselves',
        description: 'Using frontier models to generate millions of synthetic reasoning traces, test cases, and code samples, followed by automated verification to train specialized downstream models.',
        category: 'Model Training',
        trendScore: '86%',
        whyItMatters: 'Bypasses human data collection bottlenecks and reduces model training costs.',
        keyTakeaway: 'Quality synthetic data is becoming the primary fuel for next-gen models.'
      },
      {
        id: 'bw-13',
        title: 'Guardrails & Real-Time Alignment Tuning',
        tagline: 'Enforcing safety, privacy, and policy rules on LLM streaming outputs',
        description: 'Input/output filter layers (e.g. NeMo Guardrails, Llama Guard) that block prompt injections, PII leaks, and non-compliant responses in real time.',
        category: 'AI Safety & Trust',
        trendScore: '85%',
        whyItMatters: 'Required for enterprise compliance, legal safety, and preventing malicious prompt injection attacks.',
        keyTakeaway: 'Enterprise deployment requires strict real-time safety guardrails.'
      },
      {
        id: 'bw-14',
        title: 'Prompt Compression & Semantic Vector Caching',
        tagline: 'Reusing cached LLM context tokens to slash API latency and cost',
        description: 'Caching pre-computed prompt prefix KV tensors across requests so identical system prompts and context documents cost 50%-80% less and load instantly.',
        category: 'Cost Optimization',
        trendScore: '88%',
        whyItMatters: 'Drastically reduces token bill expenses for high-volume conversational AI applications.',
        keyTakeaway: 'Prompt caching makes long system instructions practically free.'
      },
      {
        id: 'bw-15',
        title: 'Zero-Shot & Few-Shot Chain-of-Thought Prompting',
        tagline: 'Guiding models through step-by-step reasoning using structured exemplars',
        description: 'Techniques like "Let\'s think step by step" combined with few-shot input-output examples that dramatically reduce reasoning errors on hard queries.',
        category: 'Prompt Engineering',
        trendScore: '90%',
        whyItMatters: 'Improves model accuracy on complex logic by 40% without fine-tuning model weights.',
        keyTakeaway: 'Providing structured reasoning examples is the most effective prompt technique.'
      }
    ]);

    this.qnaItems.set([
      { id: 'qna-1', category: 'Fundamentals', question: 'What does LLM stand for?', answer: 'Large Language Model' },
      { id: 'qna-2', category: 'Fundamentals', question: 'What is the basic task of a language model?', answer: 'Predict the next token' },
      { id: 'qna-3', category: 'Tokenization', question: 'What is a token?', answer: 'A unit of text processed by a language model' },
      { id: 'qna-4', category: 'Tokenization', question: 'Why is text tokenized?', answer: 'To convert text into units that can be represented numerically' },
      { id: 'qna-5', category: 'Tokenization', question: 'Are tokens always complete words?', answer: 'No' },
      { id: 'qna-6', category: 'Vectors & Embeddings', question: 'What is an embedding?', answer: 'A numerical/vector representation of a token' },
      { id: 'qna-7', category: 'Vectors & Embeddings', question: 'What is the purpose of an embedding space?', answer: 'To represent tokens as numerical vectors with meaningful relationships' },
      { id: 'qna-8', category: 'Pretraining', question: 'What is the main objective of LLM pretraining?', answer: 'Next-token prediction' },
      { id: 'qna-9', category: 'Generation', question: 'What does autoregressive generation mean?', answer: 'Generating each next token based on previously generated tokens' },
      { id: 'qna-10', category: 'Architecture', question: 'What architecture is used by GPT-style models?', answer: 'Transformer' },
      { id: 'qna-11', category: 'Architecture', question: 'What is the most important mechanism in a Transformer?', answer: 'Attention' },
      { id: 'qna-12', category: 'Architecture', question: 'What does self-attention do?', answer: 'Allows tokens to interact with and attend to other tokens in the context' },
      { id: 'qna-13', category: 'Architecture', question: 'Why is attention important?', answer: 'It allows the model to determine which parts of the context are relevant' },
      { id: 'qna-14', category: 'Architecture', question: 'What is a Transformer block?', answer: 'A repeated neural-network unit containing components such as attention and feed-forward layers' },
      { id: 'qna-15', category: 'Architecture', question: 'What is the purpose of positional information?', answer: 'To provide information about the order of tokens' },
      { id: 'qna-16', category: 'Architecture', question: 'Why do Transformers need positional information?', answer: 'Attention alone does not inherently encode token order' },
      { id: 'qna-17', category: 'LLM Memory', question: 'What is the context window?', answer: 'The maximum amount of token context the model can process at once' },
      { id: 'qna-18', category: 'LLM Memory', question: 'What happens when the context window is exceeded?', answer: 'The model cannot directly attend to tokens outside the available context' },
      { id: 'qna-19', category: 'Model Training', question: 'What is a parameter in an LLM?', answer: 'A learned numerical value/weight in the neural network' },
      { id: 'qna-20', category: 'Model Training', question: 'What happens to parameters during training?', answer: 'They are adjusted to improve the model\'s predictions' },
      { id: 'qna-21', category: 'Optimization', question: 'What is the loss function used for?', answer: 'Measuring how wrong the model\'s predictions are' },
      { id: 'qna-22', category: 'Optimization', question: 'What does minimizing loss accomplish?', answer: 'It improves the model\'s predictions on the training objective' },
      { id: 'qna-23', category: 'Optimization', question: 'What is gradient descent?', answer: 'An optimization method used to update model parameters' },
      { id: 'qna-24', category: 'Optimization', question: 'What is backpropagation?', answer: 'The process of calculating gradients used to update model parameters' },
      { id: 'qna-25', category: 'Training Lifecycle', question: 'What is pretraining?', answer: 'Training a model on a large amount of data to learn general language patterns and capabilities' },
      { id: 'qna-26', category: 'Training Lifecycle', question: 'Why is massive training data useful?', answer: 'It exposes the model to a wide variety of language patterns and information' },
      { id: 'qna-27', category: 'LLM Limitations', question: 'Does pretraining make an LLM perfectly knowledgeable?', answer: 'No' },
      { id: 'qna-28', category: 'LLM Limitations', question: 'Does an LLM literally store a copy of every webpage in its parameters?', answer: 'No' },
      { id: 'qna-29', category: 'Training Lifecycle', question: 'What does the model learn from training data?', answer: 'Statistical patterns and representations' },
      { id: 'qna-30', category: 'Deep Learning', question: 'What is a neural network?', answer: 'A computational model composed of interconnected mathematical operations/parameters' },
      { id: 'qna-31', category: 'Tokenization', question: 'What is an LLM\'s vocabulary?', answer: 'The set of tokens that the tokenizer can represent' },
      { id: 'qna-32', category: 'Tokenization', question: 'What is tokenization?', answer: 'Converting raw text into tokens' },
      { id: 'qna-33', category: 'Tokenization', question: 'What is detokenization?', answer: 'Converting tokens back into readable text' },
      { id: 'qna-34', category: 'Tokenization', question: 'Why can tokenization affect model performance?', answer: 'Different tokenizations change how efficiently text is represented' },
      { id: 'qna-35', category: 'Tokenization', question: 'What is a tokenizer?', answer: 'A system that converts text into tokens and tokens back into text' },
      { id: 'qna-36', category: 'Execution', question: 'What is inference?', answer: 'Using a trained model to generate predictions/output' },
      { id: 'qna-37', category: 'Execution', question: 'What is training?', answer: 'Adjusting model parameters using data and an optimization process' },
      { id: 'qna-38', category: 'Execution', question: 'What is the difference between training and inference?', answer: 'Training changes parameters; inference uses the trained parameters' },
      { id: 'qna-39', category: 'Decoding & Sampling', question: 'What is sampling?', answer: 'Selecting the next token from a probability distribution' },
      { id: 'qna-40', category: 'Decoding & Sampling', question: 'What does temperature control?', answer: 'The randomness/variability of generation' },
      { id: 'qna-41', category: 'Decoding & Sampling', question: 'What generally happens when temperature is increased?', answer: 'Output becomes more diverse/random' },
      { id: 'qna-42', category: 'Decoding & Sampling', question: 'What generally happens when temperature is decreased?', answer: 'Output becomes more deterministic' },
      { id: 'qna-43', category: 'Decoding & Sampling', question: 'What is a probability distribution over tokens?', answer: 'The model\'s estimated probabilities for possible next tokens' },
      { id: 'qna-44', category: 'Decoding & Sampling', question: 'What is a logit?', answer: 'An unnormalized score produced by the model before converting scores into probabilities' },
      { id: 'qna-45', category: 'Decoding & Sampling', question: 'What function commonly converts logits into probabilities?', answer: 'Softmax' },
      { id: 'qna-46', category: 'Decoding & Sampling', question: 'What is the most likely next token called?', answer: 'The token with the highest predicted probability' },
      { id: 'qna-47', category: 'Decoding & Sampling', question: 'What is greedy decoding?', answer: 'Always selecting the highest-probability next token' },
      { id: 'qna-48', category: 'Safety & Hallucination', question: 'What is hallucination?', answer: 'Generating information that is incorrect, fabricated, or unsupported' },
      { id: 'qna-49', category: 'Safety & Hallucination', question: 'Why do LLMs hallucinate?', answer: 'They are optimized to generate likely continuations rather than inherently verify truth' },
      { id: 'qna-50', category: 'Safety & Hallucination', question: 'Does fluent language guarantee factual accuracy?', answer: 'No' },
      { id: 'qna-51', category: 'Alignment', question: 'What is post-training?', answer: 'Training performed after pretraining to improve behavior, instruction following, and alignment' },
      { id: 'qna-52', category: 'Alignment', question: 'What is instruction tuning?', answer: 'Training a model to better follow human instructions' },
      { id: 'qna-53', category: 'Alignment', question: 'What does RLHF stand for?', answer: 'Reinforcement Learning from Human Feedback' },
      { id: 'qna-54', category: 'Alignment', question: 'What is the purpose of RLHF?', answer: 'Aligning model behavior with human preferences' },
      { id: 'qna-55', category: 'Alignment', question: 'What is a reward model?', answer: 'A model that estimates how desirable a response is according to learned preferences' },
      { id: 'qna-56', category: 'Alignment', question: 'What is alignment?', answer: 'Making model behavior better match intended human goals and preferences' },
      { id: 'qna-57', category: 'Alignment', question: 'Why is post-training important?', answer: 'It makes pretrained models more useful, controllable, and aligned with user instructions' },
      { id: 'qna-58', category: 'Alignment', question: 'What is instruction following?', answer: 'The ability of a model to produce responses appropriate to a user\'s instructions' },
      { id: 'qna-59', category: 'Machine Learning', question: 'What is reinforcement learning?', answer: 'Learning through rewards or penalties associated with actions' },
      { id: 'qna-60', category: 'Alignment', question: 'What is the role of human preferences in RLHF?', answer: 'They provide signals about which model outputs are preferred' },
      { id: 'qna-61', category: 'Reasoning & Logic', question: 'What is reasoning in LLMs?', answer: 'Performing multi-step processing to arrive at an answer' },
      { id: 'qna-62', category: 'Reasoning & Logic', question: 'Why can reasoning models use more tokens?', answer: 'They may perform additional internal/visible computation before producing the final answer' },
      { id: 'qna-63', category: 'Reasoning & Logic', question: 'What is test-time compute?', answer: 'Computational resources used while generating an answer' },
      { id: 'qna-64', category: 'Tools & Agents', question: 'What is tool use by an LLM?', answer: 'Using external tools such as calculators, search, code execution, or APIs' },
      { id: 'qna-65', category: 'Tools & Agents', question: 'Why are tools useful for LLMs?', answer: 'They extend the model\'s capabilities beyond what it can reliably do internally' },
      { id: 'qna-66', category: 'Tools & Agents', question: 'Can an LLM use a calculator as a tool?', answer: 'Yes' },
      { id: 'qna-67', category: 'Tools & Agents', question: 'Can an LLM use external search as a tool?', answer: 'Yes' },
      { id: 'qna-68', category: 'Integration', question: 'What is an API?', answer: 'An interface that allows software systems to communicate with each other' },
      { id: 'qna-69', category: 'Tools & Agents', question: 'What is tool calling?', answer: 'The model requesting an external tool to perform a specific operation' },
      { id: 'qna-70', category: 'RAG Systems', question: 'What is retrieval-augmented generation (RAG)?', answer: 'Generating responses using information retrieved from an external knowledge source' },
      { id: 'qna-71', category: 'RAG Systems', question: 'Why can RAG reduce hallucination?', answer: 'It can provide relevant external information for the model to use' },
      { id: 'qna-72', category: 'RAG Systems', question: 'Does RAG guarantee that an answer is correct?', answer: 'No' },
      { id: 'qna-73', category: 'AI Agents', question: 'What is an AI agent?', answer: 'A system that can use models, tools, and actions to accomplish tasks' },
      { id: 'qna-74', category: 'AI Agents', question: 'What is the difference between an LLM and an AI agent?', answer: 'An LLM generates predictions/text, while an agent can use the model together with tools and actions' },
      { id: 'qna-75', category: 'Multimodal AI', question: 'What is multimodality?', answer: 'The ability to process or generate multiple types of data such as text, images, audio, or video' },
      { id: 'qna-76', category: 'Multimodal AI', question: 'Can modern AI models process more than text?', answer: 'Yes' },
      { id: 'qna-77', category: 'Hardware & Compute', question: 'What is a GPU?', answer: 'A processor highly suited to the parallel mathematical operations used in neural networks' },
      { id: 'qna-78', category: 'Hardware & Compute', question: 'Why are GPUs important for LLMs?', answer: 'They efficiently perform the large-scale parallel computations required for training and inference' },
      { id: 'qna-79', category: 'Hardware & Compute', question: 'Why does training large LLMs require substantial computing resources?', answer: 'Large models and datasets require enormous numbers of mathematical operations' },
      { id: 'qna-80', category: 'Scaling Laws', question: 'What is model scaling?', answer: 'Increasing factors such as model size, data, or compute to improve capabilities' },
      { id: 'qna-81', category: 'Architecture', question: 'What is a foundation model?', answer: 'A broadly pretrained model that can serve as the basis for many downstream applications' },
      { id: 'qna-82', category: 'Model Adaptation', question: 'What is fine-tuning?', answer: 'Further training a pretrained model for a particular behavior, task, or domain' },
      { id: 'qna-83', category: 'Model Adaptation', question: 'How does fine-tuning differ from pretraining?', answer: 'Fine-tuning adapts an already pretrained model, while pretraining establishes broad capabilities' },
      { id: 'qna-84', category: 'Open Source AI', question: 'What is an open-weight model?', answer: 'A model whose learned weights are made available to users' },
      { id: 'qna-85', category: 'Open Source AI', question: 'What is a closed model?', answer: 'A model whose underlying weights or implementation are not fully publicly available' },
      { id: 'qna-86', category: 'Cost & Efficiency', question: 'Why is inference cost important?', answer: 'Generating responses requires computational resources and therefore costs money/energy' },
      { id: 'qna-87', category: 'Cost & Efficiency', question: 'Why can larger models be more expensive to run?', answer: 'They generally require more computation and memory' },
      { id: 'qna-88', category: 'Compression', question: 'What is quantization?', answer: 'Representing model values with lower numerical precision to reduce memory and computation' },
      { id: 'qna-89', category: 'Compression', question: 'What is the main benefit of quantization?', answer: 'Reduced memory usage and potentially faster/cheaper inference' },
      { id: 'qna-90', category: 'Lifecycle Pipeline', question: 'What is the overall LLM development pipeline?', answer: 'Data -> Tokenization -> Pretraining -> Post-training/Alignment -> Inference/Use' },
      { id: 'qna-91', category: 'Fundamentals', question: 'What is the fundamental prediction unit of an LLM?', answer: 'A token' },
      { id: 'qna-92', category: 'Fundamentals', question: 'Does an LLM directly predict complete answers in one step?', answer: 'No' },
      { id: 'qna-93', category: 'Generation', question: 'How is a long response generated?', answer: 'By repeatedly predicting one token after another' },
      { id: 'qna-94', category: 'Generation', question: 'What happens after a token is generated during autoregressive generation?', answer: 'It becomes part of the context for predicting the next token' },
      { id: 'qna-95', category: 'Sampling & Randomness', question: 'Why can LLMs produce different answers to the same prompt?', answer: 'Probabilistic sampling can select different tokens' },
      { id: 'qna-96', category: 'Fundamentals', question: 'What is the central idea behind modern LLMs?', answer: 'Learning statistical representations of language through large-scale training and using them to predict/generate tokens' }
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
