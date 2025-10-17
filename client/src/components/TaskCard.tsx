import { Task } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import { Draggable } from 'react-beautiful-dnd';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard = ({ task, index, onEdit, onDelete }: TaskCardProps) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`p-4 mb-3 transition-all ${
            snapshot.isDragging 
              ? 'shadow-glow rotate-2 scale-105' 
              : 'hover:shadow-card'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              {...provided.dragHandleProps}
              className="mt-1 text-muted-foreground hover:text-foreground transition-colors cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold mb-1 truncate">{task.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {task.description}
              </p>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                  className="h-8 px-2"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="h-8 px-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </Draggable>
  );
};
