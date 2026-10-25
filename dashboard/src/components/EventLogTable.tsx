import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { dataSource } from '../services';

const PAGE_SIZE = 20;

export function EventLogTable({ userId }: { userId: string }) {
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: ['event-log', userId, page],
    queryFn: () => dataSource.getEventLog(userId, page, PAGE_SIZE),
    placeholderData: (prev) => prev,
  });

  const totalPages = query.data ? Math.max(1, Math.ceil(query.data.total / PAGE_SIZE)) : 1;

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
            {query.data?.events.map((ev) => (
              <tr key={ev.id} className="text-[var(--color-text)]">
                <td className="py-2 pr-4 tabular-nums text-[var(--color-text-muted)]">
                  {new Date(ev.timestampS * 1000).toLocaleTimeString('en-US')}
                </td>
                <td className="py-2 pr-4 font-mono">{ev.eventName}</td>
                <td className="py-2 pr-4 tabular-nums text-[var(--color-text-muted)]">{ev.eventCode}</td>
                <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                  {ev.eventValue === 1 ? 'down' : ev.eventValue === 0 ? 'up' : 'repeat'}
                </td>
                <td className="py-2 pr-4">
                  <span
                    className={
                      'rounded-full px-2 py-0.5 text-[10px] font-medium ' +
                      (ev.status === 1
                        ? 'bg-[var(--color-good)]/10 text-[var(--color-good)]'
                        : 'bg-[var(--color-warn)]/10 text-[var(--color-warn)]')
                    }
                  >
                    {ev.status === 1 ? 'delivered' : 'pending'}
                  </span>
                </td>
                <td className="py-2 font-mono text-[var(--color-text-faint)]">{ev.batchId ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
        <span>
          {query.data ? `${query.data.total.toLocaleString()} events` : 'Loading…'}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md border border-[var(--color-border)] px-2 py-1 disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-md border border-[var(--color-border)] px-2 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
