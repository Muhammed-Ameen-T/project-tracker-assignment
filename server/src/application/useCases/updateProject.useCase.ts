// src/application/useCase/UpdateProject.useCase.ts
import { injectable, inject } from 'inversify';
import { IUpdateProjectUseCase } from '../../domain/interfaces/useCase/project.interface';
import { UpdateProjectDTO, ProjectResponseDTO } from '../dto/project.dto';
import { TYPES } from '../../infrastructure/config/types';
import 'reflect-metadata';
import { IProjectRepository } from '../../domain/interfaces/repositories/IProjectRepository';
import { CustomError } from '../../utils/errors/custom.error';
import { ErrorMsg } from '../../utils/constants/commonErrorMsg.constants';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';

/**
 * @class UpdateProjectUseCase
 * Handles the single responsibility of updating an existing Project entity's core details.
 * @implements {IUpdateProjectUseCase}
 */
@injectable()
export class UpdateProjectUseCase implements IUpdateProjectUseCase {
  
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
   * Executes the project update process.
   * @param {UpdateProjectDTO} dto - DTO containing project ID and fields to update.
   * @returns {Promise<ProjectResponseDTO>} The data of the updated project.
   * @throws {Error} If the project is not found or validation fails.
   */
  async execute(dto: UpdateProjectDTO): Promise<ProjectResponseDTO> {
    if (!dto.name || dto.name.trim().length === 0) {
      throw new CustomError(ErrorMsg.PROJECT_NAME_REQUIRED, HttpResCode.BAD_REQUEST);
    }
    if (!dto.description || dto.description.trim().length === 0) {
      throw new CustomError(ErrorMsg.PROJECT_DESCRIPTION_REQUIRED, HttpResCode.BAD_REQUEST);
    }

    const updatedProject = await this.projectRepository.update(
      dto.projectId, 
      { name: dto.name.trim(), description: dto.description.trim() }
    );

    if (!updatedProject) {
      throw new CustomError(ErrorMsg.PROJECT_WITH_ID_NOT_FOUND(dto.projectId), HttpResCode.NOT_FOUND);
    }

    return new ProjectResponseDTO(updatedProject);
  }
}