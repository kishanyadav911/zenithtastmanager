import { useState } from "react";
import { Task, Priority, Subtask, TaskList } from "@/types/task";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Plus, X, Flag } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Omit<Task, "id" | "createdAt" | "order">) => void;
  editTask?: Task;
  lists: TaskList[];
}

export const AddTaskDialog = ({ open, onOpenChange, onSave, editTask, lists }: AddTaskDialogProps) => {
  const [title, setTitle] = useState(editTask?.title || "");
  const [description, setDescription] = useState(editTask?.description || "");
  const [priority, setPriority] = useState<Priority>(editTask?.priority || "none");
  const [dueDate, setDueDate] = useState<Date | undefined>(editTask?.dueDate);
  const [listId, setListId] = useState(editTask?.listId || lists[0]?.id || "personal");
  const [tags, setTags] = useState<string[]>(editTask?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [subtasks, setSubtasks] = useState<Subtask[]>(editTask?.subtasks || []);
  const [subtaskInput, setSubtaskInput] = useState("");

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      completed: editTask?.completed || false,
      priority,
      dueDate,
      tags,
      listId,
      subtasks,
      completedAt: editTask?.completedAt,
    });

    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setPriority("none");
    setDueDate(undefined);
    setListId(lists[0]?.id || "personal");
    setTags([]);
    setTagInput("");
    setSubtasks([]);
    setSubtaskInput("");
    onOpenChange(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const addSubtask = () => {
    if (subtaskInput.trim()) {
      setSubtasks([
        ...subtasks,
        {
          id: Date.now().toString(),
          title: subtaskInput.trim(),
          completed: false,
        },
      ]);
      setSubtaskInput("");
    }
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editTask ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              className="mt-1.5 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                <SelectTrigger id="priority" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-priority-none" />
                      None
                    </span>
                  </SelectItem>
                  <SelectItem value="low">
                    <span className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-priority-low" />
                      Low
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-priority-medium" />
                      Medium
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-priority-high" />
                      High
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="list">List</Label>
              <Select value={listId} onValueChange={setListId}>
                <SelectTrigger id="list" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      <span className="flex items-center gap-2">
                        <span>{list.icon}</span>
                        {list.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1.5",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add tag and press Enter"
              />
              <Button type="button" onClick={addTag} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="subtasks">Subtasks</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                id="subtasks"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubtask())}
                placeholder="Add subtask and press Enter"
              />
              <Button type="button" onClick={addSubtask} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {subtasks.length > 0 && (
              <div className="space-y-2 mt-2">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-2 p-2 bg-muted rounded-md"
                  >
                    <span className="flex-1 text-sm">{subtask.title}</span>
                    <X
                      className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => removeSubtask(subtask.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {editTask ? "Update" : "Create"} Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
