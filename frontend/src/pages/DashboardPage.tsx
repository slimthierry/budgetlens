import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
} from 'lucide-react';

// Mock data - replace with API calls
const mockData = {
  totalBalance: 12450.80,
  monthlyIncome: 3500.00,
  monthlyExpenses: 2180.50,
  monthlyNet: 1319.50,
  recentTransactions: [
    { id: 1, description: 'Courses Carrefour', category: 'Alimentation', amount: -85.40, date: '2026-02-26', type: 'expense' },
    { id: 2, description: 'Salaire Fevrier', category: 'Salaire', amount: 3500.00, date: '2026-02-25', type: 'income' },
    { id: 3, description: 'Abonnement Netflix', category: 'Abonnements', amount: -17.99, date: '2026-02-24', type: 'expense' },
    { id: 4, description: 'Restaurant Le Bistrot', category: 'Restaurants', amount: -42.00, date: '2026-02-23', type: 'expense' },
    { id: 5, description: 'Essence Total', category: 'Transport', amount: -65.00, date: '2026-02-22', type: 'expense' },
  ],
  spendingByCategory: [
    { category: 'Logement', amount: 800, percentage: 36.7, color: '#8B5CF6' },
    { category: 'Alimentation', amount: 450, percentage: 20.6, color: '#10B981' },
    { category: 'Transport', amount: 280, percentage: 12.8, color: '#3B82F6' },
    { category: 'Loisirs', amount: 200, percentage: 9.2, color: '#F59E0B' },
    { category: 'Abonnements', amount: 150, percentage: 6.9, color: '#6366F1' },
    { category: 'Restaurants', amount: 180, percentage: 8.3, color: '#F97316' },
    { category: 'Autres', amount: 120.50, percentage: 5.5, color: '#6B7280' },
  ],
  budgetAlerts: [
    { category: 'Restaurants', spent: 180, limit: 200, percentage: 90 },
    { category: 'Loisirs', spent: 170, limit: 200, percentage: 85 },
  ],
};

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  trendValue?: string;
  color: string;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-content-secondary">{title}</p>
          <p className="mt-1 text-2xl font-bold text-content-primary">{value}</p>
          {trend && trendValue && (
            <div className="mt-2 flex items-center gap-1">
              {trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                }`}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Solde total"
          value={formatCurrency(mockData.totalBalance)}
          icon={Wallet}
          trend="up"
          trendValue="+5.2%"
          color="#10B981"
        />
        <StatCard
          title="Revenus du mois"
          value={formatCurrency(mockData.monthlyIncome)}
          icon={TrendingUp}
          trend="up"
          trendValue="+2.1%"
          color="#3B82F6"
        />
        <StatCard
          title="Depenses du mois"
          value={formatCurrency(mockData.monthlyExpenses)}
          icon={TrendingDown}
          trend="down"
          trendValue="+8.3%"
          color="#EF4444"
        />
        <StatCard
          title="Solde net"
          value={formatCurrency(mockData.monthlyNet)}
          icon={TrendingUp}
          trend="up"
          trendValue="+12.4%"
          color="#8B5CF6"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Spending by category */}
        <div className="card p-6 lg:col-span-1">
          <h3 className="mb-4 text-lg font-semibold text-content-primary">
            Depenses par categorie
          </h3>
          <div className="space-y-3">
            {mockData.spendingByCategory.map((cat) => (
              <div key={cat.category}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-content-secondary">{cat.category}</span>
                  </div>
                  <span className="font-medium text-content-primary">
                    {formatCurrency(cat.amount)}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-content-primary">
              Transactions recentes
            </h3>
            <a
              href="/transactions"
              className="text-sm font-medium text-content-brand hover:underline"
            >
              Voir tout
            </a>
          </div>
          <div className="space-y-3">
            {mockData.recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg p-3 hover:bg-surface-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      tx.type === 'income'
                        ? 'bg-emerald-50 dark:bg-emerald-950'
                        : 'bg-red-50 dark:bg-red-950'
                    }`}
                  >
                    {tx.type === 'income' ? (
                      <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-content-primary">
                      {tx.description}
                    </p>
                    <p className="text-xs text-content-tertiary">{tx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      tx.amount > 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}
                  >
                    {tx.amount > 0 ? '+' : ''}
                    {formatCurrency(tx.amount)}
                  </p>
                  <p className="text-xs text-content-tertiary">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget alerts */}
      {mockData.budgetAlerts.length > 0 && (
        <div className="card border-l-4 border-l-amber-500 p-6">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-content-primary">
              Alertes budget
            </h3>
          </div>
          <div className="space-y-3">
            {mockData.budgetAlerts.map((alert) => (
              <div
                key={alert.category}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-content-primary">
                    {alert.category}
                  </p>
                  <p className="text-xs text-content-tertiary">
                    {formatCurrency(alert.spent)} / {formatCurrency(alert.limit)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32">
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${Math.min(alert.percentage, 100)}%`,
                          backgroundColor:
                            alert.percentage >= 90 ? '#EF4444' : '#F59E0B',
                        }}
                      />
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      alert.percentage >= 90 ? 'text-red-500' : 'text-amber-500'
                    }`}
                  >
                    {alert.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
