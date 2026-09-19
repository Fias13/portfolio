import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, Pencil, Trash2 } from "lucide-react";
import { certificatesApi } from "@/api/resources";
import { apiErrorMessage } from "@/api/client";
import type { Certificate } from "@/api/types";
import { useConfirm } from "@/contexts/ConfirmContext";
import AdminToolbar from "@/components/admin/AdminToolbar";
import DataTable, { type Column } from "@/components/admin/DataTable";
import RowActions, { IconAction } from "@/components/admin/RowActions";
import Modal from "@/components/common/Modal";
import { TextField, TextAreaField, ToggleField } from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";

function CertificateFormModal({ item, onClose, onSaved }: { item?: Certificate | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!item;
  const [form, setForm] = useState({
    name: item?.name || "",
    organization: item?.organization || "",
    issueDate: item?.issueDate?.slice(0, 10) || "",
    credentialId: item?.credentialId || "",
    credentialUrl: item?.credentialUrl || "",
    imageUrl: item?.imageUrl || null,
    descriptionEn: item?.descriptionEn || "",
    descriptionTh: item?.descriptionTh || "",
    visible: item?.visible ?? true,
  });
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.organization.trim() || !form.issueDate) {
      toast.error("Name, organization, and issue date are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, sortOrder: 0 };
      if (isEdit) {
        await certificatesApi.update(item!.id, payload);
        toast.success("Certificate updated");
      } else {
        await certificatesApi.create(payload);
        toast.success("Certificate added");
      }
      onSaved();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={isEdit ? "Edit Certificate" : "Add Certificate"} maxWidth="max-w-2xl">
      <form onSubmit={onSubmit} className="space-y-4">
        <TextField label="Certificate Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Organization" required value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
          <TextField label="Issue Date" type="date" required value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Credential ID" value={form.credentialId} onChange={(e) => setForm({ ...form, credentialId: e.target.value })} />
          <TextField label="Credential URL" type="url" value={form.credentialUrl} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextAreaField label="Description (EN)" rows={3} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
          <TextAreaField label="Description (TH)" rows={3} value={form.descriptionTh} onChange={(e) => setForm({ ...form, descriptionTh: e.target.value })} />
        </div>
        <ImageUploader label="Certificate Image" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} folder="certificates" />
        <ToggleField label="Visible" checked={form.visible} onChange={(v) => setForm({ ...form, visible: v })} />
        <div className="flex justify-end gap-2 border-t border-ink-100 pt-4 dark:border-ink-800">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
            {saving && <Loader2 size={15} className="animate-spin" />}
            {isEdit ? "Save Changes" : "Add Certificate"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function CertificatesAdmin() {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const [editing, setEditing] = useState<Certificate | null | undefined>(undefined);

  const { data, isLoading } = useQuery({ queryKey: ["admin-certificates"], queryFn: certificatesApi.list });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
    queryClient.invalidateQueries({ queryKey: ["certificates"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
  };

  const removeMutation = useMutation({
    mutationFn: (id: string) => certificatesApi.remove(id),
    onSuccess: () => {
      toast.success("Certificate deleted");
      invalidate();
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const toggleVisible = useMutation({
    mutationFn: (c: Certificate) => certificatesApi.update(c.id, { visible: !c.visible }),
    onSuccess: invalidate,
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const columns: Column<Certificate>[] = [
    { header: "Name", key: "name", render: (c) => <span className="font-medium">{c.name}</span> },
    { header: "Organization", key: "org", render: (c) => c.organization },
    { header: "Issued", key: "date", render: (c) => new Date(c.issueDate).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Certificates</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Manage the certificate gallery.</p>

      <div className="mt-6">
        <AdminToolbar onAdd={() => setEditing(null)} addLabel="Add Certificate" />
        <DataTable
          columns={columns}
          data={data || []}
          keyField={(c) => c.id}
          isLoading={isLoading}
          emptyTitle="No certificates yet"
          actions={(c) => (
            <RowActions>
              <IconAction icon={c.visible ? EyeOff : Eye} label={c.visible ? "Hide" : "Show"} onClick={() => toggleVisible.mutate(c)} />
              <IconAction icon={Pencil} label="Edit" onClick={() => setEditing(c)} />
              <IconAction
                icon={Trash2}
                label="Delete"
                danger
                onClick={async () => {
                  const ok = await confirm({ title: "Delete this certificate?", confirmLabel: "Delete", danger: true });
                  if (ok) removeMutation.mutate(c.id);
                }}
              />
            </RowActions>
          )}
        />
      </div>

      {editing !== undefined && (
        <CertificateFormModal
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
