import type { ReactNode } from 'react';
import clsx from 'clsx';

export function Card({
  children,
  className,
  title,
  subtitle,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      className={clsx(
        'rounded-xl border bg-[var(--color-surface)]',
        'border-[var(--color-border)] p-5',
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-[var(--color-text-faint)]">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
