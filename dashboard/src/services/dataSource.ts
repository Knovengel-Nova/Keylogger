import type {
  AgentHealth,
  DataSourceMode,
  DeviceUser,
  EventRecord,
  FleetSummary,
  UserOverview,
} from './types';

export interface EventLogPage {
  events: EventRecord[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Everything the dashboard needs, independent of where it comes from.
 * Today only `mockDataSource` implements this. Swapping in a real
 * Main Server API later means adding a new implementation here —
 * no component code should need to change.
 */
export interface DataSource {
  mode: DataSourceMode;
  getFleetSummary(): Promise<FleetSummary>;
  listUsers(): Promise<DeviceUser[]>;
  getUserOverview(userId: string): Promise<UserOverview | null>;
  getEventLog(userId: string, page: number, pageSize: number): Promise<EventLogPage>;
  getAgentHealth(userId: string): Promise<AgentHealth | null>;
  listAgentHealth(): Promise<AgentHealth[]>;
}
