import { Request, Response, NextFunction } from 'express';

/**
 * @interface IProjectController
 * Contract for handling Project-related HTTP requests.
 */
export interface IProjectController {
  createProject(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllProjects(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProjectById(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteProject(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProjectSummary(req: Request, res: Response, next: NextFunction): Promise<void>;
}