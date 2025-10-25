import type { Task } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

/**
 * TaskCard component - displays a single task card
 */
export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task.id);
    }
  };

  return (
    <div
      onClick={() => onEdit(task)}
      className="group bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-750 transition-all hover:shadow-lg border border-gray-700 hover:border-gray-600"
    >
      <h3 className="text-white font-medium text-sm mb-2 line-clamp-2">{task.title}</h3>

      {task.description && (
        <p className="text-gray-400 text-xs mb-3 line-clamp-3">{task.description}</p>
      )}

      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300 text-xs font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
