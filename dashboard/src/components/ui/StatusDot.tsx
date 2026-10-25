import clsx from 'clsx';
import type { ConnectionStatus } from '../../services/types';

const COLOR: Record<ConnectionStatus, string> = {
  online: 'bg-[var(--color-good)]',
  offline: 'bg-[var(--color-text-faint)]',
  unknown: 'bg-[var(--color-warn)]',
};

export function StatusDot({ status, className }: { status: ConnectionStatus; className?: string }) {
  return <span className={clsx('inline-block h-2 w-2 rounded-full', COLOR[status], className)} />;
}
