import type { GoogleGenAI } from '@google/genai'; 
import { TaskService } from '../../infrastructure/services/task.service';
import { env } from '../../infrastructure/config/env.config';


let aiClient: GoogleGenAI | any; 
const taskService = new TaskService();

async function getAiClient(): Promise<any> {
  if (!aiClient) {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables.');
    }
    
    const module = await import('@google/genai');
    
    const GenAIClass = module.GoogleGenAI || module.default?.GoogleGenAI || module.default;
    
    if (typeof GenAIClass !== 'function' && typeof GenAIClass !== 'object') {
        throw new Error("Could not find GoogleGenAI class in dynamic import.");
    }
    
    aiClient = new GenAIClass({ apiKey });
  }
  return aiClient;
}

/**
 * Generates a high-level summary of a project's progress using Gemini AI.
 */
export async function getProjectSummary(projectId: string): Promise<string> {
  const ai = await getAiClient(); 
  const tasks = await taskService.findTasksByProjectId(projectId);

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
    The summary should clearly state the total number of tasks, tasks in each status ('To Do', 'In Progress', 'Done'), and a brief overall progress assessment.
    
    Task Data:
    ${JSON.stringify(taskData, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are an expert Project Manager AI. Your task is to analyze task data and provide a professional, concise summary of the project's progress. Be brief and to the point.",
      }
    });

    return response.text;
  } catch (error) {
    console.error('Gemini AI Summary Error:', error);
    throw new Error('Failed to generate project summary from AI.');
  }
}

/**
 * Answers a user question based on a specific task's title and description using Gemini AI.
 */
export async function getTaskQnA(taskId: string, question: string): Promise<string> {
  const ai = await getAiClient(); // Initialize client before use
  const task = await taskService.findTaskById(taskId);

  if (!task) {
    throw new Error('Task not found.');
  }

  const systemContext = `
    You are a Task Assistant AI. Your only source of information is the following Task.
    Answer the user's question ONLY based on the provided Title and Description.
    If the answer cannot be found in the task details, state that clearly.
    
    Task Title: "${task.title}"
    Task Description: "${task.description}"
    Task Status: "${task.status}"
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
    throw new Error('Failed to get answer from AI.');
  }
}