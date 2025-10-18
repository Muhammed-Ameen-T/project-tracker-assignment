// src/application/useCases/DeleteTask.useCase.ts
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/config/types';
import 'reflect-metadata';
import { IDeleteTaskUseCase } from '../../domain/interfaces/useCase/task.interface';
import { ITaskRepository } from '../../domain/interfaces/repositories/ITaskRepository';
import { DeleteTaskDTO, TaskResponseDTO } from '../dto/task.dto';
import { CustomError } from '../../utils/errors/custom.error';
import { ErrorMsg } from '../../utils/constants/commonErrorMsg.constants';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';

/**
 * @class DeleteTaskUseCase
 * Handles the single responsibility of deleting a Task entity.
 * @implements {IDeleteTaskUseCase}
 */
@injectable()
export class DeleteTaskUseCase implements IDeleteTaskUseCase {
  private taskRepository: ITaskRepository;

  /**
   * @constructor
   */
  constructor(
    @inject(TYPES.ITaskRepository) taskRepository: ITaskRepository,
  ) {
    this.taskRepository = taskRepository;
  }

  /**
   * Executes the task deletion process.
   * @param {DeleteTaskDTO} dto
   * @returns {Promise<TaskResponseDTO>} The deleted task data.
   * @throws {Error} If task is not found.
   */
  async execute(dto: DeleteTaskDTO): Promise<TaskResponseDTO> {
    const deletedTask = await this.taskRepository.deleteTask(dto.taskId);

    if (!deletedTask) {
      throw new CustomError(ErrorMsg.TASK_WITH_ID_NOT_FOUND(dto.taskId), HttpResCode.NOT_FOUND);
    }

    return new TaskResponseDTO(deletedTask);
  }
}