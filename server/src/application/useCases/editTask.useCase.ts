// src/application/useCases/EditTask.useCase.ts
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/config/types';
import 'reflect-metadata';
import { CustomError } from '../../utils/errors/custom.error';
import { ErrorMsg } from '../../utils/constants/commonErrorMsg.constants';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';
import { EditTaskDTO, TaskResponseDTO } from '../dto/task.dto';
import { IEditTaskUseCase } from '../../domain/interfaces/useCase/task.interface';
import { ITaskRepository } from '../../domain/interfaces/repositories/ITaskRepository';
/**
 * @class EditTaskUseCase
 * Handles the single responsibility of updating a task's details.
 * @implements {IEditTaskUseCase}
 */
@injectable()
export class EditTaskUseCase implements IEditTaskUseCase {
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
   * Executes the task update process, including metadata and status.
   * @param {EditTaskDTO} dto
   * @returns {Promise<TaskResponseDTO>} The updated task data.
   * @throws {Error} If task is not found.
   */
  async execute(dto: EditTaskDTO): Promise<TaskResponseDTO> {
    if (!dto.title || dto.title.trim().length === 0) {
      throw new CustomError(ErrorMsg.TASK_TITLE_REQUIRED, HttpResCode.BAD_REQUEST);
    }

    const updatedTask = await this.taskRepository.editTask(
      dto.taskId,
      dto.title,
      dto.description,
      dto.status,
    ); 

    if (!updatedTask) {
      throw new CustomError(ErrorMsg.TASK_WITH_ID_NOT_FOUND(dto.taskId), HttpResCode.NOT_FOUND);
    }

    const fullyUpdatedTask = await this.taskRepository.findTaskById(dto.taskId);

    return new TaskResponseDTO(fullyUpdatedTask || updatedTask);
  }
}