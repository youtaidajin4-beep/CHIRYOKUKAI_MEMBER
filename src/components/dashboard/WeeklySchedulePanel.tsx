"use client";

import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import type { WeeklyDayBucket } from "@/lib/dashboard-utils";
import clsx from "clsx";

interface WeeklySchedulePanelProps {
  schedule: WeeklyDayBucket[];
}

export function WeeklySchedulePanel({ schedule }: WeeklySchedulePanelProps) {
  return (
    <Card padding="md" className="mb-8">
      <CardHeader
        title="今週のフォロー予定"
        description="次回アクション日ベース（7日間）"
      />
      <div className="grid gap-3 sm:grid-cols-7">
        {schedule.map((day) => (
          <div
            key={day.date.toISOString()}
            className={clsx(
              "rounded-xl border p-3 min-h-[100px] flex flex-col",
              day.isToday
                ? "border-teal-300 bg-teal-50/50 ring-1 ring-teal-200"
                : "border-supira-border/80 bg-supira-surface/40"
            )}
          >
            <p
              className={clsx(
                "text-xs font-bold mb-2",
                day.isToday ? "text-teal-800" : "text-supira-muted"
              )}
            >
              {day.label}
            </p>
            {day.members.length === 0 ? (
              <p className="text-[10px] text-supira-subtle mt-auto">—</p>
            ) : (
              <ul className="space-y-1.5 flex-1">
                {day.members.slice(0, 3).map(({ member }) => (
                  <li key={member.id}>
                    <Link
                      href={`/members/${member.id}`}
                      className="block text-[11px] font-medium text-supira-primary hover:text-supira-accent truncate leading-tight"
                      title={member.name}
                    >
                      {member.name}
                    </Link>
                  </li>
                ))}
                {day.members.length > 3 && (
                  <li className="text-[10px] text-supira-muted">+{day.members.length - 3}</li>
                )}
              </ul>
            )}
            {day.members.length > 0 && (
              <span
                className={clsx(
                  "mt-2 inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums",
                  day.isToday ? "bg-teal-200 text-teal-900" : "bg-white text-supira-muted"
                )}
              >
                {day.members.length}件
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
