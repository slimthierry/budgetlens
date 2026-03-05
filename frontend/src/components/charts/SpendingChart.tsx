import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

interface SpendingChartProps {
  data: MonthlyData[];
  height?: number;
}

export function SpendingChart({ data, height = 350 }: SpendingChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-primary)" />
        <XAxis
          dataKey="month"
          tick={{ fill: 'var(--color-content-tertiary)', fontSize: 12 }}
          axisLine={{ stroke: 'var(--color-border-primary)' }}
        />
        <YAxis
          tick={{ fill: 'var(--color-content-tertiary)', fontSize: 12 }}
          axisLine={{ stroke: 'var(--color-border-primary)' }}
          tickFormatter={(value) => `${value}\u00a0\u20ac`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-surface-elevated)',
            border: '1px solid var(--color-border-primary)',
            borderRadius: '8px',
            color: 'var(--color-content-primary)',
          }}
          formatter={(value: number) =>
            new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            }).format(value)
          }
        />
        <Legend />
        <Bar
          dataKey="income"
          name="Revenus"
          fill="#10B981"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <Bar
          dataKey="expenses"
          name="D\u00e9penses"
          fill="#EF4444"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
