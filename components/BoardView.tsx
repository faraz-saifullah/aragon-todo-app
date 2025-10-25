import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type { Task, StatusColumn } from '@/lib/types';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';

interface BoardViewProps {
  columns: StatusColumn[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (columnId: string) => void;
  onAddColumn: () => void;
  onTaskUpdate: () => Promise<void>; // Refetch board after drag
}

/**
 * BoardView component - Displays the Kanban board with dynamic columns
 * JIRA-style: All columns scroll together as one unified area
 */
export default function BoardView({
  columns,
  onEditTask,
  onDeleteTask,
  onAddTask,
  onAddColumn,
  onTaskUpdate,
}: BoardViewProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag (prevents accidental drags)
      },
    })
  );

  // Find task by ID across all columns
  const findTask = (taskId: string): Task | undefined => {
    for (const column of columns) {
      const task = column.tasks?.find((t) => t.id === taskId);
      if (task) return task;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as string;
    const task = findTask(taskId);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Find which column was dropped on
    let targetColumnId: string | null = null;

    // Check if dropped directly on a column
    const column = columns.find((col) => col.id === overId);
    if (column) {
      targetColumnId = column.id;
    } else {
      // Dropped on another task - find which column that task belongs to
      for (const col of columns) {
        if (col.tasks?.some((t) => t.id === overId)) {
          targetColumnId = col.id;
          break;
        }
      }
    }

    if (!targetColumnId) return;

    // Find source column
    const sourceColumnId = columns.find((col) => col.tasks?.some((t) => t.id === taskId))?.id;

    // Only move if actually changed columns
    if (sourceColumnId && targetColumnId !== sourceColumnId) {
      try {
        // Use existing PUT /api/tasks/:id endpoint
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ columnId: targetColumnId }),
        });

        if (!response.ok) {
          throw new Error('Failed to move task');
        }

        // Refetch board to get updated data with history
        await onTaskUpdate();
      } catch (error) {
        console.error('Error moving task:', error);
        // Refetch anyway to restore correct state
        await onTaskUpdate();
      }
    }
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  // Get color info for a column
  const getColumnColor = (
    columnName: string,
    customColor?: string | null
  ): { className?: string; style?: React.CSSProperties } => {
    // If custom hex color is provided, use inline style
    if (customColor && customColor.startsWith('#')) {
      return { style: { backgroundColor: customColor } };
    }

    // If custom Tailwind class is provided
    if (customColor) {
      return { className: customColor };
    }

    // Default colors based on common column names
    const name = columnName.toLowerCase();
    if (name.includes('todo') || name.includes('backlog')) return { className: 'bg-status-todo' };
    if (name.includes('doing') || name.includes('progress') || name.includes('working'))
      return { className: 'bg-status-doing' };
    if (name.includes('done') || name.includes('complete')) return { className: 'bg-status-done' };

    // Default fallback
    return { className: 'bg-blue-500' };
  };

  if (columns.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-text-secondary text-lg mb-4">No columns yet for this board</p>
          <p className="text-text-secondary text-sm">
            Create columns to start organizing your tasks
          </p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="h-full overflow-x-auto overflow-y-auto">
        <div className="px-3 py-4 md:px-4 md:py-6 lg:px-6 lg:py-6 min-w-min h-full">
          <div className="flex gap-4 md:gap-6 h-full items-start">
            {columns.map((column) => {
              const colorInfo = getColumnColor(column.name, column.color);
              return (
                <KanbanColumn
                  key={column.id}
                  columnId={column.id}
                  title={column.name}
                  tasks={column.tasks || []}
                  count={(column.tasks || []).length}
                  colorClassName={colorInfo.className}
                  colorStyle={colorInfo.style}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                  onAddTask={() => onAddTask(column.id)}
                />
              );
            })}

            {/* Add New Column Button */}
            <div className="flex flex-col min-w-[240px] w-[240px] md:min-w-[280px] md:w-[280px]">
              <button
                onClick={onAddColumn}
                className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 flex-shrink-0 group cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-[12px] h-[12px] md:w-[15px] md:h-[15px] rounded-full bg-text-secondary group-hover:bg-surface-accent transition-colors" />
                <h2 className="text-text-secondary group-hover:text-surface-accent text-[10px] md:text-xs font-bold uppercase tracking-[2px] md:tracking-[2.4px] transition-colors">
                  + New Column
                </h2>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay - Shows preview of card being dragged */}
      <DragOverlay>
        {activeTask && (
          <div className="rotate-3 opacity-90">
            <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
