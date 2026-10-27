interface Props {
  live?: boolean;
  label?: string;
}

/** Marks a panel/metric as backed by real data vs. simulated/demo data. */
export function DataModeBadge({ live: isLive = false, label: badgeLabel }: Props) {
  const badgeClasses = isLive
    ? 'border-[var(--color-good)]/30 bg-[var(--color-good)]/10 text-[var(--color-good)]'
    : 'border-[var(--color-border-strong)] bg-[var(--color-surface-2)] text-[var(--color-text-faint)]';
  const dotClasses = isLive ? 'bg-[var(--color-good)]' : 'bg-[var(--color-text-faint)]';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${badgeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotClasses}`} />
      {badgeLabel ?? (isLive ? 'Live' : 'Simulated')}
    </span>
  );
}
