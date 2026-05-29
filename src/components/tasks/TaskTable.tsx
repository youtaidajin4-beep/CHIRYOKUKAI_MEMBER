"use client";

import Link from "next/link";
import type { Task, TaskStatus } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { CheckSquare, Calendar } from "lucide-react";
import clsx from "clsx";

interface TaskTableProps {
  tasks: Task[];
  onStatusChange?: (id: string, status: TaskStatus) => void;
}

export function TaskTable({ tasks, onStatusChange }: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="タスクがありません"
        description="メンバー詳細からアクションを進めると、ここにタスクが表示されます。"
      />
    );
  }

  const sorted = [...tasks].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const isOverdue = (due: string) => {
    if (!due) return false;
    return new Date(due) < new Date() && new Date(due).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="space-y-3">
      {sorted.map((t) => (
        <article
          key={t.id}
          className={clsx(
            "flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-card transition hover:shadow-card-hover sm:flex-row sm:items-center",
            t.status === "完了"
              ? "border-supira-border/60 opacity-75"
              : isOverdue(t.dueDate)
                ? "border-red-200/80"
                : "border-supira-border/80"
          )}
        >
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <MemberAvatar name={t.memberName} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-supira-primary">{t.title}</p>
              <p className="mt-0.5 text-xs text-supira-muted">{t.taskType}</p>
              <Link
                href={`/members/${t.memberId}`}
                className="mt-2 inline-block text-sm font-medium text-supira-accent hover:underline"
              >
                {t.memberName}
              </Link>
              {t.memo && (
                <p className="mt-2 text-xs text-supira-muted line-clamp-2">{t.memo}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end">
            {t.dueDate && (
              <span
                className={clsx(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium",
                  isOverdue(t.dueDate) && t.status !== "完了"
                    ? "bg-red-50 text-red-700"
                    : "bg-supira-surface text-slate-600"
                )}
              >
                <Calendar className="h-3.5 w-3.5" />
                {new Date(t.dueDate).toLocaleDateString("ja-JP")}
              </span>
            )}
            {onStatusChange ? (
              <select
                value={t.status}
                onChange={(e) =>
                  onStatusChange(t.id, e.target.value as TaskStatus)
                }
                className="rounded-xl border border-supira-border bg-white px-3 py-2 text-sm font-medium shadow-sm focus:shadow-glow focus:outline-none"
              >
                {(["未着手", "進行中", "完了", "保留"] as TaskStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ) : (
              <StatusBadge label={t.status} />
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
