import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/config/types';
import 'reflect-metadata';
import { ITaskRepository } from '../../domain/interfaces/repositories/ITaskRepository';
import { CustomError } from '../../utils/errors/custom.error';
import { env } from '../config/env.config';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';
import { ErrorMsg } from '../../utils/constants/commonErrorMsg.constants';

/**
 * Initializes and returns the Gemini AI client using the dynamic import pattern.
 * This is necessary for ESM compatibility in a mixed module environment.
 * @returns {Promise<any>} The initialized GoogleGenAI client instance.
 */
async function getAiClient(): Promise<any> {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables.');
    }
    
    // Dynamic import to load the ESM module at runtime
    const module = await import('@google/genai');
    
    // Robust check for the class location (named, default, or nested)
    const GenAIClass = module.GoogleGenAI || module.default?.GoogleGenAI || module.default;
    
    if (typeof GenAIClass !== 'function' && typeof GenAIClass !== 'object') {
        throw new Error("Could not find GoogleGenAI class in dynamic import.");
    }
    
    return new GenAIClass({ apiKey });
}

/**
 * @class AiService
 * Handles all interactions with the Gemini AI SDK.
 * This layer is independent of Use Cases and Controllers, following the Dependency Inversion Principle (DIP).
 */
@injectable()
export class AiService {
  private taskRepository: ITaskRepository;
  private aiClient: any;

  /**
   * @constructor
   * @param {ITaskRepository} taskRepository - Injected concrete repository contract for data access.
   */
  constructor(
    @inject(TYPES.ITaskRepository) taskRepository: ITaskRepository,
  ) {
    this.taskRepository = taskRepository;
  }
  
  /**
   * Lazy initializes the AI client instance.
   * @returns {Promise<any>}
   */
  private async getClient() {
    if (!this.aiClient) {
      this.aiClient = await getAiClient();
    }
    return this.aiClient;
  }


  /**
   * Generates a high-level summary of a project's progress based on task data.
   * @param {string} projectId
   * @returns {Promise<string>} A concise summary string.
   */
  async getProjectSummary(projectId: string): Promise<string> {
    const ai = await this.getClient();
    const tasks = await this.taskRepository.findTasksByProjectId(projectId);

    if (tasks.length === 0) {
      return 'This project has no tasks yet. Cannot generate a summary.';
    }

    const taskData = tasks.map(t => ({
      title: t.title,
      status: t.status,
    }));

    const prompt = `
      Analyze the following list of tasks and their statuses.
      Generate a concise, high-level summary of the project's progress and status breakdown.
      Task Data: ${JSON.stringify(taskData, null, 2)}
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: "You are an expert Project Manager AI. Provide a professional, concise summary.",
        }
      });

      return response.text;
    } catch (error) {
      console.error('Gemini AI Summary Error:', error);
      throw new Error('Failed to generate project summary from AI.');
    }
  }

  /**
   * Answers a user question based on a specific task's details, using task data as context.
   * @param {string} taskId
   * @param {string} question
   * @returns {Promise<string>} The AI's answer.
   */
  async getTaskQnA(taskId: string, question: string): Promise<string> {
    const ai = await this.getClient();
    const task = await this.taskRepository.findTaskById(taskId);

    if (!task) {
      throw new CustomError(ErrorMsg.TASK_NOT_FOUND, HttpResCode.NOT_FOUND);
    }

    const systemContext = `
      You are a Task Assistant AI. Answer the user's question ONLY based on the following Task details.
      Task Title: "${task.title}"
      Task Description: "${task.description}"
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: question }] }],
        config: {
          systemInstruction: systemContext,
        }
      });

      return response.text;
    } catch (error) {
      console.error('Gemini AI Q&A Error:', error);
      throw new  CustomError(ErrorMsg.FAILED_TO_GET_AI_ANSWER, HttpResCode.INTERNAL_SERVER_ERROR);
    }
  }
}