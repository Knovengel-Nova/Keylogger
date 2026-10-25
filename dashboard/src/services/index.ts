import type { DataSource } from './dataSource';
import { mockDataSource } from './mock/mockDataSource';

// Only a mock implementation exists today — there is no Main Server /
// Postgres / ML Server yet (see documentation/Architecture Diagram AnB.png).
// When a real API ships, add a `services/live/liveDataSource.ts` implementing
// `DataSource` and switch this export. No page/component should need to change.
export const dataSource: DataSource = mockDataSource;
