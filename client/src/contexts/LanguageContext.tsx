import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import en from "@/locales/en.json";
import th from "@/locales/th.json";

export type Language = "en" | "th";

const dictionaries: Record<Language, Record<string, unknown>> = { en, th };

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function getInitialLang(): Language {
  try {
    const stored = localStorage.getItem("lang");
    if (stored === "en" || stored === "th") return stored;
  } catch {
    // ignore
  }
  return "en";
}

function resolve(dict: Record<string, unknown>, key: string): string | undefined {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
  return typeof value === "string" ? value : undefined;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    try {
      localStorage.setItem("lang", lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const setLang = (l: Language) => setLangState(l);
  const toggleLang = () => setLangState((prev) => (prev === "en" ? "th" : "en"));

  const t = useMemo(() => {
    return (key: string) => resolve(dictionaries[lang], key) ?? resolve(dictionaries.en, key) ?? key;
  }, [lang]);

  return <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function localized<T extends object>(obj: T, field: string, lang: Language): string {
  const record = obj as Record<string, unknown>;
  const key = `${field}${lang === "th" ? "Th" : "En"}`;
  return (record[key] as string) ?? (record[`${field}En`] as string) ?? "";
}
