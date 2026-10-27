import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { KeyFrequency } from '../../services/types';
import { axisTickStyle, tooltipStyle } from './chartTheme';

const KEY_DISPLAY_LABEL: Record<string, string> = {
  KEY_SPACE: 'Space',
  KEY_BACKSPACE: 'Backspace',
  KEY_ENTER: 'Enter',
  KEY_LEFTSHIFT: 'Shift',
};

function label(eventName: string) {
  if (KEY_DISPLAY_LABEL[eventName]) return KEY_DISPLAY_LABEL[eventName];
  const letter = eventName.replace('KEY_', '');
  return letter.length === 1 ? letter : letter.charAt(0) + letter.slice(1).toLowerCase();
}

export function KeyFrequencyChart({ data }: { data: KeyFrequency[] }) {
  const chartData = data.slice(0, 10).map((keyItem) => ({ name: label(keyItem.eventName), count: keyItem.count, code: keyItem.eventCode }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
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
          {chartData.map((entry) => (
            <Cell key={entry.code} fill="var(--series-1)" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
