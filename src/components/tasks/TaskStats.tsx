import { TaskStats as ITaskStats } from "@/types/task";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle, AlertCircle, TrendingUp } from "lucide-react";

interface TaskStatsProps {
  stats: ITaskStats;
}

export const TaskStats = ({ stats }: TaskStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Circle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Tasks</p>
            <p className="text-2xl font-bold text-foreground">{stats.active}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-success/10 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completed Today</p>
            <p className="text-2xl font-bold text-foreground">{stats.completedToday}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-destructive/10 rounded-lg">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Overdue</p>
            <p className="text-2xl font-bold text-foreground">{stats.overdue}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            <p className="text-2xl font-bold text-foreground">{stats.completionRate}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
