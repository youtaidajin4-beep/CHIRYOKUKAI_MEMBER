/* AUTO-GENERATED — roster.tsv + students/*.tsv */
import type { Member, Task } from "./types";
import membersJson from "@/data/initial-members.json";
import tasksJson from "@/data/initial-tasks.json";

export const initialMembers = membersJson as Member[];
export const initialTasks = tasksJson as Task[];
