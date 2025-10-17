// src/application/useCases/DeleteProject.useCase.ts
import { injectable, inject } from 'inversify';

import { TYPES } from '../../infrastructure/config/types';
import { ObjectId } from 'mongoose';
import 'reflect-metadata';
import { IDeleteProjectUseCase } from '../../domain/interfaces/useCase/project.interface';
import { IProjectRepository } from '../../domain/interfaces/repositories/IProjectRepository';
import { ProjectResponseDTO } from '../dto/project.dto';

/**
 * @class DeleteProjectUseCase
 * Handles the single responsibility of deleting a Project entity.
 * @implements {IDeleteProjectUseCase}
 */
@injectable()
export class DeleteProjectUseCase implements IDeleteProjectUseCase {
  /**
   * @private
   * @type {IProjectRepository}
   */
  private projectRepository: IProjectRepository;

  /**
   * @constructor
   * @param {IProjectRepository} projectRepository - Injected concrete repository implementation.
   */
  constructor(
    @inject(TYPES.IProjectRepository) projectRepository: IProjectRepository,
  ) {
    this.projectRepository = projectRepository;
  }

  /**
   * Executes the project deletion process.
   * @param {string | ObjectId} projectId - The ID of the project to delete.
   * @returns {Promise<ProjectResponseDTO>} The data of the deleted project.
   * @throws {Error} If the project is not found.
   */
  async execute(projectId: string | ObjectId): Promise<ProjectResponseDTO> {
    // 1. Repository Call (Deletion attempts to delete and returns the deleted object's data)
    const deletedProject = await this.projectRepository.delete(projectId);

    // 2. Validation
    if (!deletedProject) {
      throw new Error(`Project with ID ${projectId} not found for deletion.`);
    }

    // 3. Response DTO conversion
    return new ProjectResponseDTO(deletedProject);
    
    // NOTE: In a complete system, task deletion logic would be triggered here by 
    // an injected TaskManagementService to maintain data integrity (Cascade Delete).
  }
}