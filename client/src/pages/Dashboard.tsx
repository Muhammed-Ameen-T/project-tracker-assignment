import { useState } from "react";
import {
  useFetchAllProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "@/hooks/useProjectTask";
import { Project, SaveProjectData } from "@/types";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectDialog } from "@/components/ProjectDialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Dashboard = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const {
    data: projects = [],
    isLoading,
    isError,
    error,
  } = useFetchAllProjects();

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleCreateProject = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleSaveProject = async (projectData: SaveProjectData) => {
    setDialogOpen(false);

    try {
      if (projectData.id) {
        await updateMutation.mutateAsync({
          id: projectData.id,
          name: projectData.name,
          description: projectData.description,
        });
        toast.success("Project updated successfully");
      } else {
        await createMutation.mutateAsync({
          name: projectData.name,
          description: projectData.description,
        });
        toast.success("Project created successfully");
      }
    } catch (err) {
      const message =
        (err as Error).message || "An unexpected error occurred during save.";
      toast.error(message);
      if (projectData.id) {
        setDialogOpen(true);
      }
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Project deleted successfully");
    } catch (err) {
      const message =
        (err as Error).message || "An unexpected error occurred during delete.";
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-2">Loading projects...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-red-600">
        <h2 className="text-xl font-semibold">Error Loading Projects</h2>
        <p>Details: {(error as Error).message}</p>
        <p className="text-muted-foreground">
          Please check your network connection or backend service.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Projects
            </h1>
            <p className="text-muted-foreground">
              Manage your projects and track progress
            </p>
          </div>
          <Button
            onClick={handleCreateProject}
            className="bg-gradient-primary shadow-glow"
            disabled={isMutating}
          >
            {isMutating ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Plus className="h-5 w-5 mr-2" />
            )}
            {isMutating ? "Saving..." : "New Project"}
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Button
              onClick={handleCreateProject}
              variant="outline"
              disabled={isMutating}
            >
              Create your first project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project as Project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}

        <ProjectDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSaveProject}
          project={editingProject}
          isSaving={isMutating}
        />
      </div>
    </div>
  );
};
