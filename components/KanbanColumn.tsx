import type { Task, TaskStatus } from '@/lib/types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  count: number;
  color: string;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (status: TaskStatus) => void;
}

/**
 * KanbanColumn component - displays a column of tasks (TODO, DOING, DONE)
 */
export default function KanbanColumn({
  title,
  status,
  tasks,
  count,
  color,
  onEditTask,
  onDeleteTask,
  onAddTask,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col min-w-[280px] flex-1">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-[15px] h-[15px] rounded-full ${color}`} />
        <h2 className="text-text-secondary text-xs font-bold uppercase tracking-[2.4px]">
          {title} ({count})
        </h2>
      </div>

      <div className="flex flex-col gap-5 flex-1">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
        ))}

        <button
          onClick={() => onAddTask(status)}
          className="bg-transparent rounded-lg py-[14px] text-text-secondary hover:text-text-primary transition-colors border-none text-[15px] font-bold text-left"
        >
          + New
        </button>
      </div>
    </div>
  );
}
