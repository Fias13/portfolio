import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FolderKanban, Sparkles, Briefcase, Trophy, Award, Newspaper, Mail, ArrowUpRight } from "lucide-react";
import { dashboardApi } from "@/api/resources";
import { Skeleton } from "@/components/common/Skeleton";
import DashboardCard from "@/components/admin/DashboardCard";

export default function Dashboard() {
  const { data, isLoading } = useQuery({ queryKey: ["dashboard-overview"], queryFn: dashboardApi.overview });

  const cards = data
    ? [
        { label: "Total Projects", value: data.counts.totalProjects, icon: FolderKanban },
        { label: "Total Skills", value: data.counts.totalSkills, icon: Sparkles },
        { label: "Experience Items", value: data.counts.totalExperience, icon: Briefcase },
        { label: "Achievements", value: data.counts.totalAchievements, icon: Trophy },
        { label: "Certificates", value: data.counts.totalCertificates, icon: Award },
        { label: "Blog Posts", value: data.counts.totalBlogPosts, icon: Newspaper },
        { label: "Unread Messages", value: data.counts.unreadMessages, icon: Mail, accent: "amber" as const },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Overview of your portfolio content.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
          : cards.map((c) => <DashboardCard key={c.label} {...c} />)}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent Projects</h2>
            <Link to="/admin/projects" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
              View all
              <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="space-y-3">
            {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            {!isLoading && data?.recentProjects.length === 0 && <p className="text-sm text-ink-400">No projects yet.</p>}
            {data?.recentProjects.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-ink-100 px-3 py-2.5 text-sm dark:border-ink-800">
                <span className="font-medium">{p.title}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.published ? "bg-brand-500/10 text-brand-600 dark:text-brand-400" : "bg-ink-200 text-ink-600 dark:bg-ink-800 dark:text-ink-400"}`}>
                  {p.published ? "Published" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent Messages</h2>
            <Link to="/admin/messages" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
              View all
              <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="space-y-3">
            {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            {!isLoading && data?.recentMessages.length === 0 && <p className="text-sm text-ink-400">No messages yet.</p>}
            {data?.recentMessages.map((m) => (
              <div key={m.id} className="rounded-lg border border-ink-100 px-3 py-2.5 text-sm dark:border-ink-800">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{m.name}</span>
                  {m.status === "UNREAD" && <span className="h-2 w-2 rounded-full bg-brand-500" aria-label="Unread" />}
                </div>
                <p className="mt-0.5 truncate text-xs text-ink-500 dark:text-ink-400">{m.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
