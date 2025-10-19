import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/config/types';
import mongoose from 'mongoose';
import { sendResponse } from '../../utils/response/sendResponse.utils';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';
import { SuccessMsg } from '../../utils/constants/commonSuccessMsg.constants';
import 'reflect-metadata';
import { IProjectController } from '../../domain/interfaces/controller/projectMng.controller';
import { ICreateProjectUseCase, IDeleteProjectUseCase, IGetAllProjectsUseCase, IGetProjectByIdUseCase, IUpdateProjectUseCase } from '../../domain/interfaces/useCase/project.interface';
import { CreateProjectDTO, UpdateProjectDTO } from '../../application/dto/project.dto';
import { ErrorMsg } from '../../utils/constants/commonErrorMsg.constants';
import { IAISummaryUseCase } from '../../domain/interfaces/useCase/ai.interface';

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
  private updateProjectUseCase: IUpdateProjectUseCase;
  private getProjectSummaryUseCase: IAISummaryUseCase; 

  /**
   * @constructor
   * Injects granular Use Case interfaces and the AI Service.
   */
  constructor(
    @inject(TYPES.ICreateProjectUseCase) createProjectUseCase: ICreateProjectUseCase,
    @inject(TYPES.IGetProjectByIdUseCase) getProjectByIdUseCase: IGetProjectByIdUseCase,
    @inject(TYPES.IGetAllProjectsUseCase) getAllProjectsUseCase: IGetAllProjectsUseCase,
    @inject(TYPES.IDeleteProjectUseCase) deleteProjectUseCase: IDeleteProjectUseCase,
    @inject(TYPES.IUpdateProjectUseCase) updateProjectUseCase: IUpdateProjectUseCase,
    @inject(TYPES.IAISummaryUseCase) getProjectSummaryUseCase: IAISummaryUseCase, 
  ) {
    this.createProjectUseCase = createProjectUseCase;
    this.getProjectByIdUseCase = getProjectByIdUseCase;
    this.getAllProjectsUseCase = getAllProjectsUseCase;
    this.deleteProjectUseCase = deleteProjectUseCase;
    this.updateProjectUseCase = updateProjectUseCase;
    this.getProjectSummaryUseCase = getProjectSummaryUseCase; 
    
    this.createProject = this.createProject.bind(this);
    this.getAllProjects = this.getAllProjects.bind(this);
    this.getProjectById = this.getProjectById.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.getProjectSummary = this.getProjectSummary.bind(this);
  }

  /**
   * @inheritDoc
   * @route POST /api/projects
   */
  async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new CreateProjectDTO(req.body.name, req.body.description);
      
      const project = await this.createProjectUseCase.execute(dto);
      
      sendResponse(res, HttpResCode.CREATED, SuccessMsg.PROJECT_CREATED, project);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @inheritDoc
   * @route PATCH /api/projects/:projectId
   */
  async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = req.params.projectId;
      const { name, description } = req.body;
      
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new Error(ErrorMsg.INVALID_PROJECT_ID));
      }
      
      const dto = new UpdateProjectDTO(projectId, name, description);
      
      const updatedProject = await this.updateProjectUseCase.execute(dto);
      
      sendResponse(res, HttpResCode.OK, SuccessMsg.PROJECT_UPDATED, updatedProject);
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
        return next(new Error(ErrorMsg.INVALID_PROJECT_ID));
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
        return next(new Error(ErrorMsg.INVALID_PROJECT_ID));
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
        return next(new Error(ErrorMsg.INVALID_PROJECT_ID));
      }
      
      const { summary } = await this.getProjectSummaryUseCase.execute(projectId);

      sendResponse(res, HttpResCode.OK, SuccessMsg.SUMMARY_GENERATED, { summary });
    } catch (error) {
      next(error);
    }
  }
}