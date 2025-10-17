// src/domain/interfaces/IRepository.interface.ts
import { ObjectId, Document } from 'mongoose';

/**
 * @typedef {Object} IBaseDocument
 * Generic Mongoose Document type required for all Documents (T).
 */
export interface IBaseDocument extends Document {}

/**
 * @interface IRepository
 * Base Contract for generic CRUD operations.
 * T: The Mongoose Document Type (e.g., IProjectDocument).
 * D: The Plain Data Type (e.g., IProjectData) returned by lean queries.
 */
export interface IRepository<T extends IBaseDocument, D> {
  // Base CRUD methods that all repositories must implement
  findById(id: string | ObjectId): Promise<D | null>;
  create(data: Partial<D>): Promise<T>;
  delete(id: string | ObjectId): Promise<D | null>;
}