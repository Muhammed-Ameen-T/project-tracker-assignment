import { Project } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-6 hover:shadow-glow transition-all cursor-pointer group bg-gradient-card border-border/50">
      <div onClick={() => navigate(`/project/${project.id}`)}>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4" />
          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="flex gap-2 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(project);
          }}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
          className="flex-1"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </Card>
  );
};
