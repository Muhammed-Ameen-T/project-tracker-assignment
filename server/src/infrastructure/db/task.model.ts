import mongoose, { Schema } from 'mongoose';
import { ITaskDocument } from '../../domain/interfaces/repositories/ITaskRepository';

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do',
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
});

export const TaskModel = mongoose.model<ITaskDocument>('Task', TaskSchema);