"use client";

import { useMemo } from "react";
import { CheckSquare, Circle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { TaskTable } from "@/components/tasks/TaskTable";
import { Card } from "@/components/ui/Card";
import { useMembers } from "@/context/MemberContext";
import type { TaskStatus } from "@/lib/types";

export default function TasksPage() {
  const { tasks, updateTask } = useMembers();

  const grouped = useMemo(() => {
    const active = tasks.filter((t) => t.status !== "完了");
    const done = tasks.filter((t) => t.status === "完了");
    const inProgress = tasks.filter((t) => t.status === "進行中");
    return { active, done, inProgress };
  }, [tasks]);

  return (
    <Layout>
      <Header
        title="タスク一覧"
        description="紹介者確認・本人連絡・求人相談など、次のアクションを漏れなく管理します。"
        breadcrumb={[
          { label: "ダッシュボード", href: "/" },
          { label: "タスク" },
        ]}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <Circle className="h-5 w-5 text-supira-subtle" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{grouped.active.length}</p>
              <p className="text-xs text-supira-muted">未完了</p>
            </div>
          </div>
        </Card>
        <Card padding="md" className="border-blue-100 bg-blue-50/30">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-2xl font-bold tabular-nums text-blue-900">{grouped.inProgress.length}</p>
              <p className="text-xs text-blue-700/80">進行中</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div>
            <p className="text-2xl font-bold tabular-nums text-emerald-700">{grouped.done.length}</p>
            <p className="text-xs text-supira-muted">完了</p>
          </div>
        </Card>
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-sm font-semibold text-supira-primary">進行中・未着手</h2>
        <TaskTable
          tasks={grouped.active}
          onStatusChange={(id, status: TaskStatus) => updateTask(id, { status })}
        />
      </section>

      {grouped.done.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-medium text-supira-subtle">完了したタスク</h2>
          <TaskTable tasks={grouped.done} />
        </section>
      )}
    </Layout>
  );
}
