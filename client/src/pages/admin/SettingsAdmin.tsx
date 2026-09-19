import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { settingsApi } from "@/api/resources";
import { apiErrorMessage } from "@/api/client";
import { TextField, TextAreaField, SelectField, TagsField } from "@/components/admin/FormField";

export default function SettingsAdmin() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-settings"], queryFn: settingsApi.get });
  const [form, setForm] = useState({
    siteTitle: "",
    siteDescriptionEn: "",
    siteDescriptionTh: "",
    seoKeywords: [] as string[],
    defaultLanguage: "en",
    defaultTheme: "dark",
    contactEmail: "",
    github: "",
    linkedin: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        siteTitle: data.siteTitle || "",
        siteDescriptionEn: data.siteDescriptionEn || "",
        siteDescriptionTh: data.siteDescriptionTh || "",
        seoKeywords: data.seoKeywords || [],
        defaultLanguage: data.defaultLanguage || "en",
        defaultTheme: data.defaultTheme || "dark",
        contactEmail: data.contactEmail || "",
        github: data.socialLinks?.github || "",
        linkedin: data.socialLinks?.linkedin || "",
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () =>
      settingsApi.update({
        siteTitle: form.siteTitle,
        siteDescriptionEn: form.siteDescriptionEn,
        siteDescriptionTh: form.siteDescriptionTh,
        seoKeywords: form.seoKeywords,
        defaultLanguage: form.defaultLanguage as "en" | "th",
        defaultTheme: form.defaultTheme as "light" | "dark",
        contactEmail: form.contactEmail,
        socialLinks: { github: form.github, linkedin: form.linkedin },
      }),
    onSuccess: () => {
      toast.success("Settings updated");
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  if (isLoading) return null;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Global site configuration and SEO defaults.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="card-surface mt-6 space-y-5 p-6"
      >
        <TextField label="Website Title" required value={form.siteTitle} onChange={(e) => setForm({ ...form, siteTitle: e.target.value })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextAreaField label="Description (EN)" rows={3} value={form.siteDescriptionEn} onChange={(e) => setForm({ ...form, siteDescriptionEn: e.target.value })} />
          <TextAreaField label="Description (TH)" rows={3} value={form.siteDescriptionTh} onChange={(e) => setForm({ ...form, siteDescriptionTh: e.target.value })} />
        </div>
        <TagsField label="SEO Keywords" values={form.seoKeywords} onChange={(v) => setForm({ ...form, seoKeywords: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Default Language"
            value={form.defaultLanguage}
            onChange={(e) => setForm({ ...form, defaultLanguage: e.target.value })}
            options={[
              { value: "en", label: "English" },
              { value: "th", label: "Thai" },
            ]}
          />
          <SelectField
            label="Default Theme"
            value={form.defaultTheme}
            onChange={(e) => setForm({ ...form, defaultTheme: e.target.value })}
            options={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
            ]}
          />
        </div>
        <TextField label="Contact Email" type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="GitHub URL" type="url" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
          <TextField label="LinkedIn URL" type="url" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
        </div>

        <div className="flex justify-end border-t border-ink-100 pt-4 dark:border-ink-800">
          <button type="submit" disabled={mutation.isPending} className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
            {mutation.isPending && <Loader2 size={15} className="animate-spin" />}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
