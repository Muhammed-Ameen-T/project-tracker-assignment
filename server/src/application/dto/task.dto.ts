import { ObjectId } from 'mongoose';

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

    /**
     * @param {string | ObjectId} projectId
     * @param {string} title
     * @param {string} description
     */
    constructor(projectId: string | ObjectId, title: string, description: string) {
        this.projectId = projectId;
        this.title = title;
        this.description = description;
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
        // Ensure projectId is cast to string for the response contract
        this.projectId = data.projectId.toString(); 
    }
}