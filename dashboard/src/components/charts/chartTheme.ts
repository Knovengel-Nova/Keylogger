// Shared Recharts styling pulled from the CSS custom properties defined in
// index.css (dataviz skill reference palette). Recharts needs literal
// strings, not var() in some SVG attrs, so chart components should read
// these at render time via getComputedStyle where exact color is required,
// falling back to the CSS var directly where SVG supports it.

export function resolvedCssVar(name: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export const tooltipStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  fontSize: 12,
  color: 'var(--color-text)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

export const axisTickStyle = { fontSize: 11, fill: 'var(--color-text-faint)' };
