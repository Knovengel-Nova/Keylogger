import type { ReactNode } from 'react';

interface StatTileProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
}

export function StatTile({
  label: statLabel,
  value: statValue,
  hint: statHint,
  icon: statIcon,
}: StatTileProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[var(--color-text-faint)]">{statLabel}</p>
        {statIcon}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--color-text)]">{statValue}</p>
      {statHint && <p className="mt-1 text-xs text-[var(--color-text-muted)]">{statHint}</p>}
    </div>
  );
}
