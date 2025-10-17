// src/domain/interfaces/ITaskRepository.ts
import { ObjectId, Document, Types } from 'mongoose';
import { ITaskData, TaskStatus } from '../../models/task.model';

/**
 * @typedef {Object} ITaskDocument
 * Mongoose Document interface for Task (includes Mongoose methods).
 */
export interface ITaskDocument extends ITaskData, Document {}

/**
 * @interface ITaskRepository
 * Contract for Task data persistence operations.
 */
export interface ITaskRepository {
  /**
   * Finds a single task by its ID.
   * @param {string | ObjectId} id
   * @returns {Promise<ITaskData | null>}
   */
  findTaskById(id: string | ObjectId): Promise<ITaskData | null>;

  /**
   * Retrieves all tasks for a specific project ID.
   * @param {string | ObjectId} projectId
   * @returns {Promise<ITaskData[]>}
   */
  findTasksByProjectId(projectId: string | ObjectId): Promise<ITaskData[]>;

  /**
   * Creates a new task.
   * @param {ObjectId} projectId
   * @param {string} title
   * @param {string} description
   * @returns {Promise<ITaskDocument>}
   */
  createTask(projectId: Types.ObjectId, title: string, description: string): Promise<ITaskDocument>;

  /**
   * Updates the status of a specific task.
   * @param {string | ObjectId} taskId
   * @param {TaskStatus} newStatus
   * @returns {Promise<ITaskData | null>}
   */
  updateTaskStatus(taskId: string | ObjectId, newStatus: TaskStatus): Promise<ITaskData | null>;

  /**
   * Deletes a task by its ID.
   * @param {string | ObjectId} taskId
   * @returns {Promise<ITaskData | null>}
   */
  deleteTask(taskId: string | ObjectId): Promise<ITaskData | null>;
}