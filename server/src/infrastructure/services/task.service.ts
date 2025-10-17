import { TaskModel, ITask, TaskStatus } from '../db/Task.model';
import { ObjectId } from 'mongoose';

/**
 * Low-level Service Layer for Task CRUD operations.
 * Directly interacts with the Mongoose model.
 */
export class TaskService {

  /**
   * Finds a single task by its ID.
   */
  async findTaskById(id: string | ObjectId): Promise<ITask | null> {
    return TaskModel.findById(id).lean();
  }

  /**
   * Retrieves all tasks for a specific project ID.
   */
  async findTasksByProjectId(projectId: string | ObjectId): Promise<ITask[]> {
    return TaskModel.find({ projectId }).lean();
  }

  /**
   * Creates a new task for a project.
   */
  async createTask(projectId: string | ObjectId, title: string, description: string): Promise<ITask> {
    const newTask = new TaskModel({ projectId, title, description });
    return newTask.save();
  }

  /**
   * Updates the status of a specific task.
   */
  async updateTaskStatus(taskId: string | ObjectId, newStatus: TaskStatus): Promise<ITask | null> {
    return TaskModel.findByIdAndUpdate(
      taskId,
      { status: newStatus },
      { new: true }
    ).lean();
  }

  /**
   * Deletes a task by its ID.
   */
  async deleteTask(taskId: string | ObjectId): Promise<ITask | null> {
    return TaskModel.findByIdAndDelete(taskId).lean();
  }
}