import type { DataSource, EventLogPage } from '../dataSource';
import type { AgentHealth, DeviceUser, FleetSummary, UserOverview } from '../types';
import {
  MOCK_USERS,
  buildAgentHealth,
  buildDeviceUser,
  buildEventLog,
  buildUserOverview,
} from './fixtures';

const SIMULATED_DELAY_MS = 220;

function simulateLatency<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));
}

export const mockDataSource: DataSource = {
  mode: 'mock',

  async getFleetSummary(): Promise<FleetSummary> {
    const currentTime = new Date();
    const users = MOCK_USERS.map((userSeed) => buildDeviceUser(userSeed, currentTime));
    return simulateLatency({
      totalUsers: users.length,
      onlineUsers: users.filter((u) => u.status === 'online').length,
      totalEventsToday: users.reduce((total, u) => total + u.eventsLast24h, 0),
      totalPendingEvents: users.reduce((total, u) => total + u.pendingEvents, 0),
    });
  },

  async listUsers(): Promise<DeviceUser[]> {
    const currentTime = new Date();
    return simulateLatency(MOCK_USERS.map((userSeed) => buildDeviceUser(userSeed, currentTime)));
  },

  async getUserOverview(userId: string): Promise<UserOverview | null> {
    const userSeed = MOCK_USERS.find((s) => s.id === userId);
    if (!userSeed) return simulateLatency(null);
    return simulateLatency(buildUserOverview(userSeed, new Date()));
  },

  async getEventLog(userId: string, page: number, pageSize: number): Promise<EventLogPage> {
    const userSeed = MOCK_USERS.find((s) => s.id === userId);
    if (!userSeed) return simulateLatency({ events: [], total: 0, page, pageSize });
    const user = buildDeviceUser(userSeed, new Date());
    const all = buildEventLog(userSeed, user, 600);
    const startIdx = (page - 1) * pageSize;
    return simulateLatency({
      events: all.slice(startIdx, startIdx + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  },

  async getAgentHealth(userId: string): Promise<AgentHealth | null> {
    const userSeed = MOCK_USERS.find((s) => s.id === userId);
    if (!userSeed) return simulateLatency(null);
    const user = buildDeviceUser(userSeed, new Date());
    return simulateLatency(buildAgentHealth(userSeed, user));
  },

  async listAgentHealth(): Promise<AgentHealth[]> {
    const currentTime = new Date();
    return simulateLatency(MOCK_USERS.map((userSeed) => buildAgentHealth(userSeed, buildDeviceUser(userSeed, currentTime))));
  },
};
