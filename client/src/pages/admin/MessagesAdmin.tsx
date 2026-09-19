import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Archive, Mail, MailOpen, Trash2 } from "lucide-react";
import { messagesApi } from "@/api/resources";
import { apiErrorMessage } from "@/api/client";
import type { ContactMessage, MessageStatus } from "@/api/types";
import { useConfirm } from "@/contexts/ConfirmContext";
import AdminToolbar from "@/components/admin/AdminToolbar";
import DataTable, { type Column } from "@/components/admin/DataTable";
import RowActions, { IconAction } from "@/components/admin/RowActions";
import Modal from "@/components/common/Modal";

const STATUS_STYLES: Record<MessageStatus, string> = {
  UNREAD: "bg-brand-500/10 text-brand-600 dark:text-brand-400",
  READ: "bg-ink-200 text-ink-600 dark:bg-ink-800 dark:text-ink-400",
  ARCHIVED: "bg-ink-100 text-ink-400 dark:bg-ink-900 dark:text-ink-500",
};

export default function MessagesAdmin() {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [active, setActive] = useState<ContactMessage | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-messages", statusFilter],
    queryFn: () => messagesApi.list(statusFilter ? { status: statusFilter } : undefined),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
  };

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MessageStatus }) => messagesApi.updateStatus(id, status),
    onSuccess: invalidate,
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => messagesApi.remove(id),
    onSuccess: () => {
      toast.success("Message deleted");
      invalidate();
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const filtered = (data || []).filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
  );

  const openMessage = (m: ContactMessage) => {
    setActive(m);
    if (m.status === "UNREAD") statusMutation.mutate({ id: m.id, status: "READ" });
  };

  const columns: Column<ContactMessage>[] = [
    {
      header: "From",
      key: "from",
      render: (m) => (
        <button onClick={() => openMessage(m)} className="text-left">
          <p className={`font-medium ${m.status === "UNREAD" ? "text-ink-900 dark:text-white" : ""}`}>{m.name}</p>
          <p className="text-xs text-ink-400">{m.email}</p>
        </button>
      ),
    },
    { header: "Message", key: "message", render: (m) => <span className="line-clamp-1 text-ink-500 dark:text-ink-400">{m.message}</span> },
    {
      header: "Status",
      key: "status",
      render: (m) => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[m.status]}`}>{m.status}</span>,
    },
    { header: "Date", key: "date", render: (m) => new Date(m.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Messages</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Messages submitted through the contact form.</p>

      <div className="mt-6">
        <AdminToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name or email..."
          filters={
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-900">
              <option value="">All statuses</option>
              <option value="UNREAD">Unread</option>
              <option value="READ">Read</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          }
        />
        <DataTable
          columns={columns}
          data={filtered}
          keyField={(m) => m.id}
          isLoading={isLoading}
          emptyTitle="No messages yet"
          actions={(m) => (
            <RowActions>
              <IconAction
                icon={m.status === "UNREAD" ? MailOpen : Mail}
                label={m.status === "UNREAD" ? "Mark as read" : "Mark as unread"}
                onClick={() => statusMutation.mutate({ id: m.id, status: m.status === "UNREAD" ? "READ" : "UNREAD" })}
              />
              <IconAction icon={Archive} label="Archive" onClick={() => statusMutation.mutate({ id: m.id, status: "ARCHIVED" })} />
              <IconAction
                icon={Trash2}
                label="Delete"
                danger
                onClick={async () => {
                  const ok = await confirm({ title: "Delete this message?", confirmLabel: "Delete", danger: true });
                  if (ok) removeMutation.mutate(m.id);
                }}
              />
            </RowActions>
          )}
        />
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.name}>
        {active && (
          <div>
            <p className="text-sm text-ink-500 dark:text-ink-400">{active.email}</p>
            <p className="mt-1 text-xs text-ink-400">{new Date(active.createdAt).toLocaleString()}</p>
            <p className="mt-4 whitespace-pre-wrap text-sm">{active.message}</p>
            <a href={`mailto:${active.email}`} className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              Reply via Email
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
}
