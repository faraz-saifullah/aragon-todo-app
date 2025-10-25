import { NextRequest, NextResponse } from 'next/server';
import { getColumnsByBoardId, createColumn, reorderColumns } from '@/lib/services/column.service';
import { createColumnSchema, reorderColumnsSchema } from '@/lib/validation';
import { handleApiError, successResponse } from '@/lib/api-utils';

/**
 * GET /api/columns?boardId=xxx - Get all columns for a board
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get('boardId');

    if (!boardId) {
      return NextResponse.json({ error: 'boardId query parameter is required' }, { status: 400 });
    }

    const columns = await getColumnsByBoardId(boardId);
    return successResponse(columns);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/columns - Create a new column
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createColumnSchema.parse(body);
    const column = await createColumn(validatedData);
    return successResponse(column, 201, 'Column created successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/columns/reorder - Reorder columns for a board
 * Body: { boardId: string, columnIds: string[] }
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { boardId, columnIds } = body;

    if (!boardId) {
      return NextResponse.json({ error: 'boardId is required' }, { status: 400 });
    }

    const validatedData = reorderColumnsSchema.parse({ columnIds });
    await reorderColumns(boardId, validatedData.columnIds);
    return successResponse({ success: true }, 200, 'Columns reordered successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
