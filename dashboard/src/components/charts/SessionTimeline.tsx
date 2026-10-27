import { useMemo, useState } from 'react';
import type { SessionBlock } from '../../services/types';
import { formatDateTime } from '../../lib/format';

export function SessionTimeline({ sessions }: { sessions: SessionBlock[] }) {
  const [hoveredSession, setHoveredSession] = useState<SessionBlock | null>(null);

  const { blocks: sessionBlocks, start, span } = useMemo(() => {
    if (sessions.length === 0) return { blocks: [], start: 0, span: 1 };
    const start = new Date(sessions[0].start).getTime();
    const end = new Date(sessions[sessions.length - 1].end).getTime();
    const span = Math.max(1, end - start);
    return { blocks: sessions, start, span };
  }, [sessions]);

  return (
    <div>
      <div className="flex h-6 overflow-hidden rounded-md border border-[var(--color-border)]">
        {sessionBlocks.map((block, i) => {
          const left = ((new Date(block.start).getTime() - start) / span) * 100;
          const width = ((new Date(block.end).getTime() - new Date(block.start).getTime()) / span) * 100;
          return (
            <div
              key={i}
              onMouseEnter={() => setHoveredSession(block)}
              onMouseLeave={() => setHoveredSession((prev) => (prev === block ? null : prev))}
              style={{
                width: `${width}%`,
                marginLeft: i === 0 ? `${left}%` : undefined,
                background: block.kind === 'active' ? 'var(--series-1)' : 'var(--color-surface-2)',
              }}
              className="h-full shrink-0 border-r border-[var(--color-surface)] last:border-r-0"
            />
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--color-text-faint)]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ background: 'var(--series-1)' }} /> Active
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-[var(--color-surface-2)] ring-1 ring-inset ring-[var(--color-border)]" /> Idle
          </span>
        </div>
        <span>
          {hoveredSession
            ? `${hoveredSession.kind === 'active' ? 'Active' : 'Idle'}: ${formatDateTime(hoveredSession.start)} – ${formatDateTime(hoveredSession.end)}`
            : 'Hover a block for detail'}
        </span>
      </div>
    </div>
  );
}
