import { useMemo, useState } from 'react';
import type { HeatmapCell } from '../../services/types';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SEQ_STEPS = ['var(--seq-100)', 'var(--seq-250)', 'var(--seq-400)', 'var(--seq-500)', 'var(--seq-650)'];

export function HourDayHeatmap({ data }: { data: HeatmapCell[] }) {
  const [hovered, setHovered] = useState<HeatmapCell | null>(null);

  const max = useMemo(() => Math.max(1, ...data.map((c) => c.count)), [data]);
  const byKey = useMemo(() => {
    const m = new Map<string, HeatmapCell>();
    data.forEach((c) => m.set(`${c.dayOfWeek}-${c.hour}`, c));
    return m;
  }, [data]);

  function stepFor(count: number) {
    const ratio = count / max;
    if (ratio === 0) return 'var(--color-surface-2)';
    const idx = Math.min(SEQ_STEPS.length - 1, Math.floor(ratio * SEQ_STEPS.length));
    return SEQ_STEPS[idx];
  }

  return (
    <div className="relative">
      <div className="flex gap-1">
        <div className="flex flex-col justify-between gap-1 pr-1 pt-4">
          {DAY_LABELS.map((d) => (
            <span key={d} className="h-4 text-[10px] leading-4 text-[var(--color-text-faint)]">
              {d}
            </span>
          ))}
        </div>
        <div className="flex-1 overflow-x-auto">
          <div className="mb-1 flex gap-1 pl-0 text-[10px] text-[var(--color-text-faint)]">
            {Array.from({ length: 24 }).map((_, h) => (
              <span key={h} className="w-4 shrink-0 text-center">
                {h % 6 === 0 ? h : ''}
              </span>
            ))}
          </div>
          {DAY_LABELS.map((_, day) => (
            <div key={day} className="mb-1 flex gap-1">
              {Array.from({ length: 24 }).map((_, hour) => {
                const cell = byKey.get(`${day}-${hour}`) ?? { dayOfWeek: day, hour, count: 0 };
                return (
                  <button
                    key={hour}
                    type="button"
                    onMouseEnter={() => setHovered(cell)}
                    onMouseLeave={() => setHovered((h) => (h === cell ? null : h))}
                    className="h-4 w-4 shrink-0 rounded-[3px] ring-1 ring-inset ring-[var(--color-surface)] transition-opacity hover:opacity-80"
                    style={{ background: stepFor(cell.count) }}
                    aria-label={`${DAY_LABELS[day]} ${hour}:00 — ${cell.count} keystrokes`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--color-text-faint)]">
        <span>
          {hovered
            ? `${DAY_LABELS[hovered.dayOfWeek]} ${hovered.hour}:00 — ${hovered.count.toLocaleString()} keystrokes`
            : 'Hover a cell for detail'}
        </span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          {['var(--color-surface-2)', ...SEQ_STEPS].map((c, i) => (
            <span key={i} className="h-3 w-3 rounded-[2px]" style={{ background: c }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
