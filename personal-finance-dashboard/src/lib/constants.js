// Default categories for transactions
export const defaultCategories = {
  expense: [
    'Food & Dining',
    'Transportation', 
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel'
  ],
  income: [
    'Salary',
    'Freelance', 
    'Investment',
    'Business',
    'Gift',
    'Other'
  ]
};

// Budget alert thresholds
export const BUDGET_ALERTS = {
  WARNING: 0.8, // 80%
  DANGER: 1.0   // 100%
};

// Chart colors for categories
export const CHART_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
  '#ec4899', // pink
  '#6b7280'  // gray
];

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  MONTH_YEAR: 'MMM yyyy'
};

// Pagination
export const ITEMS_PER_PAGE = 10;

// Local storage keys
export const STORAGE_KEYS = {
  TRANSACTIONS: 'pfd_transactions',
  BUDGETS: 'pfd_budgets',
  SAVINGS_GOALS: 'pfd_savings_goals',
  SETTINGS: 'pfd_settings'
};
