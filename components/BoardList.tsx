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
    <aside className="w-[260px] h-full bg-surface-primary border-r border-[#3E3F4E] flex flex-col">
      {/* Top section - aligned with header height */}
      <div className="px-6 flex items-center h-[80px] md:h-[96px] border-b border-[#3E3F4E]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-[6px] h-[25px] bg-surface-accent rounded-sm" />
            <div className="w-[6px] h-[25px] bg-surface-accent/80 rounded-sm" />
            <div className="w-[6px] h-[25px] bg-surface-accent/60 rounded-sm" />
          </div>
          <h1 className="text-text-primary text-[28px] font-bold leading-none">kanban</h1>
        </div>
      </div>

      {/* Board list section */}
      <div className="flex-1 overflow-y-auto">
        <div className="pt-[19px] pb-4">
          <p className="px-6 text-text-secondary text-[12px] uppercase tracking-[2.4px] font-bold mb-[19px]">
            All Boards ({boards.length})
          </p>

          <nav className="pr-6">
            {boards.map((board) => (
              <button
                key={board.id}
                onClick={() => onSelectBoard(board.id)}
                className={`w-full text-left pl-6 pr-4 py-[15px] rounded-r-full transition-all flex items-center gap-3 group mb-0 ${
                  selectedBoardId === board.id
                    ? 'bg-surface-accent text-text-primary'
                    : 'text-text-secondary hover:bg-text-primary/10 hover:text-surface-accent'
                }`}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 2.5A.5.5 0 0 1 .5 2h3a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-11zm5 0A.5.5 0 0 1 5.5 2h3a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-7zm5 0A.5.5 0 0 1 10.5 2h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3z" />
                </svg>
                <span className="font-bold text-[15px] leading-tight break-words">
                  {board.title}
                </span>
              </button>
            ))}

            <button
              onClick={onAddBoard}
              className="w-full text-left pl-6 pr-4 py-[15px] rounded-r-full text-surface-accent hover:bg-text-primary/10 hover:text-surface-accent transition-all flex items-center gap-3 mt-0"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 2.5A.5.5 0 0 1 .5 2h3a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-11zm5 0A.5.5 0 0 1 5.5 2h3a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-7zm5 0A.5.5 0 0 1 10.5 2h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3z" />
              </svg>
              <span className="font-bold text-[15px]">+ Create New Board</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Optional: Theme toggle section at bottom */}
      <div className="p-4 border-t border-[#3E3F4E]">
        {/* This can be used for dark/light mode toggle if needed */}
      </div>
    </aside>
  );
}
