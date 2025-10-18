export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  projectId: string;
  createdAt: string;
}

export type TaskStatus = Task['status'];

export interface IProjectResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface ITaskResponse {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  createdAt: string;
}

export interface ISummaryResponse {
  summary: string;
}

export interface IQnAResponse {
  question: string;
  answer: string;
}

export interface UpdateProjectData {
  id: string;
  name: string;
  description: string;
}

export type SaveProjectData = {
  id?: string; 
  name: string;
  description: string;
};

export interface EditTaskData {
  taskId: string;
  title: string;
  description: string;
  status: string;
}