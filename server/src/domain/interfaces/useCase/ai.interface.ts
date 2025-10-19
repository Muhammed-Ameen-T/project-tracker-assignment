/**
 * @interface IAISummaryUseCase
 * Contract for generating a project summary.
 */
export interface IAISummaryUseCase {
  /**
   * Generates an AI summary for a given project.
   * @param {string} projectId
   * @returns {Promise<object>} Object containing the summary string.
   */
  execute(projectId: string): Promise<{ summary: string }>;
}

/**
 * @interface IAIQnAUseCase
 * Contract for handling task-specific Q&A with the AI.
 */
export interface IAIQnAUseCase {
  /**
   * Gets an AI answer for a task question.
   * @param {string} taskId
   * @param {string} question
   * @returns {Promise<object>} Object containing the question and answer strings.
   */
  execute(taskId: string, question: string): Promise<{ question: string; answer: string }>;
}