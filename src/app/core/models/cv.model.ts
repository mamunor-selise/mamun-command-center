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
  careerObjective?: string;
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
  cgpa?: string; // e.g. "CGPA: 3.68 out of 4.00"
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
  bulletPoints?: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface ExtraCurricular {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: number; // 0 to 100 percentage bar
}

export type CvTemplateStyle = 'modern' | 'minimal' | 'executive' | 'compact';

export interface CvProfile {
  id: string;
  title: string;
  targetRole: string;
  templateStyle: CvTemplateStyle;
  fontSize: 'sm' | 'base' | 'lg';
  spacing: 'compact' | 'normal' | 'relaxed';
  personalInfo: PersonalInfo;
  experiences: WorkExperience[];
  education: Education[];
  skillCategories: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  awards?: Award[];
  extraCurriculars?: ExtraCurricular[];
  languages?: Language[];
  updatedAt: string;
}
