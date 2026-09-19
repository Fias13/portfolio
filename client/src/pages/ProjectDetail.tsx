import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { projectsApi } from "@/api/resources";
import { useLanguage, localized } from "@/contexts/LanguageContext";
import Seo from "@/components/common/Seo";
import Modal from "@/components/common/Modal";
import ErrorState from "@/components/common/ErrorState";
import { Skeleton } from "@/components/common/Skeleton";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLanguage();
  const [lightbox, setLightbox] = useState<string | null>(null);

  const { data: project, isLoading, isError, error } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => projectsApi.get(slug!),
    enabled: !!slug,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="section-container py-24">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-6 h-80 w-full" />
      </div>
    );
  }

  if (isError) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404) return <Navigate to="/404" replace />;
    return (
      <div className="section-container py-24">
        <ErrorState message={t("common.error")} />
      </div>
    );
  }

  if (!project) return null;

  const sections: Array<{ label: string; content: string | null | undefined }> = [
    { label: t("projectDetail.problem"), content: localized(project, "problem", lang) },
    { label: t("projectDetail.solution"), content: localized(project, "solution", lang) },
    { label: t("projectDetail.challenges"), content: localized(project, "challenges", lang) },
    { label: t("projectDetail.results"), content: localized(project, "results", lang) },
  ];

  return (
    <article className="section-container py-16 sm:py-20">
      <Seo
        title={`${project.title} — Jirat Sitthiwetkiat`}
        description={localized(project, "shortDesc", lang)}
        image={project.thumbnailUrl || undefined}
        type="article"
      />

      <Link to="/#projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-600 dark:hover:text-brand-400">
        <ArrowLeft size={15} />
        {t("projectDetail.back")}
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{project.title}</h1>
            {project.role && <p className="mt-2 text-ink-500 dark:text-ink-400">{project.role}{project.year ? ` · ${project.year}` : ""}</p>}
          </div>
          <div className="flex gap-2">
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                {t("projects.liveDemo")}
                <ExternalLink size={14} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-300 px-4 py-2 text-sm font-semibold hover:bg-ink-100 dark:border-ink-700 dark:hover:bg-ink-800"
              >
                <Github size={14} />
                {t("projects.sourceCode")}
              </a>
            )}
          </div>
        </div>

        {project.thumbnailUrl && (
          <img src={project.thumbnailUrl} alt={project.title} className="mt-8 w-full rounded-2xl border border-ink-200 dark:border-ink-800" />
        )}

        {localized(project, "fullDesc", lang) && (
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ink-600 dark:text-ink-300">{localized(project, "fullDesc", lang)}</p>
        )}

        {project.techStack.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-400">{t("projectDetail.techStack")}</h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="rounded-full bg-ink-100 px-3 py-1.5 text-sm font-medium dark:bg-ink-800">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.features.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-400">{t("projectDetail.features")}</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {project.features.map((f) => (
                <div key={f} className="rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm dark:border-ink-800">
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {sections
            .filter((s) => s.content)
            .map((s) => (
              <div key={s.label} className="card-surface p-5">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">{s.label}</h2>
                <p className="text-sm text-ink-600 dark:text-ink-300">{s.content}</p>
              </div>
            ))}
        </div>

        {project.images.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-400">{t("projectDetail.gallery")}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.images.map((img) => (
                <button key={img.id} onClick={() => setLightbox(img.url)} className="overflow-hidden rounded-xl border border-ink-200 dark:border-ink-800">
                  <img src={img.url} alt={img.caption || project.title} loading="lazy" className="aspect-video w-full object-cover transition hover:scale-105" />
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <Modal open={!!lightbox} onClose={() => setLightbox(null)} title={project.title} maxWidth="max-w-3xl">
        {lightbox && <img src={lightbox} alt={project.title} className="w-full rounded-lg" />}
      </Modal>
    </article>
  );
}
