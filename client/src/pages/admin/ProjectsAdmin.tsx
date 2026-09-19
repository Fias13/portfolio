import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { projectsApi } from "@/api/resources";
import { apiErrorMessage } from "@/api/client";
import type { Project } from "@/api/types";
import { useConfirm } from "@/contexts/ConfirmContext";
import AdminToolbar from "@/components/admin/AdminToolbar";
import DataTable, { type Column } from "@/components/admin/DataTable";
import RowActions, { IconAction } from "@/components/admin/RowActions";
import ProjectFormModal from "@/components/admin/ProjectFormModal";

export default function ProjectsAdmin() {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Project | null | undefined>(undefined);

  const { data, isLoading } = useQuery({ queryKey: ["admin-projects"], queryFn: () => projectsApi.list() });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
  };

  const removeMutation = useMutation({
    mutationFn: (id: string) => projectsApi.remove(id),
    onSuccess: () => {
      toast.success("Project deleted");
      invalidate();
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => projectsApi.duplicate(id),
    onSuccess: () => {
      toast.success("Project duplicated");
      invalidate();
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) => projectsApi.publish(id, published),
    onSuccess: (_, vars) => {
      toast.success(vars.published ? "Project published successfully." : "Project unpublished.");
      invalidate();
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const reorderMutation = useMutation({
    mutationFn: (order: string[]) => projectsApi.reorder(order),
    onSuccess: invalidate,
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const move = (id: string, direction: -1 | 1) => {
    const list = data || [];
    const index = list.findIndex((p) => p.id === id);
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= list.length) return;
    const next = [...list];
    [next[index], next[swapWith]] = [next[swapWith], next[index]];
    reorderMutation.mutate(next.map((p) => p.id));
  };

  const filtered = (data || []).filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
  const reorderDisabled = !!search;

  const columns: Column<Project>[] = [
    {
      header: "Title",
      key: "title",
      render: (p) => (
        <div>
          <p className="font-medium">{p.title}</p>
          <p className="text-xs text-ink-400">/{p.slug}</p>
        </div>
      ),
    },
    { header: "Category", key: "category", render: (p) => p.category || "—" },
    {
      header: "Status",
      key: "status",
      render: (p) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.published ? "bg-brand-500/10 text-brand-600 dark:text-brand-400" : "bg-ink-200 text-ink-600 dark:bg-ink-800 dark:text-ink-400"}`}>
          {p.published ? "Published" : "Draft"}
        </span>
      ),
    },
    { header: "Featured", key: "featured", render: (p) => (p.featured ? "★" : "—") },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Manage case studies shown on the public site.</p>
        </div>
      </div>

      <AdminToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Search projects..." onAdd={() => setEditing(null)} addLabel="Add Project" />
      <p className="-mt-2 mb-4 text-xs text-ink-400">Use the up/down arrows to reorder projects (clear the search to reorder).</p>

      <DataTable
        columns={columns}
        data={filtered}
        keyField={(p) => p.id}
        isLoading={isLoading}
        emptyTitle="No projects yet"
        emptyDescription="Click 'Add Project' to create your first case study."
        actions={(p) => (
          <RowActions>
            {!reorderDisabled && (
              <>
                <IconAction icon={ArrowUp} label="Move up" onClick={() => move(p.id, -1)} />
                <IconAction icon={ArrowDown} label="Move down" onClick={() => move(p.id, 1)} />
              </>
            )}
            <IconAction
              icon={p.published ? EyeOff : Eye}
              label={p.published ? "Unpublish" : "Publish"}
              onClick={() => publishMutation.mutate({ id: p.id, published: !p.published })}
            />
            <IconAction icon={Copy} label="Duplicate" onClick={() => duplicateMutation.mutate(p.id)} />
            <IconAction icon={Pencil} label="Edit" onClick={() => setEditing(p)} />
            <IconAction
              icon={Trash2}
              label="Delete"
              danger
              onClick={async () => {
                const ok = await confirm({
                  title: "Delete this project?",
                  description: `"${p.title}" will be permanently removed from the database.`,
                  confirmLabel: "Delete",
                  danger: true,
                });
                if (ok) removeMutation.mutate(p.id);
              }}
            />
          </RowActions>
        )}
      />

      {editing !== undefined && (
        <ProjectFormModal
          project={editing}
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
