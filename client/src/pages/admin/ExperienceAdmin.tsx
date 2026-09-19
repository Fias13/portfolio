import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { experienceApi } from "@/api/resources";
import { apiErrorMessage } from "@/api/client";
import type { EmploymentType, Experience } from "@/api/types";
import { useConfirm } from "@/contexts/ConfirmContext";
import AdminToolbar from "@/components/admin/AdminToolbar";
import DataTable, { type Column } from "@/components/admin/DataTable";
import RowActions, { IconAction } from "@/components/admin/RowActions";
import Modal from "@/components/common/Modal";
import { TextField, TextAreaField, SelectField, ToggleField, TagsField } from "@/components/admin/FormField";

const EMPLOYMENT_TYPES: EmploymentType[] = ["INTERNSHIP", "FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE"];

function ExperienceFormModal({ item, onClose, onSaved }: { item?: Experience | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!item;
  const [form, setForm] = useState({
    company: item?.company || "",
    position: item?.position || "",
    employmentType: item?.employmentType || "INTERNSHIP",
    startDate: item?.startDate?.slice(0, 10) || "",
    endDate: item?.endDate?.slice(0, 10) || "",
    isPresent: item?.isPresent || false,
    descriptionEn: item?.descriptionEn || "",
    descriptionTh: item?.descriptionTh || "",
    responsibilities: item?.responsibilities || [],
    technologies: item?.technologies || [],
    location: item?.location || "",
    visible: item?.visible ?? true,
  });
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.position.trim() || !form.startDate) {
      toast.error("Company, position, and start date are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, endDate: form.isPresent ? null : form.endDate || null };
      if (isEdit) {
        await experienceApi.update(item!.id, payload);
        toast.success("Experience updated");
      } else {
        await experienceApi.create(payload);
        toast.success("Experience added");
      }
      onSaved();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={isEdit ? "Edit Experience" : "Add Experience"} maxWidth="max-w-2xl">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Company" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <TextField label="Position" required value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Employment Type"
            value={form.employmentType}
            onChange={(e) => setForm({ ...form, employmentType: e.target.value as EmploymentType })}
            options={EMPLOYMENT_TYPES.map((t) => ({ value: t, label: t.replace("_", " ") }))}
          />
          <TextField label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Start Date" type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <TextField label="End Date" type="date" disabled={form.isPresent} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        </div>
        <ToggleField label="Present" checked={form.isPresent} onChange={(v) => setForm({ ...form, isPresent: v })} description="This is my current role" />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextAreaField label="Description (EN)" required rows={3} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
          <TextAreaField label="Description (TH)" required rows={3} value={form.descriptionTh} onChange={(e) => setForm({ ...form, descriptionTh: e.target.value })} />
        </div>
        <TagsField label="Responsibilities" values={form.responsibilities} onChange={(v) => setForm({ ...form, responsibilities: v })} />
        <TagsField label="Technologies" values={form.technologies} onChange={(v) => setForm({ ...form, technologies: v })} />
        <ToggleField label="Visible" checked={form.visible} onChange={(v) => setForm({ ...form, visible: v })} />
        <div className="flex justify-end gap-2 border-t border-ink-100 pt-4 dark:border-ink-800">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
            {saving && <Loader2 size={15} className="animate-spin" />}
            {isEdit ? "Save Changes" : "Add Experience"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function ExperienceAdmin() {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const [editing, setEditing] = useState<Experience | null | undefined>(undefined);

  const { data, isLoading } = useQuery({ queryKey: ["admin-experience"], queryFn: experienceApi.list });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-experience"] });
    queryClient.invalidateQueries({ queryKey: ["experience"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
  };

  const removeMutation = useMutation({
    mutationFn: (id: string) => experienceApi.remove(id),
    onSuccess: () => {
      toast.success("Experience deleted");
      invalidate();
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const columns: Column<Experience>[] = [
    {
      header: "Position",
      key: "position",
      render: (e) => (
        <div>
          <p className="font-medium">{e.position}</p>
          <p className="text-xs text-ink-400">{e.company}</p>
        </div>
      ),
    },
    { header: "Type", key: "type", render: (e) => e.employmentType.replace("_", " ") },
    { header: "Period", key: "period", render: (e) => `${new Date(e.startDate).getFullYear()} – ${e.isPresent ? "Present" : e.endDate ? new Date(e.endDate).getFullYear() : "—"}` },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Experience</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Manage the experience timeline.</p>

      <div className="mt-6">
        <AdminToolbar onAdd={() => setEditing(null)} addLabel="Add Experience" />
        <DataTable
          columns={columns}
          data={data || []}
          keyField={(e) => e.id}
          isLoading={isLoading}
          emptyTitle="No experience yet"
          actions={(e) => (
            <RowActions>
              <IconAction icon={Pencil} label="Edit" onClick={() => setEditing(e)} />
              <IconAction
                icon={Trash2}
                label="Delete"
                danger
                onClick={async () => {
                  const ok = await confirm({ title: "Delete this experience entry?", confirmLabel: "Delete", danger: true });
                  if (ok) removeMutation.mutate(e.id);
                }}
              />
            </RowActions>
          )}
        />
      </div>

      {editing !== undefined && (
        <ExperienceFormModal
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
