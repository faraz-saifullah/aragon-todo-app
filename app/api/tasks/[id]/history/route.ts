import { NextRequest } from 'next/server';
import { getTaskHistory } from '@/lib/services/task.service';
import { handleApiError } from '@/lib/api-utils';

/**
 * GET /api/tasks/:id/history
 * Get history of changes for a specific task
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const history = await getTaskHistory(params.id);
    return Response.json({ history });
  } catch (error) {
    return handleApiError(error);
  }
}
