export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatCompact(num: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
}

export function formatRelativeTime(isoTimestamp: string): string {
  const elapsedMs = Date.now() - new Date(isoTimestamp).getTime();
  const elapsedMinutes = Math.round(elapsedMs / 60_000);
  if (elapsedMinutes < 1) return 'just now';
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  const elapsedHours = Math.round(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}h ago`;
  const elapsedDays = Math.round(elapsedHours / 24);
  return `${elapsedDays}d ago`;
}

export function formatDateTime(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
