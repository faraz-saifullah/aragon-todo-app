'use client';

import { useState, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import BoardView from '@/components/BoardView';
import BoardFormModal from '@/components/BoardFormModal';
import TaskFormModal from '@/components/TaskFormModal';
import { useBoards, useBoard } from '@/lib/hooks';
import type {
  Task,
  TaskStatus,
  CreateBoardForm,
  UpdateBoardForm,
  CreateTaskForm,
  UpdateTaskForm,
} from '@/lib/types';

export default function Home() {
  const { boards, loading: boardsLoading, createBoard, updateBoard, deleteBoard } = useBoards();
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const { board, refetch: refetchBoard } = useBoard(selectedBoardId);

  // Modal states
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<typeof board | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('TODO');

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-select first board if none selected
  useState(() => {
    if (!selectedBoardId && boards.length > 0) {
      setSelectedBoardId(boards[0].id);
    }
  });

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const tasks = board?.tasks || [];
    return {
      TODO: tasks.filter((t) => t.status === 'TODO'),
      DOING: tasks.filter((t) => t.status === 'DOING'),
      DONE: tasks.filter((t) => t.status === 'DONE'),
    };
  }, [board]);

  // Board handlers
  const handleAddBoard = () => {
    setEditingBoard(null);
    setBoardModalOpen(true);
  };

  const handleBoardSubmit = async (data: CreateBoardForm | UpdateBoardForm) => {
    if (editingBoard) {
      await updateBoard(editingBoard.id, data);
    } else {
      const newBoard = await createBoard(data as CreateBoardForm);
      setSelectedBoardId(newBoard.id);
    }
  };

  // Task handlers
  const handleAddTask = (status: TaskStatus) => {
    setEditingTask(null);
    setNewTaskStatus(status);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleTaskSubmit = async (data: CreateTaskForm | UpdateTaskForm) => {
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
    }

    await refetchBoard();
  };

  const handleDeleteTask = async (taskId: string) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Failed to delete task');
    }

    await refetchBoard();
  };

  if (boardsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-secondary">
        <div className="text-text-primary text-lg">Loading boards...</div>
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
            setSelectedBoardId(id);
            setIsMobileMenuOpen(false); // Close menu after selection on mobile
          }}
          onAddBoard={() => {
            handleAddBoard();
            setIsMobileMenuOpen(false); // Close menu after action on mobile
          }}
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
            onClick={() => handleAddTask('TODO')}
            className="bg-surface-accent hover:bg-surface-accent/90 text-text-primary px-3 py-2 md:px-4 md:py-2 lg:px-6 lg:py-3 rounded-full font-medium transition-colors text-xs md:text-sm lg:text-base flex-shrink-0"
            aria-label="Add new task"
          >
            <span className="hidden sm:inline">+ Add New Task</span>
            <span className="sm:hidden">+ Task</span>
          </button>
        </header>

        {/* Content Body - Kanban Board Area */}
        <main role="main" className="flex-1 overflow-hidden" aria-label="Kanban board">
          {board ? (
            <BoardView
              boardTitle={board.title}
              tasksByStatus={tasksByStatus}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onAddTask={handleAddTask}
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
        defaultStatus={newTaskStatus}
      />
    </div>
  );
}
