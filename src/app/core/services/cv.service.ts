import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CvProfile, CvTemplateStyle } from '../models/cv.model';
import { ChatbotService } from './chatbot.service';

const INITIAL_PROFILES: CvProfile[] = [
  {
    id: 'cv-1',
    title: 'Full-Stack Software Engineer',
    targetRole: 'Senior Full-Stack Engineer (Angular & Node.js)',
    templateStyle: 'modern',
    fontSize: 'base',
    spacing: 'normal',
    personalInfo: {
      fullName: 'Mamun Or Rashid',
      jobTitle: 'Senior Full-Stack Engineer',
      email: 'mamunor.selise@gmail.com',
      phone: '+880 1700-000000',
      location: 'Dhaka, Bangladesh',
      website: 'https://mamun-dev.com',
      github: 'https://github.com/mamunor-selise',
      linkedin: 'https://linkedin.com/in/mamunor-rashid',
      avatarUrl: '',
      summary: 'Passionate Senior Full-Stack Engineer with 5+ years of experience architecting high-performance web applications, cloud solutions, and reactive single-page applications using Angular, TypeScript, Node.js, and modern AI integrations.'
    },
    experiences: [
      {
        id: 'exp-1',
        company: 'SELISE Digital Platforms',
        role: 'Senior Software Engineer',
        location: 'Dhaka, Bangladesh',
        startDate: '2023-01',
        endDate: 'Present',
        isCurrent: true,
        bulletPoints: [
          'Architected and delivered scalable enterprise Angular 19 SPAs serving over 100k active users.',
          'Integrated LLM agentic workflows into core product features, improving task automation efficiency by 40%.',
          'Mentored junior engineers and enforced strict TypeScript, RxJS, and clean architecture standards.'
        ]
      },
      {
        id: 'exp-2',
        company: 'Tech Solutions Ltd.',
        role: 'Full-Stack Developer',
        location: 'Dhaka, Bangladesh',
        startDate: '2021-03',
        endDate: '2022-12',
        isCurrent: false,
        bulletPoints: [
          'Engineered RESTful & GraphQL microservices with Node.js, Express, and PostgreSQL.',
          'Reduced web application initial load times by 55% using lazy loading, SSR, and asset optimization.',
          'Collaborated with UX teams to build responsive Tailwind CSS UI component libraries.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'Ahsanullah University of Science and Technology',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science & Engineering',
        location: 'Dhaka, Bangladesh',
        startDate: '2016-09',
        endDate: '2020-11'
      }
    ],
    skillCategories: [
      {
        id: 'cat-1',
        name: 'Frontend & UI',
        skills: ['Angular 19', 'TypeScript', 'RxJS', 'Tailwind CSS', 'HTML5/CSS3', 'State Management']
      },
      {
        id: 'cat-2',
        name: 'Backend & Cloud',
        skills: ['Node.js', 'Express.js', 'PostgreSQL', 'RESTful APIs', 'Docker', 'Vercel']
      },
      {
        id: 'cat-3',
        name: 'AI & Tools',
        skills: ['OpenAI / DeepSeek APIs', 'Git / GitHub', 'Jira / Agile', 'CI/CD', 'Jest / Vitest']
      }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Mamun Command Center',
        description: 'All-in-one developer productivity platform with daily planner, CV builder, quiz engine, and AI assistant.',
        role: 'Creator & Lead Architect',
        link: 'https://github.com/mamunor-selise/mamun-command-center',
        techStack: ['Angular 19', 'Tailwind CSS', 'OpenRouter AI', 'TypeScript']
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        title: 'AWS Certified Developer - Associate',
        issuer: 'Amazon Web Services',
        date: '2023'
      }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cv-2',
    title: 'AI Systems Specialist',
    targetRole: 'AI & LLM Integration Specialist',
    templateStyle: 'minimal',
    fontSize: 'base',
    spacing: 'compact',
    personalInfo: {
      fullName: 'Mamun Or Rashid',
      jobTitle: 'AI Systems & Full-Stack Specialist',
      email: 'mamunor.selise@gmail.com',
      phone: '+880 1700-000000',
      location: 'Dhaka, Bangladesh',
      website: 'https://mamun-dev.com',
      github: 'https://github.com/mamunor-selise',
      linkedin: 'https://linkedin.com/in/mamunor-rashid',
      avatarUrl: '',
      summary: 'Innovative AI Engineer specializing in LLM integrations, autonomous agent architectures, and responsive web platforms. Experienced in connecting frontier models (DeepSeek, GPT-4, Llama) into business applications.'
    },
    experiences: [
      {
        id: 'exp-3',
        company: 'SELISE Digital Platforms',
        role: 'AI & Software Lead',
        location: 'Dhaka, Bangladesh',
        startDate: '2023-05',
        endDate: 'Present',
        isCurrent: true,
        bulletPoints: [
          'Built custom RAG systems and autonomous AI agent tools using OpenRouter and vector databases.',
          'Designed prompt engineering workflows for structured JSON outputs and automated chat assistants.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-2',
        institution: 'Ahsanullah University of Science and Technology',
        degree: 'B.Sc. in Computer Science',
        fieldOfStudy: 'Computer Science',
        location: 'Dhaka, Bangladesh',
        startDate: '2016-09',
        endDate: '2020-11'
      }
    ],
    skillCategories: [
      {
        id: 'cat-4',
        name: 'AI & Machine Learning',
        skills: ['LLM API Integration', 'Prompt Engineering', 'LangChain', 'OpenRouter', 'Agentic Workflows']
      },
      {
        id: 'cat-5',
        name: 'Web Engineering',
        skills: ['Angular', 'Node.js', 'TypeScript', 'Tailwind CSS', 'REST / GraphQL']
      }
    ],
    projects: [
      {
        id: 'proj-2',
        title: 'Command Center AI Assistant',
        description: 'Multi-model AI assistant with system prompt context injection for user tasks and code review.',
        techStack: ['Angular 19', 'DeepSeek V3', 'TypeScript']
      }
    ],
    certifications: [],
    updatedAt: new Date().toISOString()
  }
];

const STORAGE_KEY = 'mcc_cv_profiles';
const ACTIVE_KEY = 'mcc_active_cv_id';

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private platformId = inject(PLATFORM_ID);
  private chatbotService = inject(ChatbotService);

  profiles = signal<CvProfile[]>([]);
  activeProfileId = signal<string>('');

  activeProfile = computed(() => {
    const list = this.profiles();
    const id = this.activeProfileId();
    return list.find(p => p.id === id) || list[0] || null;
  });

  constructor() {
    this.loadProfilesFromStorage();
  }

  private loadProfilesFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.profiles.set(parsed);
            const savedActive = localStorage.getItem(ACTIVE_KEY);
            if (savedActive && parsed.some(p => p.id === savedActive)) {
              this.activeProfileId.set(savedActive);
            } else {
              this.activeProfileId.set(parsed[0].id);
            }
            return;
          }
        }
      } catch (err) {
        console.error('Failed to read CV profiles from localStorage', err);
      }
    }
    // Default fallback
    this.profiles.set(INITIAL_PROFILES);
    this.activeProfileId.set(INITIAL_PROFILES[0].id);
    this.persistProfiles();
  }

  private persistProfiles() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profiles()));
        localStorage.setItem(ACTIVE_KEY, this.activeProfileId());
      } catch (err) {
        console.error('Failed to save CV profiles to localStorage', err);
      }
    }
  }

  setActiveProfile(id: string) {
    this.activeProfileId.set(id);
    this.persistProfiles();
  }

  saveProfile(updated: CvProfile) {
    updated.updatedAt = new Date().toISOString();
    this.profiles.update(list => {
      const idx = list.findIndex(p => p.id === updated.id);
      if (idx >= 0) {
        const copy = [...list];
        copy[idx] = updated;
        return copy;
      }
      return [...list, updated];
    });
    this.persistProfiles();
  }

  createNewProfile(title = 'New Resume Profile', targetRole = 'Software Engineer'): CvProfile {
    const newId = 'cv-' + Date.now();
    const current = this.activeProfile();
    const basePersonalInfo = current ? { ...current.personalInfo } : {
      fullName: 'Mamun Or Rashid',
      jobTitle: targetRole,
      email: 'mamunor.selise@gmail.com',
      phone: '+880 1700-000000',
      location: 'Dhaka, Bangladesh',
      website: '',
      github: '',
      linkedin: '',
      avatarUrl: '',
      summary: 'Experienced software developer with a strong focus on high quality clean code and modern web frameworks.'
    };

    const newCv: CvProfile = {
      id: newId,
      title,
      targetRole,
      templateStyle: 'modern',
      fontSize: 'base',
      spacing: 'normal',
      personalInfo: basePersonalInfo,
      experiences: current ? [...current.experiences.map(e => ({ ...e, id: 'exp-' + Math.random().toString(36).substr(2, 9) }))] : [],
      education: current ? [...current.education.map(e => ({ ...e, id: 'edu-' + Math.random().toString(36).substr(2, 9) }))] : [],
      skillCategories: current ? [...current.skillCategories.map(s => ({ ...s, id: 'cat-' + Math.random().toString(36).substr(2, 9) }))] : [],
      projects: current ? [...current.projects.map(p => ({ ...p, id: 'proj-' + Math.random().toString(36).substr(2, 9) }))] : [],
      certifications: current ? [...current.certifications.map(c => ({ ...c, id: 'cert-' + Math.random().toString(36).substr(2, 9) }))] : [],
      updatedAt: new Date().toISOString()
    };

    this.profiles.update(list => [...list, newCv]);
    this.activeProfileId.set(newId);
    this.persistProfiles();
    return newCv;
  }

  duplicateProfile(id: string) {
    const target = this.profiles().find(p => p.id === id);
    if (!target) return;
    const duplicated: CvProfile = JSON.parse(JSON.stringify(target));
    duplicated.id = 'cv-' + Date.now();
    duplicated.title = `${target.title} (Copy)`;
    duplicated.updatedAt = new Date().toISOString();
    
    this.profiles.update(list => [...list, duplicated]);
    this.activeProfileId.set(duplicated.id);
    this.persistProfiles();
  }

  deleteProfile(id: string) {
    const list = this.profiles();
    if (list.length <= 1) {
      alert('You must keep at least one CV profile.');
      return;
    }
    const filtered = list.filter(p => p.id !== id);
    this.profiles.set(filtered);
    if (this.activeProfileId() === id) {
      this.activeProfileId.set(filtered[0].id);
    }
    this.persistProfiles();
  }

  // Trigger Native Print / PDF Download
  exportToPdf() {
    if (isPlatformBrowser(this.platformId)) {
      window.print();
    }
  }

  // AI Assistant CV Generator / Optimizer
  async generateAiCvContent(prompt: string, targetRole: string): Promise<Partial<CvProfile>> {
    const systemPrompt = `You are a professional CV & Resume Architect. 
Your job is to generate concise, highly impactful CV content optimized to fit precisely on ONE A4 PAGE.
Return ONLY valid JSON matching this structure:
{
  "summary": "2-3 sentence impactful summary for the target role",
  "bulletPoints": [
    "Action-oriented bullet point with metrics and tech stack",
    "Action-oriented bullet point with achievements",
    "Action-oriented bullet point with leadership or optimization results"
  ],
  "suggestedSkills": [
    { "category": "Core Tech", "skills": ["Skill 1", "Skill 2", "Skill 3"] },
    { "category": "Frameworks & Cloud", "skills": ["Skill 4", "Skill 5"] }
  ]
}`;

    const userPrompt = `Target Role: ${targetRole}\nAdditional context / prompt: ${prompt}`;

    const reply = await this.chatbotService.sendChatMessage([
      { id: '1', sender: 'user', text: `${systemPrompt}\n\n${userPrompt}`, timestamp: new Date().toISOString() }
    ]);

    // Extract JSON from response
    try {
      const jsonMatch = reply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('Could not parse AI JSON output directly', e);
    }
    return {
      personalInfo: {
        fullName: 'Mamun Or Rashid',
        jobTitle: targetRole,
        email: 'mamunor.selise@gmail.com',
        phone: '',
        location: '',
        summary: reply
      } as any
    };
  }
}
