import type { Task } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

/**
 * TaskCard component - displays a single task card
 * No left border - column header already provides the color indicator
 */
export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <div
      onClick={() => onEdit(task)}
      className="group bg-surface-primary hover:bg-surface-hover rounded-lg px-3 py-4 md:px-4 md:py-[23px] cursor-pointer transition-colors shadow-[0_4px_6px_0_rgba(54,78,126,0.101545)]"
    >
      <h3 className="text-text-primary font-bold text-[14px] md:text-[15px] mb-1.5 md:mb-2 leading-[18px] md:leading-[19px]">
        {task.title}
      </h3>

      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity mt-1.5 md:mt-2">
        <button
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300 text-[11px] md:text-xs font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
