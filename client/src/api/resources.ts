import { api } from "./client";
import type {
  Achievement,
  BlogPost,
  Certificate,
  ContactMessage,
  DashboardOverview,
  Experience,
  Media,
  Profile,
  Project,
  SiteSetting,
  Skill,
} from "./types";

// ---- Auth ----
export const authApi = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
};

export interface ProjectInput extends Omit<Partial<Project>, "images"> {
  images?: Array<{ url: string; caption?: string | null; sortOrder: number }>;
}

// ---- Projects ----
export const projectsApi = {
  list: (params?: Record<string, string>) => api.get<Project[]>("/projects", { params }).then((r) => r.data),
  get: (slug: string) => api.get<Project>(`/projects/${slug}`).then((r) => r.data),
  create: (data: ProjectInput) => api.post<Project>("/projects", data).then((r) => r.data),
  update: (id: string, data: ProjectInput) => api.put<Project>(`/projects/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/projects/${id}`),
  duplicate: (id: string) => api.post<Project>(`/projects/${id}/duplicate`).then((r) => r.data),
  publish: (id: string, published: boolean) => api.patch<Project>(`/projects/${id}/publish`, { published }).then((r) => r.data),
  reorder: (order: string[]) => api.post("/projects/reorder", { order }),
};

// ---- Skills ----
export const skillsApi = {
  list: () => api.get<Skill[]>("/skills").then((r) => r.data),
  create: (data: Partial<Skill>) => api.post<Skill>("/skills", data).then((r) => r.data),
  update: (id: string, data: Partial<Skill>) => api.put<Skill>(`/skills/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/skills/${id}`),
  reorder: (order: string[]) => api.post("/skills/reorder", { order }),
};

// ---- Experience ----
export const experienceApi = {
  list: () => api.get<Experience[]>("/experience").then((r) => r.data),
  create: (data: Partial<Experience>) => api.post<Experience>("/experience", data).then((r) => r.data),
  update: (id: string, data: Partial<Experience>) => api.put<Experience>(`/experience/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/experience/${id}`),
};

// ---- Achievements ----
export const achievementsApi = {
  list: () => api.get<Achievement[]>("/achievements").then((r) => r.data),
  create: (data: Partial<Achievement>) => api.post<Achievement>("/achievements", data).then((r) => r.data),
  update: (id: string, data: Partial<Achievement>) => api.put<Achievement>(`/achievements/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/achievements/${id}`),
};

// ---- Certificates ----
export const certificatesApi = {
  list: () => api.get<Certificate[]>("/certificates").then((r) => r.data),
  create: (data: Partial<Certificate>) => api.post<Certificate>("/certificates", data).then((r) => r.data),
  update: (id: string, data: Partial<Certificate>) => api.put<Certificate>(`/certificates/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/certificates/${id}`),
};

export interface BlogPostInput extends Omit<Partial<BlogPost>, "tags"> {
  tags?: string[];
}

// ---- Blog ----
export const blogApi = {
  list: (params?: Record<string, string>) => api.get<BlogPost[]>("/blog", { params }).then((r) => r.data),
  get: (slug: string) => api.get<BlogPost>(`/blog/${slug}`).then((r) => r.data),
  create: (data: BlogPostInput) => api.post<BlogPost>("/blog", data).then((r) => r.data),
  update: (id: string, data: BlogPostInput) => api.put<BlogPost>(`/blog/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/blog/${id}`),
};

// ---- Contact ----
export const contactApi = {
  send: (data: { name: string; email: string; message: string }) => api.post("/contact", data),
};

// ---- Messages (admin) ----
export const messagesApi = {
  list: (params?: Record<string, string>) => api.get<ContactMessage[]>("/messages", { params }).then((r) => r.data),
  updateStatus: (id: string, status: string) => api.patch<ContactMessage>(`/messages/${id}/status`, { status }).then((r) => r.data),
  remove: (id: string) => api.delete(`/messages/${id}`),
};

// ---- Profile ----
export const profileApi = {
  get: () => api.get<Profile>("/profile").then((r) => r.data),
  update: (data: Partial<Profile>) => api.put<Profile>("/profile", data).then((r) => r.data),
};

// ---- Settings ----
export const settingsApi = {
  get: () => api.get<SiteSetting>("/settings").then((r) => r.data),
  update: (data: Partial<SiteSetting>) => api.put<SiteSetting>("/settings", data).then((r) => r.data),
};

// ---- Media ----
export const mediaApi = {
  list: (folder?: string) => api.get<Media[]>("/media", { params: folder ? { folder } : undefined }).then((r) => r.data),
  upload: (file: File, folder = "general") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    return api
      .post<Media>("/media/upload", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data);
  },
  remove: (id: string) => api.delete(`/media/${id}`),
};

// ---- Dashboard ----
export const dashboardApi = {
  overview: () => api.get<DashboardOverview>("/dashboard/overview").then((r) => r.data),
};
