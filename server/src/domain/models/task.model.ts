import { ObjectId } from 'mongoose';

/**
 * @typedef {'To Do' | 'In Progress' | 'Done'} TaskStatus
 * Valid status states for a Task.
 */
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

/**
 * @typedef {Object} ITaskData
 * The plain data structure for a Task.
 * @property {string} title
 * @property {string} description
 * @property {TaskStatus} status
 * @property {ObjectId} projectId - Reference to the parent project.
 */
export interface ITaskData {
  title: string;
  description: string;
  status: TaskStatus;
  projectId: ObjectId;
}