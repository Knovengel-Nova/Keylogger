import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TimelinePoint } from '../../services/types';
import { axisTickStyle, tooltipStyle } from './chartTheme';

export function ActivityTimelineChart({ data }: { data: TimelinePoint[] }) {
  const chartData = data.map((point) => ({
    t: new Date(point.bucketStart).toLocaleTimeString('en-US', { hour: 'numeric' }),
    full: new Date(point.bucketStart).toLocaleString('en-US', { weekday: 'short', hour: 'numeric' }),
    count: point.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--series-1)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--series-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
        <XAxis
          dataKey="t"
          tick={axisTickStyle}
          axisLine={{ stroke: 'var(--color-border-strong)' }}
          tickLine={false}
          interval={Math.ceil(chartData.length / 8)}
        />
        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.full ?? ''}
          formatter={(value) => [`${value} events`, 'Keystrokes']}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="var(--series-1)"
          strokeWidth={2}
          fill="url(#activityFill)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
