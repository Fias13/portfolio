import { Plus, Search } from "lucide-react";
import type { ReactNode } from "react";

export default function AdminToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  onAdd,
  addLabel = "Add",
  filters,
}: {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onAdd?: () => void;
  addLabel?: string;
  filters?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {onSearchChange && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={15} />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-8 pr-3 text-sm focus:border-brand-500 dark:border-ink-700 dark:bg-ink-900"
            />
          </div>
        )}
        {filters}
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus size={16} />
          {addLabel}
        </button>
      )}
    </div>
  );
}
