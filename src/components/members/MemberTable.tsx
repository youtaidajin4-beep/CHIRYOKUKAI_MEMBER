"use client";

import Link from "next/link";
import type { Member } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { truncateMemo } from "@/lib/member-utils";
import {
  AlertTriangle,
  ChevronRight,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

interface MemberTableProps {
  members: Member[];
  compact?: boolean;
}

export function MemberTable({ members, compact = false }: MemberTableProps) {
  if (members.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="該当するメンバーがいません"
        description="検索条件を変えるか、フィルターを解除してみてください。"
      />
    );
  }

  return (
    <div className="card-elevated overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-supira-border bg-gradient-to-r from-supira-surface to-white">
              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-supira-muted">
                メンバー
              </th>
              <th className="px-3 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-supira-muted">
                区分
              </th>
              {!compact && (
                <>
                  <th className="px-3 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-supira-muted hidden md:table-cell">
                    所属・学校
                  </th>
                  <th className="px-3 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-supira-muted hidden lg:table-cell">
                    卒業年
                  </th>
                  <th className="px-3 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-supira-muted hidden lg:table-cell">
                    地域
                  </th>
                </>
              )}
              <th className="px-3 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-supira-muted hidden sm:table-cell">
                紹介者
              </th>
              <th className="px-3 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-supira-muted hidden xl:table-cell">
                連絡先
              </th>
              <th className="px-3 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-supira-muted">
                優先度
              </th>
              <th className="px-3 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-supira-muted hidden md:table-cell">
                ステータス
              </th>
              {!compact && (
                <th className="px-3 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-supira-muted hidden 2xl:table-cell">
                  充足率
                </th>
              )}
              <th className="w-10 px-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-supira-border/50">
            {members.map((m) => (
              <tr key={m.id} className="table-row-interactive group">
                <td className="px-5 py-3.5">
                  <Link
                    href={`/members/${m.id}`}
                    className="flex items-center gap-3 focus-ring rounded-lg -m-1 p-1"
                  >
                    <MemberAvatar name={m.name} type={m.type} size="sm" />
                    <div className="min-w-0">
                      <p className="font-semibold text-supira-primary group-hover:text-supira-accent transition-colors truncate">
                        {m.name}
                      </p>
                      {m.kana && (
                        <p className="text-xs text-supira-subtle truncate">{m.kana}</p>
                      )}
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {m.duplicateWarning && (
                          <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                            <AlertTriangle className="h-3 w-3" />
                            重複
                          </span>
                        )}
                        {m.dataCompleteness < 50 && (
                          <span className="rounded-md bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-700">
                            不足 {m.dataCompleteness}%
                          </span>
                        )}
                        {!compact && m.memo && (
                          <span className="hidden xl:inline text-[10px] text-supira-muted truncate max-w-[120px]">
                            {truncateMemo(m.memo)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-3 py-3.5">
                  <TypeBadge type={m.type} />
                </td>
                {!compact && (
                  <>
                    <td className="px-3 py-3.5 text-slate-600 hidden md:table-cell max-w-[200px]">
                      <p className="font-medium line-clamp-1">{m.company || m.school || "—"}</p>
                      {(m.department || m.faculty) && (
                        <p className="text-xs text-supira-muted line-clamp-1 mt-0.5">
                          {m.department || m.faculty}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3.5 hidden lg:table-cell tabular-nums text-slate-600">
                      {m.graduationYear || "—"}
                    </td>
                    <td className="px-3 py-3.5 hidden lg:table-cell">
                      {m.area ? (
                        <span className="rounded-lg bg-supira-surface px-2 py-0.5 text-xs font-medium text-slate-600">
                          {m.area}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </>
                )}
                <td className="px-3 py-3.5 hidden sm:table-cell max-w-[120px]">
                  {m.referrerName ? (
                    <span className="text-slate-700 line-clamp-2">{m.referrerName}</span>
                  ) : (
                    <span className="inline-flex rounded-md bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
                      未登録
                    </span>
                  )}
                </td>
                <td className="px-3 py-3.5 hidden xl:table-cell">
                  <div className="flex flex-col gap-1 text-xs text-supira-muted">
                    {m.email && (
                      <span className="inline-flex items-center gap-1 truncate max-w-[160px]">
                        <Mail className="h-3 w-3 shrink-0 text-teal-600" />
                        {m.email}
                      </span>
                    )}
                    {m.phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3 w-3 shrink-0 text-teal-600" />
                        {m.phone}
                      </span>
                    )}
                    {!m.email && !m.phone && (
                      <span className="text-supira-subtle">—</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <PriorityBadge priority={m.priority} />
                </td>
                <td className="px-3 py-3.5 hidden md:table-cell">
                  <StatusBadge label={m.contactStatus} />
                </td>
                {!compact && (
                  <td className="px-3 py-3.5 hidden 2xl:table-cell">
                    <ProgressRing value={m.dataCompleteness} size={40} strokeWidth={3} />
                  </td>
                )}
                <td className="px-2 py-3.5">
                  <Link
                    href={`/members/${m.id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-supira-subtle opacity-0 transition group-hover:opacity-100 hover:bg-teal-50 hover:text-supira-accent"
                    aria-label={`${m.name}の詳細`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
