import { ObjectId } from 'mongoose';
import { TaskStatus } from '../../domain/models/task.model';

/**
 * @class CreateTaskDTO
 * DTO for data flowing into the ICreateTaskUseCase.
 */
export class CreateTaskDTO {
    /** @type {string | ObjectId} */
    projectId: string | ObjectId;
    /** @type {string} */
    title: string;
    /** @type {string} */
    description: string;
    /** @type {string} */
    status: string;

    /**
     * @param {string | ObjectId} projectId
     * @param {string} title
     * @param {string} description
     */
    constructor(projectId: string | ObjectId, title: string, description: string, status: string) {
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        this.status = status;
    }
}

/**
 * @class UpdateTaskStatusDTO
 * DTO for data flowing into the IUpdateTaskStatusUseCase.
 */
export class UpdateTaskStatusDTO {
    /** @type {string | ObjectId} */
    taskId: string | ObjectId;
    /** @type {string} */
    status: string;

    /**
     * @param {string | ObjectId} taskId
     * @param {string} status
     */
    constructor(taskId: string | ObjectId, status: string) {
        this.taskId = taskId;
        this.status = status;
    }
}

/**
 * @class TaskResponseDTO
 * DTO for data flowing out of Task Use Cases.
 */
export class TaskResponseDTO {
    /** @type {string} */
    id: string;
    /** @type {string} */
    title: string;
    /** @type {string} */
    description: string;
    /** @type {string} */
    status: string;
    /** @type {string} */
    projectId: string;

    /**
     * @param {Object} data - Task data structure.
     */
    constructor(data: any) {
        this.id = data._id?.toString() || data.id;
        this.title = data.title;
        this.description = data.description;
        this.status = data.status;
        this.projectId = data.projectId.toString(); 
    }
}

/**
 * @class EditTaskDTO
 * DTO for data flowing into the IEditTaskUseCase.
 */
export class EditTaskDTO {
    /** @type {string | ObjectId} */
    taskId: string | ObjectId;
    /** @type {string} */
    title: string;
    /** @type {string} */
    description: string;
    /** @type {TaskStatus} */
    status: TaskStatus;

    /**
     * @param {string | ObjectId} taskId
     * @param {string} title
     * @param {string} description
     * @param {TaskStatus} status
     */
    constructor(taskId: string | ObjectId, title: string, description: string, status: TaskStatus) {
        this.taskId = taskId;
        this.title = title;
        this.description = description;
        this.status = status;
    }
}

/**
 * @class DeleteTaskDTO
 * DTO for data flowing into the IDeleteTaskUseCase.
 */
export class DeleteTaskDTO {
    /** @type {string | ObjectId} */
    taskId: string | ObjectId;

    /**
     * @param {string | ObjectId} taskId
     */
    constructor(taskId: string | ObjectId) {
        this.taskId = taskId;
    }
}