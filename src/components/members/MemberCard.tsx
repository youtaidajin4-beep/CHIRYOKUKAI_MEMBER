"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  GraduationCap,
  Mail,
  MapPin,
  Network,
  Phone,
  ChevronRight,
} from "lucide-react";
import type { Member } from "@/lib/types";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { truncateMemo } from "@/lib/member-utils";

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  const affiliation = member.company || member.school || null;
  const subAffiliation = member.company
    ? [member.department, member.position].filter(Boolean).join(" · ")
    : [member.faculty, member.graduationYear].filter(Boolean).join(" · ");

  return (
    <Link href={`/members/${member.id}`} className="member-card group block h-full">
      <div className="border-b border-supira-border/60 bg-gradient-to-br from-supira-surface/80 to-white px-4 py-4">
        <div className="flex items-start gap-3">
          <MemberAvatar name={member.name} type={member.type} size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-bold text-supira-primary group-hover:text-supira-accent transition truncate">
                  {member.name}
                </h3>
                {member.kana && (
                  <p className="text-xs text-supira-subtle truncate">{member.kana}</p>
                )}
              </div>
              <ProgressRing value={member.dataCompleteness} size={44} strokeWidth={3} />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <TypeBadge type={member.type} />
              <PriorityBadge priority={member.priority} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 text-sm">
        {affiliation ? (
          <div className="flex gap-2">
            {member.company ? (
              <Building2 className="h-4 w-4 shrink-0 text-supira-subtle mt-0.5" />
            ) : (
              <GraduationCap className="h-4 w-4 shrink-0 text-supira-subtle mt-0.5" />
            )}
            <div className="min-w-0">
              <p className="font-medium text-slate-800 line-clamp-2">{affiliation}</p>
              {subAffiliation && (
                <p className="text-xs text-supira-muted mt-0.5 line-clamp-1">{subAffiliation}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-orange-600/90 italic">所属・学校 未入力</p>
        )}

        <div className="flex flex-wrap gap-2 text-xs">
          {member.area && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-supira-surface px-2 py-1 text-slate-600">
              <MapPin className="h-3 w-3" />
              {member.area}
            </span>
          )}
          {member.industry && member.industry !== "不明" && (
            <span className="rounded-lg bg-supira-surface px-2 py-1 text-slate-600">
              {member.industry}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="shrink-0 text-supira-subtle">所属</span>
          {member.lodgeOwnerName ? (
            <span className="text-slate-700 truncate">{member.lodgeOwnerName}</span>
          ) : (
            <span className="font-medium text-orange-700">ロッジ未登録</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Network className="h-3.5 w-3.5 text-supira-subtle shrink-0" />
          {member.referrerName ? (
            <span className="text-slate-700 truncate">{member.referrerName}</span>
          ) : (
            <span className="font-medium text-orange-700">紹介者 未登録</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusBadge label={member.contactStatus} />
        </div>

        {(member.email || member.phone) && (
          <div className="flex flex-wrap gap-3 pt-1 border-t border-supira-border/50 text-xs text-supira-muted">
            {member.email && (
              <span className="inline-flex items-center gap-1 truncate max-w-full">
                <Mail className="h-3 w-3 shrink-0" />
                <span className="truncate">{member.email}</span>
              </span>
            )}
            {member.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3 w-3 shrink-0" />
                {member.phone}
              </span>
            )}
          </div>
        )}

        {member.memo && (
          <p className="text-xs text-supira-muted line-clamp-2 border-t border-supira-border/50 pt-2">
            {truncateMemo(member.memo)}
          </p>
        )}

        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {member.duplicateWarning && (
            <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
              <AlertTriangle className="h-3 w-3" />
              重複候補
            </span>
          )}
          {member.dataCompleteness < 50 && (
            <span className="rounded-md bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-700">
              情報不足
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-supira-border/60 bg-supira-surface/40 px-4 py-2.5 text-xs font-medium text-supira-accent">
        <span>詳細を見る</span>
        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
