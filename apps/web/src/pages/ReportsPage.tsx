import { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

interface CategoryTrend {
  category: string;
  currentMonth: number;
  previousMonth: number;
  change: number;
  color: string;
}

const mockMonthlyData: MonthlyData[] = [
  { month: 'Sept 2025', income: 3500, expenses: 2800, net: 700 },
  { month: 'Oct 2025', income: 3500, expenses: 2400, net: 1100 },
  { month: 'Nov 2025', income: 4200, expenses: 2900, net: 1300 },
  { month: 'Dec 2025', income: 3800, expenses: 3500, net: 300 },
  { month: 'Janv 2026', income: 3500, expenses: 2200, net: 1300 },
  { month: 'Fev 2026', income: 3500, expenses: 2180, net: 1320 },
];

const mockCategoryTrends: CategoryTrend[] = [
  { category: 'Alimentation', currentMonth: 450, previousMonth: 420, change: 7.1, color: '#10B981' },
  { category: 'Transport', currentMonth: 280, previousMonth: 310, change: -9.7, color: '#3B82F6' },
  { category: 'Logement', currentMonth: 800, previousMonth: 800, change: 0, color: '#8B5CF6' },
  { category: 'Loisirs', currentMonth: 200, previousMonth: 180, change: 11.1, color: '#F59E0B' },
  { category: 'Restaurants', currentMonth: 180, previousMonth: 150, change: 20, color: '#F97316' },
  { category: 'Abonnements', currentMonth: 67, previousMonth: 67, change: 0, color: '#6366F1' },
  { category: 'Shopping', currentMonth: 120, previousMonth: 200, change: -40, color: '#EC4899' },
  { category: 'Sante', currentMonth: 22, previousMonth: 45, change: -51.1, color: '#EF4444' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function ReportsPage() {
  const [period, setPeriod] = useState<'6m' | '12m' | 'ytd'>('6m');

  const totalIncome = mockMonthlyData.reduce((sum, m) => sum + m.income, 0);
  const totalExpenses = mockMonthlyData.reduce((sum, m) => sum + m.expenses, 0);
  const avgIncome = totalIncome / mockMonthlyData.length;
  const avgExpenses = totalExpenses / mockMonthlyData.length;
  const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;

  const maxValue = Math.max(
    ...mockMonthlyData.map((m) => Math.max(m.income, m.expenses))
  );

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-content-tertiary" />
          <span className="text-sm font-medium text-content-secondary">Periode:</span>
        </div>
        <div className="flex rounded-lg border border-theme-primary overflow-hidden">
          {([
            { key: '6m', label: '6 mois' },
            { key: '12m', label: '12 mois' },
            { key: 'ytd', label: 'Annee' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                period === key
                  ? 'bg-emerald-500 text-white'
                  : 'bg-surface-primary text-content-secondary hover:bg-surface-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <p className="text-sm text-content-secondary">Revenus totaux</p>
          <p className="mt-1 text-xl font-bold text-emerald-500">
            {formatCurrency(totalIncome)}
          </p>
          <p className="mt-1 text-xs text-content-tertiary">
            Moy: {formatCurrency(avgIncome)}/mois
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-content-secondary">Depenses totales</p>
          <p className="mt-1 text-xl font-bold text-red-500">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="mt-1 text-xs text-content-tertiary">
            Moy: {formatCurrency(avgExpenses)}/mois
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-content-secondary">Epargne nette</p>
          <p className="mt-1 text-xl font-bold text-content-primary">
            {formatCurrency(totalIncome - totalExpenses)}
          </p>
          <p className="mt-1 text-xs text-content-tertiary">
            Sur {mockMonthlyData.length} mois
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-content-secondary">Taux d'epargne</p>
          <p className="mt-1 text-xl font-bold text-emerald-500">
            {savingsRate.toFixed(1)}%
          </p>
          <p className="mt-1 text-xs text-content-tertiary">
            Objectif recommande: 20%
          </p>
        </div>
      </div>

      {/* Monthly comparison chart (CSS bars) */}
      <div className="card p-6">
        <h3 className="mb-6 text-lg font-semibold text-content-primary">
          Revenus vs Depenses par mois
        </h3>
        <div className="space-y-4">
          {mockMonthlyData.map((month) => (
            <div key={month.month}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-content-primary w-24">
                  {month.month}
                </span>
                <div className="flex gap-4 text-xs">
                  <span className="text-emerald-500">
                    +{formatCurrency(month.income)}
                  </span>
                  <span className="text-red-500">
                    -{formatCurrency(month.expenses)}
                  </span>
                  <span
                    className={`font-semibold ${
                      month.net >= 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}
                  >
                    {month.net >= 0 ? '+' : ''}
                    {formatCurrency(month.net)}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <div className="h-4 flex-1">
                  <div
                    className="h-full rounded-l bg-emerald-400 dark:bg-emerald-600 transition-all duration-500"
                    style={{
                      width: `${(month.income / maxValue) * 100}%`,
                    }}
                  />
                </div>
                <div className="h-4 flex-1">
                  <div
                    className="h-full rounded-r bg-red-400 dark:bg-red-600 transition-all duration-500"
                    style={{
                      width: `${(month.expenses / maxValue) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="text-content-secondary">Revenus</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <span className="text-content-secondary">Depenses</span>
          </div>
        </div>
      </div>

      {/* Category trends */}
      <div className="card p-6">
        <h3 className="mb-4 text-lg font-semibold text-content-primary">
          Evolution par categorie
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-theme-primary">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-content-tertiary">
                  Categorie
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-content-tertiary">
                  Mois actuel
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-content-tertiary">
                  Mois precedent
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-content-tertiary">
                  Evolution
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {mockCategoryTrends.map((cat) => (
                <tr key={cat.category} className="hover:bg-surface-secondary transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm font-medium text-content-primary">
                        {cat.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-content-primary">
                    {formatCurrency(cat.currentMonth)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-content-secondary">
                    {formatCurrency(cat.previousMonth)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {cat.change > 0 ? (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      ) : cat.change < 0 ? (
                        <TrendingDown className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <BarChart3 className="h-4 w-4 text-content-tertiary" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          cat.change > 0
                            ? 'text-red-500'
                            : cat.change < 0
                            ? 'text-emerald-500'
                            : 'text-content-tertiary'
                        }`}
                      >
                        {cat.change > 0 ? '+' : ''}
                        {cat.change.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
