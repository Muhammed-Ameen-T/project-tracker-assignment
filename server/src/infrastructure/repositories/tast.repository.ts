// src/infrastructure/db/TaskRepository.ts
import { injectable } from 'inversify';
import { ObjectId, Types } from 'mongoose';

import 'reflect-metadata'; 
import { BaseRepository } from './base.repository';
import { ITaskDocument, ITaskRepository } from '../../domain/interfaces/repositories/ITaskRepository';
import { ITaskData, TaskStatus } from '../../domain/models/task.model';
import { TaskModel } from '../db/task.model';

/**
 * @class TaskRepository
 * Concrete Mongoose implementation of the ITaskRepository contract.
 * Inherits Mongoose setup from BaseRepository.
 * @implements {ITaskRepository}
 */
@injectable()
export class TaskRepository extends BaseRepository<ITaskDocument, ITaskData> implements ITaskRepository {

  /**
   * @constructor
   * Passes the TaskModel to the BaseRepository constructor.
   */
  constructor() {
    super(TaskModel);
  }

  /**
   * Finds a single task by its ID.
   * @param {string | ObjectId} id
   * @returns {Promise<ITaskData | null>}
   */
  async findTaskById(id: string | ObjectId): Promise<ITaskData | null> {
    return super.findById(id);
  }

  /**
   * Retrieves all tasks for a specific project ID.
   * @param {string | ObjectId} projectId
   * @returns {Promise<ITaskData[]>}
   */
  async findTasksByProjectId(projectId: string | ObjectId): Promise<ITaskData[]> {
    return this.model.find({ projectId }).lean();
  }

  /**
   * Creates a new task.
   * @param {ObjectId} projectId
   * @param {string} title
   * @param {string} description
   * @returns {Promise<ITaskDocument>}
   */
  async createTask(projectId: Types.ObjectId, title: string, description: string): Promise<ITaskDocument> {
    // We bypass the generic create() to use the specific parameters required by the contract
    const newTask = new this.model({ projectId, title, description });
    return newTask.save();
  }

  /**
   * Updates the status of a specific task.
   * @param {string | ObjectId} taskId
   * @param {TaskStatus} newStatus
   * @returns {Promise<ITaskData | null>}
   */
  async updateTaskStatus(taskId: string | ObjectId, newStatus: TaskStatus): Promise<ITaskData | null> {
    return this.model.findByIdAndUpdate(
      taskId,
      { status: newStatus },
      { new: true }
    ).lean();
  }

  /**
   * Deletes a task by its ID.
   * @param {string | ObjectId} taskId
   * @returns {Promise<ITaskData | null>}
   */
  async deleteTask(taskId: string | ObjectId): Promise<ITaskData | null> {
    return super.delete(taskId);
  }
}