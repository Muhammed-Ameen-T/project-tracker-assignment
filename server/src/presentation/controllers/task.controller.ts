import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/config/types';
import mongoose from 'mongoose';
import { sendResponse } from '../../utils/response/sendResponse.utils';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';
import { SuccessMsg } from '../../utils/constants/commonSuccessMsg.constants';
import 'reflect-metadata';
import { ITaskController } from '../../domain/interfaces/controller/taskMng.controller';
import { ICreateTaskUseCase, IDeleteTaskUseCase, IEditTaskUseCase, IGetTasksByProjectIdUseCase, IUpdateTaskStatusUseCase } from '../../domain/interfaces/useCase/task.interface';
import { CreateTaskDTO, DeleteTaskDTO, EditTaskDTO, UpdateTaskStatusDTO } from '../../application/dto/task.dto';
import { AiService } from '../../infrastructure/services/ai.service';

/**
 * @class TaskController
 * Implements ITaskController and manages Task endpoints using granular Use Cases.
 * @implements {ITaskController}
 */
@injectable()
export class TaskController implements ITaskController {
  
  private createTaskUseCase: ICreateTaskUseCase;
  private editTaskUseCase: IEditTaskUseCase;
  private deleteTaskUseCase: IDeleteTaskUseCase;
  private getTasksByProjectIdUseCase: IGetTasksByProjectIdUseCase;
  private updateTaskStatusUseCase: IUpdateTaskStatusUseCase;
  private aiService: AiService;

  /**
   * @constructor
   * Injects granular Task Use Case interfaces and the AI Service.
   */
  constructor(
    @inject(TYPES.ICreateTaskUseCase) createTaskUseCase: ICreateTaskUseCase,
    @inject(TYPES.IEditTaskUseCase) editTaskUseCase: IEditTaskUseCase,
    @inject(TYPES.IDeleteTaskUseCase) deleteTaskUseCase: IDeleteTaskUseCase,
    @inject(TYPES.IGetTasksByProjectIdUseCase) getTasksByProjectIdUseCase: IGetTasksByProjectIdUseCase,
    @inject(TYPES.IUpdateTaskStatusUseCase) updateTaskStatusUseCase: IUpdateTaskStatusUseCase,
    @inject(TYPES.AiService) aiService: AiService,
  ) {
    this.createTaskUseCase = createTaskUseCase;
    this.editTaskUseCase = editTaskUseCase;
    this.deleteTaskUseCase = deleteTaskUseCase;
    this.getTasksByProjectIdUseCase = getTasksByProjectIdUseCase;
    this.updateTaskStatusUseCase = updateTaskStatusUseCase;
    this.aiService = aiService;
    
    this.createTask = this.createTask.bind(this);
    this.editTask = this.editTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.getTasksByProjectId = this.getTasksByProjectId.bind(this);
    this.updateTaskStatus = this.updateTaskStatus.bind(this);
    this.getTaskQnA = this.getTaskQnA.bind(this);
  }

  /**
   * @inheritDoc
   * @route POST /api/projects/:projectId/tasks
   */
  async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const { title, description, status } = req.body;

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new Error('Invalid Project ID format.'));
      }

      const dto = new CreateTaskDTO(projectId, title, description, status);
      
      const task = await this.createTaskUseCase.execute(dto);
      
      sendResponse(res, HttpResCode.CREATED, SuccessMsg.TASK_CREATED, task);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @inheritDoc
   * @route PATCH /api/projects/:projectId/tasks/:taskId
   */
  async editTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { taskId } = req.params;
      const { title, description, status } = req.body;

      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return next(new Error('Invalid Task ID format.'));
      }

      const dto = new EditTaskDTO(taskId, title, description, status);
      const updatedTask = await this.editTaskUseCase.execute(dto);

      sendResponse(res, HttpResCode.OK, SuccessMsg.TASK_UPDATED, updatedTask);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @inheritDoc
   * @route DELETE /api/projects/:projectId/tasks/:taskId
   */
  async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { taskId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return next(new Error('Invalid Task ID format.'));
      }

      const dto = new DeleteTaskDTO(taskId);

      await this.deleteTaskUseCase.execute(dto);
      sendResponse(res, HttpResCode.NO_CONTENT, SuccessMsg.TASK_DELETED);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @inheritDoc
   * @route GET /api/projects/:projectId/tasks
   */
  async getTasksByProjectId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new Error('Invalid Project ID format.'));
      }
      
      const tasks = await this.getTasksByProjectIdUseCase.execute(projectId);
      
      sendResponse(res, HttpResCode.OK, SuccessMsg.TASKS_FETCHED, tasks);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @inheritDoc
   * @route PATCH /api/projects/:projectId/tasks/:taskId/status
   */
  async updateTaskStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { taskId } = req.params;
      const { status } = req.body;

      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return next(new Error('Invalid Task ID format.'));
      }
      if (typeof status !== 'string') {
        return next(new Error('Task status must be provided as a string.'));
      }
      
      const dto = new UpdateTaskStatusDTO(taskId, status);
      
      const updatedTask = await this.updateTaskStatusUseCase.execute(dto);
      
      sendResponse(res, HttpResCode.OK, SuccessMsg.TASK_UPDATED, updatedTask);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @inheritDoc
   * @route POST /api/ai/qna/:taskId
   */
  async getTaskQnA(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { taskId } = req.params;
      const { question } = req.body;

      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return next(new Error('Invalid Task ID format.'));
      }

      if (!question || typeof question !== 'string') {
        return next(new Error('A "question" string is required in the body.'));
      }
      
      const answer = await this.aiService.getTaskQnA(taskId, question);
      
      sendResponse(res, HttpResCode.OK, SuccessMsg.QNA_GENERATED, { question, answer });
    } catch (error) {
      next(error);
    }
  }
}