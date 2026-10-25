import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { dataSource } from '../services';
import { Card } from '../components/ui/Card';
import { StatTile } from '../components/ui/StatTile';
import { StatusDot } from '../components/ui/StatusDot';
import { DataModeBadge } from '../components/ui/DataModeBadge';
import { ActivityTimelineChart } from '../components/charts/ActivityTimelineChart';
import { TypingSpeedChart } from '../components/charts/TypingSpeedChart';
import { KeyFrequencyChart } from '../components/charts/KeyFrequencyChart';
import { HourDayHeatmap } from '../components/charts/HourDayHeatmap';
import { SessionTimeline } from '../components/charts/SessionTimeline';
import { EventLogTable } from '../components/EventLogTable';
import { formatCompact, formatNumber, formatRelativeTime, initials } from '../lib/format';

export function UserDetailPage() {
  const { userId = '' } = useParams();
  const overviewQuery = useQuery({
    queryKey: ['user-overview', userId],
    queryFn: () => dataSource.getUserOverview(userId),
  });

  if (overviewQuery.isLoading) {
    return <p className="text-sm text-[var(--color-text-muted)]">Loading…</p>;
  }

  const overview = overviewQuery.data;
  if (!overview) {
    return (
      <div>
        <p className="text-sm text-[var(--color-text)]">User not found.</p>
        <Link to="/" className="text-sm text-[var(--color-accent)]">
          Back to overview
        </Link>
      </div>
    );
  }

  const { user, timeline, heatmap, keyFrequency, typingSpeed, sessions, sync, mlInsights } = overview;
  const avgKpm = Math.round(typingSpeed.reduce((s, p) => s + p.keysPerMinute, 0) / typingSpeed.length) || 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Link to="/" className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-accent)]">
          ← Fleet overview
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent-bg)] text-sm font-semibold text-[var(--color-accent)]">
              {initials(user.displayName)}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[var(--color-text)]">{user.displayName}</h1>
              <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-faint)]">
                <StatusDot status={user.status} />
                {user.deviceLabel} · {user.os} · {formatRelativeTime(user.lastSeen)}
              </p>
            </div>
          </div>
          <DataModeBadge live={false} label="Simulated profile" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Total events" value={formatNumber(user.totalEvents)} />
        <StatTile label="Last 24h" value={formatCompact(user.eventsLast24h)} />
        <StatTile label="Avg typing speed" value={`${avgKpm}/min`} hint="keys per minute" />
        <StatTile
          label="Pending sync"
          value={formatNumber(sync.pendingEvents)}
          hint={sync.lastBatchId ? `last batch ${sync.lastBatchId}` : 'fully delivered'}
        />
      </div>

      <Card
        title="Activity timeline"
        subtitle="Keystroke volume, last 48 hours"
        action={<DataModeBadge live={false} />}
      >
        <ActivityTimelineChart data={timeline} />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Activity heatmap" subtitle="Keystrokes by hour and day of week" action={<DataModeBadge live={false} />}>
          <HourDayHeatmap data={heatmap} />
        </Card>
        <Card title="Top keys" subtitle="Most frequent key presses" action={<DataModeBadge live={false} />}>
          <KeyFrequencyChart data={keyFrequency} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Typing speed" subtitle="Keys per minute, last 24 hours" action={<DataModeBadge live={false} />}>
          <TypingSpeedChart data={typingSpeed} />
        </Card>
        <Card title="Active vs idle sessions" subtitle="Last ~16 hours" action={<DataModeBadge live={false} />}>
          <SessionTimeline sessions={sessions} />
        </Card>
      </div>

      <Card
        title="Sync status"
        subtitle="Maps to the real events.status / batch_id columns"
        action={<DataModeBadge live={false} label="Schema-backed, no server yet" />}
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile label="Delivered" value={formatNumber(sync.deliveredEvents)} />
          <StatTile label="Pending" value={formatNumber(sync.pendingEvents)} />
          <StatTile label="Last batch" value={sync.lastBatchId ?? '—'} />
          <StatTile
            label="Transport"
            value="Not implemented"
            hint="TcpSender.java is an empty stub — no delivery path yet"
          />
        </div>
      </Card>

      <Card title="Raw event log" subtitle="events table, paginated">
        <EventLogTable userId={user.id} />
      </Card>

      <Card
        title="ML-derived insights"
        subtitle="Requires the planned ML Server — entirely simulated"
        action={<DataModeBadge live={false} label="Simulated — ML Server not built" />}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {mlInsights.map((insight, i) => (
            <div key={i} className="rounded-lg border border-dashed border-[var(--color-border-strong)] p-3">
              <p className="text-xs font-medium text-[var(--color-text)]">{insight.label}</p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">{insight.detail}</p>
              <p className="mt-2 text-[11px] text-[var(--color-text-faint)]">
                confidence {Math.round(insight.confidence * 100)}%
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
