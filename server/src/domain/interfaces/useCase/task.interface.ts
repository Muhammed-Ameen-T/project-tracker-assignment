// src/domain/interfaces/useCases/task.interface.ts
import { ObjectId } from 'mongoose';
import { CreateTaskDTO, TaskResponseDTO, UpdateTaskStatusDTO } from '../../../application/dto/task.dto';

/**
 * @interface ICreateTaskUseCase
 * Contract for creating a single task.
 */
export interface ICreateTaskUseCase {
  execute(dto: CreateTaskDTO): Promise<TaskResponseDTO>;
}

/**
 * @interface IGetTasksByProjectIdUseCase
 * Contract for retrieving all tasks for a given project ID.
 */
export interface IGetTasksByProjectIdUseCase {
  execute(projectId: string | ObjectId): Promise<TaskResponseDTO[]>;
}

/**
 * @interface IUpdateTaskStatusUseCase
 * Contract for updating a task's status.
 */
export interface IUpdateTaskStatusUseCase {
  execute(dto: UpdateTaskStatusDTO): Promise<TaskResponseDTO>;
}