// src/application/useCases/UpdateTaskStatus.useCase.ts
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { TaskStatus } from '../../domain/models/task.model';
import { IUpdateTaskStatusUseCase } from '../../domain/interfaces/useCase/task.interface';
import { ITaskRepository } from '../../domain/interfaces/repositories/ITaskRepository';
import { TaskResponseDTO, UpdateTaskStatusDTO } from '../dto/task.dto';
import { TYPES } from '../../infrastructure/config/types';
import { CustomError } from '../../utils/errors/custom.error';
import { ErrorMsg } from '../../utils/constants/commonErrorMsg.constants';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';
import { isValidTaskStatus } from '../../utils/helper/isValidStatus';


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
    if (!isValidTaskStatus(dto.status)) {
      throw new CustomError(ErrorMsg.INVALID_TASK_STATUS(dto.status), HttpResCode.BAD_REQUEST);
    }

    const updatedTask = await this.taskRepository.updateTaskStatus(dto.taskId, dto.status as TaskStatus);

    if (!updatedTask) {
      throw new CustomError(ErrorMsg.TASK_WITH_ID_NOT_FOUND(dto.taskId), HttpResCode.NOT_FOUND);
    }

    return new TaskResponseDTO(updatedTask);
  }
}