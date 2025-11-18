export type Priority = "high" | "medium" | "low" | "none";

export type TaskStatus = "active" | "completed";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;
  tags: string[];
  listId: string;
  subtasks: Subtask[];
  createdAt: Date;
  completedAt?: Date;
  order: number;
}

export interface TaskList {
  id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
}

export interface TaskFilters {
  search: string;
  priority: Priority | "all";
  status: TaskStatus | "all";
  listId: string | "all";
  tags: string[];
  sortBy: "dueDate" | "priority" | "createdAt" | "title" | "manual";
  sortOrder: "asc" | "desc";
  view: "today" | "upcoming" | "all" | "completed";
}

export interface TaskStats {
  total: number;
  completed: number;
  active: number;
  completedToday: number;
  completedThisWeek: number;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
  completionRate: number;
}
