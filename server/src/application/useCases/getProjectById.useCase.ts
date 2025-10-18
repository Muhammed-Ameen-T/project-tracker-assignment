// src/application/useCases/GetProjectById.useCase.ts
import { injectable, inject } from 'inversify';

import { TYPES } from '../../infrastructure/config/types';
import { ObjectId } from 'mongoose';
import 'reflect-metadata';
import { IGetProjectByIdUseCase } from '../../domain/interfaces/useCase/project.interface';
import { IProjectRepository } from '../../domain/interfaces/repositories/IProjectRepository';
import { ProjectResponseDTO } from '../dto/project.dto';
import { CustomError } from '../../utils/errors/custom.error';
import { ErrorMsg } from '../../utils/constants/commonErrorMsg.constants';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';

/**
 * @class GetProjectByIdUseCase
 * Handles the single responsibility of retrieving a single project by ID.
 * @implements {IGetProjectByIdUseCase}
 */
@injectable()
export class GetProjectByIdUseCase implements IGetProjectByIdUseCase {
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
   * Executes the retrieval process.
   * @param {string | ObjectId} projectId
   * @returns {Promise<ProjectResponseDTO>} The found project's response data.
   * @throws {Error} If project is not found.
   */
  async execute(projectId: string | ObjectId): Promise<ProjectResponseDTO> {
    const project = await this.projectRepository.findById(projectId);
    
    if (!project) {
      throw new CustomError(ErrorMsg.PROJECT_WITH_ID_NOT_FOUND(projectId), HttpResCode.NOT_FOUND);
    }

    return new ProjectResponseDTO(project);
  }
}