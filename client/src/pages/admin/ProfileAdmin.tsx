import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { profileApi } from "@/api/resources";
import { apiErrorMessage } from "@/api/client";
import { TextField, TextAreaField, ToggleField } from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import { Skeleton } from "@/components/common/Skeleton";

export default function ProfileAdmin() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-profile"], queryFn: profileApi.get });
  const [form, setForm] = useState({
    name: "",
    headlineEn: "",
    headlineTh: "",
    bioEn: "",
    bioTh: "",
    email: "",
    phone: "",
    location: "",
    github: "",
    linkedin: "",
    website: "",
    resumeUrl: "",
    avatarUrl: null as string | null,
    availableForWork: true,
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        headlineEn: data.headlineEn || "",
        headlineTh: data.headlineTh || "",
        bioEn: data.bioEn || "",
        bioTh: data.bioTh || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        website: data.website || "",
        resumeUrl: data.resumeUrl || "",
        avatarUrl: data.avatarUrl || null,
        availableForWork: data.availableForWork,
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => profileApi.update(form),
    onSuccess: () => {
      toast.success("Profile updated. Changes are now live on the public site.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">This information powers the Hero, About, and Footer sections.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="card-surface mt-6 space-y-5 p-6"
      >
        <ImageUploader label="Profile Image" value={form.avatarUrl} onChange={(url) => setForm({ ...form, avatarUrl: url })} folder="profile" />

        <TextField label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Headline (EN)" required value={form.headlineEn} onChange={(e) => setForm({ ...form, headlineEn: e.target.value })} />
          <TextField label="Headline (TH)" required value={form.headlineTh} onChange={(e) => setForm({ ...form, headlineTh: e.target.value })} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextAreaField label="Bio (EN)" required rows={5} value={form.bioEn} onChange={(e) => setForm({ ...form, bioEn: e.target.value })} />
          <TextAreaField label="Bio (TH)" required rows={5} value={form.bioTh} onChange={(e) => setForm({ ...form, bioTh: e.target.value })} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>

        <TextField label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="GitHub URL" type="url" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
          <TextField label="LinkedIn URL" type="url" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Website URL" type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          <TextField label="Resume URL" value={form.resumeUrl} onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })} placeholder="/uploads/resume.pdf" />
        </div>

        <ToggleField label="Available for work" checked={form.availableForWork} onChange={(v) => setForm({ ...form, availableForWork: v })} />

        <div className="flex justify-end border-t border-ink-100 pt-4 dark:border-ink-800">
          <button type="submit" disabled={mutation.isPending} className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
            {mutation.isPending && <Loader2 size={15} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
