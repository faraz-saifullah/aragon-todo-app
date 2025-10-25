import { useState, useEffect } from 'react';
import Modal, { Input, TextArea, Select, Button } from './Modal';
import type { Task, CreateTaskForm, UpdateTaskForm, StatusColumn } from '@/lib/types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskForm | UpdateTaskForm) => Promise<void>;
  task?: Task | null;
  boardId: string;
  columns: StatusColumn[];
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
  defaultColumnId,
}: TaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusId, setStatusId] = useState<string>(defaultColumnId || columns[0]?.id || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Build column options from columns prop
  const columnOptions = columns.map((col) => ({
    value: col.id,
    label: col.name,
  }));

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatusId(task.statusId);
    } else {
      setTitle('');
      setDescription('');
      setStatusId(defaultColumnId || columns[0]?.id || '');
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
          }
        : {
            title: title.trim(),
            description: description.trim() || undefined,
            statusId,
            boardId,
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
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Create New Task'}>
      <form onSubmit={handleSubmit}>
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

        <Select
          label="Column"
          value={statusId}
          onChange={(value) => setStatusId(value)}
          options={columnOptions}
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
    </Modal>
  );
}
