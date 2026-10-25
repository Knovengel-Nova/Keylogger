interface Props {
  live?: boolean;
  label?: string;
}

/** Marks a panel/metric as backed by real data vs. simulated/demo data. */
export function DataModeBadge({ live = false, label }: Props) {
  return (
    <span
      className={
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ' +
        (live
          ? 'border-[var(--color-good)]/30 bg-[var(--color-good)]/10 text-[var(--color-good)]'
          : 'border-[var(--color-border-strong)] bg-[var(--color-surface-2)] text-[var(--color-text-faint)]')
      }
    >
      <span
        className={'h-1.5 w-1.5 rounded-full ' + (live ? 'bg-[var(--color-good)]' : 'bg-[var(--color-text-faint)]')}
      />
      {label ?? (live ? 'Live' : 'Simulated')}
    </span>
  );
}
