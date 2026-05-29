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
import { initialMembers, initialTasks } from "@/lib/mock-data";
import {
  enrichMember,
  generateId,
  markDuplicateWarnings,
} from "@/lib/member-utils";
import type { Member, Task } from "@/lib/types";

const STORAGE_KEY = "supira-chiryokukai-members-v6";
const TASKS_KEY = "supira-chiryokukai-tasks-v6";

interface MemberContextValue {
  members: Member[];
  tasks: Task[];
  addMember: (member: Partial<Member>) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  importMembers: (newMembers: Partial<Member>[]) => number;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  getMemberById: (id: string) => Member | undefined;
  refreshDuplicates: () => void;
}

const MemberContext = createContext<MemberContextValue | null>(null);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const storageLoaded = useRef(false);

  // localStorage から復元（初回のみ・非ブロッキング）
  useEffect(() => {
    if (storageLoaded.current) return;
    storageLoaded.current = true;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedTasks = localStorage.getItem(TASKS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Member[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMembers(parsed);
        }
      }
      if (storedTasks) {
        const parsed = JSON.parse(storedTasks) as Task[];
        if (Array.isArray(parsed)) setTasks(parsed);
      }
    } catch {
      /* 初期データのまま */
    }
  }, []);

  // 保存はデバウンス（大量データでのフリーズ防止）
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

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
      } catch {
        /* quota 等 */
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [tasks]);

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

  const addTask = useCallback((task: Omit<Task, "id">) => {
    setTasks((prev) => [...prev, { ...task, id: generateId("t") }]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const value = useMemo(
    () => ({
      members,
      tasks,
      addMember,
      updateMember,
      deleteMember,
      importMembers,
      addTask,
      updateTask,
      getMemberById,
      refreshDuplicates,
    }),
    [
      members,
      tasks,
      addMember,
      updateMember,
      deleteMember,
      importMembers,
      addTask,
      updateTask,
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
