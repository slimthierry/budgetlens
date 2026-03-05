// ============================================================
// BudgetLens - Theme configuration
// ============================================================

export const STORAGE_KEY = 'budgetlens-theme';

export const emerald = {
  50: '#ECFDF5',
  100: '#D1FAE5',
  200: '#A7F3D0',
  300: '#6EE7B7',
  400: '#34D399',
  500: '#10B981',
  600: '#059669',
  700: '#047857',
  800: '#065F46',
  900: '#064E3B',
  950: '#022C22',
} as const;

export const brand = emerald;

export const lightTheme = {
  surface: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    primary: '#111827',
    secondary: '#4B5563',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
    brand: '#059669',
  },
  border: {
    primary: '#E5E7EB',
    secondary: '#D1D5DB',
    focus: '#10B981',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
} as const;

export const darkTheme = {
  surface: {
    primary: '#0F172A',
    secondary: '#1E293B',
    tertiary: '#334155',
    elevated: '#1E293B',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    primary: '#F1F5F9',
    secondary: '#94A3B8',
    tertiary: '#64748B',
    inverse: '#0F172A',
    brand: '#34D399',
  },
  border: {
    primary: '#334155',
    secondary: '#475569',
    focus: '#34D399',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
} as const;

export const categoryColors: Record<string, string> = {
  'Alimentation': '#10B981',
  'Transport': '#3B82F6',
  'Logement': '#8B5CF6',
  'Loisirs': '#F59E0B',
  'Sante': '#EF4444',
  'Shopping': '#EC4899',
  'Education': '#06B6D4',
  'Abonnements': '#6366F1',
  'Restaurants': '#F97316',
  'Epargne': '#14B8A6',
  'Salaire': '#22C55E',
  'Freelance': '#A855F7',
  'Autres': '#6B7280',
};

export type Theme = 'light' | 'dark' | 'system';

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';
}

export function setStoredTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEY, theme);
}

export function getResolvedTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return theme;
}
