import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/config/types';
import 'reflect-metadata';
import { ICreateProjectUseCase } from '../../domain/interfaces/useCase/project.interface';
import { IProjectRepository } from '../../domain/interfaces/repositories/IProjectRepository';
import { CreateProjectDTO, ProjectResponseDTO } from '../dto/project.dto';
import { CustomError } from '../../utils/errors/custom.error';
import { ErrorMsg } from '../../utils/constants/commonErrorMsg.constants';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';

/**
 * @class CreateProjectUseCase
 * Handles the single responsibility of validating data and creating a new Project.
 * @implements {ICreateProjectUseCase}
 */
@injectable()
export class CreateProjectUseCase implements ICreateProjectUseCase {
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
   * Executes the project creation process.
   * @param {CreateProjectDTO} dto - Data Transfer Object containing project details.
   * @returns {Promise<ProjectResponseDTO>} The created project's response data.
   * @throws {Error} If validation fails.
   */
  async execute(dto: CreateProjectDTO): Promise<ProjectResponseDTO> {
    if (!dto.name || dto.name.trim().length === 0) {
      throw new CustomError(ErrorMsg.PROJECT_NAME_REQUIRED, HttpResCode.BAD_REQUEST);
    }
    if (!dto.description || dto.description.trim().length === 0) {
      throw new CustomError(ErrorMsg.PROJECT_DESCRIPTION_REQUIRED, HttpResCode.BAD_REQUEST);
    }

    const newProjectDocument = await this.projectRepository.create({
      name: dto.name.trim(),
      description: dto.description.trim(),
    });

    return new ProjectResponseDTO(newProjectDocument);
  }
}