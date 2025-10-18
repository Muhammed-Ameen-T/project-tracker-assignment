// src/domain/interfaces/useCases/project.interface.ts
import { ObjectId } from 'mongoose';
import { CreateProjectDTO, ProjectResponseDTO, UpdateProjectDTO } from '../../../application/dto/project.dto';

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
 * @interface IUpdateProjectUseCase
 * Contract for updating the name and description of an existing project.
 */
export interface IUpdateProjectUseCase {
  /**
   * @param {UpdateProjectDTO} dto
   * @returns {Promise<ProjectResponseDTO>} The updated project's data.
   */
  execute(dto: UpdateProjectDTO): Promise<ProjectResponseDTO>;
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