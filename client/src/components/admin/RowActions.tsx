import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function IconAction({ icon: Icon, onClick, label, danger }: { icon: LucideIcon; onClick: () => void; label: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`rounded-lg p-1.5 transition hover:bg-ink-100 dark:hover:bg-ink-800 ${danger ? "text-red-500 hover:text-red-600" : "text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-white"}`}
    >
      <Icon size={16} />
    </button>
  );
}

export default function RowActions({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-end gap-1">{children}</div>;
}
