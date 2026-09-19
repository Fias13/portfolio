import { useQuery } from "@tanstack/react-query";
import { skillsApi } from "@/api/resources";
import { useLanguage } from "@/contexts/LanguageContext";
import SectionHeading from "@/components/common/SectionHeading";
import { Skeleton } from "@/components/common/Skeleton";
import SkillCategoryCard from "@/components/skills/SkillCategoryCard";

const SOFT_SKILLS_CATEGORY = "Soft Skills";

export default function SoftSkillsSection() {
  const { t } = useLanguage();
  const { data, isLoading } = useQuery({ queryKey: ["skills"], queryFn: skillsApi.list });

  const softSkills = (data || []).filter((s) => s.category === SOFT_SKILLS_CATEGORY);

  if (!isLoading && softSkills.length === 0) return null;

  return (
    <section className="section-container py-20 sm:py-28">
      <SectionHeading eyebrow={t("softSkills.eyebrow")} title={t("softSkills.title")} />

      <div className="mx-auto mt-12 max-w-xl">
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <SkillCategoryCard category={SOFT_SKILLS_CATEGORY} skills={softSkills} />
        )}
      </div>
    </section>
  );
}
