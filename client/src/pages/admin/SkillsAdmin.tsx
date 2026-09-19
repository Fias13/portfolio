import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Pencil, Trash2 } from "lucide-react";
import { skillsApi } from "@/api/resources";
import { apiErrorMessage } from "@/api/client";
import type { Skill } from "@/api/types";
import { useConfirm } from "@/contexts/ConfirmContext";
import AdminToolbar from "@/components/admin/AdminToolbar";
import DataTable, { type Column } from "@/components/admin/DataTable";
import RowActions, { IconAction } from "@/components/admin/RowActions";
import Modal from "@/components/common/Modal";
import { TextField, SelectField, ToggleField } from "@/components/admin/FormField";

const CATEGORY_OPTIONS = ["Frontend", "Database", "Testing", "Tools", "Soft Skills"];

function SkillFormModal({ skill, onClose, onSaved }: { skill?: Skill | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!skill;
  const [form, setForm] = useState({
    name: skill?.name || "",
    category: skill?.category || CATEGORY_OPTIONS[0],
    descriptionEn: skill?.descriptionEn || "",
    descriptionTh: skill?.descriptionTh || "",
    visible: skill?.visible ?? true,
  });
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await skillsApi.update(skill!.id, form);
        toast.success("Skill updated");
      } else {
        await skillsApi.create({ ...form, sortOrder: 0 });
        toast.success("Skill added");
      }
      onSaved();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={isEdit ? "Edit Skill" : "Add Skill"}>
      <form onSubmit={onSubmit} className="space-y-4">
        <TextField label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <SelectField
          label="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          options={CATEGORY_OPTIONS.map((c) => ({ value: c, label: c }))}
        />
        <ToggleField label="Visible" checked={form.visible} onChange={(v) => setForm({ ...form, visible: v })} description="Show on the public site" />
        <div className="flex justify-end gap-2 border-t border-ink-100 pt-4 dark:border-ink-800">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
            {saving && <Loader2 size={15} className="animate-spin" />}
            {isEdit ? "Save Changes" : "Add Skill"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function SkillsAdmin() {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Skill | null | undefined>(undefined);

  const { data, isLoading } = useQuery({ queryKey: ["admin-skills"], queryFn: skillsApi.list });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
    queryClient.invalidateQueries({ queryKey: ["skills"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
  };

  const removeMutation = useMutation({
    mutationFn: (id: string) => skillsApi.remove(id),
    onSuccess: () => {
      toast.success("Skill deleted");
      invalidate();
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const toggleVisible = useMutation({
    mutationFn: (skill: Skill) => skillsApi.update(skill.id, { visible: !skill.visible }),
    onSuccess: invalidate,
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const reorderMutation = useMutation({
    mutationFn: (order: string[]) => skillsApi.reorder(order),
    onSuccess: invalidate,
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const move = (id: string, direction: -1 | 1) => {
    const list = data || [];
    const index = list.findIndex((s) => s.id === id);
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= list.length) return;
    if (list[swapWith].category !== list[index].category) return; // keep reordering within the same category
    const next = [...list];
    [next[index], next[swapWith]] = [next[swapWith], next[index]];
    reorderMutation.mutate(next.map((s) => s.id));
  };

  const filtered = (data || []).filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  const reorderDisabled = !!search;

  const columns: Column<Skill>[] = [
    { header: "Name", key: "name", render: (s) => <span className="font-medium">{s.name}</span> },
    { header: "Category", key: "category", render: (s) => s.category },
    {
      header: "Visible",
      key: "visible",
      render: (s) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.visible ? "bg-brand-500/10 text-brand-600 dark:text-brand-400" : "bg-ink-200 text-ink-600 dark:bg-ink-800 dark:text-ink-400"}`}>
          {s.visible ? "Visible" : "Hidden"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Skills</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Manage the tech stack shown in the Skills section.</p>

      <div className="mt-6">
        <AdminToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Search skills..." onAdd={() => setEditing(null)} addLabel="Add Skill" />
        <p className="-mt-2 mb-4 text-xs text-ink-400">Use the up/down arrows to reorder within a category (clear the search to reorder).</p>

        <DataTable
          columns={columns}
          data={filtered}
          keyField={(s) => s.id}
          isLoading={isLoading}
          emptyTitle="No skills yet"
          actions={(s) => (
            <RowActions>
              {!reorderDisabled && (
                <>
                  <IconAction icon={ArrowUp} label="Move up" onClick={() => move(s.id, -1)} />
                  <IconAction icon={ArrowDown} label="Move down" onClick={() => move(s.id, 1)} />
                </>
              )}
              <IconAction icon={s.visible ? EyeOff : Eye} label={s.visible ? "Hide" : "Show"} onClick={() => toggleVisible.mutate(s)} />
              <IconAction icon={Pencil} label="Edit" onClick={() => setEditing(s)} />
              <IconAction
                icon={Trash2}
                label="Delete"
                danger
                onClick={async () => {
                  const ok = await confirm({ title: "Delete this skill?", description: `"${s.name}" will be removed.`, confirmLabel: "Delete", danger: true });
                  if (ok) removeMutation.mutate(s.id);
                }}
              />
            </RowActions>
          )}
        />
      </div>

      {editing !== undefined && (
        <SkillFormModal
          skill={editing}
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
