import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { blogApi } from "@/api/resources";
import { useLanguage, localized } from "@/contexts/LanguageContext";
import SectionHeading from "@/components/common/SectionHeading";
import { SkeletonGrid } from "@/components/common/Skeleton";

function formatDate(dateStr: string | null | undefined, lang: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function BlogSection() {
  const { t, lang } = useLanguage();
  const { data, isLoading } = useQuery({ queryKey: ["blog", "public"], queryFn: () => blogApi.list() });
  const posts = (data || []).slice(0, 3);

  if (!isLoading && posts.length === 0) return null;

  return (
    <section className="section-container py-20 sm:py-28">
      <SectionHeading eyebrow={t("blog.eyebrow")} title={t("blog.title")} />

      <div className="mt-12">
        {isLoading && <SkeletonGrid />}
        {!isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="card-surface flex h-full flex-col p-6"
              >
                <p className="text-xs font-medium text-ink-400">{formatDate(post.publishedAt, lang)}</p>
                <h3 className="mt-2 text-lg font-bold">{post.title}</h3>
                <p className="mt-2 flex-1 text-sm text-ink-600 dark:text-ink-400">{localized(post, "excerpt", lang)}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag.id} className="rounded-md bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                      {tag.name}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  {t("blog.readMore")}
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
