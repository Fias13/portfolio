import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, MapPin } from "lucide-react";
import { experienceApi } from "@/api/resources";
import { useLanguage, localized } from "@/contexts/LanguageContext";
import SectionHeading from "@/components/common/SectionHeading";
import { Skeleton } from "@/components/common/Skeleton";

function formatDate(dateStr: string, lang: string) {
  return new Date(dateStr).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", { month: "short", year: "numeric" });
}

export default function ExperienceSection() {
  const { t, lang } = useLanguage();
  const { data, isLoading } = useQuery({ queryKey: ["experience"], queryFn: experienceApi.list });

  return (
    <section id="experience" className="section-container py-20 sm:py-28">
      <SectionHeading eyebrow={t("experience.eyebrow")} title={t("experience.title")} />

      <div className="relative mx-auto mt-14 max-w-3xl">
        <div className="absolute bottom-0 left-4 top-0 w-px bg-ink-200 dark:bg-ink-800 sm:left-1/2" aria-hidden="true" />

        {isLoading &&
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="mb-6 ml-12 h-32 w-full sm:ml-0" />)}

        {!isLoading &&
          (data || []).map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative mb-10 pl-12 sm:w-1/2 sm:pl-0 ${i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:ml-auto sm:pl-12"}`}
            >
              <span
                className={`absolute left-2.5 top-1 flex h-4 w-4 items-center justify-center rounded-full border-4 border-white bg-brand-500 dark:border-ink-950 sm:left-auto ${
                  i % 2 === 0 ? "sm:-right-2" : "sm:-left-2"
                }`}
                aria-hidden="true"
              />
              <div className="card-surface p-5">
                <div className={`flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 ${i % 2 === 0 ? "sm:justify-end" : ""}`}>
                  <Briefcase size={14} />
                  {exp.isPresent ? t("experience.present") : formatDate(exp.endDate || exp.startDate, lang)}
                  <span className="text-ink-400">·</span>
                  {formatDate(exp.startDate, lang)}
                </div>
                <h3 className="mt-1.5 text-lg font-bold">{exp.position}</h3>
                <p className="text-sm font-medium text-ink-500 dark:text-ink-400">{exp.company}</p>
                {exp.location && (
                  <p className={`mt-1 flex items-center gap-1 text-xs text-ink-400 ${i % 2 === 0 ? "sm:justify-end" : ""}`}>
                    <MapPin size={12} />
                    {exp.location}
                  </p>
                )}
                <p className="mt-3 text-sm text-ink-600 dark:text-ink-300">{localized(exp, "description", lang)}</p>
                {exp.responsibilities.length > 0 && (
                  <ul className={`mt-3 space-y-1 text-sm text-ink-500 dark:text-ink-400 ${i % 2 === 0 ? "sm:text-right" : ""}`}>
                    {exp.responsibilities.slice(0, 5).map((r) => (
                      <li key={r}>• {r}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
      </div>
    </section>
  );
}
