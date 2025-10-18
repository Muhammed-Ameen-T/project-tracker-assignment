import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useFetchTasksByProject,
  useCreateTask,
  useUpdateTaskStatus,
  useTaskQnA,
  useFetchProjectSummary,
  useFetchProjectById,
  useEditTask, 
  useDeleteTask, 
} from "@/hooks/useProjectTask";
import { Task, TaskStatus } from "@/types";
import { KanbanColumn } from "@/components/KanbanColumn";
import { TaskDialog } from "@/components/TaskDialog";
import { SummaryModal } from "@/components/SummaryModal";
import { QnAModal } from "@/components/QnAModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles, MessageSquare, Loader2 } from "lucide-react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { toast } from "sonner";

const statuses: TaskStatus[] = ["To Do", "In Progress", "Done"];

export const TaskBoard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("To Do");
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showQnAModal, setShowQnAModal] = useState(false);

  const { data: project, isLoading: isLoadingProject } = useFetchProjectById(
    projectId || ""
  );

  const {
    data: tasks = [],
    isLoading: isLoadingTasks,
    isError: isErrorTasks,
    error: tasksError,
  } = useFetchTasksByProject(projectId || "");

  const createTaskMutation = useCreateTask(projectId || "");
  const updateStatusMutation = useUpdateTaskStatus(projectId || "");
  const editTaskMutation = useEditTask(projectId || ""); 
  const deleteTaskMutation = useDeleteTask(projectId || ""); 
  
  const summaryQuery = useFetchProjectSummary(projectId || "");
  const qnaMutation = useTaskQnA(editingTask?.id || "");

  const isMutating =
    createTaskMutation.isPending ||
    updateStatusMutation.isPending ||
    editTaskMutation.isPending || 
    deleteTaskMutation.isPending; 


  const handleAddTask = (status: TaskStatus) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
    qnaMutation.reset(); 
    setShowQnAModal(false);
  };
  
  type TaskSavePayload = {
    id?: string;
    title: string;
    description: string;
    status: TaskStatus;
  };

  const handleSaveTask = async (
    taskData: TaskSavePayload
  ) => {
    setDialogOpen(false); 

    try {
      if (taskData.id) {
        await editTaskMutation.mutateAsync({
          taskId: taskData.id,
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
        });
        toast.success("Task updated successfully");
      } else {
        await createTaskMutation.mutateAsync({
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
        });
        toast.success("Task created successfully");
      }
    } catch (err) {
      toast.error(`Error saving task: ${(err as Error).message}`);
      setDialogOpen(true); 
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTaskMutation.mutateAsync(id);
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error(`Error deleting task: ${(err as Error).message}`);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    const newStatus = destination.droppableId as TaskStatus;

    try {
      await updateStatusMutation.mutateAsync({
        taskId: draggableId,
        status: newStatus,
      });
      toast.success(`Task status updated to ${newStatus}`);
    } catch (err) {
      toast.error(`Failed to update status: ${(err as Error).message}`);
    }
  };

  const handleAISummarize = () => {
    if (summaryQuery.data?.summary) {
      setShowSummaryModal(true);
      return;
    }

    summaryQuery.refetch();

    if (summaryQuery.isLoading) {
      toast.info("Generating summary...");
    } else if (summaryQuery.isError) {
      toast.error(`AI Error: ${(summaryQuery.error as Error).message}`);
    } else {
      toast.info("Summary requested.");
    }
  };

  const handleAIQA = (task: Task) => {
    setEditingTask(task);
    setShowQnAModal(true);
    qnaMutation.reset();
  };

  const handleAskQnA = async (question: string) => {
    if (!editingTask?.id) return;

    try {
      await qnaMutation.mutateAsync({ question });
    } catch (err) {
      toast.error(`Q&A Error: ${(err as Error).message}`);
    }
  };


  if (isLoadingProject || isLoadingTasks) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-2">Loading project data...</p>
      </div>
    );
  }

  if (isErrorTasks || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {project ? "Error loading tasks." : "Project not found."}
          </p>
          <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      <div className="container mx-auto px-6 py-8">
        {/* Navigation */}
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

        {/* Project Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            {project.name}
          </h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>

        {/* AI Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* AI Project Summary */}
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-start gap-4">
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
                  disabled={summaryQuery.isLoading || isMutating}
                >
                  {summaryQuery.isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  {summaryQuery.isLoading
                    ? "Generating..."
                    : "Generate Summary"}
                </Button>
              </div>
            </div>
          </Card>

          {/* AI Task Assistant Placeholder */}
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">AI Task Assistant</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Ask questions about specific tasks and get AI-powered answers
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowQnAModal(true)}
                  className="w-full sm:w-auto"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask Question
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {statuses.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={tasks.filter((t) => t.status === status)}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onAIQA={handleAIQA}
              />
            ))}
          </div>
        </DragDropContext>

        {/* Task Dialog (for Creation/Editing) */}
        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSaveTask}
          task={editingTask}
          defaultStatus={defaultStatus}
          isSaving={isMutating}
        />

        {/* AI Summary Modal */}
        <SummaryModal
          open={showSummaryModal}
          onClose={() => setShowSummaryModal(false)}
          summary={summaryQuery.data?.summary || ""}
          projectName={project.name}
          isLoading={summaryQuery.isLoading}
        />

        {/* AI Q&A Modal */}
        {editingTask && (
          <QnAModal
            open={showQnAModal}
            onClose={() => setShowQnAModal(false)}
            onAsk={handleAskQnA}
            isLoading={qnaMutation.isPending}
            result={qnaMutation.data?.answer || null}
            taskTitle={editingTask.title}
          />
        )}
      </div>
    </div>
  );
};