'use client';

import { useState } from 'react';
import type { Board } from '@/lib/types';

interface BoardListProps {
  boards: Board[];
  selectedBoardId: string | null;
  onSelectBoard: (boardId: string) => void;
  onAddBoard: () => void;
  onEditBoard: (board: Board) => void;
  onDeleteBoard: (boardId: string) => void;
  onClose?: () => void; // Optional close handler for mobile
}

/**
 * BoardList component - sidebar with list of boards
 */
export default function BoardList({
  boards,
  selectedBoardId,
  onSelectBoard,
  onAddBoard,
  onEditBoard,
  onDeleteBoard,
  onClose,
}: BoardListProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleMenuToggle = (e: React.MouseEvent, boardId: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === boardId ? null : boardId);
  };

  const handleEdit = (e: React.MouseEvent, board: Board) => {
    e.stopPropagation();
    setOpenMenuId(null);
    onEditBoard(board);
  };

  const handleDelete = (e: React.MouseEvent, boardId: string) => {
    e.stopPropagation();
    setOpenMenuId(null);
    onDeleteBoard(boardId);
  };

  return (
    <aside className="w-full lg:w-[260px] h-full bg-surface-primary border-r border-border-primary flex flex-col">
      {/* Top section - aligned with header height */}
      <div className="px-6 lg:px-8 flex items-center justify-between h-[64px] md:h-[80px] lg:h-[96px] border-b border-border-primary">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-[6px] h-[25px] bg-surface-accent rounded-sm" />
            <div className="w-[6px] h-[25px] bg-surface-accent/80 rounded-sm" />
            <div className="w-[6px] h-[25px] bg-surface-accent/60 rounded-sm" />
          </div>
          <h1 className="text-text-primary text-2xl lg:text-[28px] font-bold leading-none">
            kanban
          </h1>
        </div>
        {/* Close button - visible only on mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Board list section */}
      <div className="flex-1 overflow-y-auto py-4 lg:py-6">
        {/* Section 1: List Title */}
        <div className="px-6 lg:px-8 mb-4 lg:mb-5">
          <p className="text-text-secondary text-[12px] uppercase tracking-[2.4px] font-bold">
            All Boards ({boards.length})
          </p>
        </div>

        {/* Section 2: Board Items */}
        <nav className="space-y-0">
          {boards.map((board) => (
            <div key={board.id} className="relative">
              <button
                onClick={() => onSelectBoard(board.id)}
                className={`w-full text-left pl-6 lg:pl-8 pr-12 py-[12px] lg:py-[15px] mr-4 lg:mr-6 rounded-r-full transition-all flex items-center gap-3 group ${
                  selectedBoardId === board.id
                    ? 'bg-surface-accent text-text-primary'
                    : 'text-text-secondary hover:bg-text-primary/10 hover:text-surface-accent'
                }`}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 2.5A.5.5 0 0 1 .5 2h3a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-11zm5 0A.5.5 0 0 1 5.5 2h3a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-7zm5 0A.5.5 0 0 1 10.5 2h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3z" />
                </svg>
                <span className="font-bold text-[14px] lg:text-[15px] leading-tight break-words flex-1">
                  {board.title}
                </span>
              </button>

              {/* Kebab Menu Button */}
              <button
                onClick={(e) => handleMenuToggle(e, board.id)}
                className={`absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-text-primary/10 transition-opacity ${
                  selectedBoardId === board.id
                    ? 'text-text-primary opacity-100'
                    : 'text-text-secondary opacity-0 group-hover:opacity-100'
                }`}
                aria-label="Board options"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {openMenuId === board.id && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setOpenMenuId(null)}
                  />
                  {/* Menu */}
                  <div className="absolute right-6 lg:right-8 top-full mt-1 bg-surface-secondary rounded-lg shadow-lg py-2 min-w-[150px] z-20">
                    <button
                      onClick={(e) => handleEdit(e, board)}
                      className="w-full text-left px-4 py-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors text-sm"
                    >
                      Edit Board
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, board.id)}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-surface-hover hover:text-red-300 transition-colors text-sm"
                    >
                      Delete Board
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          <button
            onClick={onAddBoard}
            className="w-full text-left pl-6 lg:pl-8 pr-4 lg:pr-6 py-[12px] lg:py-[15px] mr-4 lg:mr-6 rounded-r-full text-surface-accent hover:bg-text-primary/10 hover:text-surface-accent transition-all flex items-center gap-3"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 2.5A.5.5 0 0 1 .5 2h3a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-11zm5 0A.5.5 0 0 1 5.5 2h3a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-7zm5 0A.5.5 0 0 1 10.5 2h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3z" />
            </svg>
            <span className="font-bold text-[14px] lg:text-[15px]">+ Create New Board</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
