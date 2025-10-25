import { NextRequest, NextResponse } from 'next/server';
import { getColumnById, updateColumn, deleteColumn } from '@/lib/services/column.service';
import { updateColumnSchema } from '@/lib/validation';
import { handleApiError, successResponse } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/columns/[id] - Get a specific column
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const column = await getColumnById(id);

    if (!column) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }

    return successResponse(column);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/columns/[id] - Update a column (name, color only)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateColumnSchema.parse(body);
    const column = await updateColumn(id, validatedData);
    return successResponse(column, 200, 'Column updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/columns/[id]?moveToColumnId=xxx - Delete a column
 * Requires moveToColumnId query param to specify where to move existing tasks
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const moveToColumnId = searchParams.get('moveToColumnId');

    if (!moveToColumnId) {
      return NextResponse.json(
        {
          error:
            'moveToColumnId query parameter is required. Tasks must be moved to another column before deletion.',
        },
        { status: 400 }
      );
    }

    await deleteColumn(id, moveToColumnId);
    return successResponse({ id }, 200, 'Column deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
