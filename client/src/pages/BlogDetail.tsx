import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { blogApi } from "@/api/resources";
import { useLanguage, localized } from "@/contexts/LanguageContext";
import Seo from "@/components/common/Seo";
import ErrorState from "@/components/common/ErrorState";
import { Skeleton } from "@/components/common/Skeleton";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLanguage();

  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => blogApi.get(slug!),
    enabled: !!slug,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="section-container max-w-2xl py-24">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-6 h-10 w-full" />
        <Skeleton className="mt-4 h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404) return <Navigate to="/404" replace />;
    return (
      <div className="section-container py-24">
        <ErrorState message={t("common.error")} />
      </div>
    );
  }

  if (!post) return null;

  return (
    <article className="section-container max-w-2xl py-16 sm:py-20">
      <Seo title={`${post.title} — Jirat Sitthiwetkiat`} description={localized(post, "excerpt", lang)} type="article" />

      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-600 dark:hover:text-brand-400">
        <ArrowLeft size={15} />
        {t("common.backHome")}
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-6">
        {post.publishedAt && (
          <p className="text-xs font-medium text-ink-400">
            {new Date(post.publishedAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        )}
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{post.title}</h1>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span key={tag.id} className="rounded-md bg-ink-100 px-2 py-0.5 text-xs font-medium dark:bg-ink-800">
              {tag.name}
            </span>
          ))}
        </div>

        {post.coverImageUrl && <img src={post.coverImageUrl} alt={post.title} className="mt-8 w-full rounded-2xl" />}

        <div
          className="quill-content prose prose-ink mt-8 max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-brand-600 dark:prose-a:text-brand-400"
          dangerouslySetInnerHTML={{ __html: lang === "th" ? post.contentTh : post.contentEn }}
        />
      </motion.div>
    </article>
  );
}
