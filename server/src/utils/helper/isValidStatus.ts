import { TaskStatus } from "../../domain/models/task.model";

/**
 * Validates if a string is a valid TaskStatus.
 */
export function isValidTaskStatus(status: string): status is TaskStatus {
  return ['To Do', 'In Progress', 'Done'].includes(status);
}