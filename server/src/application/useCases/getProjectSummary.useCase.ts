import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/config/types';
import { AiService } from '../../infrastructure/services/ai.service';
import { IAISummaryUseCase } from '../../domain/interfaces/useCase/ai.interface';
import { IGetProjectByIdUseCase } from '../../domain/interfaces/useCase/project.interface'; 
import 'reflect-metadata';

/**
 * @class GetProjectSummaryUseCase
 * Application logic for generating an AI summary, relying on IGetProjectByIdUseCase for pre-validation.
 * @implements {IAISummaryUseCase}
 */
@injectable()
export class GetProjectSummaryUseCase implements IAISummaryUseCase {
  
  private aiService: AiService;
  private getProjectByIdUseCase: IGetProjectByIdUseCase;

  /**
   * @constructor
   * Injects the required AI service and project validation use case.
   */
  constructor(
    @inject(TYPES.AiService) aiService: AiService,
    @inject(TYPES.IGetProjectByIdUseCase) getProjectByIdUseCase: IGetProjectByIdUseCase,
  ) {
    this.aiService = aiService;
    this.getProjectByIdUseCase = getProjectByIdUseCase;
  }

  /**
   * @inheritDoc
   */
  async execute(projectId: string): Promise<{ summary: string }> {
    await this.getProjectByIdUseCase.execute(projectId);

    const summary = await this.aiService.getProjectSummary(projectId);

    return { summary };
  }
}