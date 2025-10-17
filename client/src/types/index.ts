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
