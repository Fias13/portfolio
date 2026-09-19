import { motion } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/api/resources";
import { useLanguage } from "@/contexts/LanguageContext";
import CodeCard from "@/components/hero/CodeCard";

export default function Hero() {
  const { t } = useLanguage();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: profileApi.get });

  return (
    <section id="home" className="relative overflow-hidden pt-16 sm:pt-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-500/15 via-transparent to-transparent"
        aria-hidden="true"
      />
      <div className="section-container grid items-center gap-12 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-400"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {t("hero.headline1")}
            <br />
            <span className="text-gradient">{t("hero.headline2")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 max-w-xl text-lg text-ink-600 dark:text-ink-300"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
            >
              {t("hero.viewProjects")}
              <ArrowRight size={16} />
            </a>
            {profile?.resumeUrl && (
              <a
                href={profile.resumeUrl}
                download
                className="inline-flex items-center gap-2 rounded-full border border-ink-300 px-6 py-3 text-sm font-semibold text-ink-800 transition hover:bg-ink-100 dark:border-ink-700 dark:text-ink-100 dark:hover:bg-ink-800"
              >
                <Download size={16} />
                {t("hero.downloadResume")}
              </a>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex items-center gap-3"
          >
            {profile?.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="rounded-full border border-ink-200 p-2.5 text-ink-500 transition hover:border-brand-400 hover:text-brand-600 dark:border-ink-800 dark:text-ink-400 dark:hover:text-brand-400"
              >
                <Github size={18} />
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="rounded-full border border-ink-200 p-2.5 text-ink-500 transition hover:border-brand-400 hover:text-brand-600 dark:border-ink-800 dark:text-ink-400 dark:hover:text-brand-400"
              >
                <Linkedin size={18} />
              </a>
            )}
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="rounded-full border border-ink-200 p-2.5 text-ink-500 transition hover:border-brand-400 hover:text-brand-600 dark:border-ink-800 dark:text-ink-400 dark:hover:text-brand-400"
              >
                <Mail size={18} />
              </a>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-brand-500/10 blur-3xl" aria-hidden="true" />
          <CodeCard />
          <div className="absolute -bottom-4 -right-4 hidden items-center gap-2 rounded-2xl border border-ink-200 bg-white px-4 py-3 text-xs font-semibold shadow-xl dark:border-ink-800 dark:bg-ink-900 sm:flex">
            <Sparkles size={14} className="text-brand-500" />
            Quality-first frontend
          </div>
        </motion.div>
      </div>
    </section>
  );
}
