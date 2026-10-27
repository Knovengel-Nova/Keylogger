import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TypingSpeedPoint } from '../../services/types';
import { axisTickStyle, tooltipStyle } from './chartTheme';

export function TypingSpeedChart({ data }: { data: TypingSpeedPoint[] }) {
  const chartData = data.map((point) => ({
    t: new Date(point.bucketStart).toLocaleTimeString('en-US', { hour: 'numeric' }),
    kpm: point.keysPerMinute,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
        <XAxis
          dataKey="t"
          tick={axisTickStyle}
          axisLine={{ stroke: 'var(--color-border-strong)' }}
          tickLine={false}
          interval={Math.ceil(chartData.length / 6)}
        />
        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} width={36} />
        <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} keys/min`, 'Typing speed']} />
        <Line
          type="monotone"
          dataKey="kpm"
          stroke="var(--series-2)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
