import clsx from "clsx";
import type { MemberType } from "@/lib/types";

const typeColors: Record<MemberType, string> = {
  学生: "bg-sky-100 text-sky-800 ring-sky-200/60",
  OB: "bg-indigo-100 text-indigo-800 ring-indigo-200/60",
  OG: "bg-violet-100 text-violet-800 ring-violet-200/60",
  社会人: "bg-teal-100 text-teal-800 ring-teal-200/60",
  企業関係者: "bg-amber-100 text-amber-900 ring-amber-200/60",
  不明: "bg-slate-100 text-slate-600 ring-slate-200/60",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2);
}

interface MemberAvatarProps {
  name: string;
  type?: MemberType;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl ring-4 ring-white/30",
};

export function MemberAvatar({ name, type = "不明", size = "md" }: MemberAvatarProps) {
  return (
    <div
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-full font-semibold ring-2",
        typeColors[type],
        sizeMap[size]
      )}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
}
