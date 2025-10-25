import type { Board } from '@/lib/types';
import BoardList from './BoardList';

interface NavigationProps {
  boards: Board[];
  selectedBoardId: string | null;
  onSelectBoard: (boardId: string) => void;
  onAddBoard: () => void;
  onClose?: () => void; // Optional close handler for mobile
}

/**
 * Navigation component - Main app navigation sidebar
 * Contains the board selection and app-level navigation
 */
export default function Navigation({
  boards,
  selectedBoardId,
  onSelectBoard,
  onAddBoard,
  onClose,
}: NavigationProps) {
  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="w-full lg:w-auto h-full lg:h-screen lg:sticky lg:top-0 bg-surface-primary"
    >
      <BoardList
        boards={boards}
        selectedBoardId={selectedBoardId}
        onSelectBoard={onSelectBoard}
        onAddBoard={onAddBoard}
        onClose={onClose}
      />
    </nav>
  );
}
