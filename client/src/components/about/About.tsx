import { motion } from "framer-motion";
import { Award, Code2, GraduationCap, TestTube2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { profileApi, projectsApi } from "@/api/resources";
import { useLanguage } from "@/contexts/LanguageContext";
import SectionHeading from "@/components/common/SectionHeading";

export default function About() {
  const { t, lang } = useLanguage();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: profileApi.get });
  const { data: projects } = useQuery({ queryKey: ["projects", "public"], queryFn: () => projectsApi.list() });

  const cards = [
    {
      icon: GraduationCap,
      title: t("about.cs"),
      subtitle: `${t("about.university")} · ${t("about.honors")}`,
    },
    {
      icon: TestTube2,
      title: t("about.internship"),
      subtitle: lang === "th" ? "ประสบการณ์ทดสอบซอฟต์แวร์เชิงลึก" : "Hands-on QA & manual testing experience",
    },
    {
      icon: Code2,
      title: `${projects?.length ?? "3"}+ ${t("about.projects")}`,
      subtitle: lang === "th" ? "สร้างด้วย React และเทคโนโลยีสมัยใหม่" : "Built with React & modern tooling",
    },
    {
      icon: Award,
      title: t("about.bootcamp"),
      subtitle: t("about.bootcampPrize"),
    },
  ];

  return (
    <section id="about" className="section-container py-20 sm:py-28">
      <SectionHeading eyebrow={t("about.eyebrow")} title={t("about.title")} align="left" />

      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          {profile?.avatarUrl && (
            <motion.img
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              src={profile.avatarUrl}
              alt={profile.name}
              className="mb-6 h-24 w-24 rounded-2xl border border-ink-200 object-cover shadow-sm dark:border-ink-800"
            />
          )}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: profile?.avatarUrl ? 0.08 : 0 }}
            className="text-lg leading-relaxed text-ink-600 dark:text-ink-300"
          >
            {profile ? (lang === "th" ? profile.bioTh : profile.bioEn) : "..."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card-surface p-5"
            >
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <card.icon size={20} />
              </span>
              <p className="font-semibold">{card.title}</p>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{card.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
