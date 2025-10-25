import type { Task, TaskStatus } from '@/lib/types';
import KanbanColumn from './KanbanColumn';

interface BoardViewProps {
  boardTitle: string;
  tasksByStatus: {
    TODO: Task[];
    DOING: Task[];
    DONE: Task[];
  };
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (status: TaskStatus) => void;
}

/**
 * BoardView component - Displays the Kanban board with columns
 * JIRA-style: All columns scroll together as one unified area
 */
export default function BoardView({
  boardTitle,
  tasksByStatus,
  onEditTask,
  onDeleteTask,
  onAddTask,
}: BoardViewProps) {
  return (
    <div className="h-full overflow-x-auto overflow-y-auto">
      <div className="px-4 py-6 md:px-6 md:py-6 min-w-min h-full">
        <div className="flex gap-6 h-full items-start">
          <KanbanColumn
            title="Todo"
            status="TODO"
            tasks={tasksByStatus.TODO}
            count={tasksByStatus.TODO.length}
            color="bg-status-todo"
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onAddTask={onAddTask}
          />
          <KanbanColumn
            title="Doing"
            status="DOING"
            tasks={tasksByStatus.DOING}
            count={tasksByStatus.DOING.length}
            color="bg-status-doing"
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onAddTask={onAddTask}
          />
          <KanbanColumn
            title="Done"
            status="DONE"
            tasks={tasksByStatus.DONE}
            count={tasksByStatus.DONE.length}
            color="bg-status-done"
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onAddTask={onAddTask}
          />
        </div>
      </div>
    </div>
  );
}
