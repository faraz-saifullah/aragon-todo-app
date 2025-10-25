import { useState, useEffect } from 'react';
import Modal, { Input, Button } from './Modal';
import type { StatusColumn, CreateColumnForm, UpdateColumnForm } from '@/lib/types';

interface ColumnFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateColumnForm | UpdateColumnForm) => Promise<void>;
  column?: StatusColumn | null;
  boardId: string;
}

const DEFAULT_COLORS = [
  { label: 'Teal', value: '#49c4e5' },
  { label: 'Purple', value: '#635fc7' },
  { label: 'Green', value: '#67e2ae' },
  { label: 'Red', value: '#ea5555' },
  { label: 'Orange', value: '#ff9f43' },
  { label: 'Blue', value: '#4361ee' },
];

/**
 * ColumnFormModal - modal for creating/editing columns
 */
export default function ColumnFormModal({
  isOpen,
  onClose,
  onSubmit,
  column,
  boardId,
}: ColumnFormModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_COLORS[0].value);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (column) {
      setName(column.name);
      setColor(column.color || DEFAULT_COLORS[0].value);
    } else {
      setName('');
      setColor(DEFAULT_COLORS[0].value);
    }
    setErrors({});
  }, [column, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Column name is required';
    } else if (name.length > 50) {
      newErrors.name = 'Column name is too long (max 50 characters)';
    }

    if (!color || !/^#[0-9A-Fa-f]{6}$/.test(color)) {
      newErrors.color = 'Please select a valid color';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      const data: CreateColumnForm | UpdateColumnForm = column
        ? {
            name: name.trim(),
            color,
          }
        : {
            name: name.trim(),
            color,
            boardId,
          };
      await onSubmit(data);
      onClose();
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to save column',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={column ? 'Edit Column' : 'Add New Column'}>
      <form onSubmit={handleSubmit}>
        <Input
          label="Column Name"
          value={name}
          onChange={setName}
          placeholder="e.g., In Review, Blocked, Testing"
          error={errors.name}
          required
          maxLength={50}
          autoFocus
        />

        <div className="mb-6">
          <label className="block text-text-primary text-xs md:text-sm font-bold mb-2">
            Column Color
          </label>
          <div className="grid grid-cols-6 gap-3">
            {DEFAULT_COLORS.map((colorOption) => (
              <button
                key={colorOption.value}
                type="button"
                onClick={() => setColor(colorOption.value)}
                className={`w-full aspect-square rounded-lg transition-all ${
                  color === colorOption.value
                    ? 'ring-2 ring-surface-accent ring-offset-2 ring-offset-surface-secondary scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: colorOption.value }}
                title={colorOption.label}
                aria-label={`Select ${colorOption.label} color`}
              />
            ))}
          </div>
          {errors.color && <p className="text-red-400 text-xs mt-2">{errors.color}</p>}
        </div>

        {errors.submit && <p className="text-red-400 text-sm mb-4">{errors.submit}</p>}

        <div className="flex gap-3">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : column ? 'Save Changes' : 'Create Column'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}

