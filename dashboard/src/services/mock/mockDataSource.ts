import type { DataSource, EventLogPage } from '../dataSource';
import type { AgentHealth, DeviceUser, FleetSummary, UserOverview } from '../types';
import {
  MOCK_USERS,
  buildAgentHealth,
  buildDeviceUser,
  buildEventLog,
  buildUserOverview,
} from './fixtures';

const LATENCY_MS = 220;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

export const mockDataSource: DataSource = {
  mode: 'mock',

  async getFleetSummary(): Promise<FleetSummary> {
    const now = new Date();
    const users = MOCK_USERS.map((s) => buildDeviceUser(s, now));
    return delay({
      totalUsers: users.length,
      onlineUsers: users.filter((u) => u.status === 'online').length,
      totalEventsToday: users.reduce((sum, u) => sum + u.eventsLast24h, 0),
      totalPendingEvents: users.reduce((sum, u) => sum + u.pendingEvents, 0),
    });
  },

  async listUsers(): Promise<DeviceUser[]> {
    const now = new Date();
    return delay(MOCK_USERS.map((s) => buildDeviceUser(s, now)));
  },

  async getUserOverview(userId: string): Promise<UserOverview | null> {
    const seed = MOCK_USERS.find((s) => s.id === userId);
    if (!seed) return delay(null);
    return delay(buildUserOverview(seed, new Date()));
  },

  async getEventLog(userId: string, page: number, pageSize: number): Promise<EventLogPage> {
    const seed = MOCK_USERS.find((s) => s.id === userId);
    if (!seed) return delay({ events: [], total: 0, page, pageSize });
    const user = buildDeviceUser(seed, new Date());
    const all = buildEventLog(seed, user, 600);
    const start = (page - 1) * pageSize;
    return delay({
      events: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  },

  async getAgentHealth(userId: string): Promise<AgentHealth | null> {
    const seed = MOCK_USERS.find((s) => s.id === userId);
    if (!seed) return delay(null);
    const user = buildDeviceUser(seed, new Date());
    return delay(buildAgentHealth(seed, user));
  },

  async listAgentHealth(): Promise<AgentHealth[]> {
    const now = new Date();
    return delay(MOCK_USERS.map((s) => buildAgentHealth(s, buildDeviceUser(s, now))));
  },
};
