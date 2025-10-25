import { useEffect, useState } from 'react';

interface TaskHistoryEntry {
  id: string;
  field: string;
  oldValue: string | null;
  newValue: string | null;
  changedAt: string;
}

interface TaskHistoryTimelineProps {
  taskId: string;
}

/**
 * TaskHistoryTimeline - Displays a timeline of changes to a task
 */
export default function TaskHistoryTimeline({ taskId }: TaskHistoryTimelineProps) {
  const [history, setHistory] = useState<TaskHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        const response = await fetch(`/api/tasks/${taskId}/history`);

        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }

        const data = await response.json();
        setHistory(data.history);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [taskId]);

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      status: 'Status',
      assignee: 'Assignee',
      title: 'Title',
      description: 'Description',
    };
    return labels[field] || field;
  };

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'status':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        );
      case 'assignee':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        );
      case 'title':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        );
      case 'description':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-text-secondary text-sm">Loading history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-sm py-4">
        <p>{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-text-muted text-sm py-8 text-center">
        <p>No history yet</p>
        <p className="text-xs mt-1">Changes to this task will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-text-primary font-semibold text-sm mb-4">Activity</h3>
      <div className="space-y-3">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="flex gap-3 pb-3 border-b border-border-primary last:border-0"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-accent/20 flex items-center justify-center text-surface-accent">
              {getFieldIcon(entry.field)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-sm">
                <span className="font-medium">{getFieldLabel(entry.field)}</span> changed
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="text-text-muted line-through">{entry.oldValue || '(none)'}</span>
                <svg className="w-3 h-3 text-text-muted" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-surface-accent font-medium">
                  {entry.newValue || '(none)'}
                </span>
              </div>
              <p className="text-text-muted text-xs mt-1">{formatRelativeTime(entry.changedAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

