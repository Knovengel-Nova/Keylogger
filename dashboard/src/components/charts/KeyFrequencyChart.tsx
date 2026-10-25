import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { KeyFrequency } from '../../services/types';
import { axisTickStyle, tooltipStyle } from './chartTheme';

const KEY_LABEL: Record<string, string> = {
  KEY_SPACE: 'Space',
  KEY_BACKSPACE: 'Backspace',
  KEY_ENTER: 'Enter',
  KEY_LEFTSHIFT: 'Shift',
};

function label(eventName: string) {
  if (KEY_LABEL[eventName]) return KEY_LABEL[eventName];
  const letter = eventName.replace('KEY_', '');
  return letter.length === 1 ? letter : letter.charAt(0) + letter.slice(1).toLowerCase();
}

export function KeyFrequencyChart({ data }: { data: KeyFrequency[] }) {
  const rows = data.slice(0, 10).map((k) => ({ name: label(k.eventName), count: k.count, code: k.eventCode }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeDasharray="3 3" />
        <XAxis type="number" tick={axisTickStyle} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={axisTickStyle}
          axisLine={false}
          tickLine={false}
          width={72}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value, _n, p) => [`${Number(value).toLocaleString()} presses`, `code ${p.payload.code}`]}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={16}>
          {rows.map((r) => (
            <Cell key={r.code} fill="var(--series-1)" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
