"use client";

import type { Member } from "@/lib/types";
import { MemberCard } from "./MemberCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users } from "lucide-react";

interface MemberCardGridProps {
  members: Member[];
}

export function MemberCardGrid({ members }: MemberCardGridProps) {
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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {members.map((m) => (
        <MemberCard key={m.id} member={m} />
      ))}
    </div>
  );
}
