import { Task, TaskList } from "@/types/task";

const TASKS_KEY = "daily-tasks";
const LISTS_KEY = "daily-tasks-lists";

export const defaultLists: TaskList[] = [
  { id: "personal", name: "Personal", color: "#3b82f6", icon: "👤", order: 0 },
  { id: "work", name: "Work", color: "#8b5cf6", icon: "💼", order: 1 },
  { id: "shopping", name: "Shopping", color: "#10b981", icon: "🛒", order: 2 },
  { id: "health", name: "Health", color: "#f59e0b", icon: "💪", order: 3 },
];

export const loadTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASKS_KEY);
    if (!stored) return [];
    
    const tasks = JSON.parse(stored);
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    }));
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
};

export const loadLists = (): TaskList[] => {
  try {
    const stored = localStorage.getItem(LISTS_KEY);
    if (!stored) {
      saveLists(defaultLists);
      return defaultLists;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error loading lists:", error);
    return defaultLists;
  }
};

export const saveLists = (lists: TaskList[]): void => {
  try {
    localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
  } catch (error) {
    console.error("Error saving lists:", error);
  }
};
