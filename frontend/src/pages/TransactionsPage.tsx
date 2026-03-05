import { useState } from 'react';
import {
  Plus,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Calendar,
  X,
} from 'lucide-react';

interface Transaction {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense' | 'transfer';
  account: string;
}

const mockTransactions: Transaction[] = [
  { id: 1, description: 'Courses Carrefour', category: 'Alimentation', amount: -85.40, date: '2026-02-26', type: 'expense', account: 'Compte courant' },
  { id: 2, description: 'Salaire Fevrier', category: 'Salaire', amount: 3500.00, date: '2026-02-25', type: 'income', account: 'Compte courant' },
  { id: 3, description: 'Abonnement Netflix', category: 'Abonnements', amount: -17.99, date: '2026-02-24', type: 'expense', account: 'Compte courant' },
  { id: 4, description: 'Restaurant Le Bistrot', category: 'Restaurants', amount: -42.00, date: '2026-02-23', type: 'expense', account: 'Compte courant' },
  { id: 5, description: 'Essence Total', category: 'Transport', amount: -65.00, date: '2026-02-22', type: 'expense', account: 'Compte courant' },
  { id: 6, description: 'Freelance Projet X', category: 'Freelance', amount: 800.00, date: '2026-02-20', type: 'income', account: 'Compte courant' },
  { id: 7, description: 'Loyer Mars', category: 'Logement', amount: -800.00, date: '2026-02-20', type: 'expense', account: 'Compte courant' },
  { id: 8, description: 'Pharmacie', category: 'Sante', amount: -22.50, date: '2026-02-19', type: 'expense', account: 'Compte courant' },
  { id: 9, description: 'FNAC - Livre', category: 'Shopping', amount: -24.90, date: '2026-02-18', type: 'expense', account: 'Compte courant' },
  { id: 10, description: 'Remboursement assurance', category: 'Remboursements', amount: 150.00, date: '2026-02-17', type: 'income', account: 'Compte courant' },
];

const categories = [
  'Toutes', 'Alimentation', 'Transport', 'Logement', 'Loisirs',
  'Sante', 'Shopping', 'Abonnements', 'Restaurants', 'Salaire', 'Freelance',
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function TransactionsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = mockTransactions.filter((tx) => {
    if (searchQuery && !tx.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'Toutes' && tx.category !== selectedCategory) {
      return false;
    }
    if (selectedType !== 'all' && tx.type !== selectedType) {
      return false;
    }
    return true;
  });

  // Calculate running balance
  let runningBalance = 12450.80;

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-lg bg-surface-primary border border-theme-primary px-3 py-2 flex-1 sm:w-80">
            <Search className="h-4 w-4 text-content-tertiary" />
            <input
              type="text"
              placeholder="Rechercher une transaction..."
              className="bg-transparent text-sm text-content-primary placeholder:text-content-tertiary outline-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X className="h-4 w-4 text-content-tertiary" />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary ${showFilters ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800' : ''}`}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filtres</span>
          </button>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          Ajouter une transaction
        </button>
      </div>

      {/* Filters bar */}
      {showFilters && (
        <div className="card p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Type filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-content-secondary">Type:</span>
              <div className="flex rounded-lg border border-theme-primary overflow-hidden">
                {(['all', 'income', 'expense'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedType === type
                        ? 'bg-emerald-500 text-white'
                        : 'bg-surface-primary text-content-secondary hover:bg-surface-secondary'
                    }`}
                  >
                    {type === 'all' ? 'Tous' : type === 'income' ? 'Revenus' : 'Depenses'}
                  </button>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-content-secondary">Categorie:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field w-auto py-1.5 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date range */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-content-tertiary" />
              <input type="date" className="input-field w-auto py-1.5 text-sm" />
              <span className="text-content-tertiary">-</span>
              <input type="date" className="input-field w-auto py-1.5 text-sm" />
            </div>
          </div>
        </div>
      )}

      {/* Add transaction form */}
      {showAddForm && (
        <div className="card p-6">
          <h3 className="mb-4 text-lg font-semibold text-content-primary">
            Nouvelle transaction
          </h3>
          <form className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-content-secondary">
                Description
              </label>
              <input type="text" className="input-field" placeholder="Description" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-content-secondary">
                Montant
              </label>
              <input type="number" step="0.01" className="input-field" placeholder="0.00" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-content-secondary">
                Categorie
              </label>
              <select className="input-field">
                {categories.filter(c => c !== 'Toutes').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-content-secondary">
                Date
              </label>
              <input type="date" className="input-field" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="sm:col-span-2 lg:col-span-4 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary">
                Annuler
              </button>
              <button type="submit" className="btn-primary">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transactions list */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-theme-primary">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-content-tertiary">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-content-tertiary">
                  Categorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-content-tertiary">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-content-tertiary">
                  Montant
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-content-tertiary">
                  Solde
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredTransactions.map((tx) => {
                const balance = runningBalance;
                runningBalance -= tx.amount;
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-surface-secondary transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            tx.type === 'income'
                              ? 'bg-emerald-50 dark:bg-emerald-950'
                              : 'bg-red-50 dark:bg-red-950'
                          }`}
                        >
                          {tx.type === 'income' ? (
                            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-content-primary">
                            {tx.description}
                          </p>
                          <p className="text-xs text-content-tertiary">
                            {tx.account}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge-info">{tx.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-content-secondary">
                      {new Date(tx.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`text-sm font-semibold ${
                          tx.amount > 0 ? 'text-emerald-500' : 'text-red-500'
                        }`}
                      >
                        {tx.amount > 0 ? '+' : ''}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-content-secondary">
                      {formatCurrency(balance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-content-tertiary mb-3" />
            <p className="text-content-secondary">Aucune transaction trouvee</p>
          </div>
        )}
      </div>
    </div>
  );
}
