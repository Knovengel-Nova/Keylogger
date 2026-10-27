import { useQuery } from '@tanstack/react-query';
import { dataSource } from '../services';
import { Card } from '../components/ui/Card';
import { DataModeBadge } from '../components/ui/DataModeBadge';
import { formatRelativeTime } from '../lib/format';

const DISCOVERY_STATE_LABEL: Record<string, string> = {
  found: 'Server found',
  searching: 'Searching (UDP broadcast)',
  lost: 'Lost',
};

export function DeviceHealthPage() {
  const deviceUsersQuery = useQuery({ queryKey: ['users'], queryFn: () => dataSource.listUsers() });
  const agentHealthQuery = useQuery({ queryKey: ['agent-health'], queryFn: () => dataSource.listAgentHealth() });

  const userLookupMap = new Map((deviceUsersQuery.data ?? []).map((entry) => [entry.id, entry]));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text)]">Agent &amp; device health</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Discovery, heartbeat, encryption and transport state per agent.
          </p>
        </div>
        <DataModeBadge live={false} label="Simulated — no server to report from" />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[var(--color-text-faint)]">
                <th className="py-2 pr-4 font-medium">Device</th>
                <th className="py-2 pr-4 font-medium">Discovery</th>
                <th className="py-2 pr-4 font-medium">Last heartbeat</th>
                <th className="py-2 pr-4 font-medium">Heartbeat interval</th>
                <th className="py-2 pr-4 font-medium">Encryption</th>
                <th className="py-2 font-medium">TCP data link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {agentHealthQuery.data?.map((healthRecord) => {
                const matchedUser = userLookupMap.get(healthRecord.deviceId);
                return (
                  <tr key={healthRecord.deviceId} className="text-[var(--color-text)]">
                    <td className="py-2 pr-4">{matchedUser?.displayName ?? healthRecord.deviceId}</td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                      {DISCOVERY_STATE_LABEL[healthRecord.discoveryState]}
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                      {healthRecord.lastHeartbeatAt ? formatRelativeTime(healthRecord.lastHeartbeatAt) : '—'}
                    </td>
                    <td className="py-2 pr-4 tabular-nums text-[var(--color-text-muted)]">
                      {healthRecord.heartbeatIntervalS}s
                    </td>
                    <td className="py-2 pr-4">
                      <span className="rounded-full bg-[var(--color-good)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--color-good)]">
                        AES enabled
                      </span>
                    </td>
                    <td className="py-2">
                      <span className="rounded-full bg-[var(--color-bad)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--color-bad)]">
                        not implemented
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card
        title="Protocol notes"
        subtitle="What's actually implemented in the agent today"
      >
        <ul className="list-disc space-y-1.5 pl-5 text-xs text-[var(--color-text-muted)]">
          <li>UDP discovery broadcast + listener — implemented (Agent.java, UdpListener.java).</li>
          <li>Heartbeat sender — implemented (HeartbeatSender.java).</li>
          <li>AES encryption/decryption — implemented (CryptoManager.java).</li>
          <li>
            TCP event delivery to a server — <strong>not implemented</strong>; TcpSender.run() is an empty
            stub, so no device has ever actually shipped captured events off-box.
          </li>
          <li>Main Server (SpringBoot), Postgres store, ML Server — not started.</li>
        </ul>
      </Card>
    </div>
  );
}
