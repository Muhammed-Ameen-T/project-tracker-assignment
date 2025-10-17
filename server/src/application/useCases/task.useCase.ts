import { TaskService } from '../services/task.service.js';
import { ProjectService } from '../services/project.service.js';
import { ITask, TaskStatus } from '../db/Task.model.js';
import { ObjectId } from 'mongoose';

const taskService = new TaskService();
const projectService = new ProjectService();

/**
 * Validates if a string is a valid TaskStatus.
 */
function isValidTaskStatus(status: string): status is TaskStatus {
  return ['To Do', 'In Progress', 'Done'].includes(status);
}

/**
 * Use Case: Creates a new task, ensuring the parent project exists.
 */
export async function createTaskForProject(
  projectId: string,
  title: string,
  description: string
): Promise<ITask> {
  // 1. Validation for input data
  if (!title || title.trim().length === 0) {
    throw new Error('Task title is required.');
  }
  if (!description || description.trim().length === 0) {
    throw new Error('Task description is required.');
  }

  // 2. Business logic: Check if the project exists
  const project = await projectService.findProjectById(projectId);
  if (!project) {
    throw new Error(`Project with ID ${projectId} not found. Cannot create task.`);
  }

  // 3. Service call
  return taskService.createTask(projectId, title.trim(), description.trim());
}

/**
 * Use Case: Retrieves all tasks for a project ID, ensuring project exists.
 */
export async function getTasksByProjectId(projectId: string): Promise<ITask[]> {
  const project = await projectService.findProjectById(projectId);
  if (!project) {
    throw new Error(`Project with ID ${projectId} not found.`);
  }
  return taskService.findTasksByProjectId(projectId);
}

/**
 * Use Case: Updates a task's status with status validation and existence check.
 */
export async function updateTaskStatusAndValidate(
  taskId: string | ObjectId,
  newStatus: string
): Promise<ITask> {
  // 1. Validation for status format
  if (!isValidTaskStatus(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}. Must be 'To Do', 'In Progress', or 'Done'.`);
  }

  // 2. Service call (Update and existence check in one go)
  const updatedTask = await taskService.updateTaskStatus(taskId, newStatus);

  if (!updatedTask) {
    throw new Error(`Task with ID ${taskId} not found for status update.`);
  }

  // 3. Optional business logic: (e.g., if a project is complete, ensure no tasks are 'To Do')
  // This is a placeholder for complex logic.

  return updatedTask;
}