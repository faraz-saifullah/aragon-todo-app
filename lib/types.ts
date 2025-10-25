/**
 * Core type definitions for the application
 */

export type TaskStatus = 'TODO' | 'DOING' | 'DONE';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StatusColumn {
  id: string;
  boardId: string;
  name: string;
  order: number;
  color: string | null;
  tasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  statusId: string;
  order: number;
  boardId: string;
  assigneeId: string | null;
  assignee?: User; // Populated when included
  creatorId: string;
  creator?: User; // Populated when included
  status?: StatusColumn; // The actual status column object when populated
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  title: string;
  description: string | null;
  columns?: StatusColumn[];
  _count?: {
    tasks: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskForm {
  title: string;
  description?: string;
  statusId: string;
  boardId: string;
  assigneeId?: string | null;
  creatorId: string;
}

export interface UpdateTaskForm {
  title?: string;
  description?: string;
  statusId?: string;
  assigneeId?: string | null;
}

export interface CreateBoardForm {
  title: string;
  description?: string;
}

export interface UpdateBoardForm {
  title?: string;
  description?: string;
}

export interface CreateColumnForm {
  name: string;
  color?: string;
  boardId: string;
}

export interface UpdateColumnForm {
  name?: string;
  color?: string;
}
