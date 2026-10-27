import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { dataSource } from '../services';

const ROWS_PER_PAGE = 20;

export function EventLogTable({ userId }: { userId: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const eventLogQuery = useQuery({
    queryKey: ['event-log', userId, currentPage],
    queryFn: () => dataSource.getEventLog(userId, currentPage, ROWS_PER_PAGE),
    placeholderData: (prev) => prev,
  });

  const pageCount = eventLogQuery.data ? Math.max(1, Math.ceil(eventLogQuery.data.total / ROWS_PER_PAGE)) : 1;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[var(--color-text-faint)]">
              <th className="py-2 pr-4 font-medium">Timestamp</th>
              <th className="py-2 pr-4 font-medium">Event</th>
              <th className="py-2 pr-4 font-medium">Code</th>
              <th className="py-2 pr-4 font-medium">Action</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 font-medium">Batch</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {eventLogQuery.data?.events.map((eventRow) => (
              <tr key={eventRow.id} className="text-[var(--color-text)]">
                <td className="py-2 pr-4 tabular-nums text-[var(--color-text-muted)]">
                  {new Date(eventRow.timestampS * 1000).toLocaleTimeString('en-US')}
                </td>
                <td className="py-2 pr-4 font-mono">{eventRow.eventName}</td>
                <td className="py-2 pr-4 tabular-nums text-[var(--color-text-muted)]">{eventRow.eventCode}</td>
                <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                  {eventRow.eventValue === 1 ? 'down' : eventRow.eventValue === 0 ? 'up' : 'repeat'}
                </td>
                <td className="py-2 pr-4">
                  <span
                    className={
                      'rounded-full px-2 py-0.5 text-[10px] font-medium ' +
                      (eventRow.status === 1
                        ? 'bg-[var(--color-good)]/10 text-[var(--color-good)]'
                        : 'bg-[var(--color-warn)]/10 text-[var(--color-warn)]')
                    }
                  >
                    {eventRow.status === 1 ? 'delivered' : 'pending'}
                  </span>
                </td>
                <td className="py-2 font-mono text-[var(--color-text-faint)]">{eventRow.batchId ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
        <span>
          {eventLogQuery.data ? `${eventLogQuery.data.total.toLocaleString()} events` : 'Loading…'}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="rounded-md border border-[var(--color-border)] px-2 py-1 disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {currentPage} / {pageCount}
          </span>
          <button
            type="button"
            disabled={currentPage >= pageCount}
            onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
            className="rounded-md border border-[var(--color-border)] px-2 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
