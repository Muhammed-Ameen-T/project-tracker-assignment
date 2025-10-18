import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { Droppable } from 'react-beautiful-dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onAIQA: (task: Task) => void;
}

const statusColors: Record<TaskStatus, string> = {
  'To Do': 'bg-status-todo',
  'In Progress': 'bg-status-progress',
  'Done': 'bg-status-done',
};

export const KanbanColumn = ({
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onAIQA, 
}: KanbanColumnProps) => {
  return (
    <div className="flex flex-col bg-secondary rounded-lg p-4 min-w-[320px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn('w-3 h-3 rounded-full', statusColors[status])} />
          <h3 className="font-semibold text-lg">{status}</h3>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
            {tasks.length}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onAddTask(status)}
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 transition-colors rounded-lg p-2 min-h-[200px]',
              snapshot.isDraggingOver && 'bg-primary/10'
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onAIQA={onAIQA} 
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};