export interface ProjectImage {
  id: string;
  url: string;
  caption?: string | null;
  sortOrder: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescEn: string;
  shortDescTh: string;
  fullDescEn: string;
  fullDescTh: string;
  role?: string | null;
  year?: number | null;
  category?: string | null;
  techStack: string[];
  features: string[];
  problemEn?: string | null;
  problemTh?: string | null;
  solutionEn?: string | null;
  solutionTh?: string | null;
  challengesEn?: string | null;
  challengesTh?: string | null;
  resultsEn?: string | null;
  resultsTh?: string | null;
  githubUrl?: string | null;
  liveDemoUrl?: string | null;
  thumbnailUrl?: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  images: ProjectImage[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
  descriptionEn?: string | null;
  descriptionTh?: string | null;
  sortOrder: number;
  visible: boolean;
}

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "CONTRACT" | "FREELANCE";

export interface Experience {
  id: string;
  company: string;
  position: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate?: string | null;
  isPresent: boolean;
  descriptionEn: string;
  descriptionTh: string;
  responsibilities: string[];
  technologies: string[];
  location?: string | null;
  sortOrder: number;
  visible: boolean;
}

export interface Achievement {
  id: string;
  titleEn: string;
  titleTh: string;
  organization: string;
  date: string;
  descriptionEn?: string | null;
  descriptionTh?: string | null;
  imageUrl?: string | null;
  credentialUrl?: string | null;
  event?: string | null;
  project?: string | null;
  role?: string | null;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
}

export interface Certificate {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  credentialId?: string | null;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  descriptionEn?: string | null;
  descriptionTh?: string | null;
  visible: boolean;
  sortOrder: number;
}

export interface BlogTag {
  id: string;
  name: string;
}

export type BlogStatus = "DRAFT" | "PUBLISHED";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerptEn: string;
  excerptTh: string;
  contentEn: string;
  contentTh: string;
  coverImageUrl?: string | null;
  status: BlogStatus;
  publishedAt?: string | null;
  createdAt: string;
  tags: BlogTag[];
}

export type MessageStatus = "UNREAD" | "READ" | "ARCHIVED";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
}

export interface Profile {
  id: string;
  name: string;
  headlineEn: string;
  headlineTh: string;
  bioEn: string;
  bioTh: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  github?: string | null;
  linkedin?: string | null;
  website?: string | null;
  resumeUrl?: string | null;
  avatarUrl?: string | null;
  availableForWork: boolean;
}

export interface SiteSetting {
  id: string;
  siteTitle: string;
  siteDescriptionEn: string;
  siteDescriptionTh: string;
  seoKeywords: string[];
  favicon?: string | null;
  defaultLanguage: string;
  defaultTheme: string;
  contactEmail?: string | null;
  socialLinks?: Record<string, string> | null;
}

export interface Media {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  folder?: string | null;
  createdAt: string;
}

export interface DashboardOverview {
  counts: {
    totalProjects: number;
    totalSkills: number;
    totalExperience: number;
    totalAchievements: number;
    totalCertificates: number;
    totalBlogPosts: number;
    unreadMessages: number;
  };
  recentProjects: Project[];
  recentMessages: ContactMessage[];
}
