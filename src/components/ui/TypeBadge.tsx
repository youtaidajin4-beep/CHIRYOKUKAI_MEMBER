import clsx from "clsx";
import type { MemberType } from "@/lib/types";

const styles: Record<MemberType, string> = {
  学生: "bg-sky-50 text-sky-700 border-sky-100",
  OB: "bg-indigo-50 text-indigo-700 border-indigo-100",
  OG: "bg-violet-50 text-violet-700 border-violet-100",
  社会人: "bg-teal-50 text-teal-700 border-teal-100",
  企業関係者: "bg-amber-50 text-amber-800 border-amber-100",
  不明: "bg-slate-50 text-slate-500 border-slate-100",
};

export function TypeBadge({ type }: { type: MemberType }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        styles[type]
      )}
    >
      {type}
    </span>
  );
}
