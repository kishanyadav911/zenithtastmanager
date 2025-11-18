import { TaskFilters as ITaskFilters, Priority, TaskList } from "@/types/task";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, LayoutGrid, List as ListIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TaskFiltersProps {
  filters: ITaskFilters;
  onFiltersChange: (filters: Partial<ITaskFilters>) => void;
  lists: TaskList[];
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
}

export const TaskFiltersComponent = ({
  filters,
  onFiltersChange,
  lists,
  viewMode,
  onViewModeChange,
}: TaskFiltersProps) => {
  const activeFiltersCount = [
    filters.priority !== "all",
    filters.status !== "all",
    filters.listId !== "all",
    filters.tags.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            placeholder="Search tasks..."
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("list")}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select
          value={filters.priority}
          onValueChange={(value) => onFiltersChange({ priority: value as Priority | "all" })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => onFiltersChange({ status: value as any })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.listId}
          onValueChange={(value) => onFiltersChange({ listId: value })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="List" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Lists</SelectItem>
            {lists.map((list) => (
              <SelectItem key={list.id} value={list.id}>
                {list.icon} {list.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy}
          onValueChange={(value) => onFiltersChange({ sortBy: value as any })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="createdAt">Created</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>

        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" />
            {activeFiltersCount} active
          </Badge>
        )}
      </div>
    </div>
  );
};
