import { Card } from '../components/ui/Card';
import { DataModeBadge } from '../components/ui/DataModeBadge';

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Settings</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Admin preferences and alerting.</p>
      </div>

      <Card title="Alert thresholds" action={<DataModeBadge live={false} label="UI only — no alert engine yet" />}>
        <div className="space-y-3 text-sm">
          <label className="flex items-center justify-between">
            <span className="text-[var(--color-text-muted)]">Flag idle devices after</span>
            <select className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm">
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>4 hours</option>
            </select>
          </label>
          <label className="flex items-center justify-between">
            <span className="text-[var(--color-text-muted)]">Notify on pending-sync backlog above</span>
            <select className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm">
              <option>500 events</option>
              <option>1,000 events</option>
              <option>5,000 events</option>
            </select>
          </label>
          <label className="flex items-center justify-between">
            <span className="text-[var(--color-text-muted)]">ML anomaly alerts</span>
            <span className="text-xs text-[var(--color-text-faint)]">Unavailable — no ML Server</span>
          </label>
        </div>
      </Card>

      <Card title="About this dashboard">
        <p className="text-sm text-[var(--color-text-muted)]">
          This dashboard runs against a mock data source only. See the banner at the top of the app for
          what's real vs. simulated. When the Main Server API ships, a <code>liveDataSource</code> can be
          swapped in via <code>src/services/index.ts</code> without touching any page or chart.
        </p>
      </Card>
    </div>
  );
}
