import mongoose, { Schema } from 'mongoose';
import { IProjectDocument } from '../../domain/interfaces/repositories/IProjectRepository';

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const ProjectModel = mongoose.model<IProjectDocument>('Project', ProjectSchema);