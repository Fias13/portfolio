import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Skill } from "@/api/types";

export default function SkillCategoryCard({ category, skills, index = 0 }: { category: string; skills: Skill[]; index?: number }) {
  const { t } = useLanguage();
  const label = t(`skills.categories.${category}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="card-surface p-6"
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
        {label !== `skills.categories.${category}` ? label : category}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="rounded-full border border-ink-200 bg-ink-50 px-3 py-1.5 text-sm font-medium text-ink-700 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
