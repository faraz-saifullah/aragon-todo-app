/**
 * Core type definitions for the application
 */

export type TaskStatus = 'TODO' | 'DOING' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  order: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  title: string;
  description: string | null;
  order: number;
  tasks?: Task[];
  _count?: {
    tasks: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskForm {
  title: string;
  description?: string;
  status: TaskStatus;
  boardId: string;
}

export interface UpdateTaskForm {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface CreateBoardForm {
  title: string;
  description?: string;
}

export interface UpdateBoardForm {
  title?: string;
  description?: string;
}
