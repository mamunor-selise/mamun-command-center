import { connectToDatabase } from './_db.js';

export const defaultAiTrendsData = {
  buzzwords: [
    {
      id: 'bw-1',
      title: 'Agentic Workflows & Multi-Agent Teams',
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
      title: 'Zero-Shot & Few-Shot CoT Prompting',
      tagline: 'Guiding models through step-by-step reasoning using structured exemplars',
      description: 'Techniques like "Let\'s think step by step" combined with few-shot input-output examples that dramatically reduce reasoning errors on hard queries.',
      category: 'Prompt Engineering',
      trendScore: '90%',
      whyItMatters: 'Improves model accuracy on complex logic by 40% without fine-tuning model weights.',
      keyTakeaway: 'Providing structured reasoning examples is the most effective prompt technique.'
    }
  ],

  trendingTools: [
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
  ],

  storeTools: [
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
  ]
};

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Client-Api-Key, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle POST for adding custom tool to store or refreshing trends via OpenRouter
  if (req.method === 'POST') {
    const { action, tool } = req.body || {};

    if (action === 'add-tool' && tool) {
      try {
        const { db } = await connectToDatabase();
        const customToolsColl = db.collection('custom_ai_tools');
        const newTool = {
          id: 'custom-' + Date.now(),
          name: tool.name || 'Untitled AI Tool',
          category: tool.category || 'Productivity',
          description: tool.description || '',
          url: tool.url || '#',
          pricing: tool.pricing || 'Freemium',
          icon: tool.icon || '🚀',
          tags: Array.isArray(tool.tags) ? tool.tags : [tool.category || 'AI'],
          rating: tool.rating || 5.0,
          createdAt: new Date().toISOString()
        };
        await customToolsColl.insertOne(newTool);
        return res.status(200).json({ success: true, tool: newTool });
      } catch (err) {
        console.error('Error saving custom AI tool:', err);
        return res.status(500).json({ error: { message: 'Failed to save custom tool.' } });
      }
    }

    if (action === 'refresh-openrouter') {
      const serverKey = process.env.OPEN_ROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '';
      const clientKey = req.headers['x-client-api-key'] || (req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : '');
      const apiKey = clientKey || serverKey;

      if (!apiKey) {
        return res.status(200).json({
          success: true,
          source: 'fallback',
          message: 'No OpenRouter API key found. Returning curated trends.',
          data: defaultAiTrendsData
        });
      }

      try {
        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://mamun-command-center.vercel.app',
            'X-Title': 'Mamun Command Center'
          },
          body: JSON.stringify({
            model: 'deepseek/deepseek-chat',
            messages: [
              {
                role: 'system',
                content: 'You are an expert AI industry analyst. Return JSON format with keys "buzzwords" (array of 15 items: id, title, tagline, description, category, trendScore, whyItMatters, keyTakeaway) and "trendingTools" (array of 6 items: id, name, category, description, url, pricing, trendingRank, icon, tags, rating).'
              },
              {
                role: 'user',
                content: 'Provide 15 current weekly AI buzzwords and top trending AI tools for developer productivity, LLMs, and creative design in strict valid JSON.'
              }
            ]
          })
        });

        if (openRouterResponse.ok) {
          const aiJson = await openRouterResponse.json();
          const content = aiJson.choices?.[0]?.message?.content;
          if (content) {
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedData = JSON.parse(cleanContent);
            return res.status(200).json({
              success: true,
              source: 'openrouter',
              data: {
                buzzwords: parsedData.buzzwords || defaultAiTrendsData.buzzwords,
                trendingTools: parsedData.trendingTools || defaultAiTrendsData.trendingTools,
                storeTools: defaultAiTrendsData.storeTools
              }
            });
          }
        }
      } catch (err) {
        console.warn('OpenRouter refresh fallback due to error:', err.message);
      }
    }
  }

  // GET Request: Return default / MongoDB cached AI tools
  try {
    let customTools = [];
    try {
      const { db } = await connectToDatabase();
      customTools = await db.collection('custom_ai_tools').find({}).toArray();
    } catch (dbErr) {
      console.warn('MongoDB connection optional warning for ai-trends:', dbErr.message);
    }

    const mergedStoreTools = [...defaultAiTrendsData.storeTools, ...customTools];

    return res.status(200).json({
      success: true,
      source: 'curated',
      data: {
        ...defaultAiTrendsData,
        storeTools: mergedStoreTools
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message || 'Error loading AI trends data.' }
    });
  }
}
