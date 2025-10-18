// src/application/useCases/DeleteProject.useCase.ts
import { injectable, inject } from 'inversify';

import { TYPES } from '../../infrastructure/config/types';
import { ObjectId } from 'mongoose';
import 'reflect-metadata';
import { IDeleteProjectUseCase } from '../../domain/interfaces/useCase/project.interface';
import { IProjectRepository } from '../../domain/interfaces/repositories/IProjectRepository';
import { ProjectResponseDTO } from '../dto/project.dto';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';
import { ErrorMsg } from '../../utils/constants/commonErrorMsg.constants';
import { CustomError } from '../../utils/errors/custom.error';

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
    const deletedProject = await this.projectRepository.delete(projectId);

    if (!deletedProject) {
      throw new CustomError(ErrorMsg.PROJECT_WITH_ID_NOT_FOUND(projectId), HttpResCode.NOT_FOUND);
    }

    return new ProjectResponseDTO(deletedProject);
  }
}