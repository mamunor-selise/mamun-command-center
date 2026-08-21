export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  github?: string;
  linkedin?: string;
  avatarUrl?: string; // Base64 data URL or image URL
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bulletPoints: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface SkillCategory {
  id: string;
  name: string; // e.g. "Languages & Frameworks", "AI & Cloud", "Tools & Databases"
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  role?: string;
  link?: string;
  techStack: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export type CvTemplateStyle = 'modern' | 'minimal' | 'executive' | 'compact';

export interface CvProfile {
  id: string;
  title: string; // e.g., "Full-stack Engineer Profile", "AI Specialist Profile"
  targetRole: string;
  templateStyle: CvTemplateStyle;
  fontSize: 'sm' | 'base' | 'lg'; // Font scaling for 1-page fit
  spacing: 'compact' | 'normal' | 'relaxed'; // Vertical spacing for 1-page fit
  personalInfo: PersonalInfo;
  experiences: WorkExperience[];
  education: Education[];
  skillCategories: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  updatedAt: string;
}
