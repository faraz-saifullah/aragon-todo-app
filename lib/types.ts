/**
 * Core type definitions for the application
 */

export type TaskStatus = 'TODO' | 'DOING' | 'DONE';

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
  status?: StatusColumn; // The actual status column object when populated
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  title: string;
  description: string | null;
  columns?: StatusColumn[]; // New: columns with nested tasks
  tasks?: Task[]; // Legacy: flat tasks array (deprecated)
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
}

export interface UpdateTaskForm {
  title?: string;
  description?: string;
  statusId?: string;
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
  order?: number;
}
