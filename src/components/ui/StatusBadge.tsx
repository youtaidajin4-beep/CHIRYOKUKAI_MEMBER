import clsx from "clsx";

const colorMap: Record<string, string> = {
  未確認: "bg-slate-100/90 text-slate-600 ring-slate-200/80",
  確認予定: "bg-amber-50 text-amber-800 ring-amber-200/60",
  確認済み: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
  確認不要: "bg-slate-50 text-slate-500 ring-slate-200/60",
  確認不可: "bg-red-50 text-red-700 ring-red-200/60",
  紹介者に確認予定: "bg-amber-50 text-amber-800 ring-amber-200/60",
  紹介者確認済み: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
  本人へ連絡予定: "bg-sky-50 text-sky-800 ring-sky-200/60",
  本人へ連絡済み: "bg-sky-100 text-sky-900 ring-sky-200/60",
  返信あり: "bg-indigo-50 text-indigo-800 ring-indigo-200/60",
  対応終了: "bg-slate-100 text-slate-500 ring-slate-200/60",
  未着手: "bg-slate-100 text-slate-600 ring-slate-200/80",
  相談予定: "bg-violet-50 text-violet-800 ring-violet-200/60",
  相談中: "bg-violet-100 text-violet-900 ring-violet-200/60",
  求人開拓依頼済み: "bg-teal-50 text-teal-800 ring-teal-200/60",
  紹介可能: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
  難しい: "bg-orange-50 text-orange-800 ring-orange-200/60",
  対象外: "bg-slate-50 text-slate-400 ring-slate-200/60",
  進行中: "bg-blue-50 text-blue-800 ring-blue-200/60",
  完了: "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
  保留: "bg-amber-50 text-amber-700 ring-amber-200/60",
};

export function StatusBadge({ label }: { label: string }) {
  const colors = colorMap[label] || "bg-slate-100 text-slate-700 ring-slate-200/80";
  return (
    <span
      className={clsx(
        "inline-flex max-w-[140px] items-center rounded-lg px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset truncate",
        colors
      )}
      title={label}
    >
      {label}
    </span>
  );
}
