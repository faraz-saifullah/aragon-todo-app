'use client';

import { useState, useMemo } from 'react';
import BoardList from '@/components/BoardList';
import KanbanColumn from '@/components/KanbanColumn';
import BoardFormModal from '@/components/BoardFormModal';
import TaskFormModal from '@/components/TaskFormModal';
import { useBoards, useBoard } from '@/lib/hooks';
import type { Task, TaskStatus, CreateBoardForm, UpdateBoardForm, CreateTaskForm, UpdateTaskForm } from '@/lib/types';

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
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-white text-lg">Loading boards...</div>
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-4">No boards yet</h2>
          <p className="text-gray-400 mb-6">Create your first board to get started!</p>
          <button
            onClick={handleAddBoard}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
    <div className="flex h-screen bg-gray-950">
      <BoardList
        boards={boards}
        selectedBoardId={selectedBoardId}
        onSelectBoard={setSelectedBoardId}
        onAddBoard={handleAddBoard}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-8 py-6 flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">
            {board?.title || 'Select a board'}
          </h1>
          <button
            onClick={handleAddBoard}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>+ Add New Task</span>
          </button>
        </header>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="h-full p-8">
            {board ? (
              <div className="flex gap-6 h-full">
                <KanbanColumn
                  title="Todo"
                  status="TODO"
                  tasks={tasksByStatus.TODO}
                  count={tasksByStatus.TODO.length}
                  color="bg-cyan-400"
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={handleAddTask}
                />
                <KanbanColumn
                  title="Doing"
                  status="DOING"
                  tasks={tasksByStatus.DOING}
                  count={tasksByStatus.DOING.length}
                  color="bg-purple-500"
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={handleAddTask}
                />
                <KanbanColumn
                  title="Done"
                  status="DONE"
                  tasks={tasksByStatus.DONE}
                  count={tasksByStatus.DONE.length}
                  color="bg-green-400"
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={handleAddTask}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-lg">Select a board to view tasks</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
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
