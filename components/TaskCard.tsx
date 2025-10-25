import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '@/lib/types';
import { calculateTimeInColumn } from '@/lib/utils/time';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
}

/**
 * TaskCard component - displays a single task card
 * No left border - column header already provides the color indicator
 */
export default function TaskCard({ task, onEdit, onDelete, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
    disabled: isDragging, // Disable sorting for the overlay preview
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete task "${task.title}"?`)) {
      onDelete(task.id);
    }
  };

  const handleClick = () => {
    if (!isSortableDragging) {
      onEdit(task);
    }
  };

  // Calculate time in current column
  const timeInColumn = calculateTimeInColumn(task.createdAt, task.history);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`group bg-surface-primary hover:bg-surface-hover rounded-lg px-3 py-4 md:px-4 md:py-[23px] cursor-grab active:cursor-grabbing transition-all border border-transparent hover:border-surface-accent/30 ${
        isSortableDragging ? 'opacity-50 scale-105 border-surface-accent' : ''
      } ${isDragging ? 'border-surface-accent' : ''}`}
    >
      <h3 className="text-text-primary font-bold text-[14px] md:text-[15px] mb-1.5 md:mb-2 leading-[18px] md:leading-[19px]">
        {task.title}
      </h3>

      {/* Subtitle: Time in column */}
      <p
        className="text-text-muted text-[11px] md:text-xs mb-3"
        title={`In this column since ${timeInColumn.timestamp.toLocaleString()}`}
      >
        Added {timeInColumn.duration} ago
      </p>

      {/* Footer with assignee avatar and delete button */}
      <div className="flex items-center justify-between">
        {/* Left side: Assignee */}
        {task.assignee ? (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full bg-surface-accent flex items-center justify-center text-text-primary text-[10px] font-bold"
              title={task.assignee.name}
            >
              {task.assignee.avatar || task.assignee.name.substring(0, 2).toUpperCase()}
            </div>
            <span className="text-text-secondary text-[11px] md:text-xs truncate">
              {task.assignee.name}
            </span>
          </div>
        ) : (
          <div></div>
        )}

        {/* Right side: Delete button - shown on hover, hidden when dragging */}
        {!isSortableDragging && !isDragging && (
          <button
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 text-[10px] md:text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
