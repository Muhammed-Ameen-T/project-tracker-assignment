import { ProjectService } from '../services/project.service';
import { IProject } from '../db/Project.model';
import { ObjectId } from 'mongoose';

const projectService = new ProjectService();

/**
 * Use Case: Retrieves all projects.
 */
export async function getAllProjects(): Promise<IProject[]> {
  return projectService.findAllProjects();
}

/**
 * Use Case: Creates a new project with basic validation.
 */
export async function createProject(name: string, description: string): Promise<IProject> {
  if (!name || name.trim().length === 0) {
    throw new Error('Project name is required.');
  }
  if (!description || description.trim().length === 0) {
    throw new Error('Project description is required.');
  }

  return projectService.createProject(name.trim(), description.trim());
}

/**
 * Use Case: Retrieves a project by ID with existence check.
 */
export async function getProjectById(id: string | ObjectId): Promise<IProject> {
  const project = await projectService.findProjectById(id);
  if (!project) {
    throw new Error(`Project with ID ${id} not found.`);
  }
  return project;
}

/**
 * Use Case: Deletes a project.
 */
export async function deleteProject(id: string | ObjectId): Promise<IProject> {
  const project = await projectService.deleteProject(id);
  if (!project) {
    throw new Error(`Project with ID ${id} not found for deletion.`);
  }
  // NOTE: In a real app, we'd also delete all associated tasks here.
  return project;
}