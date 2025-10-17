import { ProjectModel, IProject } from '../db/Project.model';
import { ObjectId } from 'mongoose';

/**
 * Low-level Service Layer for Project CRUD operations.
 * Directly interacts with the Mongoose model.
 */
export class ProjectService {

  /**
   * Retrieves all projects.
   */
  async findAllProjects(): Promise<IProject[]> {
    return ProjectModel.find({}).lean();
  }

  /**
   * Retrieves a project by its ID.
   */
  async findProjectById(id: string | ObjectId): Promise<IProject | null> {
    return ProjectModel.findById(id).lean();
  }

  /**
   * Creates a new project.
   */
  async createProject(name: string, description: string): Promise<IProject> {
    const newProject = new ProjectModel({ name, description });
    return newProject.save();
  }

  /**
   * Updates an existing project.
   */
  async updateProject(id: string | ObjectId, updateData: Partial<{ name: string; description: string }>): Promise<IProject | null> {
    return ProjectModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }

  /**
   * Deletes a project by its ID.
   */
  async deleteProject(id: string | ObjectId): Promise<IProject | null> {
    return ProjectModel.findByIdAndDelete(id).lean();
  }
}