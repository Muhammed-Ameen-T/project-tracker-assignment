import { useState, useEffect } from "react";
import { Project } from "@/types";
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
import { Loader2 } from "lucide-react";

type SaveProjectData = {
  id?: string;
  name: string;
  description: string;
};

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (project: SaveProjectData) => Promise<void>;
  project?: Project | null;
  isSaving: boolean;
}

export const ProjectDialog = ({
  open,
  onOpenChange,
  onSave,
  project,
  isSaving,
}: ProjectDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState<{
    name: string;
    description: string;
  }>({ name: "", description: "" });

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
    } else {
      setName("");
      setDescription("");
    }
    setValidationError({ name: "", description: "" });
  }, [project, open]);

  const validate = (): boolean => {
    let isValid = true;
    const errors = { name: "", description: "" };

    if (!name.trim()) {
      errors.name = "Project Name is required.";
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

    const projectData: SaveProjectData = {
      id: project?.id,
      name,
      description,
    };

    await onSave(projectData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {project ? "Edit Project" : "Create New Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Project Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (validationError.name)
                    setValidationError((prev) => ({ ...prev, name: "" }));
                }}
                placeholder="Enter project name"
                disabled={isSaving}
                className={validationError.name ? "border-destructive" : ""}
              />
              {validationError.name && (
                <p className="text-sm text-destructive">
                  {validationError.name}
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
                placeholder="Enter project description"
                rows={4}
                disabled={isSaving}
                className={
                  validationError.description ? "border-destructive" : ""
                }
              />
              {validationError.description && (
                <p className="text-sm text-destructive">
                  {validationError.description}
                </p>
              )}
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
              ) : project ? (
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
