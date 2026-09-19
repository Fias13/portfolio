import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Moon, Sun, Download, Languages } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/api/resources";

const SECTIONS = [
  { id: "home", key: "nav.home" },
  { id: "about", key: "nav.about" },
  { id: "skills", key: "nav.skills" },
  { id: "projects", key: "nav.projects" },
  { id: "experience", key: "nav.experience" },
  { id: "achievements", key: "nav.achievements" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: profileApi.get });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  const goToSection = (id: string) => {
    setOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-ink-200/70 bg-white/80 backdrop-blur-lg dark:border-ink-800/70 dark:bg-ink-950/80" : "bg-transparent"
      }`}
    >
      <nav className="section-container flex h-16 items-center justify-between" aria-label="Main navigation">
        <Link to="/" className="font-mono text-lg font-bold tracking-tight">
          JIRAT<span className="text-brand-500">.</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => goToSection(s.id)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isHome && active === s.id ? "text-brand-600 dark:text-brand-400" : "text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
                }`}
              >
                {t(s.key)}
                {isHome && active === s.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-500"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={toggleLang}
            aria-label="Toggle language"
            className="flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
          >
            <Languages size={14} />
            {lang === "en" ? "EN" : "TH"}
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="rounded-full p-2 text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {profile?.resumeUrl && (
            <a
              href={profile.resumeUrl}
              download
              className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-ink-700 dark:bg-white dark:text-ink-900 dark:hover:bg-ink-200"
            >
              <Download size={14} />
              {t("nav.resume")}
            </a>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-ink-700 dark:text-ink-200 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-950 lg:hidden"
          >
            <ul className="section-container flex flex-col gap-1 py-4">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => goToSection(s.id)}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800"
                  >
                    {t(s.key)}
                  </button>
                </li>
              ))}
              <li className="mt-2 flex items-center gap-2 px-3">
                <button
                  onClick={toggleLang}
                  className="flex items-center gap-1 rounded-full border border-ink-200 px-3 py-1.5 text-xs font-semibold dark:border-ink-700"
                >
                  <Languages size={14} />
                  {lang === "en" ? "EN" : "TH"}
                </button>
                <button
                  onClick={toggleTheme}
                  className="rounded-full border border-ink-200 p-2 dark:border-ink-700"
                  aria-label="Toggle dark mode"
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                {profile?.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    download
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-ink-900"
                  >
                    <Download size={14} />
                    {t("nav.resume")}
                  </a>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
