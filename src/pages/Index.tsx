import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Task, TaskFilters, TaskList, TaskStats as ITaskStats } from "@/types/task";
import { loadTasks, saveTasks, loadLists } from "@/lib/taskStorage";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { TaskCard } from "@/components/tasks/TaskCard";
import { AddTaskDialog } from "@/components/tasks/AddTaskDialog";
import { TaskFiltersComponent } from "@/components/tasks/TaskFilters";
import { TaskStats } from "@/components/tasks/TaskStats";
import { StatsDialog } from "@/components/stats/StatsDialog";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { isToday, isThisWeek, isPast, startOfDay } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [activeView, setActiveView] = useState("today");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [filters, setFilters] = useState<TaskFilters>({
    search: "",
    priority: "all",
    status: "all",
    listId: "all",
    tags: [],
    sortBy: "manual",
    sortOrder: "asc",
    view: "today",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      setTasks(loadTasks());
      setLists(loadLists());
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      saveTasks(tasks);
    }
  }, [tasks, user]);

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "order">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      order: tasks.length,
    };
    setTasks([...tasks, newTask]);
    toast.success("Task created successfully!");
  };

  const updateTask = (taskData: Omit<Task, "id" | "createdAt" | "order">) => {
    if (!editingTask) return;
    
    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? { ...task, ...taskData }
          : task
      )
    );
    setEditingTask(undefined);
    toast.success("Task updated successfully!");
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : undefined,
            }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.success("Task deleted");
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingTask(undefined);
  };

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // View filter
    if (activeView === "today") {
      filtered = filtered.filter(
        (task) => !task.completed && task.dueDate && isToday(task.dueDate)
      );
    } else if (activeView === "upcoming") {
      filtered = filtered.filter(
        (task) => !task.completed && task.dueDate && !isPast(startOfDay(task.dueDate))
      );
    } else if (activeView === "all") {
      filtered = filtered.filter((task) => !task.completed);
    } else if (activeView === "completed") {
      filtered = filtered.filter((task) => task.completed);
    } else {
      // List view
      filtered = filtered.filter((task) => task.listId === activeView);
    }

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          task.description?.toLowerCase().includes(search)
      );
    }

    // Priority filter
    if (filters.priority !== "all") {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((task) =>
        filters.status === "completed" ? task.completed : !task.completed
      );
    }

    // List filter
    if (filters.listId !== "all") {
      filtered = filtered.filter((task) => task.listId === filters.listId);
    }

    // Sort
    if (filters.sortBy !== "manual") {
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (filters.sortBy) {
          case "dueDate":
            if (!a.dueDate && !b.dueDate) comparison = 0;
            else if (!a.dueDate) comparison = 1;
            else if (!b.dueDate) comparison = -1;
            else comparison = a.dueDate.getTime() - b.dueDate.getTime();
            break;
          case "priority":
            const priorityOrder = { high: 0, medium: 1, low: 2, none: 3 };
            comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
            break;
          case "createdAt":
            comparison = a.createdAt.getTime() - b.createdAt.getTime();
            break;
          case "title":
            comparison = a.title.localeCompare(b.title);
            break;
        }
        return filters.sortOrder === "desc" ? -comparison : comparison;
      });
    }

    return filtered;
  }, [tasks, activeView, filters]);

  const stats: ITaskStats = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);

    const completed = tasks.filter((t) => t.completed);
    const active = tasks.filter((t) => !t.completed);
    const completedToday = completed.filter(
      (t) => t.completedAt && isToday(t.completedAt)
    );
    const completedThisWeek = completed.filter(
      (t) => t.completedAt && isThisWeek(t.completedAt)
    );
    const overdue = active.filter(
      (t) => t.dueDate && isPast(t.dueDate) && !isToday(t.dueDate)
    );
    const dueToday = active.filter((t) => t.dueDate && isToday(t.dueDate));
    const dueThisWeek = active.filter((t) => t.dueDate && isThisWeek(t.dueDate));

    return {
      total: tasks.length,
      completed: completed.length,
      active: active.length,
      completedToday: completedToday.length,
      completedThisWeek: completedThisWeek.length,
      overdue: overdue.length,
      dueToday: dueToday.length,
      dueThisWeek: dueThisWeek.length,
      completionRate:
        tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0,
    };
  }, [tasks]);

  const taskCounts = useMemo(() => {
    const counts: Record<string, number> = {
      today: tasks.filter((t) => !t.completed && t.dueDate && isToday(t.dueDate)).length,
      upcoming: tasks.filter((t) => !t.completed && t.dueDate && !isPast(startOfDay(t.dueDate))).length,
      all: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    };

    lists.forEach((list) => {
      counts[list.id] = tasks.filter((t) => t.listId === list.id && !t.completed).length;
    });

    return counts;
  }, [tasks, lists]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        lists={lists}
        activeView={activeView}
        onViewChange={setActiveView}
        onAddList={() => {
          const name = prompt("Enter list name:");
          if (name?.trim()) {
            const icon = prompt("Enter list icon emoji (e.g., 📝):");
            const newList: TaskList = {
              id: Date.now().toString(),
              name: name.trim(),
              icon: icon || "📝",
              color: "#3b82f6",
              order: lists.length,
            };
            setLists([...lists, newList]);
            toast.success("List created!");
          }
        }}
        taskCounts={taskCounts}
        onStatsClick={() => setStatsDialogOpen(true)}
        onSettingsClick={() => setSettingsDialogOpen(true)}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6 lg:mt-0 mt-14">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                {activeView === "today" && "Today"}
                {activeView === "upcoming" && "Upcoming"}
                {activeView === "all" && "All Tasks"}
                {activeView === "completed" && "Completed"}
                {!["today", "upcoming", "all", "completed"].includes(activeView) &&
                  lists.find((l) => l.id === activeView)?.name}
              </h2>
              <p className="text-muted-foreground mt-1">
                {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>

          <TaskStats stats={stats} />

          <TaskFiltersComponent
            filters={filters}
            onFiltersChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
            lists={lists}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {filters.search || filters.priority !== "all" || filters.status !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first task to get started"}
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              )}
            >
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={handleEdit}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddTaskDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSave={editingTask ? updateTask : addTask}
        editTask={editingTask}
        lists={lists}
      />

      <StatsDialog
        open={statsDialogOpen}
        onOpenChange={setStatsDialogOpen}
        stats={stats}
      />

      <SettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
      />
    </div>
  );
};

export default Index;
