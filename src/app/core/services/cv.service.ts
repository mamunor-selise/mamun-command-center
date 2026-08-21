import { Injectable, signal, computed, inject, effect, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CvProfile } from '../models/cv.model';
import { ChatbotService } from './chatbot.service';
import { AuthService } from './auth.service';

const API_BASE_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private platformId = inject(PLATFORM_ID);
  private chatbotService = inject(ChatbotService);
  private authService = inject(AuthService);

  profiles = signal<CvProfile[]>([]);
  activeProfileId = signal<string>('');
  isLoading = signal<boolean>(false);

  activeProfile = computed(() => {
    const list = this.profiles();
    const id = this.activeProfileId();
    return list.find(p => p.id === id) || list[0] || null;
  });

  constructor() {
    // Automatically reload CV profiles whenever the logged in user changes
    effect(() => {
      const user = this.authService.currentUser();
      this.loadUserCvProfiles(user);
    });
  }

  private getStorageKey(): string {
    const user = this.authService.currentUser();
    return user ? `mcc_cv_profiles_${user.id}` : 'mcc_cv_profiles_guest';
  }

  async loadUserCvProfiles(user: any) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isLoading.set(true);

    const userName = user?.name || 'Guest Developer';
    const userEmail = user?.email || 'guest@example.com';
    const token = this.authService.token();

    try {
      let response: Response | null = null;
      try {
        response = await fetch('/api/cv', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 404) {
          response = await fetch(`${API_BASE_URL}/api/cv`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }
      } catch (e) {
        response = await fetch(`${API_BASE_URL}/api/cv`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      if (response && response.ok) {
        const data = await response.json();
        if (data.profiles && Array.isArray(data.profiles) && data.profiles.length > 0) {
          const formattedProfiles = data.profiles.map((p: CvProfile) => {
            if (user && (p.personalInfo.fullName === 'Mamun Or Rashid' || p.personalInfo.fullName === 'Guest Developer' || !p.personalInfo.fullName)) {
              p.personalInfo.fullName = userName;
              p.personalInfo.email = userEmail;
            }
            return p;
          });

          this.profiles.set(formattedProfiles);
          this.activeProfileId.set(formattedProfiles[0].id);
          this.persistLocalCache();
          return;
        }
      }
    } catch (err) {
      console.warn('Could not reach MongoDB Atlas API server for CV profiles, using local store.');
    } finally {
      this.isLoading.set(false);
    }

    // Fallback: Populate local default CV profile with logged-in user name & email
    const localProfiles = this.readFromLocalStorage();
    if (localProfiles.length > 0) {
      const formatted = localProfiles.map((p: CvProfile) => {
        if (user && (p.personalInfo.fullName === 'Mamun Or Rashid' || p.personalInfo.fullName === 'Guest Developer' || !p.personalInfo.fullName)) {
          p.personalInfo.fullName = userName;
          p.personalInfo.email = userEmail;
        }
        return p;
      });
      this.profiles.set(formatted);
      this.activeProfileId.set(formatted[0].id);
    } else {
      const initialProfile = this.buildInitialProfile(userName, userEmail);
      this.profiles.set([initialProfile]);
      this.activeProfileId.set(initialProfile.id);
      this.persistLocalCache();
    }
  }

  private buildInitialProfile(userName: string, userEmail: string): CvProfile {
    return {
      id: 'cv-' + Date.now(),
      title: 'Full-Stack Software Engineer',
      targetRole: 'Senior Full-Stack Engineer',
      templateStyle: 'modern',
      fontSize: 'base',
      spacing: 'normal',
      personalInfo: {
        fullName: userName,
        jobTitle: 'Senior Full-Stack Engineer',
        email: userEmail,
        phone: '+880 1700-000000',
        location: 'Dhaka, Bangladesh',
        website: '',
        github: '',
        linkedin: '',
        avatarUrl: '',
        summary: `Passionate Senior Software Engineer with experience architecting high-performance web applications, cloud solutions, and reactive single-page applications.`
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
            'Architected and delivered scalable enterprise Angular SPAs serving over 100k active users.',
            'Integrated LLM agentic workflows into core product features.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'University of Science and Technology',
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
          skills: ['Angular 19', 'TypeScript', 'RxJS', 'Tailwind CSS', 'HTML5/CSS3']
        },
        {
          id: 'cat-2',
          name: 'Backend & Cloud',
          skills: ['Node.js', 'Next.js', 'MongoDB Atlas', 'PostgreSQL', 'Docker']
        }
      ],
      projects: [],
      certifications: [],
      updatedAt: new Date().toISOString()
    };
  }

  private readFromLocalStorage(): CvProfile[] {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const raw = localStorage.getItem(this.getStorageKey());
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (err) {}
    }
    return [];
  }

  private persistLocalCache() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.getStorageKey(), JSON.stringify(this.profiles()));
      } catch (err) {}
    }
  }

  setActiveProfile(id: string) {
    this.activeProfileId.set(id);
    this.persistLocalCache();
  }

  async saveProfile(updated: CvProfile) {
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
    this.persistLocalCache();

    // Persist to MongoDB Atlas database
    const token = this.authService.token();
    try {
      let response = await fetch('/api/cv', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });

      if (response.status === 404) {
        await fetch(`${API_BASE_URL}/api/cv`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updated)
        });
      }
    } catch (e) {
      console.warn('Could not sync updated CV to MongoDB Atlas API server.');
    }
  }

  createNewProfile(title = 'New Resume Profile', targetRole = 'Software Engineer'): CvProfile {
    const newId = 'cv-' + Date.now();
    const user = this.authService.currentUser();
    const userName = user?.name || 'Guest Developer';
    const userEmail = user?.email || 'guest@example.com';

    const current = this.activeProfile();
    const basePersonalInfo = current ? { ...current.personalInfo } : {
      fullName: userName,
      jobTitle: targetRole,
      email: userEmail,
      phone: '+880 1700-000000',
      location: 'Dhaka, Bangladesh',
      website: '',
      github: '',
      linkedin: '',
      avatarUrl: '',
      summary: 'Experienced software developer with a strong focus on high quality clean code and modern web frameworks.'
    };

    basePersonalInfo.fullName = userName;
    basePersonalInfo.email = userEmail;

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
    this.saveProfile(newCv);
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
    this.saveProfile(duplicated);
  }

  async deleteProfile(id: string) {
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
    this.persistLocalCache();

    const token = this.authService.token();
    try {
      let response = await fetch(`/api/cv?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 404) {
        await fetch(`${API_BASE_URL}/api/cv?id=${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
  }

  exportToPdf() {
    if (isPlatformBrowser(this.platformId)) {
      window.print();
    }
  }

  async generateAiCvContent(prompt: string, targetRole: string): Promise<Partial<CvProfile>> {
    const systemPrompt = `You are a professional CV & Resume Architect. 
Your job is to generate concise, highly impactful CV content optimized to fit precisely on ONE A4 PAGE.
Return ONLY valid JSON matching this structure:
{
  "summary": "2-3 sentence impactful summary for the target role",
  "bulletPoints": [
    "Action-oriented bullet point with metrics and tech stack",
    "Action-oriented bullet point with achievements"
  ]
}`;

    const userPrompt = `Target Role: ${targetRole}\nAdditional context: ${prompt}`;

    const reply = await this.chatbotService.sendChatMessage([
      { id: '1', sender: 'user', text: `${systemPrompt}\n\n${userPrompt}`, timestamp: new Date().toISOString() }
    ]);

    try {
      const jsonMatch = reply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {}

    const user = this.authService.currentUser();
    return {
      personalInfo: {
        fullName: user?.name || 'Developer User',
        jobTitle: targetRole,
        email: user?.email || 'user@example.com',
        phone: '',
        location: '',
        summary: reply
      } as any
    };
  }
}
