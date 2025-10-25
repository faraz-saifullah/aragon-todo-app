import { NextRequest } from 'next/server';
import { getBoardById, updateBoard, deleteBoard } from '@/lib/services/board.service';
import { updateBoardSchema } from '@/lib/validation';
import { handleApiError, successResponse } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/boards/[id] - Get a specific board with its tasks
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const board = await getBoardById(id);
    
    if (!board) {
      return successResponse({ error: 'Board not found' }, 404);
    }
    
    return successResponse(board);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/boards/[id] - Update a board
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateBoardSchema.parse(body);
    const board = await updateBoard(id, validatedData);
    return successResponse(board, 200, 'Board updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/boards/[id] - Delete a board
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await deleteBoard(id);
    return successResponse({ id }, 200, 'Board deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

