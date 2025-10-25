import { NextRequest } from 'next/server';
import { getTaskHistory } from '@/lib/services/task.service';
import { handleApiError } from '@/lib/api-utils';

/**
 * GET /api/tasks/:id/history
 * Get history of changes for a specific task
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const history = await getTaskHistory(id);
    return Response.json({ history });
  } catch (error) {
    return handleApiError(error);
  }
}
