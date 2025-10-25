import { useState, useEffect } from 'react';
import Modal, { Input, TextArea, Button } from './Modal';
import type { Board, CreateBoardForm, UpdateBoardForm } from '@/lib/types';

interface BoardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBoardForm | UpdateBoardForm) => Promise<void>;
  board?: Board | null;
}

/**
 * BoardFormModal - modal for creating/editing boards
 */
export default function BoardFormModal({ isOpen, onClose, onSubmit, board }: BoardFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (board) {
      setTitle(board.title);
      setDescription(board.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
    setErrors({});
  }, [board, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Board title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Board title is too long (max 100 characters)';
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
      const data = {
        title: title.trim(),
        description: description.trim() || undefined,
      };
      await onSubmit(data);
      onClose();
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to save board',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={board ? 'Edit Board' : 'Create New Board'}>
      <form onSubmit={handleSubmit}>
        <Input
          label="Board Title"
          value={title}
          onChange={setTitle}
          onBlur={handleTitleBlur}
          placeholder="e.g., Platform Launch"
          error={errors.title}
          required
          maxLength={100}
          autoFocus
        />

        <TextArea
          label="Description (Optional)"
          value={description}
          onChange={setDescription}
          placeholder="Brief description of the board..."
          rows={3}
          maxLength={500}
        />

        {errors.submit && <p className="text-red-400 text-sm mb-4">{errors.submit}</p>}

        <div className="flex gap-3">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : board ? 'Save Changes' : 'Create Board'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
