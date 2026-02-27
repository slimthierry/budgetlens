import { useLocation } from 'react-router-dom';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/transactions': 'Transactions',
  '/budgets': 'Budgets',
  '/savings': 'Objectifs d\'epargne',
  '/reports': 'Rapports',
};

function ThemeToggleIcon() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn-ghost rounded-lg p-2"
      aria-label={resolvedTheme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}

export function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'BudgetLens';

  return (
    <header className="flex h-16 items-center justify-between border-b border-theme-primary bg-surface-primary px-6">
      {/* Page title */}
      <div>
        <h2 className="text-xl font-semibold text-content-primary">{title}</h2>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 rounded-lg bg-surface-secondary px-3 py-2">
          <Search className="h-4 w-4 text-content-tertiary" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-transparent text-sm text-content-primary placeholder:text-content-tertiary outline-none w-48"
          />
        </div>

        {/* Notifications */}
        <button className="btn-ghost relative rounded-lg p-2">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500" />
        </button>

        {/* Theme toggle */}
        <ThemeToggleIcon />
      </div>
    </header>
  );
}
