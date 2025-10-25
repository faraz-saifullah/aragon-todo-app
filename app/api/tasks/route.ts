import { NextRequest } from 'next/server';
import { getTasksByBoardId, createTask } from '@/lib/services/task.service';
import { createTaskSchema } from '@/lib/validation';
import { handleApiError, successResponse } from '@/lib/api-utils';

/**
 * GET /api/tasks?boardId=xyz - Get all tasks for a board
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const boardId = searchParams.get('boardId');
    
    if (!boardId) {
      return successResponse({ error: 'boardId query parameter is required' }, 400);
    }
    
    const tasks = await getTasksByBoardId(boardId);
    return successResponse(tasks);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/tasks - Create a new task
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createTaskSchema.parse(body);
    const task = await createTask(validatedData);
    return successResponse(task, 201, 'Task created successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

