import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import * as taskController from '../controllers/task.controller';

const router = Router();

// GET /api/ai/summary/:projectId - Gemini AI Project Summary Feature
router.get('/summary/:projectId', projectController.getAiProjectSummaryController);

// POST /api/ai/qna/:taskId - Gemini AI Task Q&A Feature
router.post('/qna/:taskId', taskController.getTaskQnAController);

export default router;