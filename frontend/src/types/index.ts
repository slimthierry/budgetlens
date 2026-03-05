// ============================================================
// BudgetLens - Shared TypeScript types
// ============================================================

// ---- User ----
export interface User {
  id: number;
  email: string;
  name: string;
  currency: string;
  created_at: string;
}

// ---- Auth ----
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  currency?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// ---- Account ----
export type AccountType = 'checking' | 'savings' | 'credit' | 'cash';

export interface Account {
  id: number;
  user_id: number;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  icon: string | null;
  created_at: string;
}

export interface AccountCreate {
  name: string;
  type: AccountType;
  balance?: number;
  currency?: string;
  icon?: string;
}

export interface AccountUpdate {
  name?: string;
  type?: AccountType;
  icon?: string;
}

// ---- Transaction ----
export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: number;
  account_id: number;
  amount: number;
  category: string;
  subcategory: string | null;
  description: string | null;
  date: string;
  type: TransactionType;
  recurring: boolean;
  created_at: string;
}

export interface TransactionCreate {
  account_id: number;
  amount: number;
  category: string;
  subcategory?: string;
  description?: string;
  date: string;
  type: TransactionType;
  recurring?: boolean;
}

export interface TransactionUpdate {
  amount?: number;
  category?: string;
  subcategory?: string;
  description?: string;
  date?: string;
  type?: TransactionType;
  recurring?: boolean;
}

export interface TransactionFilter {
  account_id?: number;
  category?: string;
  type?: TransactionType;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ---- Budget ----
export type BudgetPeriod = 'monthly' | 'weekly';

export interface Budget {
  id: number;
  user_id: number;
  category: string;
  monthly_limit: number;
  period: BudgetPeriod;
  alert_threshold: number;
  created_at: string;
}

export interface BudgetCreate {
  category: string;
  monthly_limit: number;
  period?: BudgetPeriod;
  alert_threshold?: number;
}

export interface BudgetUpdate {
  monthly_limit?: number;
  period?: BudgetPeriod;
  alert_threshold?: number;
}

export interface BudgetProgress {
  id: number;
  category: string;
  monthly_limit: number;
  period: BudgetPeriod;
  alert_threshold: number;
  spent: number;
  remaining: number;
  percentage: number;
  is_alert: boolean;
}

// ---- Savings Goal ----
export interface SavingsGoal {
  id: number;
  user_id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  icon: string;
  percentage: number;
  created_at: string;
}

export interface SavingsGoalCreate {
  name: string;
  target_amount: number;
  current_amount?: number;
  deadline?: string;
  icon?: string;
}

export interface SavingsGoalUpdate {
  name?: string;
  target_amount?: number;
  deadline?: string;
  icon?: string;
}

export interface SavingsContribution {
  amount: number;
}

// ---- Category ----
export type CategoryType = 'income' | 'expense';

export interface Category {
  id: number;
  name: string;
  icon: string | null;
  color: string | null;
  type: CategoryType;
  is_default: boolean;
}

// ---- Dashboard ----
export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  color: string | null;
}

export interface MonthlyComparison {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface DashboardData {
  total_balance: number;
  monthly_income: number;
  monthly_expenses: number;
  monthly_net: number;
  spending_by_category: CategorySpending[];
  recent_transactions: Transaction[];
  budget_alerts: BudgetProgress[];
  monthly_comparison: MonthlyComparison[];
}

export interface ReportData {
  monthly_comparisons: MonthlyComparison[];
  category_trends: Record<string, unknown>[];
  total_income: number;
  total_expenses: number;
  average_monthly_income: number;
  average_monthly_expenses: number;
  savings_rate: number;
}

export interface ForecastData {
  current_expenses: number;
  current_income: number;
  projected_expenses: number;
  projected_income: number;
  projected_net: number;
  day_of_month: number;
  confidence: number;
}
