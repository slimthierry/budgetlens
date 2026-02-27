import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Target,
  BarChart3,
  Wallet,
} from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Budgets', href: '/budgets', icon: Wallet },
  { name: 'Épargne', href: '/savings', icon: PiggyBank },
  { name: 'Rapports', href: '/reports', icon: BarChart3 },
];

export function Sidebar() {
  return (
    <aside
      className="hidden lg:flex lg:flex-col bg-surface-primary border-r border-theme-primary"
      style={{ width: 'var(--sidebar-width)' }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-theme-primary">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
          <Target className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-content-primary">BudgetLens</h1>
          <p className="text-xs text-content-tertiary">Suivi financier</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'text-content-secondary hover:bg-surface-secondary hover:text-content-primary'
              }`
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-theme-primary p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              TS
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-content-primary truncate">
              Thierry Sessou
            </p>
            <p className="text-xs text-content-tertiary truncate">
              thierry@budgetlens.dev
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
