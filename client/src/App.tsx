import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import ScrollToTop from "@/components/common/ScrollToTop";
import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import BlogDetail from "@/pages/BlogDetail";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/routes/ProtectedRoute";

const AdminLayout = lazy(() => import("@/components/layout/AdminLayout"));
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminProjects = lazy(() => import("@/pages/admin/ProjectsAdmin"));
const AdminSkills = lazy(() => import("@/pages/admin/SkillsAdmin"));
const AdminExperience = lazy(() => import("@/pages/admin/ExperienceAdmin"));
const AdminAchievements = lazy(() => import("@/pages/admin/AchievementsAdmin"));
const AdminCertificates = lazy(() => import("@/pages/admin/CertificatesAdmin"));
const AdminBlog = lazy(() => import("@/pages/admin/BlogAdmin"));
const AdminMessages = lazy(() => import("@/pages/admin/MessagesAdmin"));
const AdminProfile = lazy(() => import("@/pages/admin/ProfileAdmin"));
const AdminSettings = lazy(() => import("@/pages/admin/SettingsAdmin"));

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<AdminFallback />}>
      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/projects/:slug"
          element={
            <PublicLayout>
              <ProjectDetail />
            </PublicLayout>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <PublicLayout>
              <BlogDetail />
            </PublicLayout>
          }
        />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="achievements" element={<AdminAchievements />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route
          path="/404"
          element={
            <PublicLayout>
              <NotFound />
            </PublicLayout>
          }
        />
        <Route
          path="*"
          element={
            <PublicLayout>
              <NotFound />
            </PublicLayout>
          }
        />
      </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
