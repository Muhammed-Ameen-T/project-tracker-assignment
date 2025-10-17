// src/infrastructure/db/ProjectRepository.ts
import { injectable } from 'inversify';
import { ObjectId } from 'mongoose';

import 'reflect-metadata'; 
import { BaseRepository } from './base.repository';
import { IProjectDocument, IProjectRepository } from '../../domain/interfaces/repositories/IProjectRepository';
import { ProjectModel } from '../db/project.model';
import { IProjectData } from '../../domain/models/project.model';

/**
 * @class ProjectRepository
 * Concrete Mongoose implementation of the IProjectRepository contract.
 * Inherits Mongoose setup from BaseRepository.
 * @implements {IProjectRepository}
 */
@injectable()
export class ProjectRepository extends BaseRepository<IProjectDocument, IProjectData> implements IProjectRepository {

  /**
   * @constructor
   * Passes the ProjectModel to the BaseRepository constructor.
   */
  constructor() {
    super(ProjectModel);
  }

  /**
   * @inheritDoc
   */
  async findAll(): Promise<IProjectData[]> {
    return this.model.find({}).lean();
  }

  /**
   * @inheritDoc (Inherited from BaseRepository)
   * This is explicitly implemented here to satisfy IProjectRepository if it wasn't extending IRepository, 
   * but calling super.findById ensures the base logic is used.
   */
  async findById(id: string | ObjectId): Promise<IProjectData | null> {
    return super.findById(id); 
  }

  /**
   * @inheritDoc (Inherited from BaseRepository)
   */
  async create(data: Partial<IProjectData>): Promise<IProjectDocument> {
    return super.create(data); 
  }

  /**
   * @inheritDoc (This method is Project-specific on your interface, even though it matches a generic delete)
   */
  async delete(id: string | ObjectId): Promise<IProjectData | null> {
    return super.delete(id); 
  }
  
  /**
   * @inheritDoc
   */
  async update(id: string | ObjectId, updateData: Partial<IProjectData>): Promise<IProjectData | null> {
    return this.model.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }
}