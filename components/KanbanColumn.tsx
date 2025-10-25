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
 * JIRA-style: Fixed header, content scrolls with all other columns together
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
    <div className="flex flex-col min-w-[240px] w-[240px] md:min-w-[280px] md:w-[280px]">
      {/* Fixed Column Header - doesn't scroll */}
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 flex-shrink-0">
        <div className={`w-[12px] h-[12px] md:w-[15px] md:h-[15px] rounded-full ${color}`} />
        <h2 className="text-text-secondary text-[10px] md:text-xs font-bold uppercase tracking-[2px] md:tracking-[2.4px]">
          {title} ({count})
        </h2>
      </div>

      {/* Column Content - scrolls with all other columns */}
      <div className="flex flex-col gap-4 md:gap-5">
        {tasks.length === 0 ? (
          <div className="text-text-muted text-sm text-center py-8 px-4">
            <p className="mb-2">No tasks yet</p>
            <p className="text-xs">Click + New to add one</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          ))
        )}

        <button
          onClick={() => onAddTask(status)}
          className="bg-surface-primary hover:bg-surface-hover rounded-lg py-[12px] md:py-[14px] text-text-secondary hover:text-surface-accent transition-colors border border-surface-primary hover:border-surface-accent text-[14px] md:text-[15px] font-bold flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
}
