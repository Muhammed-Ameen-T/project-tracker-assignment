// src/domain/interfaces/IProjectRepository.ts
import { ObjectId, Document } from 'mongoose';
import { IProjectData } from '../../models/project.model';

/**
 * @typedef {Object} IProjectDocument
 * Mongoose Document interface for Project (includes Mongoose methods).
 */
export interface IProjectDocument extends IProjectData, Document {}


/**
 * @interface IProjectRepository
 * Contract for Project data persistence operations (CRUD).
 */
export interface IProjectRepository {
  /**
   * Retrieves all projects as plain data.
   * @returns {Promise<IProjectData[]>}
   */
  findAll(): Promise<IProjectData[]>;

  /**
   * Finds a project by ID.
   * @param {string | ObjectId} id
   * @returns {Promise<IProjectData | null>}
   */
  findById(id: string | ObjectId): Promise<IProjectData | null>;

  /**
   * Creates a new project.
   * @param {Partial<IProjectData>} data - Project data (name, description).
   * @returns {Promise<IProjectDocument>}
   */
  create(data: Partial<IProjectData>): Promise<IProjectDocument>;

  /**
   * Updates an existing project.
   * @param {string | ObjectId} id
   * @param {Partial<IProjectData>} updateData
   * @returns {Promise<IProjectData | null>}
   */
  update(id: string | ObjectId, updateData: Partial<IProjectData>): Promise<IProjectData | null>;

  /**
   * Deletes a project by its ID.
   * @param {string | ObjectId} id
   * @returns {Promise<IProjectData | null>}
   */
  delete(id: string | ObjectId): Promise<IProjectData | null>;
}