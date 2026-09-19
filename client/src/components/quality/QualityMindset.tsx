import { motion } from "framer-motion";
import { CheckCircle2, Code2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FRONTEND_ITEMS = ["React", "Reusable Components", "Responsive UI", "API Integration", "UX"];
const QUALITY_ITEMS = ["Test Cases", "Bug Detection", "Regression Testing", "UAT", "Automation"];

export default function QualityMindset() {
  const { t } = useLanguage();

  return (
    <section className="bg-ink-950 py-20 text-white sm:py-28">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("quality.title")}</h2>
          <p className="mt-4 text-ink-300">{t("quality.description")}</p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-500/10 to-transparent p-8"
          >
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
              <Code2 size={22} />
            </span>
            <h3 className="text-xl font-bold">{t("quality.frontend")}</h3>
            <ul className="mt-4 space-y-2.5">
              {FRONTEND_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-ink-200">
                  <CheckCircle2 size={16} className="text-brand-400" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-transparent p-8"
          >
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
              <ShieldCheck size={22} />
            </span>
            <h3 className="text-xl font-bold">{t("quality.quality")}</h3>
            <ul className="mt-4 space-y-2.5">
              {QUALITY_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-ink-200">
                  <CheckCircle2 size={16} className="text-sky-400" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
