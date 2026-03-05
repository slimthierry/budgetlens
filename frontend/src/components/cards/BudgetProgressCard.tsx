import React from 'react';

interface BudgetProgressCardProps {
  category: string;
  monthlyLimit: number;
  spent: number;
  remaining: number;
  percentage: number;
  isAlert: boolean;
  color: string;
  formatCurrency?: (amount: number) => string;
}

function defaultFormatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

function getProgressColor(percentage: number): string {
  if (percentage >= 90) return '#EF4444';
  if (percentage >= 80) return '#F59E0B';
  if (percentage >= 60) return '#F97316';
  return '#10B981';
}

export function BudgetProgressCard({
  category,
  monthlyLimit,
  spent,
  remaining,
  percentage,
  isAlert,
  color,
  formatCurrency = defaultFormatCurrency,
}: BudgetProgressCardProps) {
  return (
    <div
      className={`card p-6 ${isAlert ? 'border-l-4 border-l-amber-500' : ''}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h4 className="text-base font-semibold text-content-primary">
            {category}
          </h4>
        </div>
        <span
          className={`text-sm font-semibold ${
            percentage >= 90
              ? 'text-red-500'
              : percentage >= 80
              ? 'text-amber-500'
              : 'text-content-secondary'
          }`}
        >
          {percentage.toFixed(1)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="progress-bar h-3">
          <div
            className="progress-bar-fill"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: getProgressColor(percentage),
            }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-content-secondary">
          Depense:{' '}
          <span className="font-medium text-content-primary">
            {formatCurrency(spent)}
          </span>
        </span>
        <span className="text-content-secondary">
          Restant:{' '}
          <span
            className={`font-medium ${
              remaining <= 0 ? 'text-red-500' : 'text-emerald-500'
            }`}
          >
            {formatCurrency(remaining)}
          </span>
        </span>
      </div>

      <p className="mt-2 text-xs text-content-tertiary">
        Limite: {formatCurrency(monthlyLimit)} / mois
      </p>
    </div>
  );
}
