import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Github, Star } from "lucide-react";
import type { Project } from "@/api/types";
import { useLanguage, localized } from "@/contexts/LanguageContext";

export default function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const { t, lang } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group card-surface flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-brand-500/20 via-ink-900/5 to-ink-900/20 dark:from-brand-500/10 dark:to-ink-950">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-4xl font-bold text-brand-600/30 dark:text-brand-400/20">
            {project.title.slice(0, 2).toUpperCase()}
          </div>
        )}
        {project.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink-900 shadow dark:bg-ink-900/90 dark:text-white">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm text-ink-600 dark:text-ink-400">{localized(project, "shortDesc", lang)}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-ink-100 px-2 py-1 text-[11px] font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-4 dark:border-ink-800">
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            {t("projects.viewProject")}
            <ArrowUpRight size={15} />
          </Link>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} source code`}
              className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
            >
              <Github size={17} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
