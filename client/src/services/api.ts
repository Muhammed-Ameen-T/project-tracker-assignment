import api from "@/config/axios.config";
import { ENDPOINTS } from "@/constants/apiEndPoint";
import { ERROR_MESSAGES } from "@/constants/error.messages";
import {
  IProjectResponse,
  IQnAResponse,
  ISummaryResponse,
  ITaskResponse,
  TaskStatus,
} from "@/types";
import { handleAxiosError } from "@/utils/exios-error-handler";

/**
 * @constant {object} ProjectTaskAPI
 * API service layer for Project, Task, and AI interactions.
 */
export const ProjectTaskAPI = {
  // --- PROJECT CRUD ---

  /**
   * Creates a new project.
   * @param {string} name - The name of the project.
   * @param {string} description - The description of the project.
   * @returns {Promise<IProjectResponse>} The created project data.
   */
  createProject: async (
    name: string,
    description: string
  ): Promise<IProjectResponse> => {
    try {
      const response = await api.post(ENDPOINTS.createProject, {
        name,
        description,
      });
      if (!response.data?.success) {
        throw new Error(
          response.data?.message || ERROR_MESSAGES.CREATE_PROJECT_FAILED
        );
      }
      return response.data.data;
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.CREATE_PROJECT_FAILED);
    }
  },

  /**
   * Updates an existing project.
   * @param {string} projectId - The ID of the project to update.
   * @param {string} name - The new name of the project.
   * @param {string} description - The new description of the project.
   * @returns {Promise<IProjectResponse>} The updated project data.
   */
  updateProject: async (
    projectId: string,
    name: string,
    description: string
  ): Promise<IProjectResponse> => {
    try {
      const response = await api.patch(ENDPOINTS.getProjectById(projectId), {
        name,
        description,
      });
      if (!response.data?.success) {
        throw new Error(
          response.data?.message || ERROR_MESSAGES.UPDATE_PROJECT_FAILED
        );
      }
      return response.data.data;
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.UPDATE_PROJECT_FAILED);
    }
    return {} as IProjectResponse;
  },

  /**
   * Fetches all projects.
   * @returns {Promise<IProjectResponse[]>} A list of projects.
   */
  fetchAllProjects: async (): Promise<IProjectResponse[]> => {
    try {
      const response = await api.get(ENDPOINTS.getAllProjects);
      if (!response.data?.success) {
        throw new Error(
          response.data?.message || ERROR_MESSAGES.FETCH_PROJECTS_FAILED
        );
      }
      return response.data.data;
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.FETCH_PROJECTS_FAILED);
    }
  },

  /**
   * Deletes a project by ID.
   * @param {string} projectId - The ID of the project to delete.
   * @returns {Promise<IProjectResponse>} The deleted project data.
   */
  deleteProject: async (projectId: string): Promise<IProjectResponse> => {
    try {
      const response = await api.delete(ENDPOINTS.deleteProject(projectId));
      if (!response.data?.success) {
        throw new Error(
          response.data?.message || ERROR_MESSAGES.DELETE_PROJECT_FAILED
        );
      }
      return response.data.data;
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.DELETE_PROJECT_FAILED);
    }
  },

  // --- TASK CRUD ---

  /**
   * Creates a new task for a specified project.
   * @param {string} projectId - The ID of the parent project.
   * @param {string} title - The task title.
   * @param {string} description - The task description.
   * @returns {Promise<ITaskResponse>} The created task data.
   */
  createTask: async (
    projectId: string,
    title: string,
    description: string,
    status: TaskStatus
  ): Promise<ITaskResponse> => {
    try {
      const response = await api.post(ENDPOINTS.createTask(projectId), {
        title,
        description,
        status
      });
      if (!response.data?.success) {
        throw new Error(
          response.data?.message || ERROR_MESSAGES.CREATE_TASK_FAILED
        );
      }
      return response.data.data;
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.CREATE_TASK_FAILED);
    }
  },

  /**
   * Fetches all tasks for a specific project.
   * @param {string} projectId - The ID of the project.
   * @returns {Promise<ITaskResponse[]>} A list of tasks.
   */
  fetchTasksByProject: async (projectId: string): Promise<ITaskResponse[]> => {
    try {
      const response = await api.get(ENDPOINTS.getTasksByProject(projectId));
      if (!response.data?.success) {
        throw new Error(
          response.data?.message || ERROR_MESSAGES.FETCH_TASKS_FAILED
        );
      }
      return response.data.data;
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.FETCH_TASKS_FAILED);
    }
    return [];
  },

  /**
   * Updates the status of a specific task.
   * @param {string} projectId - The ID of the project (for routing).
   * @param {string} taskId - The ID of the task.
   * @param {string} status - The new status ('To Do', 'In Progress', 'Done').
   * @returns {Promise<ITaskResponse>} The updated task data.
   */
  updateTaskStatus: async (
    projectId: string,
    taskId: string,
    status: string
  ): Promise<ITaskResponse> => {
    try {
      const response = await api.patch(
        ENDPOINTS.updateTaskStatus(projectId, taskId),
        { status }
      );
      if (!response.data?.success) {
        throw new Error(
          response.data?.message || ERROR_MESSAGES.UPDATE_TASK_FAILED
        );
      }
      return response.data.data;
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.UPDATE_TASK_FAILED);
    }
  },

  /**
   * Updates all editable fields (title, description, status) of a specific task.
   * @param {string} projectId - The ID of the project.
   * @param {string} taskId - The ID of the task to update.
   * @param {string} title - The new title.
   * @param {string} description - The new description.
   * @param {string} status - The new status.
   * @returns {Promise<ITaskResponse>} The updated task data.
   */
  editTask: async (
    projectId: string,
    taskId: string,
    title: string,
    description: string,
    status: string
  ): Promise<ITaskResponse> => { 
    try {
      const response = await api.patch(
        ENDPOINTS.editTask(projectId, taskId),
        { title, description, status }
      );
      if (!response.data?.success) {
        throw new Error(
          response.data?.message || ERROR_MESSAGES.UPDATE_TASK_FAILED
        );
      }
      return response.data.data;
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.UPDATE_TASK_FAILED);
    }
  },

  /**
   * Deletes a task by ID.
   * @param {string} projectId - The ID of the project (for routing context).
   * @param {string} taskId - The ID of the task to delete.
   * @returns {Promise<IProjectResponse>} The deleted task data.
   */
  deleteTask: async (projectId: string, taskId: string): Promise<ITaskResponse> => {
    try {
      const response = await api.delete(ENDPOINTS.deleteTask(projectId, taskId));
      if (response.status !== 204) {
        throw new Error(
          response.data?.message || ERROR_MESSAGES.DELETE_TASK_FAILED
        );
      }
      return response.data.data;
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.DELETE_TASK_FAILED);
    }
  },

  /**
   * Fetches a single project by ID.
   * @param {string} projectId - The ID of the project.
   * @returns {Promise<IProjectResponse>} The project data.
   */
  fetchProjectById: async (projectId: string): Promise<IProjectResponse> => {
    try {
      const response = await api.get(ENDPOINTS.getProjectById(projectId));
      if (!response.data?.success) {
        throw new Error(
          response.data?.message || ERROR_MESSAGES.FETCH_PROJECT_FAILED
        );
      }
      return response.data.data;
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.FETCH_PROJECT_FAILED);
    }
    return {} as IProjectResponse;
  },

  // --- GEMINI AI FEATURES ---

  /**
   * Fetches an AI-generated summary of project progress based on its tasks.
   * @param {string} projectId - The ID of the project.
   * @returns {Promise<ISummaryResponse>} The summary text.
   */
  fetchProjectSummary: async (projectId: string): Promise<ISummaryResponse> => {
    try {
      const response = await api.get(ENDPOINTS.getProjectSummary(projectId));
      if (!response.data?.success) {
        throw new Error(
          response.data?.message || ERROR_MESSAGES.FETCH_SUMMARY_FAILED
        );
      }
      return response.data.data;
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.FETCH_SUMMARY_FAILED);
    }
  },

  /**
   * Sends a question about a specific task to the AI.
   * @param {string} taskId - The ID of the task.
   * @param {string} question - The user's question.
   * @returns {Promise<IQnAResponse>} The question and the AI's answer.
   */
  fetchTaskQnA: async (
    taskId: string,
    question: string
  ): Promise<IQnAResponse> => {
    try {
      const response = await api.post(ENDPOINTS.getTaskQnA(taskId), {
        question,
      });
      if (!response.data?.success) {
        throw new Error(
          response.data?.message || ERROR_MESSAGES.FETCH_QNA_FAILED
        );
      }
      return response.data.data;
    } catch (error) {
      handleAxiosError(error, ERROR_MESSAGES.FETCH_QNA_FAILED);
    }
  },
};