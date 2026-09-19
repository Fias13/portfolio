import { Link } from "react-router-dom";
import { Coffee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Seo from "@/components/common/Seo";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="section-container flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <Seo title="Page Not Found — Jirat Sitthiwetkiat" />
      <Coffee className="mb-6 h-14 w-14 text-brand-500" aria-hidden="true" />
      <h1 className="text-2xl font-bold sm:text-3xl">{t("errors.404title")}</h1>
      <p className="mt-2 max-w-sm text-ink-500 dark:text-ink-400">{t("errors.404sub")}</p>
      <Link to="/" className="mt-6 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">
        {t("common.backHome")}
      </Link>
    </div>
  );
}
