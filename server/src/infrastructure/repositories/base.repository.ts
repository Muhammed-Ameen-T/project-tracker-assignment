// src/infrastructure/db/BaseRepository.ts
import { injectable } from 'inversify';
import { ObjectId, Model } from 'mongoose';
import 'reflect-metadata';
import { IBaseDocument, IRepository } from '../../domain/interfaces/repositories/base.repository';

/**
 * @class BaseRepository
 * Abstract class implementing generic CRUD methods using Mongoose.
 * T: The Mongoose Document Type.
 * D: The Plain Data Type.
 */
@injectable()
export abstract class BaseRepository<T extends IBaseDocument, D> implements IRepository<T, D> {
  protected model: Model<T>;

  /**
   * @param {Model<T>} model - The specific Mongoose Model (injected by subclasses).
   */
  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * @inheritDoc
   */
  async findById(id: string | ObjectId): Promise<D | null> {
    // Cast is necessary because .lean() changes the return type from T to D.
    return this.model.findById(id).lean() as Promise<D | null>; 
  }

  /**
   * @inheritDoc
   */
  async create(data: Partial<D>): Promise<T> {
    const newDocument = new this.model(data);
    return newDocument.save();
  }

  /**
   * @inheritDoc
   */
  async delete(id: string | ObjectId): Promise<D | null> {
    return this.model.findByIdAndDelete(id).lean() as Promise<D | null>;
  }
}