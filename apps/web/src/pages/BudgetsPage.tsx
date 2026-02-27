import { useState } from 'react';
import { Plus, AlertTriangle, CheckCircle, Wallet } from 'lucide-react';

interface BudgetItem {
  id: number;
  category: string;
  monthlyLimit: number;
  spent: number;
  remaining: number;
  percentage: number;
  isAlert: boolean;
  color: string;
}

const mockBudgets: BudgetItem[] = [
  { id: 1, category: 'Alimentation', monthlyLimit: 500, spent: 320, remaining: 180, percentage: 64, isAlert: false, color: '#10B981' },
  { id: 2, category: 'Transport', monthlyLimit: 200, spent: 145, remaining: 55, percentage: 72.5, isAlert: false, color: '#3B82F6' },
  { id: 3, category: 'Restaurants', monthlyLimit: 200, spent: 180, remaining: 20, percentage: 90, isAlert: true, color: '#F97316' },
  { id: 4, category: 'Loisirs', monthlyLimit: 200, spent: 170, remaining: 30, percentage: 85, isAlert: true, color: '#F59E0B' },
  { id: 5, category: 'Shopping', monthlyLimit: 300, spent: 120, remaining: 180, percentage: 40, isAlert: false, color: '#EC4899' },
  { id: 6, category: 'Abonnements', monthlyLimit: 100, spent: 67, remaining: 33, percentage: 67, isAlert: false, color: '#6366F1' },
  { id: 7, category: 'Sante', monthlyLimit: 100, spent: 22, remaining: 78, percentage: 22, isAlert: false, color: '#EF4444' },
];

function formatCurrency(amount: number): string {
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

export function BudgetsPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  const totalBudget = mockBudgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const totalSpent = mockBudgets.reduce((sum, b) => sum + b.spent, 0);
  const alertCount = mockBudgets.filter((b) => b.isAlert).length;

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950">
              <Wallet className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-content-secondary">Budget total</p>
              <p className="text-xl font-bold text-content-primary">
                {formatCurrency(totalBudget)}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
              <CheckCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-content-secondary">Total depense</p>
              <p className="text-xl font-bold text-content-primary">
                {formatCurrency(totalSpent)}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-content-secondary">Alertes actives</p>
              <p className="text-xl font-bold text-content-primary">
                {alertCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          Ajouter un budget
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="card p-6">
          <h3 className="mb-4 text-lg font-semibold text-content-primary">
            Nouveau budget
          </h3>
          <form className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-content-secondary">
                Categorie
              </label>
              <select className="input-field">
                <option>Alimentation</option>
                <option>Transport</option>
                <option>Logement</option>
                <option>Loisirs</option>
                <option>Sante</option>
                <option>Shopping</option>
                <option>Abonnements</option>
                <option>Restaurants</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-content-secondary">
                Limite mensuelle
              </label>
              <input type="number" step="0.01" className="input-field" placeholder="0.00" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-content-secondary">
                Seuil d'alerte (%)
              </label>
              <input type="number" className="input-field" placeholder="80" defaultValue={80} />
            </div>
            <div className="sm:col-span-3 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary">
                Annuler
              </button>
              <button type="submit" className="btn-primary">
                Creer le budget
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budget cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mockBudgets.map((budget) => (
          <div
            key={budget.id}
            className={`card p-6 ${
              budget.isAlert ? 'border-l-4 border-l-amber-500' : ''
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: budget.color }}
                />
                <h4 className="text-base font-semibold text-content-primary">
                  {budget.category}
                </h4>
                {budget.isAlert && (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <span className="text-sm text-content-secondary">
                {budget.percentage}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="progress-bar h-3">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.min(budget.percentage, 100)}%`,
                    backgroundColor: getProgressColor(budget.percentage),
                  }}
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-content-secondary">
                Depense: <span className="font-medium text-content-primary">{formatCurrency(budget.spent)}</span>
              </span>
              <span className="text-content-secondary">
                Restant:{' '}
                <span
                  className={`font-medium ${
                    budget.remaining <= 0 ? 'text-red-500' : 'text-emerald-500'
                  }`}
                >
                  {formatCurrency(budget.remaining)}
                </span>
              </span>
            </div>

            {/* Limit */}
            <p className="mt-2 text-xs text-content-tertiary">
              Limite: {formatCurrency(budget.monthlyLimit)} / mois
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
