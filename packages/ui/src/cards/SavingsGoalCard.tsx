import React, { useState } from 'react';

interface SavingsGoalCardProps {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  icon: React.ReactNode;
  percentage: number;
  color: string;
  formatCurrency?: (amount: number) => string;
  onContribute?: (goalId: number, amount: number) => void;
}

function defaultFormatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

function ProgressRing({
  percentage,
  color,
  size = 60,
  strokeWidth = 5,
}: {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-content-primary">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}

export function SavingsGoalCard({
  id,
  name,
  targetAmount,
  currentAmount,
  deadline,
  icon,
  percentage,
  color,
  formatCurrency = defaultFormatCurrency,
  onContribute,
}: SavingsGoalCardProps) {
  const [showContribute, setShowContribute] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');

  const handleContribute = () => {
    const amount = parseFloat(contributionAmount);
    if (amount > 0 && onContribute) {
      onContribute(id, amount);
      setContributionAmount('');
      setShowContribute(false);
    }
  };

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${color}15` }}
          >
            {icon}
          </div>
          <div>
            <h4 className="text-base font-semibold text-content-primary">
              {name}
            </h4>
            {deadline && (
              <p className="text-xs text-content-tertiary">
                Echeance: {new Date(deadline).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        </div>
        <ProgressRing percentage={percentage} color={color} />
      </div>

      {/* Amount details */}
      <div className="mb-4">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-content-primary">
            {formatCurrency(currentAmount)}
          </span>
          <span className="text-sm text-content-tertiary">
            / {formatCurrency(targetAmount)}
          </span>
        </div>
        <div className="progress-bar h-2">
          <div
            className="progress-bar-fill"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>

      {/* Contribution */}
      {showContribute ? (
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            className="input-field flex-1"
            placeholder="Montant"
            value={contributionAmount}
            onChange={(e) => setContributionAmount(e.target.value)}
            autoFocus
          />
          <button className="btn-primary px-3" onClick={handleContribute}>
            OK
          </button>
          <button
            className="btn-secondary px-3"
            onClick={() => setShowContribute(false)}
          >
            X
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowContribute(true)}
          className="btn-secondary w-full"
        >
          + Ajouter une contribution
        </button>
      )}
    </div>
  );
}
