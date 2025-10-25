import { NextRequest } from 'next/server';
import { getAllBoards, createBoard } from '@/lib/services/board.service';
import { createBoardSchema } from '@/lib/validation';
import { handleApiError, successResponse } from '@/lib/api-utils';

/**
 * GET /api/boards - Get all boards
 */
export async function GET() {
  try {
    const boards = await getAllBoards();
    return successResponse(boards);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/boards - Create a new board
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createBoardSchema.parse(body);
    const board = await createBoard(validatedData);
    return successResponse(board, 201, 'Board created successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

