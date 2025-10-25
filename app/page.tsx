'use client';

import { useState, useMemo, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import BoardView from '@/components/BoardView';
import BoardFormModal from '@/components/BoardFormModal';
import TaskFormModal from '@/components/TaskFormModal';
import ColumnFormModal from '@/components/ColumnFormModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useBoards, useBoard, useUsers } from '@/lib/hooks';
import { useToast } from '@/contexts/ToastContext';
import { getFromStorage, setInStorage } from '@/lib/hooks/usePersistedState';
import type {
  Task,
  CreateBoardForm,
  UpdateBoardForm,
  CreateTaskForm,
  UpdateTaskForm,
  CreateColumnForm,
  UpdateColumnForm,
} from '@/lib/types';

export default function Home() {
  const { boards, loading: boardsLoading, createBoard, updateBoard, deleteBoard } = useBoards();
  const { users, loading: usersLoading } = useUsers();
  const toast = useToast();

  // Get default creator (first user for now, until we have auth)
  const defaultCreator = users[0];

  // Internal state for user's explicit selection (can be invalid)
  const [userSelectedBoardId, setUserSelectedBoardId] = useState<string | null>(() => {
    return getFromStorage<string | null>('selectedBoardId', null);
  });

  // Compute the actual valid board ID to use
  const selectedBoardId = useMemo(() => {
    if (boards.length === 0) return null;

    // If user has a selection and it's still valid, use it
    if (userSelectedBoardId && boards.some((b) => b.id === userSelectedBoardId)) {
      return userSelectedBoardId;
    }

    // Otherwise, use first board
    return boards[0].id;
  }, [boards, userSelectedBoardId]);

  const { board, refetch: refetchBoard } = useBoard(selectedBoardId);

  // Modal states
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<typeof board | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskColumnId, setNewTaskColumnId] = useState<string | null>(null);

  // Confirmation modal state
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationType, setConfirmationType] = useState<'task' | 'board'>('task');
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Save board selection to localStorage whenever it changes
  useEffect(() => {
    if (selectedBoardId) {
      setInStorage('selectedBoardId', selectedBoardId);
    }
  }, [selectedBoardId]);

  // Get columns with their tasks (columns is already ordered by order from API)
  const columns = useMemo(() => {
    return board?.columns || [];
  }, [board]);

  // Board handlers
  const handleAddBoard = () => {
    setEditingBoard(null);
    setBoardModalOpen(true);
  };

  const handleBoardSubmit = async (data: CreateBoardForm | UpdateBoardForm) => {
    try {
      if (editingBoard) {
        await updateBoard(editingBoard.id, data);
        toast.success('Board updated successfully');
      } else {
        const newBoard = await createBoard(data as CreateBoardForm);
        setUserSelectedBoardId(newBoard.id);
        toast.success('Board created successfully');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save board');
    }
  };

  const handleEditBoard = (board: (typeof boards)[0]) => {
    setEditingBoard(board);
    setBoardModalOpen(true);
  };

  const handleRequestDeleteBoard = (boardId: string) => {
    setBoardToDelete(boardId);
    setConfirmationType('board');
    setConfirmationOpen(true);
  };

  const handleConfirmDeleteBoard = async () => {
    if (!boardToDelete) return;

    try {
      await deleteBoard(boardToDelete);
      toast.success('Board deleted successfully');

      // If we deleted the selected board, clear selection
      if (boardToDelete === selectedBoardId) {
        setUserSelectedBoardId(null);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete board');
    } finally {
      setBoardToDelete(null);
    }
  };

  // Task handlers
  const handleAddTask = (columnId: string) => {
    setEditingTask(null);
    setNewTaskColumnId(columnId);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleTaskSubmit = async (data: CreateTaskForm | UpdateTaskForm) => {
    try {
      if (editingTask) {
        // Update existing task
        const response = await fetch(`/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Failed to update task');
        }
        toast.success('Task updated successfully');
      } else {
        // Create new task
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Failed to create task');
        }
        toast.success('Task created successfully');
      }

      await refetchBoard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save task');
    }
  };

  const handleRequestDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setConfirmationType('task');
    setConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (confirmationType === 'task') {
      await handleConfirmDeleteTask();
    } else {
      await handleConfirmDeleteBoard();
    }
  };

  const handleConfirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const response = await fetch(`/api/tasks/${taskToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete task');
      }

      toast.success('Task deleted successfully');
      await refetchBoard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete task');
    } finally {
      setTaskToDelete(null);
    }
  };

  // Column handlers
  const handleAddColumn = () => {
    setColumnModalOpen(true);
  };

  const handleColumnSubmit = async (data: CreateColumnForm | UpdateColumnForm) => {
    try {
      const response = await fetch('/api/columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to create column');
      }

      toast.success('Column created successfully');
      await refetchBoard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create column');
    }
  };

  if (boardsLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-secondary">
        <div className="text-text-primary text-lg">Loading...</div>
      </div>
    );
  }

  if (!defaultCreator) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-secondary">
        <div className="text-text-primary text-lg">No users found. Please run the seed script.</div>
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-secondary">
        <div className="text-center">
          <h2 className="text-text-primary text-2xl font-bold mb-4">No boards yet</h2>
          <p className="text-text-secondary mb-6">Create your first board to get started!</p>
          <button
            onClick={handleAddBoard}
            className="bg-surface-accent hover:bg-surface-accent/90 text-text-primary px-6 py-3 rounded-full font-medium transition-colors"
          >
            Create New Board
          </button>
        </div>
        <BoardFormModal
          isOpen={boardModalOpen}
          onClose={() => setBoardModalOpen(false)}
          onSubmit={handleBoardSubmit}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface-secondary">
      {/* LEFT SECTION: Global App Navigation - Hidden on mobile, overlay when open */}
      <div
        className={`
        fixed lg:static inset-0 z-40 lg:z-auto
        ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}
      `}
      >
        <Navigation
          boards={boards}
          selectedBoardId={selectedBoardId}
          onSelectBoard={(id) => {
            setUserSelectedBoardId(id);
            setIsMobileMenuOpen(false); // Close menu after selection on mobile
          }}
          onAddBoard={() => {
            handleAddBoard();
            setIsMobileMenuOpen(false); // Close menu after action on mobile
          }}
          onEditBoard={handleEditBoard}
          onDeleteBoard={handleRequestDeleteBoard}
          onClose={() => setIsMobileMenuOpen(false)} // Close button handler
        />
        {/* Mobile backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden -z-10"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          />
        )}
      </div>

      {/* RIGHT SECTION: Main App Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Content Header - Board-specific actions */}
        <header
          role="banner"
          className="bg-surface-primary border-b border-border-primary px-4 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6 flex items-center justify-between h-[64px] md:h-[80px] lg:h-[96px] flex-shrink-0"
        >
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            {/* Hamburger menu for mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-text-primary flex-shrink-0"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-text-primary text-base md:text-lg lg:text-xl font-bold truncate">
              {board?.title || 'Select a board'}
            </h1>
          </div>
          <button
            onClick={() => {
              const firstColumn = columns[0];
              if (firstColumn) {
                handleAddTask(firstColumn.id);
              }
            }}
            className="bg-surface-accent hover:bg-surface-accent/90 text-text-primary px-3 py-2 md:px-4 md:py-2 lg:px-6 lg:py-3 rounded-full font-medium transition-colors text-xs md:text-sm lg:text-base flex-shrink-0"
            aria-label="Add new task"
            disabled={columns.length === 0}
          >
            <span className="hidden sm:inline">+ Add New Task</span>
            <span className="sm:hidden">+ Task</span>
          </button>
        </header>

        {/* Content Body - Kanban Board Area */}
        <main role="main" className="flex-1 overflow-hidden" aria-label="Kanban board">
          {board ? (
            <BoardView
              columns={columns}
              onEditTask={handleEditTask}
              onDeleteTask={handleRequestDeleteTask}
              onAddTask={handleAddTask}
              onAddColumn={handleAddColumn}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-text-secondary text-lg">Select a board to view tasks</p>
            </div>
          )}
        </main>
      </div>

      {/* Modals - Overlay Layer */}
      <BoardFormModal
        isOpen={boardModalOpen}
        onClose={() => setBoardModalOpen(false)}
        onSubmit={handleBoardSubmit}
        board={editingBoard}
      />

      <TaskFormModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        task={editingTask}
        boardId={selectedBoardId || ''}
        columns={columns}
        users={users}
        defaultCreatorId={defaultCreator.id}
        defaultColumnId={newTaskColumnId || undefined}
      />

      <ColumnFormModal
        isOpen={columnModalOpen}
        onClose={() => setColumnModalOpen(false)}
        onSubmit={handleColumnSubmit}
        boardId={selectedBoardId || ''}
      />

      <ConfirmationModal
        isOpen={confirmationOpen}
        onClose={() => {
          setConfirmationOpen(false);
          setTaskToDelete(null);
          setBoardToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title={confirmationType === 'task' ? 'Delete Task' : 'Delete Board'}
        message={
          confirmationType === 'task'
            ? 'Are you sure you want to delete this task? This action cannot be undone.'
            : 'Are you sure you want to delete this board? All tasks and columns will be permanently deleted. This action cannot be undone.'
        }
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
