import clsx from "clsx";

export function PriorityBadge({ priority }: { priority: string }) {
  if (priority === "A") {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-100 to-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-300/80 shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
        A
      </span>
    );
  }
  if (priority === "B") {
    return (
      <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/80">
        B
      </span>
    );
  }
  if (priority === "C") {
    return (
      <span className="inline-flex items-center rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-100">
        C
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] text-supira-subtle">
      未設定
    </span>
  );
}
