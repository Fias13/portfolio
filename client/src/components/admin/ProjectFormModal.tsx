import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { projectsApi } from "@/api/resources";
import { apiErrorMessage } from "@/api/client";
import type { Project } from "@/api/types";
import Modal from "@/components/common/Modal";
import { TextField, TextAreaField, ToggleField, TagsField } from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import GalleryUploader, { type GalleryImage } from "@/components/admin/GalleryUploader";
import { Loader2 } from "lucide-react";

interface FormState {
  title: string;
  slug: string;
  shortDescEn: string;
  shortDescTh: string;
  fullDescEn: string;
  fullDescTh: string;
  role: string;
  year: string;
  category: string;
  techStack: string[];
  features: string[];
  problemEn: string;
  problemTh: string;
  solutionEn: string;
  solutionTh: string;
  challengesEn: string;
  challengesTh: string;
  resultsEn: string;
  resultsTh: string;
  githubUrl: string;
  liveDemoUrl: string;
  thumbnailUrl: string | null;
  featured: boolean;
  published: boolean;
  images: GalleryImage[];
}

function toFormState(p?: Project | null): FormState {
  return {
    title: p?.title || "",
    slug: p?.slug || "",
    shortDescEn: p?.shortDescEn || "",
    shortDescTh: p?.shortDescTh || "",
    fullDescEn: p?.fullDescEn || "",
    fullDescTh: p?.fullDescTh || "",
    role: p?.role || "",
    year: p?.year ? String(p.year) : "",
    category: p?.category || "",
    techStack: p?.techStack || [],
    features: p?.features || [],
    problemEn: p?.problemEn || "",
    problemTh: p?.problemTh || "",
    solutionEn: p?.solutionEn || "",
    solutionTh: p?.solutionTh || "",
    challengesEn: p?.challengesEn || "",
    challengesTh: p?.challengesTh || "",
    resultsEn: p?.resultsEn || "",
    resultsTh: p?.resultsTh || "",
    githubUrl: p?.githubUrl || "",
    liveDemoUrl: p?.liveDemoUrl || "",
    thumbnailUrl: p?.thumbnailUrl || null,
    featured: p?.featured || false,
    published: p?.published || false,
    images: p?.images.map((i) => ({ url: i.url, caption: i.caption, sortOrder: i.sortOrder })) || [],
  };
}

export default function ProjectFormModal({ project, onClose, onSaved }: { project?: Project | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<FormState>(() => toFormState(project));
  const [saving, setSaving] = useState(false);
  const isEdit = !!project;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.shortDescEn.trim() || !form.shortDescTh.trim()) {
      toast.error("Title and short descriptions (EN & TH) are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        year: form.year ? Number(form.year) : null,
        role: form.role || null,
        category: form.category || null,
        thumbnailUrl: form.thumbnailUrl || null,
        githubUrl: form.githubUrl || null,
        liveDemoUrl: form.liveDemoUrl || null,
        problemEn: form.problemEn || null,
        problemTh: form.problemTh || null,
        solutionEn: form.solutionEn || null,
        solutionTh: form.solutionTh || null,
        challengesEn: form.challengesEn || null,
        challengesTh: form.challengesTh || null,
        resultsEn: form.resultsEn || null,
        resultsTh: form.resultsTh || null,
        slug: form.slug || undefined,
      };
      if (isEdit) {
        await projectsApi.update(project!.id, payload);
        toast.success("Project updated");
      } else {
        await projectsApi.create(payload);
        toast.success("Project published successfully.");
      }
      onSaved();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not save project"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={isEdit ? "Edit Project" : "Add Project"} maxWidth="max-w-3xl">
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Title" required value={form.title} onChange={(e) => update("title", e.target.value)} />
          <TextField label="Slug" placeholder="auto-generated from title if left blank" value={form.slug} onChange={(e) => update("slug", e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextAreaField label="Short Description (EN)" required rows={2} value={form.shortDescEn} onChange={(e) => update("shortDescEn", e.target.value)} />
          <TextAreaField label="Short Description (TH)" required rows={2} value={form.shortDescTh} onChange={(e) => update("shortDescTh", e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextAreaField label="Full Description (EN)" rows={4} value={form.fullDescEn} onChange={(e) => update("fullDescEn", e.target.value)} />
          <TextAreaField label="Full Description (TH)" rows={4} value={form.fullDescTh} onChange={(e) => update("fullDescTh", e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <TextField label="Role" value={form.role} onChange={(e) => update("role", e.target.value)} />
          <TextField label="Year" type="number" value={form.year} onChange={(e) => update("year", e.target.value)} />
          <TextField label="Category" value={form.category} onChange={(e) => update("category", e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TagsField label="Tech Stack" values={form.techStack} onChange={(v) => update("techStack", v)} />
          <TagsField label="Features" values={form.features} onChange={(v) => update("features", v)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextAreaField label="Problem (EN)" rows={3} value={form.problemEn} onChange={(e) => update("problemEn", e.target.value)} />
          <TextAreaField label="Problem (TH)" rows={3} value={form.problemTh} onChange={(e) => update("problemTh", e.target.value)} />
          <TextAreaField label="Solution (EN)" rows={3} value={form.solutionEn} onChange={(e) => update("solutionEn", e.target.value)} />
          <TextAreaField label="Solution (TH)" rows={3} value={form.solutionTh} onChange={(e) => update("solutionTh", e.target.value)} />
          <TextAreaField label="Challenges (EN)" rows={3} value={form.challengesEn} onChange={(e) => update("challengesEn", e.target.value)} />
          <TextAreaField label="Challenges (TH)" rows={3} value={form.challengesTh} onChange={(e) => update("challengesTh", e.target.value)} />
          <TextAreaField label="Results (EN)" rows={3} value={form.resultsEn} onChange={(e) => update("resultsEn", e.target.value)} />
          <TextAreaField label="Results (TH)" rows={3} value={form.resultsTh} onChange={(e) => update("resultsTh", e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="GitHub URL" type="url" value={form.githubUrl} onChange={(e) => update("githubUrl", e.target.value)} />
          <TextField label="Live Demo URL" type="url" value={form.liveDemoUrl} onChange={(e) => update("liveDemoUrl", e.target.value)} />
        </div>

        <ImageUploader label="Thumbnail" value={form.thumbnailUrl} onChange={(url) => update("thumbnailUrl", url)} folder="projects" />
        <GalleryUploader images={form.images} onChange={(imgs) => update("images", imgs)} />

        <div className="grid gap-3 sm:grid-cols-2">
          <ToggleField label="Featured" checked={form.featured} onChange={(v) => update("featured", v)} />
          <ToggleField label="Published" checked={form.published} onChange={(v) => update("published", v)} description="Visible on the public site" />
        </div>

        <div className="flex justify-end gap-2 border-t border-ink-100 pt-4 dark:border-ink-800">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {isEdit ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
