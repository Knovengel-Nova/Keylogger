import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { dataSource } from '../services';
import { Card } from '../components/ui/Card';
import { StatTile } from '../components/ui/StatTile';
import { StatusDot } from '../components/ui/StatusDot';
import { DataModeBadge } from '../components/ui/DataModeBadge';
import { formatCompact, formatNumber, formatRelativeTime, initials } from '../lib/format';

export function FleetOverviewPage() {
  const summaryQuery = useQuery({ queryKey: ['fleet-summary'], queryFn: () => dataSource.getFleetSummary() });
  const usersQuery = useQuery({ queryKey: ['users'], queryFn: () => dataSource.listUsers() });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text)]">Fleet overview</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            All monitored devices. Click a user to see their keylog analytics.
          </p>
        </div>
        <DataModeBadge live={false} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Monitored users" value={summaryQuery.data ? formatNumber(summaryQuery.data.totalUsers) : '—'} />
        <StatTile
          label="Online now"
          value={summaryQuery.data ? formatNumber(summaryQuery.data.onlineUsers) : '—'}
          hint={summaryQuery.data ? `of ${summaryQuery.data.totalUsers}` : undefined}
        />
        <StatTile
          label="Events captured (24h)"
          value={summaryQuery.data ? formatCompact(summaryQuery.data.totalEventsToday) : '—'}
        />
        <StatTile
          label="Pending sync"
          value={summaryQuery.data ? formatNumber(summaryQuery.data.totalPendingEvents) : '—'}
          hint="events not yet delivered to a server"
        />
      </div>

      <Card title="Users" subtitle={usersQuery.data ? `${usersQuery.data.length} devices` : undefined}>
        {usersQuery.isLoading && <p className="text-sm text-[var(--color-text-muted)]">Loading…</p>}
        <div className="divide-y divide-[var(--color-border)]">
          {usersQuery.data?.map((user) => (
            <Link
              key={user.id}
              to={`/users/${user.id}`}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0 hover:opacity-80"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-bg)] text-xs font-semibold text-[var(--color-accent)]">
                  {initials(user.displayName)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--color-text)]">{user.displayName}</p>
                  <p className="truncate text-xs text-[var(--color-text-faint)]">
                    {user.deviceLabel} · {user.os}
                  </p>
                </div>
              </div>

              <div className="hidden text-right sm:block">
                <p className="text-sm tabular-nums text-[var(--color-text)]">{formatCompact(user.totalEvents)}</p>
                <p className="text-xs text-[var(--color-text-faint)]">total events</p>
              </div>

              <div className="hidden text-right md:block">
                <p className="text-sm tabular-nums text-[var(--color-text)]">{formatCompact(user.eventsLast24h)}</p>
                <p className="text-xs text-[var(--color-text-faint)]">last 24h</p>
              </div>

              <div className="w-28 shrink-0 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <StatusDot status={user.status} />
                  <span className="text-sm capitalize text-[var(--color-text)]">{user.status}</span>
                </div>
                <p className="text-xs text-[var(--color-text-faint)]">{formatRelativeTime(user.lastSeen)}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
