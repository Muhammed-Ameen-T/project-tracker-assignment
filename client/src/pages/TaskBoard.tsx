import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Task, TaskStatus } from '@/types';
import { mockProjects, mockTasks } from '@/services/mockData';
import { KanbanColumn } from '@/components/KanbanColumn';
import { TaskDialog } from '@/components/TaskDialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Sparkles, MessageSquare } from 'lucide-react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { toast } from 'sonner';

const statuses: TaskStatus[] = ['To Do', 'In Progress', 'Done'];

export const TaskBoard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState(mockProjects.find(p => p.id === projectId));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('To Do');

  useEffect(() => {
    // Filter tasks for this project
    setTasks(mockTasks.filter(t => t.projectId === projectId));
  }, [projectId]);

  const handleAddTask = (status: TaskStatus) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'projectId'> & { id?: string }) => {
    if (taskData.id) {
      // Update existing
      setTasks(tasks.map(t => 
        t.id === taskData.id 
          ? { ...t, ...taskData }
          : t
      ));
      toast.success('Task updated successfully');
    } else {
      // Create new
      const newTask: Task = {
        id: String(Date.now()),
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        projectId: projectId!,
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, newTask]);
      toast.success('Task created successfully');
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.success('Task deleted successfully');
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as TaskStatus;
    setTasks(tasks.map(t => 
      t.id === draggableId 
        ? { ...t, status: newStatus }
        : t
    ));
    
    toast.success(`Task moved to ${newStatus}`);
  };

  const handleAISummarize = () => {
    toast.info('AI Summarize feature - Connect your backend to enable');
  };

  const handleAIQA = () => {
    toast.info('AI Q&A feature - Connect your backend to enable');
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Project not found</p>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      <div className="container mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            {project.name}
          </h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>

        {/* AI Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">AI Project Summary</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Get an AI-powered overview of your project's current status
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleAISummarize}
                  className="w-full sm:w-auto"
                >
                  Generate Summary
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <MessageSquare className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">AI Task Assistant</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Ask questions about specific tasks and get AI-powered answers
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleAIQA}
                  className="w-full sm:w-auto"
                >
                  Ask Question
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {statuses.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={tasks.filter(t => t.status === status)}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        </DragDropContext>

        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSaveTask}
          task={editingTask}
          defaultStatus={defaultStatus}
        />
      </div>
    </div>
  );
};
