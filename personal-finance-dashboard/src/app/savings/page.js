'use client';

import { useState } from 'react';
import { Plus, X, Target, Trophy } from 'lucide-react';
import { useSavingsGoals } from '../../hooks/useData';
import { SavingsGoalCard, SavingsGoalForm } from '../../components/savings/SavingsComponents';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../lib/utils';

export default function SavingsPage() {
  const { 
    savingsGoals, 
    addSavingsGoal, 
    updateSavingsGoal, 
    deleteSavingsGoal, 
    addToSavingsGoal,
    getTotalSavingsTarget,
    getTotalCurrentSavings,
    isLoading 
  } = useSavingsGoals();
  
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [alert, setAlert] = useState(null);

  const handleCreateGoal = async (goalData) => {
    try {
      await addSavingsGoal(goalData);
      setShowForm(false);
      setAlert({
        type: 'success',
        message: 'Savings goal created successfully!'
      });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({
        type: 'destructive',
        message: error.message
      });
    }
  };

  const handleUpdateGoal = async (goalData) => {
    try {
      await updateSavingsGoal(editingGoal.id, goalData);
      setEditingGoal(null);
      setAlert({
        type: 'success',
        message: 'Savings goal updated successfully!'
      });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({
        type: 'destructive',
        message: error.message
      });
    }
  };

  const handleDeleteGoal = async (id) => {
    const goal = savingsGoals.find(g => g.id === id);
    if (window.confirm(`Are you sure you want to delete the goal "${goal?.name}"?`)) {
      try {
        await deleteSavingsGoal(id);
        setAlert({
          type: 'success',
          message: 'Savings goal deleted successfully!'
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

  const handleAddAmount = async (id, amount) => {
    try {
      await addToSavingsGoal(id, amount);
      const goal = savingsGoals.find(g => g.id === id);
      if (goal && goal.currentAmount + amount >= goal.targetAmount) {
        setAlert({
          type: 'success',
          message: `🎉 Congratulations! You've completed your "${goal.name}" goal!`
        });
      } else {
        setAlert({
          type: 'success',
          message: `Added ${formatCurrency(amount)} to your savings goal!`
        });
      }
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({
        type: 'destructive',
        message: error.message
      });
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
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

  const totalTarget = getTotalSavingsTarget();
  const totalCurrent = getTotalCurrentSavings();
  const completedGoals = savingsGoals.filter(goal => goal.completed);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Savings Goals
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Set and track your financial goals
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingGoal(null);
          }}
          className="flex items-center gap-2"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Add Goal'}
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

      {/* Savings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Goals</p>
                <p className="text-2xl font-bold">{savingsGoals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold">{completedGoals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Saved</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalCurrent)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Target</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalTarget)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {overallProgress.toFixed(1)}% complete
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Goal Form */}
      {showForm && (
        <SavingsGoalForm
          onSubmit={handleCreateGoal}
          onCancel={handleCancelAdd}
        />
      )}

      {/* Edit Goal Form */}
      {editingGoal && (
        <SavingsGoalForm
          initialData={editingGoal}
          onSubmit={handleUpdateGoal}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Savings Goals */}
      {savingsGoals.length > 0 ? (
        <div className="space-y-6">
          {/* Active Goals */}
          {savingsGoals.filter(goal => !goal.completed).length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Active Goals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savingsGoals
                  .filter(goal => !goal.completed)
                  .map((goal) => (
                    <SavingsGoalCard
                      key={goal.id}
                      goal={goal}
                      onEdit={handleEdit}
                      onDelete={handleDeleteGoal}
                      onAddAmount={handleAddAmount}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Completed Goals 🎉
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedGoals.map((goal) => (
                  <SavingsGoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={handleEdit}
                    onDelete={handleDeleteGoal}
                    onAddAmount={handleAddAmount}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No savings goals yet. Create your first goal to start saving!
            </p>
            <Button onClick={() => setShowForm(true)}>
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
