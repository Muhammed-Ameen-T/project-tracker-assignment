// src/infrastructure/config/types.ts
const TYPES = {
    // Repositories
    IProjectRepository: Symbol.for('IProjectRepository'),
    ITaskRepository: Symbol.for('ITaskRepository'),

    // Project Use Case Interfaces
    ICreateProjectUseCase: Symbol.for('ICreateProjectUseCase'),
    IGetProjectByIdUseCase: Symbol.for('IGetProjectByIdUseCase'),
    IGetAllProjectsUseCase: Symbol.for('IGetAllProjectsUseCase'),
    IDeleteProjectUseCase: Symbol.for('IDeleteProjectUseCase'),

    // Task Use Case Interfaces (New)
    ICreateTaskUseCase: Symbol.for('ICreateTaskUseCase'),
    IGetTasksByProjectIdUseCase: Symbol.for('IGetTasksByProjectIdUseCase'),
    IUpdateTaskStatusUseCase: Symbol.for('IUpdateTaskStatusUseCase'),
    
    // Concrete Use Cases
    CreateProjectUseCase: Symbol.for('CreateProjectUseCaseImpl'),
    GetProjectByIdUseCase: Symbol.for('GetProjectByIdUseCaseImpl'),
    GetAllProjectsUseCase: Symbol.for('GetAllProjectsUseCaseImpl'), 
    // Add new concrete task implementations
    CreateTaskUseCase: Symbol.for('CreateTaskUseCaseImpl'),
    GetTasksByProjectIdUseCase: Symbol.for('GetTasksByProjectIdUseCaseImpl'),
    UpdateTaskStatusUseCase: Symbol.for('UpdateTaskStatusUseCaseImpl'),
    
    // Services & Controllers
    AiService: Symbol.for('AiService'),
    ProjectController: Symbol.for('ProjectController'),
    TaskController: Symbol.for('TaskController'),
};

export { TYPES };