import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { achievementsApi } from "@/api/resources";
import { useLanguage, localized } from "@/contexts/LanguageContext";
import SectionHeading from "@/components/common/SectionHeading";
import { SkeletonGrid } from "@/components/common/Skeleton";

export default function AchievementsSection() {
  const { t, lang } = useLanguage();
  const { data, isLoading } = useQuery({ queryKey: ["achievements"], queryFn: achievementsApi.list });

  return (
    <section id="achievements" className="section-container py-20 sm:py-28">
      <SectionHeading eyebrow={t("achievements.eyebrow")} title={t("achievements.title")} />

      <div className="mt-12">
        {isLoading && <SkeletonGrid count={2} />}
        {!isLoading && (
          <div className="grid gap-6 sm:grid-cols-2">
            {(data || []).map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="card-surface flex gap-5 p-6"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-3xl">
                  <Trophy className="text-amber-500" size={28} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                    {a.event || a.organization} · {new Date(a.date).getFullYear()}
                  </p>
                  <h3 className="mt-1 text-lg font-bold">{localized(a, "title", lang)}</h3>
                  {a.project && <p className="mt-0.5 text-sm font-medium text-brand-600 dark:text-brand-400">{a.project}</p>}
                  {localized(a, "description", lang) && (
                    <p className="mt-2 text-sm text-ink-600 dark:text-ink-400">{localized(a, "description", lang)}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
