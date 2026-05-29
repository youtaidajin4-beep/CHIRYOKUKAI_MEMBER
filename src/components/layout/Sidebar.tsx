"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Users,
  FileUp,
  AlertCircle,
  Network,
  Briefcase,
  Copy,
  Menu,
  X,
  Plus,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useMembers } from "@/context/MemberContext";
import { isIncompleteMember, hasNoReferrer } from "@/lib/member-utils";

const navGroups = [
  {
    label: "概要",
    items: [{ href: "/", label: "ダッシュボード", icon: LayoutDashboard }],
  },
  {
    label: "メンバー管理",
    items: [
      { href: "/members", label: "メンバー一覧", icon: Users },
      { href: "/import", label: "名簿CSV取り込み", icon: FileUp },
      { href: "/incomplete", label: "情報不足", icon: AlertCircle, badgeKey: "incomplete" as const },
      { href: "/duplicates", label: "重複チェック", icon: Copy, badgeKey: "duplicates" as const },
    ],
  },
  {
    label: "ネットワーク・求人",
    items: [
      { href: "/referrers", label: "紹介者ネットワーク", icon: Network },
      { href: "/recruiting", label: "求人開拓候補", icon: Briefcase },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { members } = useMembers();

  const badges = {
    incomplete: members.filter(isIncompleteMember).length,
    duplicates: members.filter((m) => m.duplicateWarning).length,
  };

  const sidebarBody = (
    <>
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-hero shadow-sm">
            <Sparkles className="h-5 w-5 text-teal-200" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-supira-subtle">
              Supira
            </p>
            <h1 className="truncate text-sm font-bold text-supira-primary leading-tight">
              知力会ネットワーク
            </h1>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-supira-muted">
          紹介制の強みを活かした
          <br />
          求人開拓・人脈管理
        </p>
      </div>

      <div className="mx-4 mb-4">
        <Link
          href="/members/new"
          onClick={() => setMobileOpen(false)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-supira-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          メンバーを追加
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-supira-subtle">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon, badgeKey }) => {
                const active =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                const badge = badgeKey ? badges[badgeKey] : 0;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={clsx(
                        "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-supira-primary text-white shadow-sm"
                          : "text-slate-600 hover:bg-white hover:text-supira-primary hover:shadow-sm"
                      )}
                    >
                      {active && <span className="nav-active-indicator !bg-teal-300" />}
                      <Icon
                        className={clsx(
                          "h-4 w-4 shrink-0",
                          active ? "text-teal-200" : "text-supira-subtle"
                        )}
                      />
                      <span className="flex-1 truncate">{label}</span>
                      {badge > 0 && (
                        <span
                          className={clsx(
                            "min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold",
                            active
                              ? "bg-white/20 text-white"
                              : "bg-amber-100 text-amber-800"
                          )}
                        >
                          {badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-supira-border/80 p-4 mx-2 mb-2">
        <div className="rounded-xl bg-supira-surface/80 p-3 text-xs text-supira-muted leading-relaxed">
          <span className="font-medium text-supira-primary">登録メンバー</span>
          <span className="ml-2 text-lg font-bold tabular-nums text-supira-accent">
            {members.length}
          </span>
          <span className="text-supira-subtle"> 名</span>
          {members.filter(hasNoReferrer).length > 0 && (
            <p className="mt-1 text-amber-700">
              紹介者未登録 {members.filter(hasNoReferrer).length} 名
            </p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-supira-border bg-white shadow-card lg:hidden focus-ring"
        aria-label="メニューを開く"
      >
        <Menu className="h-5 w-5 text-supira-primary" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-supira-navy/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-[17.5rem] flex-col border-r border-supira-border/60 bg-white shadow-sidebar transition-transform duration-300 ease-out lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-5 rounded-lg p-2 text-supira-muted hover:bg-supira-surface lg:hidden focus-ring"
          aria-label="メニューを閉じる"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarBody}
      </aside>
    </>
  );
}
