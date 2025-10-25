import { useState, useEffect, useCallback } from 'react';
import type {
  Board,
  Task,
  User,
  CreateTaskForm,
  UpdateTaskForm,
  CreateBoardForm,
  UpdateBoardForm,
} from './types';

/**
 * Custom hooks for API interactions
 */

// Base API URL
const API_BASE = '/api';

/**
 * Hook to fetch users
 */
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/users`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch users');
      }

      setUsers(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}

/**
 * Hook to manage boards data
 */
export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/boards`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch boards');
      }

      setBoards(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const createBoard = async (data: CreateBoardForm): Promise<Board> => {
    const response = await fetch(`${API_BASE}/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create board');
    }

    await fetchBoards();
    return result.data;
  };

  const updateBoard = async (id: string, data: UpdateBoardForm): Promise<Board> => {
    const response = await fetch(`${API_BASE}/boards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update board');
    }

    await fetchBoards();
    return result.data;
  };

  const deleteBoard = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/boards/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Failed to delete board');
    }

    await fetchBoards();
  };

  return {
    boards,
    loading,
    error,
    refetch: fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
  };
}

/**
 * Hook to manage a single board with its tasks
 */
export function useBoard(boardId: string | null) {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = useCallback(async () => {
    if (!boardId) {
      setBoard(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/boards/${boardId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch board');
      }

      setBoard(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  return {
    board,
    loading,
    error,
    refetch: fetchBoard,
  };
}

/**
 * Hook to manage tasks
 */
export function useTasks(boardId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!boardId) {
      setTasks([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/tasks?boardId=${boardId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch tasks');
      }

      setTasks(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (data: CreateTaskForm): Promise<Task> => {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create task');
    }

    await fetchTasks();
    return result.data;
  };

  const updateTask = async (id: string, data: UpdateTaskForm): Promise<Task> => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update task');
    }

    await fetchTasks();
    return result.data;
  };

  const deleteTask = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Failed to delete task');
    }

    await fetchTasks();
  };

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
