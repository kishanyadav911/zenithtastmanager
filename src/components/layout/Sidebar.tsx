import { TaskList } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  CalendarClock,
  ListTodo,
  CheckCircle2,
  BarChart3,
  Settings,
  Plus,
  Menu,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  lists: TaskList[];
  activeView: string;
  onViewChange: (view: string) => void;
  onAddList?: () => void;
  taskCounts: Record<string, number>;
  onStatsClick: () => void;
  onSettingsClick: () => void;
}

export const Sidebar = ({
  lists,
  activeView,
  onViewChange,
  onAddList,
  taskCounts,
  onStatsClick,
  onSettingsClick,
}: SidebarProps) => {
  const { signOut } = useAuth();
  const smartViews = [
    { id: "today", label: "Today", icon: Calendar, count: taskCounts.today || 0 },
    { id: "upcoming", label: "Upcoming", icon: CalendarClock, count: taskCounts.upcoming || 0 },
    { id: "all", label: "All Tasks", icon: ListTodo, count: taskCounts.all || 0 },
    { id: "completed", label: "Completed", icon: CheckCircle2, count: taskCounts.completed || 0 },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const sidebarContent = (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Daily Tasks
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Organize your day</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="space-y-1 mb-4">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Smart Views
          </p>
          {smartViews.map((view) => {
            const Icon = view.icon;
            return (
              <Button
                key={view.id}
                variant={activeView === view.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-between",
                  activeView === view.id && "bg-primary/10 text-primary hover:bg-primary/15"
                )}
                onClick={() => onViewChange(view.id)}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {view.label}
                </span>
                {view.count > 0 && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    {view.count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              My Lists
            </p>
            {onAddList && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onAddList}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
          {lists.map((list) => (
            <Button
              key={list.id}
              variant={activeView === list.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-between",
                activeView === list.id && "bg-primary/10 text-primary hover:bg-primary/15"
              )}
              onClick={() => onViewChange(list.id)}
            >
              <span className="flex items-center gap-2">
                <span>{list.icon}</span>
                {list.name}
              </span>
              {(taskCounts[list.id] || 0) > 0 && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {taskCounts[list.id]}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-border mt-auto space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={onStatsClick}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Statistics
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={onSettingsClick}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-50 bg-card shadow-lg"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="flex flex-col h-full">
              {sidebarContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 border-r border-border bg-card h-screen flex-col">
        {sidebarContent}
      </div>
    </>
  );
};
