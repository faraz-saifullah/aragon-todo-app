/**
 * Time utility functions
 */

/**
 * Format a date to relative time (e.g., "2h ago", "3d ago")
 */
export function formatRelativeTime(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;

  return date.toLocaleDateString();
}

/**
 * Format duration in a compact way (e.g., "2h", "3d", "2w")
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return '<1m';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w`;

  return `${Math.floor(seconds / 2592000)}mo`;
}

/**
 * Calculate how long a task has been in its current column
 * by finding the last column change in its history
 */
export function calculateTimeInColumn(
  taskCreatedAt: string | Date,
  history?: Array<{ field: string; changedAt: string | Date }>
): { duration: string; timestamp: Date } {
  const now = new Date();

  // Find the most recent column change
  const columnChanges = history?.filter((h) => h.field === 'column') || [];

  let lastColumnChange: Date;

  if (columnChanges.length > 0) {
    // Sort by most recent first
    columnChanges.sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());
    lastColumnChange = new Date(columnChanges[0].changedAt);
  } else {
    // No column changes - use task creation date
    lastColumnChange = new Date(taskCreatedAt);
  }

  const diffInSeconds = Math.floor((now.getTime() - lastColumnChange.getTime()) / 1000);

  return {
    duration: formatDuration(diffInSeconds),
    timestamp: lastColumnChange,
  };
}
