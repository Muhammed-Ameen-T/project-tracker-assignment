import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import * as taskController from '../controllers/task.controller.js';

const router = Router();

// --- Project CRUD Routes ---
// POST /api/projects - Create Project
router.post('/', projectController.createProjectController);

// GET /api/projects - Get All Projects
router.get('/', projectController.getAllProjectsController);

// GET /api/projects/:projectId - Get Project by ID
router.get('/:projectId', projectController.getProjectByIdController);

// DELETE /api/projects/:projectId - Delete Project
router.delete('/:projectId', projectController.deleteProjectController);


// --- Task Routes (Nested under Project) ---
// POST /api/projects/:projectId/tasks - Create Task
router.post('/:projectId/tasks', taskController.createTaskController);

// GET /api/projects/:projectId/tasks - Get Tasks by Project ID
router.get('/:projectId/tasks', taskController.getTasksByProjectIdController);


// --- Task Status Update Route ---
// PATCH /api/projects/:projectId/tasks/:taskId/status - Update Task Status
router.patch('/:projectId/tasks/:taskId/status', taskController.updateTaskStatusController);


export default router;