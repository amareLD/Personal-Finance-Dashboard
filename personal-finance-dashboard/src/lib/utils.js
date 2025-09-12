import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, isValid } from 'date-fns';
import { STORAGE_KEYS, DATE_FORMATS } from './constants';

// Utility function to safely parse numbers
export const parseNumber = (value) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

// Format date
export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';
  let dateObj;
  if (typeof date === 'string') {
    // Try ISO first
    dateObj = parseISO(date);
    if (!isValid(dateObj)) {
      // Try native Date parsing for other formats
      dateObj = new Date(date);
    }
  } else {
    dateObj = date;
  }
  if (!isValid(dateObj)) return '';
  try {
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Get current month transactions
export const getCurrentMonthTransactions = (transactions) => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return isWithinInterval(transactionDate, { start, end });
  });
};

// Calculate total income for a given period
export const calculateTotalIncome = (transactions) => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((total, t) => total + parseNumber(t.amount), 0);
};

// Calculate total expenses for a given period
export const calculateTotalExpenses = (transactions) => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((total, t) => total + parseNumber(t.amount), 0);
};

// Calculate balance (income - expenses)
export const calculateBalance = (transactions) => {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  return income - expenses;
};

// Calculate savings rate
export const calculateSavingsRate = (transactions) => {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  
  if (income === 0) return 0;
  
  const savings = income - expenses;
  return (savings / income) * 100;
};

// Group transactions by category
export const groupTransactionsByCategory = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(transaction);
    return acc;
  }, {});
};

// Calculate category totals
export const calculateCategoryTotals = (transactions) => {
  const grouped = groupTransactionsByCategory(transactions);
  
  return Object.entries(grouped).map(([category, categoryTransactions]) => ({
    category,
    amount: categoryTransactions.reduce((total, t) => total + parseNumber(t.amount), 0),
    count: categoryTransactions.length,
    transactions: categoryTransactions
  }));
};

// Filter transactions
export const filterTransactions = (transactions, filters) => {
  return transactions.filter(transaction => {
    // Filter by type
    if (filters.type && transaction.type !== filters.type) {
      return false;
    }
    
    // Filter by category
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }
    
    // Filter by date range
    if (filters.startDate || filters.endDate) {
      const transactionDate = new Date(transaction.date);
      
      if (filters.startDate && transactionDate < new Date(filters.startDate)) {
        return false;
      }
      
      if (filters.endDate && transactionDate > new Date(filters.endDate)) {
        return false;
      }
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return transaction.description.toLowerCase().includes(searchTerm);
    }
    
    return true;
  });
};

// Sort transactions
export const sortTransactions = (transactions, sortBy = 'date', sortOrder = 'desc') => {
  return [...transactions].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle different data types
    if (sortBy === 'date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (sortBy === 'amount') {
      aValue = parseNumber(aValue);
      bValue = parseNumber(bValue);
    } else {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

// Paginate array
export const paginateArray = (array, page, itemsPerPage) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    items: array.slice(startIndex, endIndex),
    totalPages: Math.ceil(array.length / itemsPerPage),
    currentPage: page,
    totalItems: array.length,
    hasNextPage: endIndex < array.length,
    hasPrevPage: page > 1
  };
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validate transaction
export const validateTransaction = (transaction) => {
  const errors = {};
  
  if (!transaction.amount || parseNumber(transaction.amount) <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }
  
  if (!transaction.description || transaction.description.trim().length === 0) {
    errors.description = 'Description is required';
  } else if (transaction.description.length > 100) {
    errors.description = 'Description must be 100 characters or less';
  }
  
  if (!transaction.category) {
    errors.category = 'Category is required';
  }
  
  if (!transaction.type) {
    errors.type = 'Type is required';
  }
  
  if (!transaction.date) {
    errors.date = 'Date is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Local storage utilities
export const getFromStorage = (key) => {
  if (typeof window === 'undefined') return null;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return null;
  }
};

export const saveToStorage = (key, data) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const removeFromStorage = (key) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

// Calculate months between dates
export const getMonthsBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const yearDiff = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();
  
  return yearDiff * 12 + monthDiff;
};

// Get progress percentage
export const getProgressPercentage = (current, target) => {
  if (target <= 0) return 0;
  return Math.min((current / target) * 100, 100);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
