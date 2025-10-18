// src/application/useCases/CreateTask.useCase.ts
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/config/types';
import { Types } from 'mongoose'; 
import { ICreateTaskUseCase } from '../../domain/interfaces/useCase/task.interface';
import { IProjectRepository } from '../../domain/interfaces/repositories/IProjectRepository';
import { ITaskRepository } from '../../domain/interfaces/repositories/ITaskRepository';
import { CreateTaskDTO, TaskResponseDTO } from '../dto/task.dto';
import { CustomError } from '../../utils/errors/custom.error';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';
import { ErrorMsg } from '../../utils/constants/commonErrorMsg.constants';

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
    if (!dto.title || dto.title.trim().length === 0) {
      throw new CustomError(ErrorMsg.TASK_TITLE_REQUIRED, HttpResCode.BAD_REQUEST);
    }
    if (!dto.description || dto.description.trim().length === 0) {
      throw new CustomError(ErrorMsg.TASK_DESCRIPTION_REQUIRED, HttpResCode.BAD_REQUEST);
    }

    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) {
      throw new CustomError(ErrorMsg.PROJECT_WITH_ID_NOT_FOUND(dto.projectId), HttpResCode.NOT_FOUND);
    }

    const newTaskDocument = await this.taskRepository.createTask(
      new Types.ObjectId(dto.projectId.toString()),
      dto.title.trim(),
      dto.description.trim(),
      dto.status.trim()
    );

    return new TaskResponseDTO(newTaskDocument);
  }
}