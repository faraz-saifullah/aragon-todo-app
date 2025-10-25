import type { Board } from '@/lib/types';
import BoardList from './BoardList';

interface NavigationProps {
  boards: Board[];
  selectedBoardId: string | null;
  onSelectBoard: (boardId: string) => void;
  onAddBoard: () => void;
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
}: NavigationProps) {
  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="flex-shrink-0 h-screen sticky top-0"
    >
      <BoardList
        boards={boards}
        selectedBoardId={selectedBoardId}
        onSelectBoard={onSelectBoard}
        onAddBoard={onAddBoard}
      />
    </nav>
  );
}
