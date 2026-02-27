import { useState } from 'react';
import { Plus, PiggyBank, Plane, Home, GraduationCap, Car } from 'lucide-react';

interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  icon: string;
  percentage: number;
  color: string;
}

const mockGoals: SavingsGoal[] = [
  { id: 1, name: 'Vacances ete', targetAmount: 3000, currentAmount: 1800, deadline: '2026-07-01', icon: 'plane', percentage: 60, color: '#3B82F6' },
  { id: 2, name: 'Apport immobilier', targetAmount: 30000, currentAmount: 12500, deadline: '2027-12-31', icon: 'home', percentage: 41.7, color: '#8B5CF6' },
  { id: 3, name: 'Formation developpeur', targetAmount: 2000, currentAmount: 1500, deadline: '2026-06-01', icon: 'graduation', percentage: 75, color: '#10B981' },
  { id: 4, name: 'Nouvelle voiture', targetAmount: 15000, currentAmount: 3200, deadline: '2027-06-01', icon: 'car', percentage: 21.3, color: '#F59E0B' },
  { id: 5, name: 'Fonds d\'urgence', targetAmount: 5000, currentAmount: 4200, deadline: null, icon: 'piggy-bank', percentage: 84, color: '#EF4444' },
];

const iconMap: Record<string, React.ElementType> = {
  'plane': Plane,
  'home': Home,
  'graduation': GraduationCap,
  'car': Car,
  'piggy-bank': PiggyBank,
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

function ProgressRing({
  percentage,
  color,
  size = 80,
  strokeWidth = 6,
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
        <span className="text-sm font-bold text-content-primary">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}

export function SavingsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [contributionGoalId, setContributionGoalId] = useState<number | null>(null);

  const totalSaved = mockGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = mockGoals.reduce((sum, g) => sum + g.targetAmount, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950">
              <PiggyBank className="h-7 w-7 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-content-secondary">Total epargne</p>
              <p className="text-3xl font-bold text-content-primary">
                {formatCurrency(totalSaved)}
              </p>
              <p className="text-sm text-content-tertiary">
                sur {formatCurrency(totalTarget)} objectifs
              </p>
            </div>
          </div>
          <ProgressRing
            percentage={(totalSaved / totalTarget) * 100}
            color="#10B981"
            size={100}
            strokeWidth={8}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          Nouvel objectif
        </button>
      </div>

      {/* Add goal form */}
      {showAddForm && (
        <div className="card p-6">
          <h3 className="mb-4 text-lg font-semibold text-content-primary">
            Nouvel objectif d'epargne
          </h3>
          <form className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-content-secondary">
                Nom de l'objectif
              </label>
              <input type="text" className="input-field" placeholder="Ex: Vacances" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-content-secondary">
                Montant cible
              </label>
              <input type="number" step="0.01" className="input-field" placeholder="0.00" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-content-secondary">
                Montant initial
              </label>
              <input type="number" step="0.01" className="input-field" placeholder="0.00" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-content-secondary">
                Date limite
              </label>
              <input type="date" className="input-field" />
            </div>
            <div className="sm:col-span-2 lg:col-span-4 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary">
                Annuler
              </button>
              <button type="submit" className="btn-primary">
                Creer l'objectif
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {mockGoals.map((goal) => {
          const Icon = iconMap[goal.icon] || PiggyBank;
          return (
            <div key={goal.id} className="card p-6">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${goal.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: goal.color }} />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-content-primary">
                      {goal.name}
                    </h4>
                    {goal.deadline && (
                      <p className="text-xs text-content-tertiary">
                        Echeance: {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>
                <ProgressRing
                  percentage={goal.percentage}
                  color={goal.color}
                  size={60}
                  strokeWidth={5}
                />
              </div>

              {/* Amount details */}
              <div className="mb-4">
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-content-primary">
                    {formatCurrency(goal.currentAmount)}
                  </span>
                  <span className="text-sm text-content-tertiary">
                    / {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
                <div className="progress-bar h-2">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.min(goal.percentage, 100)}%`,
                      backgroundColor: goal.color,
                    }}
                  />
                </div>
              </div>

              {/* Contribution section */}
              {contributionGoalId === goal.id ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    className="input-field flex-1"
                    placeholder="Montant"
                    autoFocus
                  />
                  <button className="btn-primary px-3">Ajouter</button>
                  <button
                    className="btn-secondary px-3"
                    onClick={() => setContributionGoalId(null)}
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setContributionGoalId(goal.id)}
                  className="btn-secondary w-full"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une contribution
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
