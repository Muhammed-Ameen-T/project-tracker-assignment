import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/config/types';
import mongoose from 'mongoose';
import { sendResponse } from '../../utils/response/sendResponse.utils';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';
import { SuccessMsg } from '../../utils/constants/commonSuccessMsg.constants';
import 'reflect-metadata';
import { IProjectController } from '../../domain/interfaces/controller/projectMng.controller';
import { ICreateProjectUseCase, IDeleteProjectUseCase, IGetAllProjectsUseCase, IGetProjectByIdUseCase } from '../../domain/interfaces/useCase/project.interface';
import { CreateProjectDTO } from '../../application/dto/project.dto';
import { AiService } from '../../infrastructure/services/ai.service';

/**
 * @class ProjectController
 * Implements IProjectController and manages Project endpoints using granular Use Cases.
 * @implements {IProjectController}
 */
@injectable()
export class ProjectController implements IProjectController {
  
  private createProjectUseCase: ICreateProjectUseCase;
  private getProjectByIdUseCase: IGetProjectByIdUseCase;
  private getAllProjectsUseCase: IGetAllProjectsUseCase;
  private deleteProjectUseCase: IDeleteProjectUseCase;
  private aiService: AiService;

  /**
   * @constructor
   * Injects granular Use Case interfaces and the AI Service.
   */
  constructor(
    @inject(TYPES.ICreateProjectUseCase) createProjectUseCase: ICreateProjectUseCase,
    @inject(TYPES.IGetProjectByIdUseCase) getProjectByIdUseCase: IGetProjectByIdUseCase,
    @inject(TYPES.IGetAllProjectsUseCase) getAllProjectsUseCase: IGetAllProjectsUseCase,
    @inject(TYPES.IDeleteProjectUseCase) deleteProjectUseCase: IDeleteProjectUseCase,
    @inject(TYPES.AiService) aiService: AiService,
  ) {
    this.createProjectUseCase = createProjectUseCase;
    this.getProjectByIdUseCase = getProjectByIdUseCase;
    this.getAllProjectsUseCase = getAllProjectsUseCase;
    this.deleteProjectUseCase = deleteProjectUseCase;
    this.aiService = aiService;
    
    // Bind methods to 'this' to prevent context loss when used as Express middleware
    this.createProject = this.createProject.bind(this);
    this.getAllProjects = this.getAllProjects.bind(this);
    this.getProjectById = this.getProjectById.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.getProjectSummary = this.getProjectSummary.bind(this);
  }

  /**
   * @inheritDoc
   * @route POST /api/projects
   */
  async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Create DTO from request body
      const dto = new CreateProjectDTO(req.body.name, req.body.description);
      
      // 2. Execute the single Use Case action
      const project = await this.createProjectUseCase.execute(dto);
      
      sendResponse(res, HttpResCode.CREATED, SuccessMsg.PROJECT_CREATED, project);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @inheritDoc
   * @route GET /api/projects
   */
  async getAllProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projects = await this.getAllProjectsUseCase.execute(); 
      sendResponse(res, HttpResCode.OK, SuccessMsg.PROJECTS_FETCHED, projects);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @inheritDoc
   * @route GET /api/projects/:projectId
   */
  async getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = req.params.projectId;
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new Error('Invalid Project ID format.'));
      }
      
      const project = await this.getProjectByIdUseCase.execute(projectId);
      
      sendResponse(res, HttpResCode.OK, SuccessMsg.PROJECT_FETCHED, project);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @inheritDoc
   * @route DELETE /api/projects/:projectId
   */
  async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = req.params.projectId;
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new Error('Invalid Project ID format.'));
      }
      
      const deletedProject = await this.deleteProjectUseCase.execute(projectId);
      
      sendResponse(res, HttpResCode.OK, SuccessMsg.PROJECT_DELETED, deletedProject);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @inheritDoc
   * @route GET /api/ai/summary/:projectId
   */
  async getProjectSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = req.params.projectId;
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new Error('Invalid Project ID format.'));
      }
      
      await this.getProjectByIdUseCase.execute(projectId); 

      const summary = await this.aiService.getProjectSummary(projectId);
      
      sendResponse(res, HttpResCode.OK, SuccessMsg.SUMMARY_GENERATED, { summary });
    } catch (error) {
      next(error);
    }
  }
}