import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectTaskAPI } from "@/services/api";
import {
  EditTaskData,
  IProjectResponse,
  IQnAResponse,
  ISummaryResponse,
  ITaskResponse,
  TaskStatus,
  UpdateProjectData,
} from "@/types";

const QUERY_KEYS = {
  PROJECTS: "projects",
  TASKS: (projectId: string) => ["tasks", projectId],
  SUMMARY: (projectId: string) => ["summary", projectId],
  PROJECT: (projectId: string) => ["project", projectId],
};

/**
 * Custom hook to fetch all projects.
 * @returns {IProjectResponse[]} Cached or fetched list of projects.
 */
export const useFetchAllProjects = () => {
  return useQuery<IProjectResponse[]>({
    queryKey: [QUERY_KEYS.PROJECTS],
    queryFn: ProjectTaskAPI.fetchAllProjects,
  });
};

/**
 * Custom hook to create a new project.
 * Invalidates the 'projects' cache upon success.
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      ProjectTaskAPI.createProject(data.name, data.description),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
    },
    onError: (error) => {
      console.error("Failed to create project:", error);
    },
  });
};

/**
 * Custom hook to update an existing project.
 * Invalidates the 'projects' cache upon success.
 */
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProjectData) =>
      ProjectTaskAPI.updateProject(data.id, data.name, data.description),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
    },
    onError: (error) => {
      console.error("Failed to update project:", error);
    },
  });
};

/**
 * Custom hook to delete a project.
 * Invalidates the 'projects' cache upon success.
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => ProjectTaskAPI.deleteProject(projectId),

    onSuccess: (deletedProject, projectId) => {
      queryClient.setQueryData<IProjectResponse[]>(
        [QUERY_KEYS.PROJECTS],
        (oldData) => oldData?.filter((p) => p.id !== projectId)
      );
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
    },
    onError: (error) => {
      console.error("Failed to delete project:", error);
    },
  });
};

/**
 * Custom hook to fetch all tasks for a given project ID.
 */
export const useFetchTasksByProject = (projectId: string) => {
  return useQuery<ITaskResponse[]>({
    queryKey: QUERY_KEYS.TASKS(projectId),
    queryFn: () => ProjectTaskAPI.fetchTasksByProject(projectId),
    enabled: !!projectId,
  });
};

/**
 * Custom hook to create a new task.
 * Invalidates the specific project's 'tasks' cache upon success.
 */
export const useCreateTask = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title: string; description: string; status: TaskStatus }) =>
      ProjectTaskAPI.createTask(projectId, data.title, data.description, data.status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS(projectId) });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUMMARY(projectId),
      });
    },
    onError: (error) => {
      console.error("Failed to create task:", error);
    },
  });
};

/**
 * Custom hook to edit (update metadata/status) an existing task.
 * Invalidates the specific project's 'tasks' and 'summary' caches upon success.
 */
export const useEditTask = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditTaskData) =>
      ProjectTaskAPI.editTask(
        projectId,
        data.taskId,
        data.title,
        data.description,
        data.status
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS(projectId) });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUMMARY(projectId),
      });
    },
    onError: (error) => {
      console.error("Failed to edit task:", error);
    },
  });
};

/**
 * Custom hook to delete a task.
 * Invalidates the specific project's 'tasks' and 'summary' caches upon success.
 */
export const  useDeleteTask = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) =>
      ProjectTaskAPI.deleteTask(projectId, taskId),

    onSuccess: (deletedTask, taskId) => {
      queryClient.setQueryData<ITaskResponse[]>(
        QUERY_KEYS.TASKS(projectId),
        (oldData) => oldData?.filter((t) => t.id !== taskId)
      );
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUMMARY(projectId),
      });
    },
    onError: (error) => {
      console.error("Failed to delete task:", error);
    },
  });
};

/**
 * Custom hook to update the status of a task.
 * Invalidates the specific project's 'tasks' and 'summary' caches.
 */
export const useUpdateTaskStatus = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; status: string }) =>
      ProjectTaskAPI.updateTaskStatus(projectId, data.taskId, data.status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS(projectId) });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUMMARY(projectId),
      });
    },
    onError: (error) => {
      console.error("Failed to update task status:", error);
    },
  });
};

/**
 * Custom hook to fetch the AI-generated project summary.
 */
export const useFetchProjectSummary = (projectId: string) => {
  return useQuery<ISummaryResponse>({
    queryKey: QUERY_KEYS.SUMMARY(projectId),
    queryFn: () => ProjectTaskAPI.fetchProjectSummary(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Custom hook to fetch the details of a single project by ID.
 * ensuring the project details are correctly cached and retrieved.
 */
export const useFetchProjectById = (projectId: string) => {
  return useQuery<IProjectResponse>({
    queryKey: QUERY_KEYS.PROJECT(projectId),
    queryFn: () => ProjectTaskAPI.fetchProjectById(projectId),
    enabled: !!projectId,
  });
};

/**
 * Custom hook to fetch an AI Q&A response for a specific task.
 * Uses useMutation since this is a user-triggered, non-cacheable action (like a chat request).
 */
export const useTaskQnA = (taskId: string) => {
  return useMutation<IQnAResponse, Error, { question: string }>({
    mutationFn: (data) => ProjectTaskAPI.fetchTaskQnA(taskId, data.question),

    onError: (error) => {
      console.error("Failed to get Q&A response:", error);
    },
  });
};
