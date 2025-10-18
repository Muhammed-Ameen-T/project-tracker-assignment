/**
 * @class CreateProjectDTO
 * DTO for data flowing into the CreateProjectUseCase.
 */
export class CreateProjectDTO {
    /** @type {string} */
    name: string;
    /** @type {string} */
    description: string;

    /**
     * @param {string} name
     * @param {string} description
     */
    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
}

/**
 * @class ProjectResponseDTO
 * DTO for data flowing out of Use Cases (response to the Controller).
 */
export class ProjectResponseDTO {
    /** @type {string} */
    id: string;
    /** @type {string} */
    name: string;
    /** @type {string} */
    description: string;
    /** @type {Date} */
    createdAt: Date;

    /**
     * @param {Object} data - Project data (IProjectData or IProjectDocument).
     */
    constructor(data: any) {
        this.id = data._id?.toString() || data.id;
        this.name = data.name;
        this.description = data.description;
        this.createdAt = data.createdAt;
    }
}

/**
 * @class UpdateProjectDTO
 * DTO for data flowing into the IUpdateProjectUseCase.
 */
export class UpdateProjectDTO {
    /** @type {string | ObjectId} */
    projectId: string;
    /** @type {string} */
    name: string;
    /** @type {string} */
    description: string;

    /**
     * @param {string} projectId
     * @param {string} name
     * @param {string} description
     */
    constructor(projectId: string, name: string, description: string) {
        this.projectId = projectId;
        this.name = name;
        this.description = description;
    }
}