// src/application/useCases/CreateTask.useCase.ts
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/config/types';
import { Types } from 'mongoose'; 
import { ICreateTaskUseCase } from '../../domain/interfaces/useCase/task.interface';
import { IProjectRepository } from '../../domain/interfaces/repositories/IProjectRepository';
import { ITaskRepository } from '../../domain/interfaces/repositories/ITaskRepository';
import { CreateTaskDTO, TaskResponseDTO } from '../dto/task.dto';

/**
 * @class CreateTaskUseCase
 * Handles the single responsibility of validating input and creating a new task.
 * @implements {ICreateTaskUseCase}
 */
@injectable()
export class CreateTaskUseCase implements ICreateTaskUseCase {
  private taskRepository: ITaskRepository;
  private projectRepository: IProjectRepository;

  /**
   * @constructor
   * @param {ITaskRepository} taskRepository - Injected repository for task persistence.
   * @param {IProjectRepository} projectRepository - Injected repository for project validation.
   */
  constructor(
    @inject(TYPES.ITaskRepository) taskRepository: ITaskRepository,
    @inject(TYPES.IProjectRepository) projectRepository: IProjectRepository,
  ) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
  }

  /**
   * Executes the task creation process.
   * @param {CreateTaskDTO} dto - Data Transfer Object containing task details.
   * @returns {Promise<TaskResponseDTO>} The created task's response data.
   * @throws {Error} If validation fails or project is not found.
   */
  async execute(dto: CreateTaskDTO): Promise<TaskResponseDTO> {
    // 1. Validation
    if (!dto.title || dto.title.trim().length === 0) {
      throw new Error('Task title is required.');
    }
    if (!dto.description || dto.description.trim().length === 0) {
      throw new Error('Task description is required.');
    }

    // 2. Business Logic: Check if the project exists (using injected repository contract)
    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) {
      throw new Error(`Project with ID ${dto.projectId} not found. Cannot create task.`);
    }

    const newTaskDocument = await this.taskRepository.createTask(
      new Types.ObjectId(dto.projectId.toString()),
      dto.title.trim(),
      dto.description.trim()
    );

    // 4. Response DTO conversion
    return new TaskResponseDTO(newTaskDocument);
  }
}