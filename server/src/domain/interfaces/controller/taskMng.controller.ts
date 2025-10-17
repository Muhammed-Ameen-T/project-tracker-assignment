import { Request, Response, NextFunction } from 'express';

/**
 * @interface ITaskController
 * Contract for handling Task-related HTTP requests.
 */
export interface ITaskController {
  createTask(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTasksByProjectId(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTaskStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTaskQnA(req: Request, res: Response, next: NextFunction): Promise<void>;
}