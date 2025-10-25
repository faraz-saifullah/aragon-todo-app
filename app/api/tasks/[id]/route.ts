import { NextRequest } from 'next/server';
import { getTaskById, updateTask, deleteTask } from '@/lib/services/task.service';
import { updateTaskSchema } from '@/lib/validation';
import { handleApiError, successResponse } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/tasks/[id] - Get a specific task
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const task = await getTaskById(id);

    if (!task) {
      return successResponse({ error: 'Task not found' }, 404);
    }

    return successResponse(task);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/tasks/[id] - Update a task
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);
    const task = await updateTask(id, validatedData);
    return successResponse(task, 200, 'Task updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/tasks/[id] - Delete a task
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await deleteTask(id);
    return successResponse({ id }, 200, 'Task deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
