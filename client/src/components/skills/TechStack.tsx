import { useQuery } from "@tanstack/react-query";
import { skillsApi } from "@/api/resources";
import { useLanguage } from "@/contexts/LanguageContext";
import SectionHeading from "@/components/common/SectionHeading";
import { SkeletonGrid } from "@/components/common/Skeleton";
import ErrorState from "@/components/common/ErrorState";
import SkillCategoryCard from "@/components/skills/SkillCategoryCard";

const CATEGORY_ORDER = ["Frontend", "Database", "Testing", "Tools"];
const EXCLUDED_CATEGORIES = ["Soft Skills"];

export default function TechStack() {
  const { t } = useLanguage();
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["skills"], queryFn: skillsApi.list });

  const grouped = (data || []).reduce<Record<string, typeof data>>((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category]!.push(skill);
    return acc;
  }, {});

  const categories = CATEGORY_ORDER.filter((c) => grouped[c]?.length).concat(
    Object.keys(grouped).filter((c) => !CATEGORY_ORDER.includes(c) && !EXCLUDED_CATEGORIES.includes(c))
  );

  return (
    <section id="skills" className="section-container py-20 sm:py-28">
      <SectionHeading eyebrow={t("skills.eyebrow")} title={t("skills.title")} />

      <div className="mt-12">
        {isLoading && <SkeletonGrid count={5} />}
        {isError && <ErrorState message={t("common.error")} onRetry={() => refetch()} />}
        {!isLoading && !isError && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, i) => (
              <SkillCategoryCard key={category} category={category} skills={grouped[category]!} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
