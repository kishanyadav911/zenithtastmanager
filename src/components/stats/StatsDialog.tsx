import { TaskStats } from "@/types/task";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Target,
  Clock,
} from "lucide-react";

interface StatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: TaskStats;
}

export const StatsDialog = ({ open, onOpenChange, stats }: StatsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Task Statistics</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-2">
                  <ListTodo className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-success/10 rounded-full mb-2">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-2">
                  <Circle className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-destructive/10 rounded-full mb-2">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.overdue}</p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </Card>
          </div>

          {/* Completion Rate */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Completion Rate</h3>
                  <p className="text-sm text-muted-foreground">Overall progress</p>
                </div>
              </div>
              <span className="text-3xl font-bold text-accent">{stats.completionRate}%</span>
            </div>
            <Progress value={stats.completionRate} className="h-3" />
          </Card>

          {/* Time-based Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-success" />
                </div>
                <h3 className="font-semibold text-foreground">Daily Progress</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completed Today</span>
                  <span className="text-xl font-bold text-foreground">
                    {stats.completedToday}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Due Today</span>
                  <span className="text-xl font-bold text-foreground">{stats.dueToday}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Weekly Progress</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completed This Week</span>
                  <span className="text-xl font-bold text-foreground">
                    {stats.completedThisWeek}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Due This Week</span>
                  <span className="text-xl font-bold text-foreground">
                    {stats.dueThisWeek}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Productivity Insights */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <h3 className="font-semibold text-foreground">Productivity Insights</h3>
            </div>
            <div className="space-y-2 text-sm">
              {stats.completedToday > 0 && (
                <p className="text-muted-foreground">
                  ✨ Great job! You've completed {stats.completedToday} task
                  {stats.completedToday !== 1 ? "s" : ""} today.
                </p>
              )}
              {stats.overdue > 0 && (
                <p className="text-destructive">
                  ⚠️ You have {stats.overdue} overdue task{stats.overdue !== 1 ? "s" : ""}. 
                  Consider prioritizing them.
                </p>
              )}
              {stats.completionRate >= 80 && (
                <p className="text-success">
                  🎉 Excellent! Your completion rate is {stats.completionRate}%.
                </p>
              )}
              {stats.completionRate < 50 && stats.total > 0 && (
                <p className="text-warning">
                  💪 Keep going! Focus on completing your active tasks.
                </p>
              )}
              {stats.dueToday > 0 && (
                <p className="text-primary">
                  📅 You have {stats.dueToday} task{stats.dueToday !== 1 ? "s" : ""} due today.
                </p>
              )}
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Missing import
import { ListTodo } from "lucide-react";
