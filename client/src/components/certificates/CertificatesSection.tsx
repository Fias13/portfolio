import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Award, ExternalLink } from "lucide-react";
import { certificatesApi } from "@/api/resources";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Certificate } from "@/api/types";
import SectionHeading from "@/components/common/SectionHeading";
import { SkeletonGrid } from "@/components/common/Skeleton";
import Modal from "@/components/common/Modal";

export default function CertificatesSection() {
  const { t, lang } = useLanguage();
  const { data, isLoading } = useQuery({ queryKey: ["certificates"], queryFn: certificatesApi.list });
  const [active, setActive] = useState<Certificate | null>(null);

  return (
    <section className="section-container py-20 sm:py-28">
      <SectionHeading eyebrow={t("certificates.eyebrow")} title={t("certificates.title")} />

      <div className="mt-12">
        {isLoading && <SkeletonGrid count={2} />}
        {!isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(data || []).map((cert, i) => (
              <motion.button
                key={cert.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => setActive(cert)}
                className="card-surface flex items-center gap-4 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Award size={22} />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{cert.name}</p>
                  <p className="truncate text-sm text-ink-500 dark:text-ink-400">{cert.organization}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.name}>
        {active && (
          <div>
            {active.imageUrl && <img src={active.imageUrl} alt={active.name} className="mb-4 w-full rounded-lg" />}
            <p className="text-sm font-medium text-ink-500 dark:text-ink-400">{active.organization}</p>
            <p className="mt-1 text-xs text-ink-400">{new Date(active.issueDate).toLocaleDateString()}</p>
            {(lang === "th" ? active.descriptionTh : active.descriptionEn) && (
              <p className="mt-3 text-sm text-ink-600 dark:text-ink-300">
                {lang === "th" ? active.descriptionTh : active.descriptionEn}
              </p>
            )}
            {active.credentialUrl && (
              <a
                href={active.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400"
              >
                {t("certificates.viewCredential")}
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
