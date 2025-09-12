'use client';

import { useState, useEffect } from 'react';
import { Plus, X, PiggyBank } from 'lucide-react';
import { useTransactions, useBudgets } from '../../hooks/useData';
import { BudgetCard, BudgetForm } from '../../components/budget/BudgetComponents';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import { 
  getCurrentMonthTransactions, 
  calculateCategoryTotals, 
  formatCurrency 
} from '../../lib/utils';

export default function BudgetPage() {
  const { transactions } = useTransactions();
  const { 
    budgets, 
    setBudget, 
    removeBudget, 
    getTotalBudget, 
    isLoading 
  } = useBudgets();
  
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [alert, setAlert] = useState(null);
  const [categorySpending, setCategorySpending] = useState({});

  // Calculate current month spending by category
  useEffect(() => {
    const currentMonthTransactions = getCurrentMonthTransactions(transactions);
    const expenseTransactions = currentMonthTransactions.filter(t => t.type === 'expense');
    const categoryTotals = calculateCategoryTotals(expenseTransactions);
    
    const spendingMap = {};
    categoryTotals.forEach(({ category, amount }) => {
      spendingMap[category] = amount;
    });
    
    setCategorySpending(spendingMap);
  }, [transactions]);

  const handleSetBudget = async (category, amount) => {
    try {
      await setBudget(category, amount);
      setShowForm(false);
      setEditingBudget(null);
      setAlert({
        type: 'success',
        message: `Budget ${editingBudget ? 'updated' : 'set'} successfully for ${category}!`
      });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({
        type: 'destructive',
        message: error.message
      });
    }
  };

  const handleDeleteBudget = async (category) => {
    if (window.confirm(`Are you sure you want to delete the budget for ${category}?`)) {
      try {
        await removeBudget(category);
        setAlert({
          type: 'success',
          message: `Budget deleted successfully for ${category}!`
        });
        setTimeout(() => setAlert(null), 3000);
      } catch (error) {
        setAlert({
          type: 'destructive',
          message: error.message
        });
      }
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingBudget(null);
  };

  const handleCancelAdd = () => {
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalBudget = getTotalBudget();
  const totalSpent = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);
  const existingCategories = budgets.map(budget => budget.category);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Budget Tracker
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Set and track your monthly spending budgets
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingBudget(null);
          }}
          className="flex items-center gap-2"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Set Budget'}
        </Button>
      </div>

      {/* Alert */}
      {alert && (
        <Alert 
          variant={alert.type} 
          dismissible 
          onDismiss={() => setAlert(null)}
        >
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Budget Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Budget Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalBudget)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Budget
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalSpent)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Spent
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className={`text-2xl font-bold ${
                totalBudget - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(totalBudget - totalSpent)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Remaining
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Set Budget Form */}
      {showForm && (
        <BudgetForm
          onSubmit={handleSetBudget}
          onCancel={handleCancelAdd}
          existingCategories={existingCategories}
        />
      )}

      {/* Edit Budget Form */}
      {editingBudget && (
        <BudgetForm
          initialData={editingBudget}
          onSubmit={handleSetBudget}
          onCancel={handleCancelEdit}
          existingCategories={existingCategories}
        />
      )}

      {/* Budget Cards */}
      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.category}
              category={budget.category}
              budget={budget}
              spent={categorySpending[budget.category] || 0}
              onEdit={handleEdit}
              onDelete={handleDeleteBudget}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <PiggyBank className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No budgets set yet. Create your first budget to start tracking your spending!
            </p>
            <Button onClick={() => setShowForm(true)}>
              Set Your First Budget
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
