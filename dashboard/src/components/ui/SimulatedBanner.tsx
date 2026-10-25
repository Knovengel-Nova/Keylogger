export function SimulatedBanner() {
  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-accent-bg)] px-4 py-2 text-xs text-[var(--color-text-muted)] sm:px-6">
      <span className="font-medium text-[var(--color-accent)]">Demo mode:</span> the Main
      Server, Postgres store, and ML Server in the architecture plan aren't built yet — every
      number here is generated mock data shaped like the real schema. Panels tied to the
      working client capture (SQLite event log, sync status) are marked once that API ships.
    </div>
  );
}
