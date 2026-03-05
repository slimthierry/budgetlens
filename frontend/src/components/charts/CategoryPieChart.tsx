import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface CategoryPieChartProps {
  data: CategoryData[];
  height?: number;
}

export function CategoryPieChart({ data, height = 300 }: CategoryPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={60}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
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
        <Legend
          formatter={(value) => (
            <span style={{ color: 'var(--color-content-secondary)', fontSize: '12px' }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
