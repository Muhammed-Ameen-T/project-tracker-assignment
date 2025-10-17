// src/infrastructure/config/inversify.config.ts
import { Container } from 'inversify';
import { TYPES } from './types';
import { ProjectRepository } from '../repositories/project.repository';
import { IProjectRepository } from '../../domain/interfaces/repositories/IProjectRepository';
import { CreateProjectUseCase } from '../../application/useCases/createProject.useCase';
import { GetProjectByIdUseCase } from '../../application/useCases/getProjectById.useCase';
import { GetAllProjectsUseCase } from '../../application/useCases/getAllProjects.useCase';
import { ICreateProjectUseCase, IDeleteProjectUseCase, IGetAllProjectsUseCase, IGetProjectByIdUseCase } from '../../domain/interfaces/useCase/project.interface';
import { ITaskRepository } from '../../domain/interfaces/repositories/ITaskRepository';
import { GetTasksByProjectIdUseCase } from '../../application/useCases/getTasksByProjectId.useCase';
import { UpdateTaskStatusUseCase } from '../../application/useCases/updateTaskStatus.useCase';
import { CreateTaskUseCase } from '../../application/useCases/createTask.useCase';
import { ICreateTaskUseCase, IGetTasksByProjectIdUseCase, IUpdateTaskStatusUseCase } from '../../domain/interfaces/useCase/task.interface';
import { ProjectController } from '../../presentation/controllers/project.controller';
import { AiService } from '../services/ai.service';
import { TaskRepository } from '../repositories/tast.repository';
import { TaskController } from '../../presentation/controllers/task.controller';
import { DeleteProjectUseCase } from '../../application/useCases/deleteProject.useCase';

const container = new Container();

// --- 1. Repository Bindings ---
container.bind<IProjectRepository>(TYPES.IProjectRepository).to(ProjectRepository);
container.bind<ITaskRepository>(TYPES.ITaskRepository).to(TaskRepository);


// --- 2. Concrete Use Case Bindings ---
container.bind(TYPES.CreateProjectUseCase).to(CreateProjectUseCase);
container.bind(TYPES.GetProjectByIdUseCase).to(GetProjectByIdUseCase);
container.bind(TYPES.GetAllProjectsUseCase).to(GetAllProjectsUseCase);

container.bind(TYPES.CreateTaskUseCase).to(CreateTaskUseCase); 
container.bind(TYPES.GetTasksByProjectIdUseCase).to(GetTasksByProjectIdUseCase); 
container.bind(TYPES.UpdateTaskStatusUseCase).to(UpdateTaskStatusUseCase); 

// --- 3. Use Case Interface Bindings ---
container.bind<ICreateProjectUseCase>(TYPES.ICreateProjectUseCase).to(CreateProjectUseCase);
container.bind<IGetProjectByIdUseCase>(TYPES.IGetProjectByIdUseCase).to(GetProjectByIdUseCase);
container.bind<IGetAllProjectsUseCase>(TYPES.IGetAllProjectsUseCase).to(GetAllProjectsUseCase);
container.bind<IDeleteProjectUseCase>(TYPES.IDeleteProjectUseCase).to(DeleteProjectUseCase);

container.bind<ICreateTaskUseCase>(TYPES.ICreateTaskUseCase).to(CreateTaskUseCase); 
container.bind<IGetTasksByProjectIdUseCase>(TYPES.IGetTasksByProjectIdUseCase).to(GetTasksByProjectIdUseCase); 
container.bind<IUpdateTaskStatusUseCase>(TYPES.IUpdateTaskStatusUseCase).to(UpdateTaskStatusUseCase); 
container.bind(TYPES.AiService).to(AiService);


// --- 4. Presentation (Controller) Bindings ---
container.bind(TYPES.ProjectController).to(ProjectController);
container.bind(TYPES.TaskController).to(TaskController);

export { container };