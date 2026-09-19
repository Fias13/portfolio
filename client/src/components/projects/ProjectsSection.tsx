import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { projectsApi } from "@/api/resources";
import { useLanguage } from "@/contexts/LanguageContext";
import SectionHeading from "@/components/common/SectionHeading";
import ProjectCard from "@/components/projects/ProjectCard";
import { SkeletonGrid } from "@/components/common/Skeleton";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import { FolderSearch } from "lucide-react";

export default function ProjectsSection() {
  const { t } = useLanguage();
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["projects", "public"], queryFn: () => projectsApi.list() });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const categories = useMemo(() => {
    const set = new Set((data || []).map((p) => p.category).filter(Boolean) as string[]);
    return Array.from(set);
  }, [data]);

  const filtered = (data || []).filter((p) => {
    if (featuredOnly && !p.featured) return false;
    if (category && p.category !== category) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <section id="projects" className="section-container py-20 sm:py-28">
      <SectionHeading eyebrow={t("projects.eyebrow")} title={t("projects.title")} />

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("projects.search")}
            aria-label={t("projects.search")}
            className="w-full rounded-full border border-ink-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-brand-500 dark:border-ink-700 dark:bg-ink-900"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="rounded-full border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-900"
          >
            <option value="">{t("projects.allCategories")}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 rounded-full border border-ink-200 px-3 py-2 text-sm dark:border-ink-700">
            <input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} className="accent-brand-600" />
            {t("projects.featuredOnly")}
          </label>
        </div>
      </div>

      <div className="mt-8">
        {isLoading && <SkeletonGrid />}
        {isError && <ErrorState message={t("common.error")} onRetry={() => refetch()} />}
        {!isLoading && !isError && filtered.length === 0 && <EmptyState icon={FolderSearch} title={t("projects.empty")} />}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
