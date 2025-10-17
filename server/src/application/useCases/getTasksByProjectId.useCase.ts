// src/application/useCases/GetTasksByProjectId.useCase.ts
import { injectable, inject } from 'inversify';

import { TYPES } from '../../infrastructure/config/types';
import { ObjectId } from 'mongoose';
import 'reflect-metadata';
import { IGetTasksByProjectIdUseCase } from '../../domain/interfaces/useCase/task.interface';
import { ITaskRepository } from '../../domain/interfaces/repositories/ITaskRepository';
import { IProjectRepository } from '../../domain/interfaces/repositories/IProjectRepository';
import { TaskResponseDTO } from '../dto/task.dto';

/**
 * @class GetTasksByProjectIdUseCase
 * Handles the single responsibility of retrieving all tasks for a project.
 * @implements {IGetTasksByProjectIdUseCase}
 */
@injectable()
export class GetTasksByProjectIdUseCase implements IGetTasksByProjectIdUseCase {
  private taskRepository: ITaskRepository;
  private projectRepository: IProjectRepository;

  /**
   * @constructor
   * @param {ITaskRepository} taskRepository
   * @param {IProjectRepository} projectRepository
   */
  constructor(
    @inject(TYPES.ITaskRepository) taskRepository: ITaskRepository,
    @inject(TYPES.IProjectRepository) projectRepository: IProjectRepository,
  ) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
  }

  /**
   * Executes the task retrieval process for a specific project.
   * @param {string | ObjectId} projectId
   * @returns {Promise<TaskResponseDTO[]>} List of tasks for the project.
   * @throws {Error} If project is not found.
   */
  async execute(projectId: string | ObjectId): Promise<TaskResponseDTO[]> {
    // 1. Business Logic: Ensure project exists
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found.`);
    }

    // 2. Repository Call
    const tasks = await this.taskRepository.findTasksByProjectId(projectId);

    return tasks.map(t => new TaskResponseDTO(t));
  }
}