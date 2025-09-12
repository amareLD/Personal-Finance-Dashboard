import { useState, useEffect, useCallback } from 'react';
import { 
  getFromStorage, 
  saveToStorage, 
  generateId, 
  validateTransaction,
  getCurrentMonthTransactions,
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateBalance,
  calculateSavingsRate
} from '../lib/utils';
import { STORAGE_KEYS } from '../lib/constants';

// Hook for managing transactions
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = getFromStorage(STORAGE_KEYS.TRANSACTIONS) || [];
    setTransactions(savedTransactions);
    setIsLoading(false);
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
    }
  }, [transactions, isLoading]);

  // Add transaction
  const addTransaction = useCallback((transactionData) => {
    const validation = validateTransaction(transactionData);
    if (!validation.isValid) {
      throw new Error(Object.values(validation.errors).join(', '));
    }

    const newTransaction = {
      ...transactionData,
      id: generateId(),
      amount: parseFloat(transactionData.amount),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  }, []);

  // Update transaction
  const updateTransaction = useCallback((id, updates) => {
    const validation = validateTransaction(updates);
    if (!validation.isValid) {
      throw new Error(Object.values(validation.errors).join(', '));
    }

    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id 
          ? { 
              ...transaction, 
              ...updates, 
              amount: parseFloat(updates.amount),
              updatedAt: new Date().toISOString() 
            }
          : transaction
      )
    );
  }, []);

  // Delete transaction
  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  }, []);

  // Get transaction by ID
  const getTransaction = useCallback((id) => {
    return transactions.find(transaction => transaction.id === id);
  }, [transactions]);

  // Calculate summary stats
  const getSummaryStats = useCallback(() => {
    const currentMonthTransactions = getCurrentMonthTransactions(transactions);
    const allTimeIncome = calculateTotalIncome(transactions);
    const allTimeExpenses = calculateTotalExpenses(transactions);
    const monthlyIncome = calculateTotalIncome(currentMonthTransactions);
    const monthlyExpenses = calculateTotalExpenses(currentMonthTransactions);
    
    return {
      totalBalance: calculateBalance(transactions),
      monthlyIncome,
      monthlyExpenses,
      monthlyBalance: monthlyIncome - monthlyExpenses,
      savingsRate: calculateSavingsRate(currentMonthTransactions),
      allTimeIncome,
      allTimeExpenses,
      totalTransactions: transactions.length,
      monthlyTransactions: currentMonthTransactions.length
    };
  }, [transactions]);

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
    getSummaryStats
  };
};

// Hook for managing budgets
export const useBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load budgets from localStorage on mount
  useEffect(() => {
    const savedBudgets = getFromStorage(STORAGE_KEYS.BUDGETS) || [];
    setBudgets(savedBudgets);
    setIsLoading(false);
  }, []);

  // Save budgets to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveToStorage(STORAGE_KEYS.BUDGETS, budgets);
    }
  }, [budgets, isLoading]);

  // Add or update budget
  const setBudget = useCallback((category, amount) => {
    if (!category || amount < 0) {
      throw new Error('Invalid budget data');
    }

    setBudgets(prev => {
      const existingIndex = prev.findIndex(budget => budget.category === category);
      const budgetData = {
        category,
        amount: parseFloat(amount),
        updatedAt: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        // Update existing budget
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...budgetData };
        return updated;
      } else {
        // Add new budget
        return [...prev, { ...budgetData, id: generateId() }];
      }
    });
  }, []);

  // Remove budget
  const removeBudget = useCallback((category) => {
    setBudgets(prev => prev.filter(budget => budget.category !== category));
  }, []);

  // Get budget for category
  const getBudget = useCallback((category) => {
    return budgets.find(budget => budget.category === category);
  }, [budgets]);

  // Get total budget amount
  const getTotalBudget = useCallback(() => {
    return budgets.reduce((total, budget) => total + budget.amount, 0);
  }, [budgets]);

  return {
    budgets,
    isLoading,
    setBudget,
    removeBudget,
    getBudget,
    getTotalBudget
  };
};

// Hook for managing savings goals
export const useSavingsGoals = () => {
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load savings goals from localStorage on mount
  useEffect(() => {
    const savedGoals = getFromStorage(STORAGE_KEYS.SAVINGS_GOALS) || [];
    setSavingsGoals(savedGoals);
    setIsLoading(false);
  }, []);

  // Save savings goals to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveToStorage(STORAGE_KEYS.SAVINGS_GOALS, savingsGoals);
    }
  }, [savingsGoals, isLoading]);

  // Add savings goal
  const addSavingsGoal = useCallback((goalData) => {
    const { name, targetAmount, deadline, currentAmount = 0 } = goalData;
    
    if (!name || !targetAmount || !deadline) {
      throw new Error('Name, target amount, and deadline are required');
    }

    if (parseFloat(targetAmount) <= 0) {
      throw new Error('Target amount must be greater than 0');
    }

    const newGoal = {
      id: generateId(),
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      deadline,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: false
    };

    setSavingsGoals(prev => [...prev, newGoal]);
    return newGoal;
  }, []);

  // Update savings goal
  const updateSavingsGoal = useCallback((id, updates) => {
    setSavingsGoals(prev => 
      prev.map(goal => {
        if (goal.id === id) {
          const updated = { 
            ...goal, 
            ...updates,
            updatedAt: new Date().toISOString()
          };
          
          // Check if goal is completed
          if (updated.currentAmount >= updated.targetAmount) {
            updated.completed = true;
          }
          
          return updated;
        }
        return goal;
      })
    );
  }, []);

  // Delete savings goal
  const deleteSavingsGoal = useCallback((id) => {
    setSavingsGoals(prev => prev.filter(goal => goal.id !== id));
  }, []);

  // Add amount to savings goal
  const addToSavingsGoal = useCallback((id, amount) => {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    setSavingsGoals(prev => 
      prev.map(goal => {
        if (goal.id === id) {
          const newAmount = goal.currentAmount + parseFloat(amount);
          return {
            ...goal,
            currentAmount: newAmount,
            completed: newAmount >= goal.targetAmount,
            updatedAt: new Date().toISOString()
          };
        }
        return goal;
      })
    );
  }, []);

  // Get savings goal by ID
  const getSavingsGoal = useCallback((id) => {
    return savingsGoals.find(goal => goal.id === id);
  }, [savingsGoals]);

  // Get total savings target
  const getTotalSavingsTarget = useCallback(() => {
    return savingsGoals.reduce((total, goal) => total + goal.targetAmount, 0);
  }, [savingsGoals]);

  // Get total current savings
  const getTotalCurrentSavings = useCallback(() => {
    return savingsGoals.reduce((total, goal) => total + goal.currentAmount, 0);
  }, [savingsGoals]);

  return {
    savingsGoals,
    isLoading,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addToSavingsGoal,
    getSavingsGoal,
    getTotalSavingsTarget,
    getTotalCurrentSavings
  };
};
