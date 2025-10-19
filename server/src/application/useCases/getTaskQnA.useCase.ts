import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/config/types';
import { AiService } from '../../infrastructure/services/ai.service';
import { IAIQnAUseCase } from '../../domain/interfaces/useCase/ai.interface';
import { ITaskRepository } from '../../domain/interfaces/repositories/ITaskRepository'; 
import { CustomError } from '../../utils/errors/custom.error'; 
import { ErrorMsg } from '../../utils/constants/commonErrorMsg.constants'; 
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils'; 
import 'reflect-metadata';

/**
 * @class GetTaskQnAUseCase
 * Application logic for generating an AI Q&A response for a task.
 * @implements {IAIQnAUseCase}
 */
@injectable()
export class GetTaskQnAUseCase implements IAIQnAUseCase {
  
  private aiService: AiService;
  private taskRepository: ITaskRepository;

  /**
   * @constructor
   * Injects the required AI service and task repository for validation.
   */
  constructor(
    @inject(TYPES.AiService) aiService: AiService,
    @inject(TYPES.ITaskRepository) taskRepository: ITaskRepository,
  ) {
    this.aiService = aiService;
    this.taskRepository = taskRepository;
  }

  /**
   * @inheritDoc
   */
  async execute(taskId: string, question: string): Promise<{ question: string; answer: string }> {
    const task = await this.taskRepository.findTaskById(taskId);
    if (!task) {
      throw new CustomError(ErrorMsg.TASK_NOT_FOUND, HttpResCode.NOT_FOUND);
    }
    
    const answer = await this.aiService.getTaskQnA(taskId, question);

    return { question, answer };
  }
}