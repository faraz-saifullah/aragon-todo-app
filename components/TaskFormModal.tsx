import { useState, useEffect } from 'react';
import Modal, { Input, TextArea, Select, Button } from './Modal';
import TaskHistoryTimeline from './TaskHistoryTimeline';
import type { Task, CreateTaskForm, UpdateTaskForm, StatusColumn, User } from '@/lib/types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskForm | UpdateTaskForm) => Promise<void>;
  task?: Task | null;
  boardId: string;
  columns: StatusColumn[];
  users: User[];
  defaultCreatorId: string;
  defaultColumnId?: string;
}

/**
 * TaskFormModal - modal for creating/editing tasks
 */
export default function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  task,
  boardId,
  columns,
  users,
  defaultCreatorId,
  defaultColumnId,
}: TaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusId, setStatusId] = useState<string>(defaultColumnId || columns[0]?.id || '');
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Build column options from columns prop
  const columnOptions = columns.map((col) => ({
    value: col.id,
    label: col.name,
  }));

  // Build user options
  const userOptions = [
    { value: '', label: 'Unassigned' },
    ...users.map((user) => ({
      value: user.id,
      label: user.name,
    })),
  ];

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatusId(task.statusId);
      setAssigneeId(task.assigneeId);
    } else {
      setTitle('');
      setDescription('');
      setStatusId(defaultColumnId || columns[0]?.id || '');
      setAssigneeId(null);
    }
    setErrors({});
  }, [task, defaultColumnId, columns, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Task title is too long (max 200 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate on blur
  const handleTitleBlur = () => {
    if (title) {
      validate();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      const data: CreateTaskForm | UpdateTaskForm = task
        ? {
            title: title.trim(),
            description: description.trim() || undefined,
            statusId,
          assigneeId: assigneeId || null,
          }
        : {
            title: title.trim(),
            description: description.trim() || undefined,
            statusId,
            boardId,
          assigneeId: assigneeId || null,
          creatorId: defaultCreatorId,
          };
      await onSubmit(data);
      onClose();
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to save task',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      wide={!!task} // Make modal wider when editing to accommodate 2-column layout
    >
      <div className={task ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''}>
        {/* LEFT COLUMN - Task Details */}
        <div className={task ? 'min-h-0' : ''}>
          <form onSubmit={handleSubmit}>
            {/* Metadata row - Assignee and Column side by side */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Select
                label="Assignee"
                value={assigneeId || ''}
                onChange={(value) => setAssigneeId(value || null)}
                options={userOptions}
              />

              <Select
                label="Column"
                value={statusId}
                onChange={(value) => setStatusId(value)}
                options={columnOptions}
              />
            </div>

            <Input
              label="Task Title"
              value={title}
              onChange={setTitle}
              onBlur={handleTitleBlur}
              placeholder="e.g., Build UI for onboarding flow"
              error={errors.title}
              required
              maxLength={200}
              autoFocus
            />

            <TextArea
              label="Description (Optional)"
              value={description}
              onChange={setDescription}
              placeholder="Add more details about this task..."
              rows={4}
              maxLength={1000}
            />

            {errors.submit && <p className="text-red-400 text-sm mb-4">{errors.submit}</p>}

            <div className="flex gap-3">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
              </Button>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN - History (only when editing) */}
        {task && (
          <div className="border-t lg:border-t-0 lg:border-l border-border-primary pt-6 lg:pt-0 lg:pl-6 mt-6 lg:mt-0 min-h-0">
            <div className="h-full max-h-[50vh] lg:max-h-[60vh] overflow-y-auto pr-2">
              <TaskHistoryTimeline taskId={task.id} />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
