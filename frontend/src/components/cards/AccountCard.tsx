import React from 'react';

interface AccountCardProps {
  name: string;
  type: string;
  balance: number;
  currency: string;
  icon: React.ReactNode;
  formatCurrency?: (amount: number) => string;
  onClick?: () => void;
}

const typeLabels: Record<string, string> = {
  checking: 'Compte courant',
  savings: 'Compte epargne',
  credit: 'Carte de credit',
  cash: 'Especes',
};

function defaultFormatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function AccountCard({
  name,
  type,
  balance,
  currency,
  icon,
  formatCurrency = defaultFormatCurrency,
  onClick,
}: AccountCardProps) {
  return (
    <div
      className="card p-5 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950">
            {icon}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-content-primary">{name}</h4>
            <p className="text-xs text-content-tertiary">
              {typeLabels[type] || type}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p
            className={`text-lg font-bold ${
              balance >= 0 ? 'text-content-primary' : 'text-red-500'
            }`}
          >
            {formatCurrency(balance)}
          </p>
          <p className="text-xs text-content-tertiary">{currency}</p>
        </div>
      </div>
    </div>
  );
}
