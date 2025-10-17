// src/application/useCases/GetAllProjects.useCase.ts
import { injectable, inject } from 'inversify';

import { TYPES } from '../../infrastructure/config/types';
import 'reflect-metadata';
import { IProjectRepository } from '../../domain/interfaces/repositories/IProjectRepository';
import { ProjectResponseDTO } from '../dto/project.dto';
import { IGetAllProjectsUseCase } from '../../domain/interfaces/useCase/project.interface';

/**
 * @class GetAllProjectsUseCase
 * Handles the single responsibility of retrieving all projects.
 * @implements {IGetAllProjectsUseCase}
 */
@injectable()
export class GetAllProjectsUseCase implements IGetAllProjectsUseCase {
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
   * Executes the project retrieval process.
   * @returns {Promise<ProjectResponseDTO[]>} List of all projects.
   */
  async execute(): Promise<ProjectResponseDTO[]> {
    const projects = await this.projectRepository.findAll();
    
    // Response DTO conversion (maps each plain data object to a DTO)
    return projects.map(p => new ProjectResponseDTO(p));
  }
}