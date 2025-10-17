// src/presentation/routes/ai.route.ts
import { Router } from 'express';
import { container } from '../../infrastructure/config/inversify.config';
import { TYPES } from '../../infrastructure/config/types';
import { ProjectController } from '../controllers/project.controller';
import { TaskController } from '../controllers/task.controller';

const router = Router();

const projectController = container.get<ProjectController>(TYPES.ProjectController);
const taskController = container.get<TaskController>(TYPES.TaskController);

router.get('/summary/:projectId', projectController.getProjectSummary);
router.post('/qna/:taskId', taskController.getTaskQnA);

export default router;