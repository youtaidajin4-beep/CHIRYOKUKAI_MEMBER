"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { initialMembers } from "@/lib/mock-data";
import {
  enrichMember,
  generateId,
  markDuplicateWarnings,
} from "@/lib/member-utils";
import { migrateMemberReferrerNames } from "@/lib/referrer-registry";
import type { Member } from "@/lib/types";

const STORAGE_KEY = "supira-chiryokukai-members-v7";

function loadMembers(): Member[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Member[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return markDuplicateWarnings(migrateMemberReferrerNames(parsed));
      }
    }
    const legacy = localStorage.getItem("supira-chiryokukai-members-v6");
    if (legacy) {
      const parsed = JSON.parse(legacy) as Member[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return markDuplicateWarnings(migrateMemberReferrerNames(parsed));
      }
    }
  } catch {
    /* fall through */
  }
  return markDuplicateWarnings(migrateMemberReferrerNames(initialMembers));
}

interface MemberContextValue {
  members: Member[];
  addMember: (member: Partial<Member>) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  importMembers: (newMembers: Partial<Member>[]) => number;
  getMemberById: (id: string) => Member | undefined;
  refreshDuplicates: () => void;
}

const MemberContext = createContext<MemberContextValue | null>(null);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(() =>
    markDuplicateWarnings(migrateMemberReferrerNames(initialMembers))
  );
  const storageLoaded = useRef(false);

  useEffect(() => {
    if (storageLoaded.current) return;
    storageLoaded.current = true;
    setMembers(loadMembers());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
      } catch {
        /* quota 等 */
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [members]);

  const refreshDuplicates = useCallback(() => {
    setMembers((prev) => markDuplicateWarnings(prev));
  }, []);

  const getMemberById = useCallback(
    (id: string) => members.find((m) => m.id === id),
    [members]
  );

  const addMember = useCallback((partial: Partial<Member>) => {
    setMembers((prev) => {
      const member = enrichMember(partial, prev);
      return markDuplicateWarnings([...prev, member]);
    });
  }, []);

  const updateMember = useCallback((id: string, updates: Partial<Member>) => {
    setMembers((prev) => {
      const next = prev.map((m) => {
        if (m.id !== id) return m;
        return enrichMember(
          { ...m, ...updates, id, updatedAt: new Date().toISOString() },
          prev
        );
      });
      return markDuplicateWarnings(next);
    });
  }, []);

  const deleteMember = useCallback((id: string) => {
    setMembers((prev) => markDuplicateWarnings(prev.filter((m) => m.id !== id)));
  }, []);

  const importMembers = useCallback((newMembers: Partial<Member>[]) => {
    let count = 0;
    setMembers((prev) => {
      const imported = newMembers.map((p) =>
        enrichMember(
          {
            ...p,
            id: p.id || generateId(),
            importSource: p.importSource || "CSV",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          prev
        )
      );
      count = imported.length;
      return markDuplicateWarnings([...prev, ...imported]);
    });
    return count;
  }, []);

  const value = useMemo(
    () => ({
      members,
      addMember,
      updateMember,
      deleteMember,
      importMembers,
      getMemberById,
      refreshDuplicates,
    }),
    [
      members,
      addMember,
      updateMember,
      deleteMember,
      importMembers,
      getMemberById,
      refreshDuplicates,
    ]
  );

  return (
    <MemberContext.Provider value={value}>{children}</MemberContext.Provider>
  );
}

export function useMembers() {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error("useMembers must be used within MemberProvider");
  return ctx;
}
