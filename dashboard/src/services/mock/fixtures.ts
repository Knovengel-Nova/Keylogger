import type {
  AgentHealth,
  ConnectionStatus,
  DeviceUser,
  EventRecord,
  HeatmapCell,
  KeyFrequency,
  MlInsight,
  SessionBlock,
  SyncStatus,
  TimelinePoint,
  TypingSpeedPoint,
  UserOverview,
} from '../types';
import { createRng, computeHashSeed, pick, seededRandomInt } from './rng';

// Linux input-event-codes.h key codes, weighted roughly by English letter
// frequency so the generated "top keys" chart looks plausible.
const KEY_CODES: { code: number; name: string; weight: number }[] = [
  { code: 57, name: 'KEY_SPACE', weight: 18 },
  { code: 18, name: 'KEY_E', weight: 12 },
  { code: 20, name: 'KEY_T', weight: 9 },
  { code: 30, name: 'KEY_A', weight: 8 },
  { code: 24, name: 'KEY_O', weight: 7.5 },
  { code: 49, name: 'KEY_N', weight: 7 },
  { code: 23, name: 'KEY_I', weight: 7 },
  { code: 31, name: 'KEY_S', weight: 6.3 },
  { code: 35, name: 'KEY_H', weight: 6 },
  { code: 19, name: 'KEY_R', weight: 6 },
  { code: 32, name: 'KEY_D', weight: 4.2 },
  { code: 38, name: 'KEY_L', weight: 4 },
  { code: 14, name: 'KEY_BACKSPACE', weight: 3.8 },
  { code: 28, name: 'KEY_ENTER', weight: 3 },
  { code: 46, name: 'KEY_C', weight: 2.8 },
  { code: 22, name: 'KEY_U', weight: 2.8 },
  { code: 50, name: 'KEY_M', weight: 2.4 },
  { code: 17, name: 'KEY_W', weight: 2.4 },
  { code: 33, name: 'KEY_F', weight: 2.2 },
  { code: 21, name: 'KEY_Y', weight: 2 },
  { code: 34, name: 'KEY_G', weight: 2 },
  { code: 25, name: 'KEY_P', weight: 1.9 },
  { code: 48, name: 'KEY_B', weight: 1.5 },
  { code: 42, name: 'KEY_LEFTSHIFT', weight: 1.4 },
  { code: 37, name: 'KEY_K', weight: 0.8 },
  { code: 44, name: 'KEY_Z', weight: 0.1 },
];

const OS_LIST = ['Ubuntu 22.04', 'Fedora 40', 'Debian 12', 'Arch Linux', 'Pop!_OS 22.04'];
const DEVICE_ADJ = ['Lab', 'Workstation', 'Desk', 'Research', 'Dev'];
const NAME_FIRST = ['Priya', 'Arjun', 'Maya', 'Dev', 'Ishaan', 'Ananya', 'Kabir', 'Sara'];
const NAME_LAST = ['Rao', 'Mehta', 'Singh', 'Nair', 'Kapoor', 'Verma', 'Iyer', 'Shah'];

export interface MockUserSeed {
  id: string;
  displayName: string;
  deviceLabel: string;
  os: string;
  status: ConnectionStatus;
  activityLevel: 'high' | 'medium' | 'low';
}

export const MOCK_USERS: MockUserSeed[] = Array.from({ length: 7 }).map((_, i) => {
  const rng = createRng(computeHashSeed(`user-seed-${i}`));
  const first = pick(rng, NAME_FIRST);
  const last = pick(rng, NAME_LAST);
  return {
    id: `dev-${(i + 1).toString().padStart(3, '0')}`,
    displayName: `${first} ${last}`,
    deviceLabel: `${pick(rng, DEVICE_ADJ)}-${seededRandomInt(rng, 10, 99)}`,
    os: pick(rng, OS_LIST),
    status: pick(rng, ['online', 'online', 'offline', 'online'] as ConnectionStatus[]),
    activityLevel: pick(rng, ['high', 'medium', 'medium', 'low'] as const),
  };
});

const ACTIVITY_MULTIPLIER: Record<MockUserSeed['activityLevel'], number> = {
  high: 1.6,
  medium: 1,
  low: 0.45,
};

export function buildDeviceUser(seed: MockUserSeed, now: Date): DeviceUser {
  const rng = createRng(computeHashSeed(seed.id));
  const mult = ACTIVITY_MULTIPLIER[seed.activityLevel];
  const totalEvents = Math.round(seededRandomInt(rng, 8000, 42000) * mult);
  const pendingEvents = seed.status === 'offline' ? seededRandomInt(rng, 50, 400) : seededRandomInt(rng, 0, 40);
  const eventsLast24h = Math.round(seededRandomInt(rng, 600, 3200) * mult);
  const lastSeenMinutesAgo = seed.status === 'online' ? seededRandomInt(rng, 0, 4) : seededRandomInt(rng, 60, 60 * 30);
  const firstSeenDaysAgo = seededRandomInt(rng, 14, 120);

  return {
    id: seed.id,
    displayName: seed.displayName,
    avatarSeed: seed.id,
    deviceLabel: seed.deviceLabel,
    os: seed.os,
    firstSeen: new Date(now.getTime() - firstSeenDaysAgo * 86_400_000).toISOString(),
    lastSeen: new Date(now.getTime() - lastSeenMinutesAgo * 60_000).toISOString(),
    status: seed.status,
    totalEvents,
    pendingEvents,
    eventsLast24h,
  };
}

export function buildTimeline(seed: MockUserSeed, now: Date, hours = 48): TimelinePoint[] {
  const rng = createRng(computeHashSeed(`${seed.id}-timeline`));
  const mult = ACTIVITY_MULTIPLIER[seed.activityLevel];
  const points: TimelinePoint[] = [];
  for (let h = hours - 1; h >= 0; h--) {
    const bucket = new Date(now.getTime() - h * 3_600_000);
    const hourOfDay = bucket.getHours();
    // waking-hours bias: low activity 0-6, peak 9-12 & 14-18
    const circadian =
      hourOfDay < 6 ? 0.15 : hourOfDay < 9 ? 0.5 : hourOfDay < 12 ? 1 : hourOfDay < 14 ? 0.6 : hourOfDay < 18 ? 1.1 : hourOfDay < 22 ? 0.7 : 0.3;
    const base = seededRandomInt(rng, 20, 180) * mult * circadian;
    points.push({ bucketStart: bucket.toISOString(), count: Math.max(0, Math.round(base)) });
  }
  return points;
}

export function buildHeatmap(seed: MockUserSeed): HeatmapCell[] {
  const rng = createRng(computeHashSeed(`${seed.id}-heatmap`));
  const mult = ACTIVITY_MULTIPLIER[seed.activityLevel];
  const cells: HeatmapCell[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const weekday = day >= 1 && day <= 5;
      const circadian =
        hour < 6 ? 0.1 : hour < 9 ? 0.4 : hour < 18 ? (weekday ? 1 : 0.5) : hour < 22 ? 0.6 : 0.2;
      const count = Math.round(seededRandomInt(rng, 0, 140) * mult * circadian);
      cells.push({ dayOfWeek: day, hour, count });
    }
  }
  return cells;
}

export function buildKeyFrequency(seed: MockUserSeed): KeyFrequency[] {
  const rng = createRng(computeHashSeed(`${seed.id}-keys`));
  const mult = ACTIVITY_MULTIPLIER[seed.activityLevel];
  const totalKeystrokes = seededRandomInt(rng, 15000, 60000) * mult;
  const totalWeight = KEY_CODES.reduce((s, k) => s + k.weight, 0);
  return KEY_CODES.map((k) => ({
    eventName: k.name,
    eventCode: k.code,
    count: Math.round((k.weight / totalWeight) * totalKeystrokes * (0.85 + rng() * 0.3)),
  })).sort((a, b) => b.count - a.count);
}

export function buildTypingSpeed(seed: MockUserSeed, now: Date, hours = 24): TypingSpeedPoint[] {
  const rng = createRng(computeHashSeed(`${seed.id}-wpm`));
  const mult = ACTIVITY_MULTIPLIER[seed.activityLevel];
  const points: TypingSpeedPoint[] = [];
  for (let h = hours - 1; h >= 0; h--) {
    const bucket = new Date(now.getTime() - h * 3_600_000);
    const hourOfDay = bucket.getHours();
    const active = hourOfDay >= 7 && hourOfDay <= 23;
    const kpm = active ? seededRandomInt(rng, 90, 260) * mult : seededRandomInt(rng, 0, 20);
    points.push({ bucketStart: bucket.toISOString(), keysPerMinute: Math.round(kpm) });
  }
  return points;
}

export function buildSessions(seed: MockUserSeed, now: Date): SessionBlock[] {
  const rng = createRng(computeHashSeed(`${seed.id}-sessions`));
  const blocks: SessionBlock[] = [];
  let cursor = new Date(now.getTime() - 16 * 3_600_000);
  for (let i = 0; i < 10; i++) {
    const activeMin = seededRandomInt(rng, 15, 90);
    const start = new Date(cursor);
    const end = new Date(cursor.getTime() + activeMin * 60_000);
    blocks.push({ start: start.toISOString(), end: end.toISOString(), kind: 'active' });
    const idleMin = seededRandomInt(rng, 5, 60);
    cursor = new Date(end.getTime() + idleMin * 60_000);
    if (idleMin > 10) {
      blocks.push({ start: end.toISOString(), end: cursor.toISOString(), kind: 'idle' });
    }
    if (cursor > now) break;
  }
  return blocks;
}

export function buildSyncStatus(user: DeviceUser): SyncStatus {
  const rng = createRng(computeHashSeed(`${user.id}-sync`));
  return {
    deliveredEvents: user.totalEvents - user.pendingEvents,
    pendingEvents: user.pendingEvents,
    lastBatchId: user.pendingEvents > 0 ? `batch-${seededRandomInt(rng, 1000, 9999)}` : null,
    lastDeliveredAt: null,
  };
}

export function buildMlInsights(seed: MockUserSeed): MlInsight[] {
  const rng = createRng(computeHashSeed(`${seed.id}-ml`));
  const mlSamples: MlInsight[] = [
    {
      kind: 'reconstructed_text',
      label: 'Reconstructed text snippet',
      confidence: Math.round(seededRandomInt(rng, 40, 72)) / 100,
      detail: '"...meeting notes draft for next sprint review..."',
    },
    {
      kind: 'anomaly',
      label: 'Unusual burst typing at 02:14',
      confidence: Math.round(seededRandomInt(rng, 55, 90)) / 100,
      detail: 'Keystroke rate 4.2x above this user\'s rolling baseline.',
    },
    {
      kind: 'app_context',
      label: 'Likely active window: code editor',
      confidence: Math.round(seededRandomInt(rng, 50, 85)) / 100,
      detail: 'Inferred from key-combo patterns (no window-title capture exists yet).',
    },
  ];
  return mlSamples;
}

export function buildAgentHealth(seed: MockUserSeed, user: DeviceUser): AgentHealth {
  const rng = createRng(computeHashSeed(`${seed.id}-health`));
  return {
    deviceId: seed.id,
    discoveryState: user.status === 'online' ? 'found' : pick(rng, ['lost', 'searching']),
    lastHeartbeatAt: user.status === 'online' ? user.lastSeen : null,
    heartbeatIntervalS: 15,
    tcpLinkState: 'not_implemented',
    encryptionEnabled: true,
  };
}

export function buildEventLog(seed: MockUserSeed, user: DeviceUser, count: number): EventRecord[] {
  const rng = createRng(computeHashSeed(`${seed.id}-eventlog`));
  const events: EventRecord[] = [];
  let ts = Math.floor(Date.now() / 1000) - count * 2;
  for (let i = 0; i < count; i++) {
    const key = pick(rng, KEY_CODES);
    const value = pick(rng, [0, 1, 1, 2] as const);
    ts += seededRandomInt(rng, 1, 4);
    events.push({
      id: i + 1,
      deviceId: seed.id,
      timestampS: ts,
      timestampUs: seededRandomInt(rng, 0, 999_999),
      eventCode: key.code,
      eventValue: value,
      eventName: key.name,
      status: i < user.pendingEvents ? 0 : 1,
      batchId: i % 150 === 0 ? `batch-${Math.floor(i / 150) + 1000}` : null,
    });
  }
  return events.reverse();
}

export function buildUserOverview(seed: MockUserSeed, now: Date): UserOverview {
  const user = buildDeviceUser(seed, now);
  return {
    user,
    timeline: buildTimeline(seed, now),
    heatmap: buildHeatmap(seed),
    keyFrequency: buildKeyFrequency(seed),
    typingSpeed: buildTypingSpeed(seed, now),
    sessions: buildSessions(seed, now),
    sync: buildSyncStatus(user),
    mlInsights: buildMlInsights(seed),
  };
}
