import { useState } from 'react';
import { Project } from '@/types';
import { mockProjects } from '@/services/mockData';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectDialog } from '@/components/ProjectDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleCreateProject = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleSaveProject = (projectData: Omit<Project, 'id' | 'createdAt'> & { id?: string }) => {
    if (projectData.id) {
      // Update existing
      setProjects(projects.map(p => 
        p.id === projectData.id 
          ? { ...p, name: projectData.name, description: projectData.description }
          : p
      ));
      toast.success('Project updated successfully');
    } else {
      // Create new
      const newProject: Project = {
        id: String(Date.now()),
        name: projectData.name,
        description: projectData.description,
        createdAt: new Date().toISOString(),
      };
      setProjects([newProject, ...projects]);
      toast.success('Project created successfully');
    }
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    toast.success('Project deleted successfully');
  };

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
          <Button onClick={handleCreateProject} className="bg-gradient-primary shadow-glow">
            <Plus className="h-5 w-5 mr-2" />
            New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Button onClick={handleCreateProject} variant="outline">
              Create your first project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
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
        />
      </div>
    </div>
  );
};
