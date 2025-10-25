'use client';

import { useState, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import KanbanColumn from '@/components/KanbanColumn';
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
      {/* LEFT SECTION: Global App Navigation */}
      <Navigation
        boards={boards}
        selectedBoardId={selectedBoardId}
        onSelectBoard={setSelectedBoardId}
        onAddBoard={handleAddBoard}
      />

      {/* RIGHT SECTION: Main App Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Content Header - Board-specific actions */}
        <header
          role="banner"
          className="bg-surface-primary border-b border-[#3E3F4E] px-6 py-5 md:px-8 md:py-6 flex items-center justify-between h-[80px] md:h-[96px] flex-shrink-0"
        >
          <h1 className="text-text-primary text-lg md:text-xl lg:text-2xl font-bold truncate">
            {board?.title || 'Select a board'}
          </h1>
          <button
            onClick={() => handleAddTask('TODO')}
            className="bg-surface-accent hover:bg-surface-accent/90 text-text-primary px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-colors text-sm md:text-base flex-shrink-0"
            aria-label="Add new task"
          >
            + Add New Task
          </button>
        </header>

        {/* Content Body - Kanban Board Area */}
        <main
          role="main"
          className="flex-1 overflow-x-auto overflow-y-hidden"
          aria-label="Kanban board"
        >
          <div className="h-full px-4 py-6 md:px-6 md:py-6">
            {board ? (
              <div className="flex gap-6 h-full">
                <KanbanColumn
                  title="Todo"
                  status="TODO"
                  tasks={tasksByStatus.TODO}
                  count={tasksByStatus.TODO.length}
                  color="bg-status-todo"
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={handleAddTask}
                />
                <KanbanColumn
                  title="Doing"
                  status="DOING"
                  tasks={tasksByStatus.DOING}
                  count={tasksByStatus.DOING.length}
                  color="bg-status-doing"
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={handleAddTask}
                />
                <KanbanColumn
                  title="Done"
                  status="DONE"
                  tasks={tasksByStatus.DONE}
                  count={tasksByStatus.DONE.length}
                  color="bg-status-done"
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={handleAddTask}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-text-secondary text-lg">Select a board to view tasks</p>
              </div>
            )}
          </div>
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
