/**
 * @constant {object} ENDPOINTS
 * Central mapping of all API routes for the Project and Task domain.
 */

export const ENDPOINTS = {
  // Project Endpoints (Backend: /api/projects)
  createProject: "/api/projects",
  getAllProjects: "/api/projects",
  getProjectById: (id: string) => `/api/projects/${id}`,
  deleteProject: (id: string) => `/api/projects/${id}`,

  // Task Endpoints (Backend: /api/projects/:projectId/tasks)
  createTask: (projectId: string) => `/api/projects/${projectId}/tasks`,
  getTasksByProject: (projectId: string) => `/api/projects/${projectId}/tasks`,
  updateTaskStatus: (projectId: string, taskId: string) => `/api/projects/${projectId}/tasks/${taskId}/status`,
  editTask: (projectId: string, taskId: string) => `/api/projects/${projectId}/tasks/${taskId}`, 
  deleteTask: (projectId: string, taskId: string) => `/api/projects/${projectId}/tasks/${taskId}`,

  // AI Endpoints (Backend: /api/ai)
  getProjectSummary: (projectId: string) => `/api/ai/summary/${projectId}`,
  getTaskQnA: (taskId: string) => `/api/ai/qna/${taskId}`,
}
