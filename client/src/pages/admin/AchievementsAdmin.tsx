import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { achievementsApi } from "@/api/resources";
import { apiErrorMessage } from "@/api/client";
import type { Achievement } from "@/api/types";
import { useConfirm } from "@/contexts/ConfirmContext";
import AdminToolbar from "@/components/admin/AdminToolbar";
import DataTable, { type Column } from "@/components/admin/DataTable";
import RowActions, { IconAction } from "@/components/admin/RowActions";
import Modal from "@/components/common/Modal";
import { TextField, TextAreaField, ToggleField } from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";

function AchievementFormModal({ item, onClose, onSaved }: { item?: Achievement | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!item;
  const [form, setForm] = useState({
    titleEn: item?.titleEn || "",
    titleTh: item?.titleTh || "",
    organization: item?.organization || "",
    date: item?.date?.slice(0, 10) || "",
    descriptionEn: item?.descriptionEn || "",
    descriptionTh: item?.descriptionTh || "",
    imageUrl: item?.imageUrl || null,
    credentialUrl: item?.credentialUrl || "",
    event: item?.event || "",
    project: item?.project || "",
    role: item?.role || "",
    featured: item?.featured || false,
    visible: item?.visible ?? true,
  });
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.titleEn.trim() || !form.titleTh.trim() || !form.organization.trim() || !form.date) {
      toast.error("Title (EN/TH), organization, and date are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, sortOrder: 0 };
      if (isEdit) {
        await achievementsApi.update(item!.id, payload);
        toast.success("Achievement updated");
      } else {
        await achievementsApi.create(payload);
        toast.success("Achievement added");
      }
      onSaved();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={isEdit ? "Edit Achievement" : "Add Achievement"} maxWidth="max-w-2xl">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Title (EN)" required value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
          <TextField label="Title (TH)" required value={form.titleTh} onChange={(e) => setForm({ ...form, titleTh: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Organization" required value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
          <TextField label="Date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField label="Event" value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })} />
          <TextField label="Project" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} />
          <TextField label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextAreaField label="Description (EN)" rows={3} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
          <TextAreaField label="Description (TH)" rows={3} value={form.descriptionTh} onChange={(e) => setForm({ ...form, descriptionTh: e.target.value })} />
        </div>
        <TextField label="Credential URL" type="url" value={form.credentialUrl} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} />
        <ImageUploader label="Image" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} folder="achievements" />
        <div className="grid gap-3 sm:grid-cols-2">
          <ToggleField label="Featured" checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} />
          <ToggleField label="Visible" checked={form.visible} onChange={(v) => setForm({ ...form, visible: v })} />
        </div>
        <div className="flex justify-end gap-2 border-t border-ink-100 pt-4 dark:border-ink-800">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
            {saving && <Loader2 size={15} className="animate-spin" />}
            {isEdit ? "Save Changes" : "Add Achievement"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function AchievementsAdmin() {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const [editing, setEditing] = useState<Achievement | null | undefined>(undefined);

  const { data, isLoading } = useQuery({ queryKey: ["admin-achievements"], queryFn: achievementsApi.list });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-achievements"] });
    queryClient.invalidateQueries({ queryKey: ["achievements"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
  };

  const removeMutation = useMutation({
    mutationFn: (id: string) => achievementsApi.remove(id),
    onSuccess: () => {
      toast.success("Achievement deleted");
      invalidate();
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const columns: Column<Achievement>[] = [
    { header: "Title", key: "title", render: (a) => <span className="font-medium">{a.titleEn}</span> },
    { header: "Organization", key: "org", render: (a) => a.organization },
    { header: "Date", key: "date", render: (a) => new Date(a.date).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Achievements</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Awards, prizes, and recognitions.</p>

      <div className="mt-6">
        <AdminToolbar onAdd={() => setEditing(null)} addLabel="Add Achievement" />
        <DataTable
          columns={columns}
          data={data || []}
          keyField={(a) => a.id}
          isLoading={isLoading}
          emptyTitle="No achievements yet"
          actions={(a) => (
            <RowActions>
              <IconAction icon={Pencil} label="Edit" onClick={() => setEditing(a)} />
              <IconAction
                icon={Trash2}
                label="Delete"
                danger
                onClick={async () => {
                  const ok = await confirm({ title: "Delete this achievement?", confirmLabel: "Delete", danger: true });
                  if (ok) removeMutation.mutate(a.id);
                }}
              />
            </RowActions>
          )}
        />
      </div>

      {editing !== undefined && (
        <AchievementFormModal
          item={editing}
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
