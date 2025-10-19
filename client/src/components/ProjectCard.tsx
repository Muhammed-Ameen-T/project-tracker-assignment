import { useState } from 'react';
import { Project } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from './ui/ConfirmationModal';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const ProjectCard = ({ project, onEdit, onDelete, isDeleting = false }: ProjectCardProps) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmDelete = () => {
    setShowConfirm(false); 
    onDelete(project.id);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  return (
    <>
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
          {/* Edit Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            className="flex-1"
            disabled={isDeleting}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>

          {/* Delete Button - Triggers Confirmation Modal */}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteClick}
            className="flex-1"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Card>

      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Project Deletion"
        description={`Are you sure you want to permanently delete project "${project.name}"? This action cannot be undone.`}
        confirmText="Delete Permanently"
        isSubmitting={isDeleting}
      />
    </>
  );
};