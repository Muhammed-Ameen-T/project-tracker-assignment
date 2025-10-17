// src/domain/interfaces/useCases/project.interface.ts
import { ObjectId } from 'mongoose';
import { CreateProjectDTO, ProjectResponseDTO } from '../../../application/dto/project.dto';

/**
 * @interface ICreateProjectUseCase
 * Contract for creating a single project.
 */
export interface ICreateProjectUseCase {
  /**
   * @param {CreateProjectDTO} dto
   * @returns {Promise<ProjectResponseDTO>}
   */
  execute(dto: CreateProjectDTO): Promise<ProjectResponseDTO>;
}

/**
 * @interface IGetProjectByIdUseCase
 * Contract for retrieving a single project.
 */
export interface IGetProjectByIdUseCase {
  /**
   * @param {string | ObjectId} projectId
   * @returns {Promise<ProjectResponseDTO>}
   */
  execute(projectId: string | ObjectId): Promise<ProjectResponseDTO>;
}

/**
 * @interface IGetAllProjectsUseCase
 * Contract for retrieving all projects.
 */
export interface IGetAllProjectsUseCase {
  /**
   * @returns {Promise<ProjectResponseDTO[]>}
   */
  execute(): Promise<ProjectResponseDTO[]>;
}

/**
 * @interface IDeleteProjectUseCase
 * Contract for deleting a single project.
 */
export interface IDeleteProjectUseCase {
  /**
   * @param {string | ObjectId} projectId
   * @returns {Promise<ProjectResponseDTO>}
   */
  execute(projectId: string | ObjectId): Promise<ProjectResponseDTO>;
}