// ============================================================
// BudgetLens - API Client
// ============================================================

import type {
  User,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  Account,
  AccountCreate,
  AccountUpdate,
  Transaction,
  TransactionCreate,
  TransactionUpdate,
  TransactionFilter,
  PaginatedResponse,
  Budget,
  BudgetCreate,
  BudgetUpdate,
  BudgetProgress,
  SavingsGoal,
  SavingsGoalCreate,
  SavingsGoalUpdate,
  SavingsContribution,
  DashboardData,
  ReportData,
  ForecastData,
} from '@budgetlens/types';

const API_BASE = '/api/v1';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('budgetlens-token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      errorData?.detail || `HTTP ${response.status}`,
      errorData
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ---- Auth ----
export const authApi = {
  register: (data: RegisterRequest) =>
    request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: async (data: LoginRequest) => {
    const response = await request<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    localStorage.setItem('budgetlens-token', response.access_token);
    localStorage.setItem('budgetlens-refresh-token', response.refresh_token);
    return response;
  },

  refresh: async (refreshToken: string) => {
    const response = await request<TokenResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    localStorage.setItem('budgetlens-token', response.access_token);
    localStorage.setItem('budgetlens-refresh-token', response.refresh_token);
    return response;
  },

  me: () => request<User>('/auth/me'),

  logout: () => {
    localStorage.removeItem('budgetlens-token');
    localStorage.removeItem('budgetlens-refresh-token');
  },
};

// ---- Accounts ----
export const accountsApi = {
  list: () => request<Account[]>('/accounts/'),
  get: (id: number) => request<Account>(`/accounts/${id}`),
  create: (data: AccountCreate) =>
    request<Account>('/accounts/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: AccountUpdate) =>
    request<Account>(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    request<void>(`/accounts/${id}`, { method: 'DELETE' }),
};

// ---- Transactions ----
export const transactionsApi = {
  list: (
    page: number = 1,
    pageSize: number = 20,
    filters?: TransactionFilter
  ) => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
    return request<PaginatedResponse<Transaction>>(
      `/transactions/?${params.toString()}`
    );
  },
  get: (id: number) => request<Transaction>(`/transactions/${id}`),
  create: (data: TransactionCreate) =>
    request<Transaction>('/transactions/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: TransactionUpdate) =>
    request<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    request<void>(`/transactions/${id}`, { method: 'DELETE' }),
};

// ---- Budgets ----
export const budgetsApi = {
  list: () => request<Budget[]>('/budgets/'),
  progress: () => request<BudgetProgress[]>('/budgets/progress'),
  get: (id: number) => request<Budget>(`/budgets/${id}`),
  create: (data: BudgetCreate) =>
    request<Budget>('/budgets/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: BudgetUpdate) =>
    request<Budget>(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    request<void>(`/budgets/${id}`, { method: 'DELETE' }),
};

// ---- Savings ----
export const savingsApi = {
  list: () => request<SavingsGoal[]>('/savings/'),
  get: (id: number) => request<SavingsGoal>(`/savings/${id}`),
  create: (data: SavingsGoalCreate) =>
    request<SavingsGoal>('/savings/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  contribute: (id: number, data: SavingsContribution) =>
    request<SavingsGoal>(`/savings/${id}/contribute`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: SavingsGoalUpdate) =>
    request<SavingsGoal>(`/savings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    request<void>(`/savings/${id}`, { method: 'DELETE' }),
};

// ---- Dashboard ----
export const dashboardApi = {
  get: () => request<DashboardData>('/dashboard/'),
  forecast: () => request<ForecastData>('/dashboard/forecast'),
  categoryForecast: (category: string) =>
    request<ForecastData>(`/dashboard/forecast/${category}`),
  reports: (months: number = 12) =>
    request<ReportData>(`/dashboard/reports?months=${months}`),
};

export { ApiError };
