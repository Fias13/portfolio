import { Github, Linkedin, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/api/resources";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: profileApi.get });
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-200 py-10 dark:border-ink-800">
      <div className="section-container flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-mono text-sm font-bold">
            JIRAT<span className="text-brand-500">.</span>
          </p>
          <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">{t("footer.builtWith")}</p>
        </div>

        <div className="flex items-center gap-3">
          {profile?.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="rounded-full p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-white"
            >
              <Github size={18} />
            </a>
          )}
          {profile?.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="rounded-full p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-white"
            >
              <Linkedin size={18} />
            </a>
          )}
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="rounded-full p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-white"
            >
              <Mail size={18} />
            </a>
          )}
        </div>

        <p className="text-xs text-ink-400">
          © {year} Jirat Sitthiwetkiat. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
