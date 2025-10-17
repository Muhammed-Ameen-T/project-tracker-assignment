/**
 * @typedef {Object} IProjectData
 * The plain data structure for a Project (returned by lean queries).
 * @property {string} name
 * @property {string} description
 * @property {Date} createdAt
 */
export interface IProjectData {
  name: string;
  description: string;
  createdAt: Date;
}