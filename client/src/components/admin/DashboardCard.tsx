import type { LucideIcon } from "lucide-react";

export default function DashboardCard({ label, value, icon: Icon, accent = "brand" }: { label: string; value: number | string; icon: LucideIcon; accent?: "brand" | "amber" | "red" }) {
  const accentClasses = {
    brand: "bg-brand-500/10 text-brand-600 dark:text-brand-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    red: "bg-red-500/10 text-red-600 dark:text-red-400",
  }[accent];

  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentClasses}`}>
          <Icon size={19} />
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold">{value}</p>
      <p className="text-sm text-ink-500 dark:text-ink-400">{label}</p>
    </div>
  );
}
