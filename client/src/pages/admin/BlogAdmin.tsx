import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { blogApi } from "@/api/resources";
import { apiErrorMessage } from "@/api/client";
import type { BlogPost, BlogStatus } from "@/api/types";
import { useConfirm } from "@/contexts/ConfirmContext";
import AdminToolbar from "@/components/admin/AdminToolbar";
import DataTable, { type Column } from "@/components/admin/DataTable";
import RowActions, { IconAction } from "@/components/admin/RowActions";
import Modal from "@/components/common/Modal";
import { TextField, TextAreaField, SelectField, TagsField } from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";

function BlogFormModal({ post, onClose, onSaved }: { post?: BlogPost | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!post;
  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerptEn: post?.excerptEn || "",
    excerptTh: post?.excerptTh || "",
    contentEn: post?.contentEn || "",
    contentTh: post?.contentTh || "",
    coverImageUrl: post?.coverImageUrl || null,
    status: post?.status || ("DRAFT" as BlogStatus),
    tags: post?.tags.map((t) => t.name) || [],
  });
  const [saving, setSaving] = useState(false);

  const submit = async (status: BlogStatus) => {
    if (!form.title.trim() || !form.excerptEn.trim() || !form.excerptTh.trim()) {
      toast.error("Title and excerpts (EN & TH) are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, status, slug: form.slug || undefined };
      if (isEdit) {
        await blogApi.update(post!.id, payload);
        toast.success(status === "PUBLISHED" ? "Post published successfully." : "Draft saved");
      } else {
        await blogApi.create(payload);
        toast.success(status === "PUBLISHED" ? "Post published successfully." : "Draft saved");
      }
      onSaved();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={isEdit ? "Edit Post" : "New Post"} maxWidth="max-w-3xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(form.status);
        }}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <TextField label="Slug" placeholder="auto-generated" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextAreaField label="Excerpt (EN)" required rows={2} value={form.excerptEn} onChange={(e) => setForm({ ...form, excerptEn: e.target.value })} />
          <TextAreaField label="Excerpt (TH)" required rows={2} value={form.excerptTh} onChange={(e) => setForm({ ...form, excerptTh: e.target.value })} />
        </div>
        <RichTextEditor label="Content (EN)" value={form.contentEn} onChange={(html) => setForm({ ...form, contentEn: html })} />
        <RichTextEditor label="Content (TH)" value={form.contentTh} onChange={(html) => setForm({ ...form, contentTh: html })} />
        <ImageUploader label="Cover Image" value={form.coverImageUrl} onChange={(url) => setForm({ ...form, coverImageUrl: url })} folder="blog" />
        <TagsField label="Tags" values={form.tags} onChange={(v) => setForm({ ...form, tags: v })} />
        <SelectField
          label="Status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as BlogStatus })}
          options={[
            { value: "DRAFT", label: "Draft" },
            { value: "PUBLISHED", label: "Published" },
          ]}
        />
        <div className="flex justify-end gap-2 border-t border-ink-100 pt-4 dark:border-ink-800">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800">
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => submit("DRAFT")}
            className="rounded-lg border border-ink-300 px-4 py-2 text-sm font-semibold hover:bg-ink-100 disabled:opacity-60 dark:border-ink-700 dark:hover:bg-ink-800"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => submit("PUBLISHED")}
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            Publish
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function BlogAdmin() {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const [editing, setEditing] = useState<BlogPost | null | undefined>(undefined);

  const { data, isLoading } = useQuery({ queryKey: ["admin-blog"], queryFn: () => blogApi.list() });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
    queryClient.invalidateQueries({ queryKey: ["blog"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
  };

  const removeMutation = useMutation({
    mutationFn: (id: string) => blogApi.remove(id),
    onSuccess: () => {
      toast.success("Post deleted");
      invalidate();
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const columns: Column<BlogPost>[] = [
    { header: "Title", key: "title", render: (p) => <span className="font-medium">{p.title}</span> },
    {
      header: "Status",
      key: "status",
      render: (p) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.status === "PUBLISHED" ? "bg-brand-500/10 text-brand-600 dark:text-brand-400" : "bg-ink-200 text-ink-600 dark:bg-ink-800 dark:text-ink-400"}`}>
          {p.status === "PUBLISHED" ? "Published" : "Draft"}
        </span>
      ),
    },
    { header: "Tags", key: "tags", render: (p) => p.tags.map((t) => t.name).join(", ") || "—" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Blog</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Write and manage developer notes.</p>

      <div className="mt-6">
        <AdminToolbar onAdd={() => setEditing(null)} addLabel="New Post" />
        <DataTable
          columns={columns}
          data={data || []}
          keyField={(p) => p.id}
          isLoading={isLoading}
          emptyTitle="No posts yet"
          actions={(p) => (
            <RowActions>
              <IconAction icon={Pencil} label="Edit" onClick={() => setEditing(p)} />
              <IconAction
                icon={Trash2}
                label="Delete"
                danger
                onClick={async () => {
                  const ok = await confirm({ title: "Delete this post?", description: `"${p.title}" will be permanently removed.`, confirmLabel: "Delete", danger: true });
                  if (ok) removeMutation.mutate(p.id);
                }}
              />
            </RowActions>
          )}
        />
      </div>

      {editing !== undefined && (
        <BlogFormModal
          post={editing}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined);
            invalidate();
          }}
        />
      )}
    </div>
  );
}
