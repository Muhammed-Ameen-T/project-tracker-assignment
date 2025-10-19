import { useState, useEffect } from "react";
import { Task, TaskStatus } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type TaskSavePayload = {
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
};

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: TaskSavePayload) => Promise<void>;
  task?: Task | null;
  defaultStatus?: TaskStatus;
  isSaving: boolean;
}

const statuses: TaskStatus[] = ["To Do", "In Progress", "Done"];

export const TaskDialog = ({
  open,
  onOpenChange,
  onSave,
  task,
  defaultStatus = "To Do",
  isSaving,
}: TaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [validationError, setValidationError] = useState<{
    title: string;
    description: string;
  }>({ title: "", description: "" });

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    } else {
      setTitle("");
      setDescription("");
      setStatus(defaultStatus);
    }
    setValidationError({ title: "", description: "" });
  }, [task, defaultStatus, open]);

  const validate = (): boolean => {
    let isValid = true;
    const errors = { title: "", description: "" };

    if (!title.trim()) {
      errors.title = "Task Title is required.";
      isValid = false;
    }
    if (!description.trim()) {
      errors.description = "Description cannot be empty.";
      isValid = false;
    }

    setValidationError(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const taskData: TaskSavePayload = {
      id: task?.id,
      title,
      description,
      status,
    };

    await onSave(taskData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (validationError.title)
                    setValidationError((prev) => ({ ...prev, title: "" }));
                }}
                placeholder="Enter task title"
                disabled={isSaving}
                className={cn(validationError.title && "border-destructive")}
              />
              {validationError.title && (
                <p className="text-sm text-destructive">
                  {validationError.title}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (validationError.description)
                    setValidationError((prev) => ({
                      ...prev,
                      description: "",
                    }));
                }}
                placeholder="Enter task description"
                rows={4}
                disabled={isSaving}
                className={cn(
                  validationError.description && "border-destructive"
                )}
              />
              {validationError.description && (
                <p className="text-sm text-destructive">
                  {validationError.description}
                </p>
              )}
            </div>

            {/* Status Field */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as TaskStatus)}
                disabled={isSaving}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : task ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};