// src/application/useCases/UpdateTaskStatus.useCase.ts
import { injectable, inject } from 'inversify';

import 'reflect-metadata';
import { TaskStatus } from '../../domain/models/task.model';
import { IUpdateTaskStatusUseCase } from '../../domain/interfaces/useCase/task.interface';
import { ITaskRepository } from '../../domain/interfaces/repositories/ITaskRepository';
import { TaskResponseDTO, UpdateTaskStatusDTO } from '../dto/task.dto';
import { TYPES } from '../../infrastructure/config/types';

/**
 * Validates if a string is a valid TaskStatus.
 */
function isValidTaskStatus(status: string): status is TaskStatus {
  return ['To Do', 'In Progress', 'Done'].includes(status);
}

/**
 * @class UpdateTaskStatusUseCase
 * Handles the single responsibility of updating a task's status with validation.
 * @implements {IUpdateTaskStatusUseCase}
 */
@injectable()
export class UpdateTaskStatusUseCase implements IUpdateTaskStatusUseCase {
  private taskRepository: ITaskRepository;

  /**
   * @constructor
   * @param {ITaskRepository} taskRepository - Injected repository for task persistence.
   */
  constructor(
    @inject(TYPES.ITaskRepository) taskRepository: ITaskRepository,
  ) {
    this.taskRepository = taskRepository;
  }

  /**
   * Executes the task status update process.
   * @param {UpdateTaskStatusDTO} dto - Data Transfer Object containing task ID and new status.
   * @returns {Promise<TaskResponseDTO>} The updated task's response data.
   * @throws {Error} If status is invalid or task is not found.
   */
  async execute(dto: UpdateTaskStatusDTO): Promise<TaskResponseDTO> {
    // 1. Validation for status format
    if (!isValidTaskStatus(dto.status)) {
      throw new Error(`Invalid status: ${dto.status}. Must be 'To Do', 'In Progress', or 'Done'.`);
    }

    // 2. Repository Call
    const updatedTask = await this.taskRepository.updateTaskStatus(dto.taskId, dto.status as TaskStatus);

    if (!updatedTask) {
      throw new Error(`Task with ID ${dto.taskId} not found for status update.`);
    }

    // 3. Response DTO conversion
    return new TaskResponseDTO(updatedTask);
  }
}