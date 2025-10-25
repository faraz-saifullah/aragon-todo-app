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

  // Count subtasks (just for display, can be enhanced later)
  const subtaskCount = task.description ? 1 : 0;
  const completedSubtasks = 0;

  return (
    <div
      onClick={() => onEdit(task)}
      className="group bg-surface-primary hover:bg-surface-hover rounded-lg px-4 py-[23px] cursor-pointer transition-colors shadow-[0_4px_6px_0_rgba(54,78,126,0.101545)]"
    >
      <h3 className="text-text-primary font-bold text-[15px] mb-2 leading-[19px]">{task.title}</h3>

      {task.description && (
        <p className="text-text-secondary text-xs font-bold mb-0">
          {completedSubtasks} of {subtaskCount} substasks
        </p>
      )}

      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity mt-2">
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
