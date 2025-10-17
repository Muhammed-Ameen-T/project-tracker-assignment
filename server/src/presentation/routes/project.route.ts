// src/presentation/routes/project.route.ts
import { Router } from 'express';
import { container } from '../../infrastructure/config/inversify.config';
import { TYPES } from '../../infrastructure/config/types';
import { ProjectController } from '../controllers/project.controller';
import { TaskController } from '../controllers/task.controller';

const router = Router();

const projectController = container.get<ProjectController>(TYPES.ProjectController);
const taskController = container.get<TaskController>(TYPES.TaskController);

// --- Project CRUD Routes ---
router.post('/', projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:projectId', projectController.getProjectById);
router.delete('/:projectId', projectController.deleteProject);

// --- Task Routes (Nested under Project) ---
router.post('/:projectId/tasks', taskController.createTask);
router.get('/:projectId/tasks', taskController.getTasksByProjectId);

// --- Task Status Update Route ---
router.patch('/:projectId/tasks/:taskId/status', taskController.updateTaskStatus);


export default router;