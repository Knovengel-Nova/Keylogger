// Data shapes for the admin dashboard.
//
// Fields marked REAL mirror columns that already exist in the shipped
// schema (Keylogger/db/schema_client.sql) or the agent protocol
// (Keylogger/agent/.../protocol). Fields marked SIMULATED have no
// backing implementation yet (no Main Server / Postgres / ML Server) and
// only exist in the mock data source today.

export type ConnectionStatus = 'online' | 'offline' | 'unknown';

export interface DeviceUser {
  id: string; // REAL: device_info.device_uuid
  displayName: string; // SIMULATED: no identity/user mapping exists server-side yet
  avatarSeed: string;
  deviceLabel: string;
  os: string;
  firstSeen: string; // REAL: device_info.created_at
  lastSeen: string; // SIMULATED: derived from heartbeat protocol, not yet wired server-side
  status: ConnectionStatus; // SIMULATED: heartbeat exists client-side, no server to track it
  totalEvents: number; // REAL: count(events)
  pendingEvents: number; // REAL: count(events where status = 0)
  eventsLast24h: number; // REAL (derivable from events.timestamp_s)
}

export interface EventRecord {
  id: number;
  deviceId: string;
  timestampS: number; // REAL: events.timestamp_s
  timestampUs: number; // REAL: events.timestamp_us
  eventCode: number; // REAL: events.event_code (Linux input event code)
  eventValue: number; // REAL: events.event_value (0=up, 1=down, 2=repeat)
  eventName: string; // REAL: events.event_name
  status: 0 | 1; // REAL: events.status (0=pending, 1=delivered)
  batchId: string | null; // REAL: events.batch_id
}

export interface TimelinePoint {
  bucketStart: string; // ISO timestamp
  count: number;
}

export interface HeatmapCell {
  dayOfWeek: number; // 0 = Sunday
  hour: number; // 0-23
  count: number;
}

export interface KeyFrequency {
  eventName: string;
  eventCode: number;
  count: number;
}

export interface TypingSpeedPoint {
  bucketStart: string;
  keysPerMinute: number;
}

export interface SessionBlock {
  start: string;
  end: string;
  kind: 'active' | 'idle';
}

export interface SyncStatus {
  deliveredEvents: number; // REAL: count(status = 1)
  pendingEvents: number; // REAL: count(status = 0)
  lastBatchId: string | null; // REAL: events.batch_id
  lastDeliveredAt: string | null; // SIMULATED: no server ACK pipeline yet
}

export interface AgentHealth {
  deviceId: string;
  discoveryState: 'found' | 'searching' | 'lost'; // SIMULATED: UDP discovery is implemented client-side, no server to confirm against
  lastHeartbeatAt: string | null; // SIMULATED: heartbeat sender exists, nothing receives it yet
  heartbeatIntervalS: number; // REAL: Constants.HEARTBEAT_BPM derived
  tcpLinkState: 'not_implemented'; // REAL (as a fact): TcpSender.java is an empty stub
  encryptionEnabled: boolean; // REAL: CryptoManager exists client-side
}

export interface MlInsight {
  kind: 'reconstructed_text' | 'anomaly' | 'app_context';
  label: string;
  confidence: number;
  detail: string;
}

export interface UserOverview {
  user: DeviceUser;
  timeline: TimelinePoint[];
  heatmap: HeatmapCell[];
  keyFrequency: KeyFrequency[];
  typingSpeed: TypingSpeedPoint[];
  sessions: SessionBlock[];
  sync: SyncStatus;
  mlInsights: MlInsight[]; // entirely SIMULATED — ML Server does not exist
}

export interface FleetSummary {
  totalUsers: number;
  onlineUsers: number;
  totalEventsToday: number;
  totalPendingEvents: number;
}

/** Marks whether a data source implementation is backed by something real or simulated. */
export type DataSourceMode = 'mock' | 'live';
