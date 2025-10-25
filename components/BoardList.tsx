import type { Board } from '@/lib/types';

interface BoardListProps {
  boards: Board[];
  selectedBoardId: string | null;
  onSelectBoard: (boardId: string) => void;
  onAddBoard: () => void;
}

/**
 * BoardList component - sidebar with list of boards
 */
export default function BoardList({
  boards,
  selectedBoardId,
  onSelectBoard,
  onAddBoard,
}: BoardListProps) {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-1">
            <div className="w-1 h-6 bg-purple-500 rounded" />
            <div className="w-1 h-6 bg-purple-400 rounded" />
            <div className="w-1 h-6 bg-purple-300 rounded" />
          </div>
          <h1 className="text-white text-2xl font-bold">kanban</h1>
        </div>

        <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-4">
          All Boards ({boards.length})
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-1">
          {boards.map((board) => (
            <button
              key={board.id}
              onClick={() => onSelectBoard(board.id)}
              className={`w-full text-left px-4 py-3 rounded-r-full transition-colors flex items-center gap-3 group ${
                selectedBoardId === board.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-purple-400'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
              </svg>
              <span className="font-medium">{board.title}</span>
            </button>
          ))}

          <button
            onClick={onAddBoard}
            className="w-full text-left px-4 py-3 rounded-r-full text-purple-400 hover:bg-gray-800 transition-colors flex items-center gap-3 font-medium"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
            </svg>
            <span>+ Create New Board</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
