import { useState, useEffect } from 'react';
import Modal, { Input, TextArea, Select, Button } from './Modal';
import type { Task, CreateTaskForm, UpdateTaskForm, TaskStatus } from '@/lib/types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskForm | UpdateTaskForm) => Promise<void>;
  task?: Task | null;
  boardId: string;
  defaultStatus?: TaskStatus;
}

const STATUS_OPTIONS = [
  { value: 'TODO', label: 'Todo' },
  { value: 'DOING', label: 'Doing' },
  { value: 'DONE', label: 'Done' },
];

/**
 * TaskFormModal - modal for creating/editing tasks
 */
export default function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  task,
  boardId,
  defaultStatus = 'TODO',
}: TaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
    }
    setErrors({});
  }, [task, defaultStatus, isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      const data: CreateTaskForm | UpdateTaskForm = task
        ? {
            title: title.trim(),
            description: description.trim() || undefined,
            status,
          }
        : {
            title: title.trim(),
            description: description.trim() || undefined,
            status,
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
          placeholder="e.g., Build UI for onboarding flow"
          error={errors.title}
          required
        />

        <TextArea
          label="Description (Optional)"
          value={description}
          onChange={setDescription}
          placeholder="Add more details about this task..."
          rows={4}
        />

        <Select
          label="Status"
          value={status}
          onChange={(value) => setStatus(value as TaskStatus)}
          options={STATUS_OPTIONS}
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
