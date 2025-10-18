// src/domain/interfaces/useCases/task.interface.ts
import { ObjectId } from 'mongoose';
import { CreateTaskDTO, DeleteTaskDTO, EditTaskDTO, TaskResponseDTO, UpdateTaskStatusDTO } from '../../../application/dto/task.dto';

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

/**
 * @interface IEditTaskUseCase
 * Contract for updating all fields of an existing task.
 */
export interface IEditTaskUseCase {
  execute(dto: EditTaskDTO): Promise<TaskResponseDTO>;
}

/**
 * @interface IDeleteTaskUseCase
 * Contract for deleting a task.
 */
export interface IDeleteTaskUseCase {
  execute(dto: DeleteTaskDTO): Promise<TaskResponseDTO>;
}