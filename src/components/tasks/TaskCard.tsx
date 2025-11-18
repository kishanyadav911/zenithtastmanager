import { Task, Priority } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, MoreVertical, Trash2, Edit, CheckSquare } from "lucide-react";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityConfig: Record<Priority, { color: string; label: string }> = {
  high: { color: "bg-priority-high text-white", label: "High" },
  medium: { color: "bg-priority-medium text-white", label: "Medium" },
  low: { color: "bg-priority-low text-white", label: "Low" },
  none: { color: "bg-priority-none text-white", label: "None" },
};

export const TaskCard = ({ task, onToggle, onEdit, onDelete }: TaskCardProps) => {
  const priorityStyle = priorityConfig[task.priority];
  
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const hasSubtasks = totalSubtasks > 0;
  
  const isOverdue = task.dueDate && isPast(task.dueDate) && !task.completed;
  
  const getDueDateLabel = () => {
    if (!task.dueDate) return null;
    if (isToday(task.dueDate)) return "Today";
    if (isTomorrow(task.dueDate)) return "Tomorrow";
    return format(task.dueDate, "MMM d, yyyy");
  };
  
  return (
    <Card className={cn(
      "p-4 transition-all hover:shadow-md",
      task.completed && "opacity-60"
    )}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className={cn(
                "font-medium text-foreground mb-1",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {task.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {task.priority !== "none" && (
                  <Badge variant="secondary" className={cn("text-xs", priorityStyle.color)}>
                    {priorityStyle.label}
                  </Badge>
                )}
                
                {task.dueDate && (
                  <Badge variant="outline" className={cn(
                    "text-xs",
                    isOverdue && "border-destructive text-destructive"
                  )}>
                    <Calendar className="w-3 h-3 mr-1" />
                    {getDueDateLabel()}
                  </Badge>
                )}
                
                {hasSubtasks && (
                  <Badge variant="outline" className="text-xs">
                    <CheckSquare className="w-3 h-3 mr-1" />
                    {completedSubtasks}/{totalSubtasks}
                  </Badge>
                )}
                
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
};
